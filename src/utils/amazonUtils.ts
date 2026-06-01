/**
 * Amazon Affiliate Utilities
 */

const AMAZON_TAG = 'revampai-20'; // Your verified Store ID

/**
 * Constructs a programmatically valid Amazon Canada affiliate link.
 * @param asin The Amazon Standard Identification Number
 * @returns A formatted affiliate URL
 */
export const getAffiliateLink = (asin: string): string => {
  if (!asin) return '';
  return `https://www.amazon.ca/dp/${asin}?tag=${AMAZON_TAG}`;
};

/**
 * Normalizes price from cents to display string
 */
export const formatAmazonPrice = (priceCents: number | undefined): string => {
  if (priceCents === undefined || priceCents === null) return 'N/A';
  return `₹${(priceCents / 100).toLocaleString('en-IN')}`;
};
