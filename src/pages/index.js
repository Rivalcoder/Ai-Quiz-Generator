// pages/index.js
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import "../app/globals.css";

export default function Home() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/page');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <Head>
        <title>AI Quiz Generator | Create Custom Quizzes</title>
        <meta name="description" content="Generate custom quizzes for your projects using AI" />
      </Head>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ top: '10%', left: '15%' }}
        />
        <motion.div 
          className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{
            x: [0, -70, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ bottom: '5%', right: '10%' }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            />
            <div className="bg-gray-900 p-4 rounded-full relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.h1 
          className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          AI Quiz Generator
        </motion.h1>
        
        <motion.p 
          className="text-xl text-indigo-100/80 mb-8 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Create customized quizzes for your projects in seconds using advanced AI. Perfect for educators, developers, and project managers.
        </motion.p>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-md"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
        <motion.button
          onClick={handleStartClick}
          className="relative z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl px-10 py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:from-purple-500 hover:to-indigo-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Now
        </motion.button>
      </motion.div>

      <motion.div 
        className="mt-8 text-indigo-200/50 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        Free to get started
      </motion.div>
    </div>
  );
}