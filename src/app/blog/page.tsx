// src/app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { sanityFetch } from '@/lib/sanity';
import { urlForImage } from '@/lib/image';
import { Metadata } from 'next';

// Define TypeScript types (re-use from page.tsx or define here for clarity)
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
}

// GROQ Query for all blog posts
const ALL_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
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
    slug
  },
  categories[]->{
    _id,
    title
  },
  publishedAt,
  seoDescription
}`;

// Metadata for the Blog page (for SEO)
export const metadata: Metadata = {
  title: 'Mycelial FunGuy Blog - Latest Musings',
  description: 'Explore the latest articles and insights on mushroom cultivation from Mycelial FunGuy.',
};

export default async function BlogPage() {
  const posts = await sanityFetch<Post[]>({
    query: ALL_POSTS_QUERY,
    revalidate: 60, // Revalidate every 60 seconds
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gradient-to-br from-green-700 via-purple-700 to-indigo-800 text-white font-sans">
      {/* Back to Home Link (Optional but good for navigation) */}
      <div className="w-full max-w-5xl mb-8">
        <Link href="/" className="text-teal-300 hover:text-teal-100 transition-colors text-lg flex items-center">
          &larr; Back to Home
        </Link>
      </div>

      <h1 className="text-5xl font-extrabold text-lime-300 mb-12 drop-shadow-2xl text-center">
        The Myco-Musings Blog
      </h1>

      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              href={`/blog/${post.slug.current}`} // Link to the individual blog post page
              key={post._id}
              className="block bg-green-800/60 p-6 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-green-600 hover:border-teal-300 backdrop-blur-sm"
            >
              {post.mainImage && post.mainImage.asset && post.mainImage.asset._ref && (
                <Image
                  src={urlForImage(post.mainImage).width(500).height(300).url()}
                  alt={post.mainImage.alt || post.title}
                  width={500}
                  height={300}
                  className="rounded-md mb-4 object-cover w-full h-48"
                />
              )}
              <h2 className="text-2xl font-semibold text-lime-200 mb-2">{post.title}</h2>
              <p className="text-gray-300 text-sm">By {post.author?.name || 'Unknown'}</p>
              <p className="text-gray-400 text-xs mt-1">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
              {post.seoDescription && <p className="text-gray-300 text-sm mt-3 line-clamp-2">{post.seoDescription}</p>}
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-300 col-span-full text-xl">
            No blog posts published yet. Check back soon for more myco-insights!
          </p>
        )}
      </section>

      {/* Footer (Placeholder) */}
      <footer className="w-full max-w-5xl text-center text-gray-400 text-sm mt-20 pt-8 border-t border-gray-700">
        © {new Date().getFullYear()} Mycelial FunGuy. All rights reserved.
      </footer>
    </main>
  );
}