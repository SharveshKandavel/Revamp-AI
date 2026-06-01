import os
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Revamp AI API")

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

@app.get("/")
async def root():
    return {"message": "Revamp AI Backend is running"}

async def sync_amazon_product(asin: str, category: str):
    if not RAINFOREST_API_KEY:
        print("Error: RAINFOREST_API_KEY not set.")
        return

    url = f"https://api.rainforestapi.com/request?api_key={RAINFOREST_API_KEY}&type=product&amazon_domain=amazon.ca&asin={asin}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            print(f"Failed to fetch {asin}: {response.text}")
            return
        
        data = response.json()
        if "product" not in data:
            print(f"Product not found for ASIN {asin}")
            return

        raw_product = data["product"]
        
        # Extract specs
        specs = {}
        if "specifications" in raw_product:
            for spec in raw_product["specifications"]:
                name = spec["name"].lower()
                val = spec["value"]
                if "socket" in name or "chipset" in name: specs["socket"] = val
                if "wattage" in name or "draw" in name: specs["tdp_watts"] = val
                if "form factor" in name: specs["form_factor"] = val
                specs[spec["name"]] = val

        price_cents = None
        if "buybox_winner" in raw_product and "price" in raw_product["buybox_winner"]:
            price_cents = int(raw_product["buybox_winner"]["price"]["value"] * 100)

        product_data = {
            "asin": raw_product["asin"],
            "name": raw_product["title"],
            "category": category,
            "manufacturer": raw_product.get("brand"),
            "price": (price_cents / 100.0) if price_cents else 0,
            "current_price_cents": price_cents,
            "image_url": raw_product.get("main_image", {}).get("link", "/placeholder.svg"),
            "specs": specs,
            "amazon_url": raw_product.get("link"),
            "last_updated": "now()", # Supabase handles this usually but we can pass isoformat
        }

        # Upsert into Supabase
        try:
            supabase.table("products").upsert(product_data, on_conflict="asin").execute()
            print(f"Successfully synced {asin}")
        except Exception as e:
            print(f"Database error for {asin}: {e}")

@app.post("/sync-category/{category}")
async def sync_category(category: str, background_tasks: BackgroundTasks):
    """
    Search for products in a category and sync the first page of results (approx 20-30 products).
    Cost: 1 Rainforest Credit.
    """
    if not RAINFOREST_API_KEY:
        raise HTTPException(status_code=500, detail="RAINFOREST_API_KEY not set")

    # Map our categories to Amazon search terms
    search_map = {
        "CPU": "intel amd processor",
        "GPU": "nvidia amd graphics card",
        "Motherboard": "gaming motherboard",
        "RAM": "ddr4 ddr5 ram",
        "Storage": "nvme ssd",
        "PowerSupply": "80 plus power supply",
        "Case": "atx pc case",
        "Monitor": "gaming monitor"
    }

    search_term = search_map.get(category, category)
    url = f"https://api.rainforestapi.com/request?api_key={RAINFOREST_API_KEY}&type=search&amazon_domain=amazon.ca&search_term={search_term}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            return {"error": f"Rainforest API error: {response.text}"}
        
        data = response.json()
        search_results = data.get("search_results", [])
        
        # We trigger background sync for each ASIN found in search
        for result in search_results:
            if "asin" in result:
                # We can either sync the basic search data (faster, zero extra credits)
                # or trigger a full product sync (higher quality, costs 1 credit per ASIN).
                # To be efficient, we'll sync the BASIC data from search results first.
                
                price_cents = None
                if "price" in result:
                    price_cents = int(result["price"]["value"] * 100)
                
                product_data = {
                    "asin": result["asin"],
                    "name": result["title"],
                    "category": category,
                    "manufacturer": result.get("brand", "Unknown"),
                    "price": (price_cents / 100.0) if price_cents else 0,
                    "current_price_cents": price_cents,
                    "image_url": result.get("image", "/placeholder.svg"),
                    "specs": {"rating": result.get("rating"), "reviews": result.get("ratings_total")},
                    "amazon_url": result.get("link"),
                    "last_updated": "now()",
                }
                
                try:
                    supabase.table("products").upsert(product_data, on_conflict="asin").execute()
                except Exception as e:
                    print(f"Error upserting search result {result['asin']}: {e}")

        return {"message": f"Ingested {len(search_results)} products for {category} using 1 credit."}

@app.get("/health")
async def health():
    return {"status": "ok"}
