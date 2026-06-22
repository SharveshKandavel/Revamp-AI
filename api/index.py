import os
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Revamp API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
RAINFOREST_API_KEY = os.getenv("RAINFOREST_API_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("Warning: Supabase credentials missing from environment.")

supabase: Client = create_client(SUPABASE_URL or "", SUPABASE_SERVICE_ROLE_KEY or "")

@app.get("/api")
async def root():
    return {"message": "Revamp Backend is running"}

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator
from datetime import datetime, timedelta

# --- Schemas ---

class ProductSpec(BaseModel):
    name: str
    value: str

class ProductPrice(BaseModel):
    value: float
    currency: str

class ProductUpsert(BaseModel):
    asin: str
    name: str
    category: str
    manufacturer: Optional[str] = "Unknown"
    price: float
    current_price_cents: Optional[int]
    image_url: str
    specs: Dict[str, Any]
    amazon_url: str
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    @validator('price')
    def price_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('Price cannot be negative')
        return v

class BuildPart(BaseModel):
    id: Optional[int]
    asin: Optional[str]
    category: str
    name: str
    price: float

class BuildCreate(BaseModel):
    user_id: str
    title: str
    description: Optional[str] = ""
    parts: Dict[str, Any] # Map of category -> part info
    compatibility_score: int = 100
    is_public: bool = True

# --- Endpoints ---

@app.get("/api/catalog")
async def get_catalog():
    """Fetch the complete hardware catalog from the database."""
    try:
        response = supabase.table("products").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Catalog fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch catalog")

@app.post("/api/builds")
async def save_build(build: BuildCreate):
    """Validate and persist a hardware configuration."""
    try:
        # Server-side Price Re-calculation (Safety Check)
        total_price = 0
        for category, part in build.parts.items():
            if part:
                total_price += part.get("price", 0)
        
        build_data = {
            "user_id": build.user_id,
            "title": build.title,
            "description": build.description,
            "total_price": total_price,
            "parts": build.parts,
            "compatibility_score": build.compatibility_score,
            "is_public": build.is_public,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("builds").insert(build_data).execute()
        return {"message": "Build saved successfully", "data": response.data[0]}
    except Exception as e:
        print(f"Build save error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/builds")
async def get_all_builds():
    """Fetch all public build configurations for the community showcase."""
    try:
        response = supabase.table("builds").select("*").eq("is_public", True).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Public builds fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch community builds")

@app.get("/api/builds/{user_id}")
async def get_user_builds(user_id: str):
    """Fetch all builds curated by a specific user."""
    try:
        response = supabase.table("builds").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"User builds fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch builds")

# --- Core Logic ---

# Cache TTL — PC part prices are stable, 72 hours saves credits
CACHE_TTL_HOURS = 72

async def get_cached_product(asin: str) -> Optional[Dict[str, Any]]:
    """Check if product exists and return it if fresh."""
    try:
        response = supabase.table("products").select("*").eq("asin", asin).execute()
        if response.data:
            product = response.data[0]
            if is_data_fresh(product):
                return product
        return None
    except Exception as e:
        print(f"Cache lookup error: {e}")
        return None

def is_data_fresh(record: Dict[str, Any], ttl_hours: int = CACHE_TTL_HOURS) -> bool:
    """Check if a record's last_updated is within the TTL."""
    last_updated_str = record.get("last_updated", "")
    if not last_updated_str:
        return False
    try:
        last_updated = datetime.fromisoformat(last_updated_str.replace('Z', '+00:00'))
        age = datetime.utcnow().replace(tzinfo=None) - last_updated.replace(tzinfo=None)
        return age < timedelta(hours=ttl_hours)
    except ValueError:
        return False

async def sync_amazon_product(asin: str, category: str, force_refresh: bool = False):
    if not RAINFOREST_API_KEY:
        print("Error: RAINFOREST_API_KEY not set.")
        return

    # 1. Caching Layer: Check if we already have fresh data
    if not force_refresh:
        cached = await get_cached_product(asin)
        if cached:
            print(f"Using fresh cached data for {asin}")
            return cached

    url = f"https://api.rainforestapi.com/request?api_key={RAINFOREST_API_KEY}&type=product&amazon_domain=amazon.ca&asin={asin}"
    
    # 2. Resilient API Call with Timeout
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0) # Strict 10s timeout
            
            if response.status_code != 200:
                print(f"Rainforest Error ({response.status_code}): {response.text}")
                # Fallback: Return whatever we have in DB, even if stale
                return await get_stale_fallback(asin)
            
            data = response.json()
            if "product" not in data:
                return await get_stale_fallback(asin)

            raw_product = data["product"]
            
            # 3. Data Transformation & Specs Extraction
            specs = {}
            if "specifications" in raw_product:
                for spec in raw_product["specifications"]:
                    name = spec["name"].lower()
                    val = spec["value"]
                    if any(k in name for v in ["socket", "chipset", "wattage", "draw", "form factor"]):
                        specs[name.replace(" ", "_")] = val
                    specs[spec["name"]] = val

            price_cents = None
            if "buybox_winner" in raw_product and "price" in raw_product["buybox_winner"]:
                price_cents = int(raw_product["buybox_winner"]["price"]["value"] * 100)

            # 4. Validation Layer: Use Pydantic to ensure data integrity
            try:
                validated_data = ProductUpsert(
                    asin=raw_product["asin"],
                    name=raw_product["title"],
                    category=category,
                    manufacturer=raw_product.get("brand", "Unknown"),
                    price=(price_cents / 100.0) if price_cents else 0,
                    current_price_cents=price_cents,
                    image_url=raw_product.get("main_image", {}).get("link", "/placeholder.svg"),
                    specs=specs,
                    amazon_url=raw_product.get("link"),
                )
            except Exception as ve:
                print(f"Validation failed for {asin}: {ve}")
                return await get_stale_fallback(asin)

            # 5. Persistent Storage
            supabase.table("products").upsert(validated_data.dict(), on_conflict="asin").execute()
            print(f"Successfully synced {asin}")
            return validated_data.dict()

        except (httpx.TimeoutException, httpx.RequestError) as e:
            print(f"Network error syncing {asin}: {e}")
            return await get_stale_fallback(asin)

async def get_stale_fallback(asin: str) -> Optional[Dict[str, Any]]:
    """Return the last known version of the product regardless of age."""
    print(f"Falling back to stale data for {asin}")
    response = supabase.table("products").select("*").eq("asin", asin).execute()
    return response.data[0] if response.data else None

# Optimized search terms per category — tuned for Amazon.ca results
SEARCH_MAP = {
    "CPU": "desktop processor cpu",
    "GPU": "graphics card gpu",
    "Motherboard": "gaming motherboard",
    "RAM": "ddr5 desktop ram",
    "Storage": "nvme ssd internal",
    "PowerSupply": "80 plus power supply unit",
    "Case": "atx mid tower pc case",
    "Monitor": "gaming monitor 144hz"
}

# Only request the fields we actually use — saves bandwidth
INCLUDE_FIELDS = ",".join([
    "search_results.asin",
    "search_results.title",
    "search_results.price",
    "search_results.image",
    "search_results.rating",
    "search_results.ratings_total",
    "search_results.link",
    "search_results.brand",
])


async def is_category_fresh(category: str) -> bool:
    """Check if a category has enough fresh products to skip re-syncing."""
    try:
        response = supabase.table("products").select("last_updated").eq("category", category).limit(5).execute()
        if not response.data or len(response.data) < 3:
            return False  # Too few products — needs sync
        return all(is_data_fresh(r) for r in response.data)
    except Exception:
        return False


@app.post("/api/sync-category/{category}")
async def sync_category(category: str, background_tasks: BackgroundTasks):
    """
    Search for products in a category and sync with caching and resilience.
    Uses include_fields to minimize response payload and save bandwidth.
    Cost: 1 Rainforest credit per category = ~10-15 products.
    """
    if not RAINFOREST_API_KEY:
        raise HTTPException(status_code=500, detail="RAINFOREST_API_KEY not set")

    # Skip if we already have fresh data for this category
    if await is_category_fresh(category):
        existing = supabase.table("products").select("*").eq("category", category).execute()
        return {
            "message": f"Category '{category}' is fresh (cached). Skipped API call.",
            "count": len(existing.data),
            "credits_used": 0
        }

    search_term = SEARCH_MAP.get(category, category)
    url = (
        f"https://api.rainforestapi.com/request"
        f"?api_key={RAINFOREST_API_KEY}"
        f"&type=search"
        f"&amazon_domain=amazon.ca"
        f"&search_term={search_term}"
        f"&include_fields={INCLUDE_FIELDS}"
    )

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=15.0)
            if response.status_code != 200:
                print(f"Search API failed for {category}: {response.status_code}")
                existing = supabase.table("products").select("*").eq("category", category).execute()
                return {"message": "Using existing database records due to API failure.", "count": len(existing.data), "credits_used": 1}
            
            data = response.json()
            search_results = data.get("search_results", [])
            
            ingested_count = 0
            for result in search_results:
                if "asin" not in result:
                    continue
                    
                # Extract price safely
                price_cents = None
                if "price" in result and result["price"]:
                    try:
                        price_val = result["price"].get("value") if isinstance(result["price"], dict) else result["price"]
                        if price_val:
                            price_cents = int(float(price_val) * 100)
                    except (ValueError, TypeError):
                        pass
                
                product_data = {
                    "asin": result["asin"],
                    "name": result.get("title", "Unknown Product"),
                    "category": category,
                    "manufacturer": result.get("brand", "Unknown"),
                    "price": (price_cents / 100.0) if price_cents else 0,
                    "current_price_cents": price_cents,
                    "image_url": result.get("image", "/placeholder.svg"),
                    "specs": {
                        "rating": result.get("rating"),
                        "reviews_count": result.get("ratings_total"),
                    },
                    "amazon_url": result.get("link"),
                    "last_updated": datetime.utcnow().isoformat()
                }
                
                # Skip products with no price
                if not price_cents:
                    continue
                
                try:
                    supabase.table("products").upsert(product_data, on_conflict="asin").execute()
                    ingested_count += 1
                except Exception as e:
                    print(f"Error upserting search result {result['asin']}: {e}")

            return {
                "message": f"Synced {ingested_count}/{len(search_results)} products for {category}.",
                "count": ingested_count,
                "credits_used": 1
            }

        except Exception as e:
            print(f"Critical error in category sync: {e}")
            raise HTTPException(status_code=503, detail="Search service temporarily unavailable. Cached data remains available.")


import asyncio

@app.post("/api/sync-all")
async def sync_all_categories():
    """
    Sync all 8 part categories in one call.
    Only refreshes categories with stale/missing data.
    Rate-limited: 1 second between API calls to avoid throttling.
    
    Worst case: 8 credits (all stale).
    Best case: 0 credits (all fresh).
    """
    if not RAINFOREST_API_KEY:
        raise HTTPException(status_code=500, detail="RAINFOREST_API_KEY not set")

    results = {}
    total_credits = 0
    categories = list(SEARCH_MAP.keys())

    for i, category in enumerate(categories):
        try:
            # Check freshness first — skip if cached
            if await is_category_fresh(category):
                existing = supabase.table("products").select("id").eq("category", category).execute()
                results[category] = {
                    "status": "cached",
                    "count": len(existing.data),
                    "credits_used": 0
                }
                continue

            # Rate limit: wait 1s between actual API calls (not cached skips)
            if total_credits > 0:
                await asyncio.sleep(1.0)

            search_term = SEARCH_MAP[category]
            url = (
                f"https://api.rainforestapi.com/request"
                f"?api_key={RAINFOREST_API_KEY}"
                f"&type=search"
                f"&amazon_domain=amazon.ca"
                f"&search_term={search_term}"
                f"&include_fields={INCLUDE_FIELDS}"
            )

            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=15.0)
                
                if response.status_code != 200:
                    results[category] = {"status": "api_error", "credits_used": 1}
                    total_credits += 1
                    continue

                data = response.json()
                search_results = data.get("search_results", [])
                ingested = 0

                for result in search_results:
                    if "asin" not in result:
                        continue
                    
                    price_cents = None
                    if "price" in result and result["price"]:
                        try:
                            price_val = result["price"].get("value") if isinstance(result["price"], dict) else result["price"]
                            if price_val:
                                price_cents = int(float(price_val) * 100)
                        except (ValueError, TypeError):
                            pass
                    
                    if not price_cents:
                        continue

                    product_data = {
                        "asin": result["asin"],
                        "name": result.get("title", "Unknown Product"),
                        "category": category,
                        "manufacturer": result.get("brand", "Unknown"),
                        "price": price_cents / 100.0,
                        "current_price_cents": price_cents,
                        "image_url": result.get("image", "/placeholder.svg"),
                        "specs": {
                            "rating": result.get("rating"),
                            "reviews_count": result.get("ratings_total"),
                        },
                        "amazon_url": result.get("link"),
                        "last_updated": datetime.utcnow().isoformat()
                    }

                    try:
                        supabase.table("products").upsert(product_data, on_conflict="asin").execute()
                        ingested += 1
                    except Exception as e:
                        print(f"Error upserting {result['asin']}: {e}")

                total_credits += 1
                results[category] = {
                    "status": "synced",
                    "count": ingested,
                    "credits_used": 1
                }

        except Exception as e:
            print(f"Error syncing {category}: {e}")
            results[category] = {"status": "error", "error": str(e), "credits_used": 0}

    return {
        "message": f"Sync complete. Total credits used: {total_credits}/8",
        "total_credits_used": total_credits,
        "categories": results
    }


@app.get("/api/health")
async def health():
    return {"status": "ok", "cache_ttl_hours": CACHE_TTL_HOURS}
