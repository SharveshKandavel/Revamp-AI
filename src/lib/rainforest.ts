import { supabase } from './supabase';

/**
 * Normalizes Rainforest API product data into our Supabase schema.
 * @param rawProduct The JSON object returned by Rainforest API
 * @param category The PartCategory this product belongs to
 */
export async function ingestRainforestProduct(rawProduct: any, category: string) {
  try {
    const asin = rawProduct.asin;
    const title = rawProduct.title;
    const manufacturer = rawProduct.brand;
    const image = rawProduct.main_image?.link || '/placeholder.svg';
    const priceCents = rawProduct.buybox_winner?.price?.value 
      ? Math.round(rawProduct.buybox_winner.price.value * 100) 
      : null;

    // Extract hardware-specific specs from specifications array
    const specs: Record<string, any> = {};
    if (rawProduct.specifications) {
      rawProduct.specifications.forEach((spec: any) => {
        const name = spec.name.toLowerCase();
        const value = spec.value;
        
        // General mapping
        if (name.includes('socket') || name.includes('chipset')) specs.socket = value;
        if (name.includes('wattage') || name.includes('draw')) specs.tdp_watts = parseInt(value);
        if (name.includes('form factor')) specs.form_factor = value;
        if (name.includes('cores')) specs.cores = parseInt(value);
        if (name.includes('threads')) specs.threads = parseInt(value);
        if (name.includes('base clock')) specs.baseClock = value;
        if (name.includes('boost clock')) specs.boostClock = value;
        
        // Capture raw specs for backup
        specs[spec.name] = value;
      });
    }

    const productData = {
      asin,
      name: title,
      category,
      manufacturer,
      price: priceCents ? priceCents / 100 : 0,
      current_price_cents: priceCents,
      image_url: image,
      specs,
      amazon_url: rawProduct.link,
      last_updated: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'asin' });

    if (error) throw error;
    
    return productData;
  } catch (err) {
    console.error('Failed to ingest Rainforest product:', err);
    throw err;
  }
}
