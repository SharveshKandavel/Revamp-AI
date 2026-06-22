import { supabase } from './supabase';

/**
 * Normalizes a Rainforest API search result into our Supabase product schema.
 * Works with the lightweight search-result format (from type=search).
 * 
 * The backend handles all Rainforest API calls directly.
 * This utility is for any client-side normalization if needed.
 */
export async function ingestSearchResult(result: any, category: string) {
  try {
    const asin = result.asin;
    if (!asin) throw new Error('Missing ASIN');

    // Search results have a simpler structure than full product details
    const priceCents = result.price?.value
      ? Math.round(result.price.value * 100)
      : (result.current_price_cents || null);

    const productData = {
      asin,
      name: result.title || result.name || 'Unknown Product',
      category,
      manufacturer: result.brand || result.manufacturer || 'Unknown',
      price: priceCents ? priceCents / 100 : 0,
      current_price_cents: priceCents,
      image_url: result.image || result.main_image?.link || '/placeholder.svg',
      specs: {
        rating: result.rating || null,
        reviews_count: result.ratings_total || null,
      },
      amazon_url: result.link || result.amazon_url || '',
      last_updated: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'asin' });

    if (error) throw error;

    return productData;
  } catch (err) {
    console.error('Failed to ingest search result:', err);
    throw err;
  }
}

/**
 * Check how many products exist for a category in the local DB.
 * Useful for deciding whether to trigger a sync.
 */
export async function getCategoryProductCount(category: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category', category);

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error(`Failed to count products for ${category}:`, err);
    return 0;
  }
}

