// src/app/teks-tips/page.tsx
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity';
import { Metadata } from 'next';

// Define TypeScript type for TekTip (re-use from page.tsx or define here)
interface TekTip {
  _id: string;
  _createdAt: string;
  question: string;
  slug: { current: string };
  seoDescription?: string;
}

// GROQ Query for all Tek & Tip tutorials (only necessary fields for the list)
const ALL_TEK_TIPS_QUERY = `*[_type == "tekTip"] | order(publishedAt desc) {
  _id,
  _createdAt,
  question,
  slug,
  seoDescription
}`;

// Metadata for the Teks & Tips page
export const metadata: Metadata = {
  title: 'Mycelial FunGuy Teks & Tips - Cultivation Tutorials',
  description: 'Find step-by-step guides, tutorials, and essential tips for successful mushroom cultivation.',
};

export default async function TeksTipsPage() {
  const tekTips = await sanityFetch<TekTip[]>({
    query: ALL_TEK_TIPS_QUERY,
    revalidate: 60, // Revalidate every 60 seconds
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gradient-to-br from-indigo-800 via-purple-700 to-green-700 text-white font-sans">
      {/* Back to Home Link */}
      <div className="w-full max-w-5xl mb-8">
        <Link href="/" className="text-pink-300 hover:text-pink-100 transition-colors text-lg flex items-center">
          &larr; Back to Home
        </Link>
      </div>

      <h1 className="text-5xl font-extrabold text-fuchsia-300 mb-12 drop-shadow-2xl text-center">
        Myco-Teks & Essential Tips
      </h1>

      <section className="w-full max-w-4xl">
        {tekTips.length > 0 ? (
          <ul className="space-y-6">
            {tekTips.map((tip) => (
              <li key={tip._id} className="bg-purple-800/60 p-6 rounded-lg shadow-xl border-2 border-purple-600 hover:border-fuchsia-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                <Link href={`/teks-tips/${tip.slug.current}`} className="block">
                  <h2 className="text-3xl font-semibold text-pink-200 mb-2 hover:underline">
                    {tip.question}
                  </h2>
                  {tip.seoDescription && (
                    <p className="text-gray-300 text-base line-clamp-2">{tip.seoDescription}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-300 text-xl">
            No Teks & Tips tutorials published yet. Check back soon for more mycological wisdom!
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