import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-br from-green-900 via-purple-900 to-indigo-900 text-gray-100 font-sans">
      <nav className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-4xl font-bold text-teal-300 drop-shadow-lg">Mycelial FunGuy</h1>
        <div className="flex gap-4">
          <Link href="/blog" className="text-xl hover:text-teal-300 transition-colors">Blog</Link>
          <Link href="/teks-tips" className="text-xl hover:text-teal-300 transition-colors">Teks & Tips</Link>
          <Link href="/about" className="text-xl hover:text-teal-300 transition-colors">About</Link>
          <Link href="/shop" className="text-xl hover:text-teal-300 transition-colors">Shop (Coming Soon!)</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto bg-gray-900/70 p-8 md:p-12 rounded-xl shadow-2xl border border-green-700 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold text-lime-300 mb-6 text-center drop-shadow-lg">
          About Your Friendly Mycelial FunGuy
        </h1>

        <section className="mb-8 text-lg leading-relaxed">
          <p className="mb-4">
            Hey there, fellow spore enthusiast! I'm the FunGuy behind Mycelial FunGuy, and this space is a reflection of my deep-seated passion for the incredible, often mysterious, world of fungi. My journey into mycology began not in a lab, but in a quiet corner of my own curiosity, watching a tiny mushroom sprout from a log and realizing there was an entire universe thriving beneath our feet.
          </p>
          <p className="mb-4">
            What started as a simple fascination quickly blossomed into an obsession with cultivation. I spent countless hours devouring books, experimenting with different "teks" (techniques), and learning from every success and, more importantly, every failure. The sheer magic of transforming spores into a bountiful flush of mushrooms captivated me, and I knew I had to share this profound experience.
          </p>
          <p className="mb-4">
            My goal with Mycelial FunGuy is to demystify mushroom cultivation and make it accessible to everyone, regardless of their experience level. Whether you're a curious beginner looking to grow your first oyster mushrooms or a seasoned mycophile seeking advanced insights, you'll find something here to spark your interest and expand your knowledge.
          </p>
          <p className="mb-4">
            I believe that growing mushrooms is more than just a hobby; it's a journey of connection—to nature, to sustainable practices, and to a deeper understanding of life's intricate networks. It's about patience, observation, and the quiet satisfaction of nurturing something truly extraordinary.
          </p>
          <p className="text-lime-200 font-semibold">
            Join me as we explore the hidden wonders of the fungal kingdom, one spore, one substrate, one beautiful mushroom at a time. Let's grow something amazing together!
          </p>
        </section>

        <div className="flex justify-center my-8">
          {/* Placeholder for a mushroom growing GIF */}
          <Image
            src="/growing-mushroom.gif"
            alt="A mushroom growing animation"
            width={300}
            height={300}
            className="rounded-lg shadow-xl border border-purple-600"
          />
        </div>

        <section className="text-center text-sm text-gray-400 mt-8 pt-4 border-t border-gray-700">
          <p>
            This page is a work in progress, much like a mycelial network expanding its reach.
            Expect more insights and fungal wisdom to sprout here soon!
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;