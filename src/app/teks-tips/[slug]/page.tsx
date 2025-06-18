// src/app/teks-tips/[slug]/page.tsx
import { client, sanityFetch } from '@/lib/sanity';
import { urlForImage } from '@/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText, PortableTextMarkComponentProps } from '@portabletext/react'; // Ensure this is imported

interface CustomPortableTextComponentProps {
  children?: React.ReactNode;
}
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Define TypeScript type for TekTip
interface TekTip {
  _id: string;
  _createdAt: string;
  question: string;
  slug: { current: string };
  mainImage?: { asset: { _ref: string }; alt: string };
  publishedAt?: string;
  seoDescription?: string;
  tutorialContent: any[]; // Portable Text content
  relatedTeks?: Array<{ _id: string; question: string; slug: { current: string } }>;
}

// GROQ Query for a single Tek & Tip by slug
const SINGLE_TEK_TIP_QUERY = `*[_type == "tekTip" && slug.current == $slug][0]{
  _id,
  _createdAt,
  question,
  slug,
  mainImage {
    asset->{_ref},
    alt
  },
  publishedAt,
  tutorialContent,
  seoDescription,
  relatedTeks[]->{
    _id,
    question,
    slug
  }
}`;

// --- Components for Portable Text (re-using the same structure as blog post) ---
const PortableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <Image
          className="my-8 rounded-lg shadow-lg"
          alt={value.alt || 'Tutorial image'}
          loading="lazy"
          src={urlForImage(value).width(800).height(500).fit('max').url()}
          width={800}
          height={500}
        />
      );
    },
  },
  block: {
    h1: ({ children }: CustomPortableTextComponentProps) => <h1 className="text-4xl md:text-5xl font-bold text-lime-200 mt-8 mb-4">{children}</h1>,
    h2: ({ children }: CustomPortableTextComponentProps) => <h2 className="text-3xl md:text-4xl font-semibold text-orange-200 mt-7 mb-3">{children}</h2>,
    h3: ({ children }: CustomPortableTextComponentProps) => <h3 className="text-2xl md:text-3xl font-medium text-pink-200 mt-6 mb-2">{children}</h3>,
    normal: ({ children }: CustomPortableTextComponentProps) => <p className="text-gray-200 leading-relaxed my-4">{children}</p>,
    blockquote: ({ children }: CustomPortableTextComponentProps) => <blockquote className="border-l-4 border-teal-400 pl-4 py-2 italic text-gray-300 my-6">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: CustomPortableTextComponentProps) => <ul className="list-disc list-inside text-gray-200 my-4">{children}</ul>,
    number: ({ children }: CustomPortableTextComponentProps) => <ol className="list-decimal list-inside text-gray-200 my-4">{children}</ol>,
  },
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<any>) => {
      if (!value || !value.href) {
        return <>{children}</>;
      }
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <Link href={value.href} rel={rel} className="text-teal-300 hover:text-teal-100 underline">
          {children}
        </Link>
      );
    },
    strong: ({ children }: { children: React.ReactNode }) => <strong className="font-bold text-lime-100">{children}</strong>,
    em: ({ children }: { children: React.ReactNode }) => <em className="italic text-gray-100">{children}</em>,
  },
};


// --- Generate Static Params for all slugs (for SSG) ---
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(`*[_type == "tekTip" && defined(slug.current)][].slug.current`);
  return slugs.map((slug) => ({ slug }));
}

// --- Generate Metadata for individual tek tip (for SEO) ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await Promise.resolve(params); // Workaround for Next.js linter
  const tekTip = await sanityFetch<TekTip>({
    query: SINGLE_TEK_TIP_QUERY,
    params: { slug },
    revalidate: 60,
  });

  if (!tekTip) {
    return {};
  }

  return {
    title: `${tekTip.question} - Mycelial FunGuy Teks & Tips`,
    description: tekTip.seoDescription || tekTip.question,
    openGraph: {
      title: tekTip.question,
      description: tekTip.seoDescription || tekTip.question,
      images: (tekTip.mainImage && tekTip.mainImage.asset && tekTip.mainImage.asset._ref)
        ? [urlForImage(tekTip.mainImage).width(1200).height(630).url()]
        : [],
    },
  };
}

export default async function TekTipPage({ params }: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(params); // Workaround for Next.js linter
  const tekTip = await sanityFetch<TekTip>({
    query: SINGLE_TEK_TIP_QUERY,
    params: { slug },
    revalidate: 60,
  });

  if (!tekTip) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gradient-to-br from-indigo-800 via-purple-700 to-green-700 text-white font-sans">
      {/* Back to Teks & Tips List Link */}
      <div className="w-full max-w-4xl mb-8">
        <Link href="/teks-tips" className="text-pink-300 hover:text-pink-100 transition-colors text-lg flex items-center">
          &larr; Back to Teks & Tips
        </Link>
      </div>

      <article className="w-full max-w-4xl bg-gray-900/70 p-8 rounded-lg shadow-2xl border-2 border-purple-700 backdrop-blur-sm">
        {tekTip.mainImage && tekTip.mainImage.asset && tekTip.mainImage.asset._ref && (
          <Image
            src={urlForImage(tekTip.mainImage).width(1000).height(600).url()}
            alt={tekTip.mainImage.alt || tekTip.question}
            width={1000}
            height={600}
            className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-lg"
          />
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold text-fuchsia-300 mb-4 leading-tight">
          {tekTip.question}
        </h1>
        <p className="text-gray-300 text-md mb-6">
          Published/Updated on: {new Date(tekTip.publishedAt || tekTip._createdAt).toLocaleDateString()}
        </p>

        {/* Render the rich text 'tutorialContent' */}
        <div className="prose prose-invert max-w-none text-gray-200">
          <PortableText value={tekTip.tutorialContent} components={PortableTextComponents} />
        </div>

        {/* Related Teks & Tips (Optional) */}
        {tekTip.relatedTeks && tekTip.relatedTeks.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-700">
            <h3 className="text-2xl font-bold text-teal-300 mb-4">Related Tutorials:</h3>
            <ul className="list-disc list-inside space-y-2">
              {tekTip.relatedTeks.map((relatedTek) => (
                <li key={relatedTek._id}>
                  <Link href={`/teks-tips/${relatedTek.slug.current}`} className="text-pink-200 hover:text-pink-100 hover:underline transition-colors">
                    {relatedTek.question}
                  </Link>
                </li>
              ))}
            </ul>
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