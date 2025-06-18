// src/lib/image.ts
import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { client } from './sanity';

const builder = createImageUrlBuilder({
  projectId: client.config().projectId || '',
  dataset: client.config().dataset || '',
});

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

// import { Image as SanityImageSource } from 'sanity';
// import { createClient } from 'next-sanity';
// import imageUrlBuilder from '@sanity/image-url';

// const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
//   useCdn: true,
//   apiVersion: '2023-05-03',
// });

// const builder = imageUrlBuilder(client);

// export function urlForImage(source: SanityImageSource) {
//   return builder.image(source);
// }