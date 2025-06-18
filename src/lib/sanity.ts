// src/lib/sanity.ts
import { createClient } from 'next-sanity';
import type { SanityClient, ClientConfig } from '@sanity/client'; // Keep these imports


// Ensure these environment variables are set in your .env.local file
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';


// Validate that necessary environment variables are defined
if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. Please check your .env.local file.');
}
if (!dataset) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET environment variable. Please check your .env.local file.');
}


// Configuration for the Sanity client
const clientConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster loads
  // token: process.env.SANITY_API_READ_TOKEN,
};

export const client: SanityClient = createClient(clientConfig);


/**
 * Helper function for fetching data from Sanity with optional Next.js caching/revalidation.
 * This directly uses the 'next' and 'cache' options provided by Next.js's `fetch` API,
 * which `next-sanity`'s client.fetch is designed to propagate.
 *
 * @template QueryResult The expected type of the query result.
 * @param {object} options - Options for the fetch operation.
 * @param {string} options.query - The GROQ query string.
 * @param {Record<string, string | number>} [options.params={}] - Optional parameters for the query.
 * @param {number | false | 0} [options.revalidate] - Next.js revalidation time in seconds.
 * - `false`: Default fetch behavior (strong cache, `force-cache`).
 * - `0`: Opt-out of cache for this request (`no-store`).
 * - `number > 0`: Revalidate every `n` seconds (`next: { revalidate: n }`).
 */
export async function sanityFetch<QueryResult>({
  query,
  params = {},
  revalidate,
}: {
  query: string;
  params?: Record<string, string | number>;
  revalidate?: number | false | 0; // Type for revalidate option
}): Promise<QueryResult> {

  // Sanity's fetch method can take `RequestInit` properties (like 'cache' or 'next')
  // as part of its third argument's object.
  const fetchOptions: { cache?: RequestCache; next?: NextFetchRequestConfig } = {};

  if (revalidate !== undefined) {
    if (revalidate === 0) {
      fetchOptions.cache = 'no-store'; // No caching
    } else if (revalidate !== false) {
      fetchOptions.next = { revalidate }; // Time-based revalidation
    }
  }

  // Pass the options directly to client.fetch.
  // The types within `next-sanity` for client.fetch are specifically designed
  // to accept these Next.js fetch options as part of its third argument's object.
  return client.fetch<QueryResult>(query, params, fetchOptions);
}