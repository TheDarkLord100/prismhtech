"use client";

import Image from "next/image";

export default function MemorialSection() {
  return (
    <section className="w-full bg-transparent pt-8 pb-16 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-center gap-12">
        
        {/* Left Text Section */}
        <div className="flex-1 text-left">
          <h3 className="text-white text-xl">In Memoria of</h3>
          <h2 className="text-4xl font-bold text-yellow-400 mt-2">
            Shri M.L. Kakar
          </h2>
          <p className="text-gray-200 mt-6 leading-relaxed font-['Gotham']">
             Founded in <span className="font-bold">1984</span> by <span className="font-bold">Shri M.L. Kakar</span>, Pervesh Rasayan stands on a legacy of unyielding integrity and visionary purpose. 
             <br/>
             <br/>
             For over four decades, we have been the trusted bridge in electroplating and industrial chemicals, not just delivering products, but embodying Quality, Trust, and Enduring Value. 
             <br/>
             <br/>
             Our journey is a tribute to Mr. Kakar's spirit, his ethics woven into every fiber of our operation. 
             <br/>
             <br/>
             <span className="font-bold">To our customers:</span> Your trust is our foundation. <span className="font-bold">To our partners:</span> Your collaboration is our strength. 
             <br/>
             <br/>
             We carry his torch forward, committed to the same sincerity, professionalism, and passion that has defined us since day one. 
             <br/>
             <br/>
             <span className="font-bold">Pervesh Rasayan:</span> Honoring a Legacy. Forging the Future. Together.
          </p>
        </div>

        {/* Right Image Section */}
        <div className="flex-shrink-0">
          <Image
            src="/Dadaji/Dadaji.png"
            alt="Dada ji’s Name"
            width={450}
            height={600}
            className="rounded-2xl object-cover shadow-lg brightness-110"
          />
        </div>
      </div>
    </section>
  );
}
