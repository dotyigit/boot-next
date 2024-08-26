"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <header className="relative z-10 p-4">
        <nav className="flex justify-end">
          <Link
            href="/entries"
            className="group flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold py-2 px-4 rounded-full transition duration-300"
          >
            <span>Go to Entries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </nav>
      </header>
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Welcome to Boot Next
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-200 mb-12"
          >
            Your powerful Next.js starter template
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            <FeatureCard
              title="Authentication"
              description="Pre-configured auth system with Lucia"
            />
            <FeatureCard
              title="Database ORM"
              description="Prisma for efficient database operations"
            />
            <FeatureCard
              title="UI Components"
              description="Beautiful UI with shadcn/ui"
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-700"
    >
      <h3 className="text-xl font-semibold mb-2 text-blue-300">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
