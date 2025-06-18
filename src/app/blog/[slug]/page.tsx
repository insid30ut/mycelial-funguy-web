// src/app/blog/[slug]/page.tsx
import { client, sanityFetch } from '@/lib/sanity';
import { urlForImage } from '@/lib/image';
import Image from 'next/image';
import Link from 'next/link';
// CORRECTED IMPORT: Added PortableTextMarkComponentProps
import { PortableText, PortableTextMarkComponentProps, PortableTextComponentProps, PortableTextBlock } from '@portabletext/react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Re-define Post and Author types for clarity in this file
interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  image?: { asset: { _ref: string }; alt: string };
}

interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: { _ref: string }; alt: string };
  author: Author;
  categories?: Array<{ _id: string; title: string }>;
  publishedAt: string;
  body: any[]; // Portable Text content
  seoDescription?: string;
}

// GROQ Query for a single blog post by slug
const SINGLE_POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
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
  body,
  seoDescription
}`;

// --- Components for Portable Text ---
const PortableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <Image
          className="my-8 rounded-lg shadow-lg"
          alt={value.alt || 'Post image'}
          loading="lazy"
          src={urlForImage(value).width(800).height(500).fit('max').url()}
          width={800}
          height={500}
        />
      );
    },
  },
  block: {
    h1: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <h1 className="text-4xl md:text-5xl font-bold text-lime-200 mt-8 mb-4">{children}</h1>,
    h2: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <h2 className="text-3xl md:text-4xl font-semibold text-orange-200 mt-7 mb-3">{children}</h2>,
    h3: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <h3 className="text-2xl md:text-3xl font-medium text-pink-200 mt-6 mb-2">{children}</h3>,
    normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <p className="text-gray-200 leading-relaxed my-4">{children}</p>,
    blockquote: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <blockquote className="border-l-4 border-teal-400 pl-4 py-2 italic text-gray-300 my-6">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <ul className="list-disc list-inside text-gray-200 my-4">{children}</ul>,
    number: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <ol className="list-decimal list-inside text-gray-200 my-4">{children}</ol>,
  },
  marks: {
    // CORRECTED: Use PortableTextMarkComponentProps and handle 'value' as optional
    link: ({ children, value }: PortableTextMarkComponentProps<any>) => {
      // Check if value exists before accessing its properties
      if (!value || !value.href) {
        return <>{children}</>; // Render children without link if value or href is missing
      }
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <Link href={value.href} rel={rel} className="text-teal-300 hover:text-teal-100 underline">
          {children}
        </Link>
      );
    },
    strong: ({ children }: PortableTextMarkComponentProps) => <strong className="font-bold text-lime-100">{children}</strong>,
    em: ({ children }: PortableTextMarkComponentProps) => <em className="italic text-gray-100">{children}</em>,
  },
};

// --- Generate Static Params for all slugs (for SSG) ---
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(`*[_type == "post" && defined(slug.current)][].slug.current`);
  return slugs.map((slug) => ({ slug }));
}

// --- Generate Metadata for individual post (for SEO) ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await sanityFetch<Post>({
    query: SINGLE_POST_QUERY,
    params: { slug: params.slug },
    revalidate: 60, // Revalidate metadata too
  });

  if (!post) {
    return {}; // Return empty metadata if post not found
  }

  return {
    title: `${post.title} - Mycelial FunGuy Blog`,
    description: post.seoDescription || post.title,
    openGraph: {
      title: post.title,
      description: post.seoDescription || post.title,
      images: post.mainImage ? [urlForImage(post.mainImage).width(1200).height(630).url()] : [],
    },
    // Add more SEO tags as needed
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await sanityFetch<Post>({
    query: SINGLE_POST_QUERY,
    params: { slug: params.slug },
    revalidate: 60, // Revalidate every 60 seconds
  });

  if (!post) {
    notFound(); // Next.js built-in 404 helper
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gradient-to-br from-green-700 via-purple-700 to-indigo-800 text-white font-sans">
      {/* Back to Blog Link */}
      <div className="w-full max-w-4xl mb-8">
        <Link href="/blog" className="text-teal-300 hover:text-teal-100 transition-colors text-lg flex items-center">
          &larr; Back to Blog
        </Link>
      </div>

      <article className="w-full max-w-4xl bg-gray-900/70 p-8 rounded-lg shadow-2xl border-2 border-green-700 backdrop-blur-sm">
        {post.mainImage && post.mainImage.asset && (
          <Image
            src={urlForImage(post.mainImage).width(1000).height(600).url()}
            alt={post.mainImage.alt || post.title}
            width={1000}
            height={600}
            className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-lg"
          />
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold text-lime-300 mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-300 text-md mb-6">
          By <span className="font-semibold text-orange-200">{post.author?.name || 'Unknown'}</span> on{' '}
          {new Date(post.publishedAt).toLocaleDateString()}
          {post.categories && post.categories.length > 0 && (
            <span className="ml-4">
              Categories: {post.categories.map(cat => cat.title).join(', ')}
            </span>
          )}
        </p>

        {/* Render the rich text 'body' content */}
        {/* Render the rich text 'body' content using PortableText */}
        {post.body && (
          <div className="prose prose-invert max-w-none text-gray-200">
            <PortableText value={post.body} components={PortableTextComponents} />
          </div>
        )}
      </article>

      {/* Footer (Placeholder) */}
      <footer className="w-full max-w-5xl text-center text-gray-400 text-sm mt-20 pt-8 border-t border-gray-700">
        © {new Date().getFullYear()} Mycelial FunGuy. All rights reserved.
      </footer>
    </main>
  );
}