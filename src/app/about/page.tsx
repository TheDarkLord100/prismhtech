import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MemorialSection from '@/components/MemorialSection'

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] text-white">
          <Navbar />
            <div className="text-center pt-20">
                <h1 className="text-5xl font-bold mb-6 text-yellow-400">About Us</h1>
            </div>
          <MemorialSection />
          <Footer />
        </main>
  )
}
