// src/app/page.tsx

import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component for optimization
import { client, sanityFetch } from '@/lib/sanity'; // Import your Sanity client and helper
// import { urlForImage } from '@/lib/image'; 
import { urlForImage } from '@/lib/image';


// Define TypeScript types for your Sanity data
// This helps with autocompletion and type safety
interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  image?: { asset: { _ref: string }; alt: string };
}

interface Category {
  _id: string;
  title: string;
}

interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: { _ref: string }; alt: string };
  author: Author;
  categories?: Category[];
  publishedAt: string;
  seoDescription?: string;
  body: any[]; // Portable Text content
}

interface TekTip {
  _id: string;
  _createdAt: string;
  question: string;
  slug: { current: string };
  mainImage?: { asset: { _ref: string }; alt: string };
  publishedAt?: string;
  seoDescription?: string;
  tutorialContent: any[]; // Portable Text content
}


// --- GROQ Queries ---
// GROQ is Sanity's powerful query language. It's like SQL but for JSON.

// Query to get all blog posts, selecting specific fields and references
const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  _createdAt,
  title,
  slug,
  mainImage {
    asset->{_ref},
    alt
  },
  author->{
    _id,
    name,
    slug,
    image {
      asset->{_ref},
      alt
    }
  },
  categories[]->{
    _id,
    title
  },
  publishedAt,
  seoDescription
}`;

// Query to get all tek & tip tutorials
const TEK_TIPS_QUERY = `*[_type == "tekTip"] | order(publishedAt desc) {
  _id,
  _createdAt,
  question,
  slug,
  mainImage {
    asset->{_ref},
    alt
  },
  publishedAt,
  seoDescription
}`;


export default async function Home() {
  // Fetch data using the sanityFetch helper
  // revalidate: 60 means Next.js will re-fetch this data every 60 seconds (ISR)
  const posts = await sanityFetch<Post[]>({
    query: POSTS_QUERY,
    revalidate: 60,
  });

  const tekTips = await sanityFetch<TekTip[]>({
    query: TEK_TIPS_QUERY,
    revalidate: 60,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-br from-green-700 via-purple-700 to-indigo-800 text-white font-sans">
      {/* Header / Nav */}
      <nav className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-teal-300 drop-shadow-lg">Mycelial FunGuy</h1>
        <div className="flex gap-4">
          <Link href="/blog" className="text-xl hover:text-teal-300 transition-colors">Blog</Link>
          <Link href="/teks-tips" className="text-xl hover:text-teal-300 transition-colors">Teks & Tips</Link>
          <Link href="/about" className="text-xl hover:text-teal-300 transition-colors">About</Link>
          {/* Shop link will be added later */}
          <Link href="/shop" className="text-xl hover:text-teal-300 transition-colors">Shop (Coming Soon!)</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="my-16 text-center max-w-3xl">
        <h2 className="text-5xl font-extrabold text-lime-300 mb-6 drop-shadow-2xl">
          Cultivate Your Consciousness. Grow Your Own Fungi.
        </h2>
        <p className="text-xl text-gray-200">
          Welcome to Mycelial FunGuy, your psychedelic portal to the world of mushroom cultivation. Dive into our guides, discover new insights, and embark on your fungal journey.
        </p>
      </section>

      {/* Featured Blog Posts */}
      <section className="w-full max-w-5xl my-16">
        <h3 className="text-4xl font-bold text-orange-300 mb-8 text-center drop-shadow-lg">Latest Myco-Musings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link href={`/blog/${post.slug.current}`} key={post._id} className="block bg-green-800/60 p-6 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-green-600 hover:border-teal-300 backdrop-blur-sm">
                {post.mainImage?.asset?._ref && (
                  <Image
                    src={urlForImage(post.mainImage).width(500).height(300).url()}
                    alt={post.mainImage.alt || post.title}
                    width={500}
                    height={300}
                    className="rounded-md mb-4 object-cover w-full h-48"
                  />
                )}
                <h4 className="text-2xl font-semibold text-lime-200 mb-2">{post.title}</h4>
                <p className="text-gray-300 text-sm">By {post.author?.name || 'Unknown'}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
                {post.seoDescription && <p className="text-gray-300 text-sm mt-3 line-clamp-2">{post.seoDescription}</p>}
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-300 col-span-full">No blog posts found. Add some in Sanity Studio!</p>
          )}
        </div>
      </section>

      {/* Featured Teks & Tips */}
      <section className="w-full max-w-5xl my-16">
        <h3 className="text-4xl font-bold text-fuchsia-300 mb-8 text-center drop-shadow-lg">Essential Myco-Teks & Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tekTips.length > 0 ? (
            tekTips.map((tekTip) => (
              <Link href={`/teks-tips/${tekTip.slug.current}`} key={tekTip._id} className="block bg-purple-800/60 p-5 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-purple-600 hover:border-fuchsia-300 backdrop-blur-sm">
                <h4 className="text-2xl font-semibold text-pink-200 mb-2">{tekTip.question}</h4>
                {tekTip.seoDescription && <p className="text-gray-300 text-sm line-clamp-2">{tekTip.seoDescription}</p>}
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-300 col-span-full">No Teks & Tips found. Add some in Sanity Studio!</p>
          )}
        </div>
      </section>

      {/* Footer (Placeholder) */}
      <footer className="w-full max-w-5xl text-center text-gray-400 text-sm mt-20 pt-8 border-t border-gray-700">
        © {new Date().getFullYear()} Mycelial FunGuy. All rights reserved.
      </footer>
    </main>
  );
}