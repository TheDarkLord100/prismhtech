"use client";

import Image from "next/image";

export default function MemorialSection() {
  return (
    <section className="w-full bg-transparent pt-8 pb-16 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-center gap-12">
        
        {/* Left Text Section */}
        <div className="flex-1 text-left">
          <h3 className="text-white text-xl">In Memoria of</h3>
          <h2 className="text-4xl font-bold text-yellow-400 italic mt-2">
            Dada ji’s Name
          </h2>
          <p className="text-gray-200 text-sm mt-6 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Ut faucibus eget rhoncus 
            odio mi. Cum in sed dui cursus faucibus cursus placerat. Integer 
            sociis laoreet pellentesque tempus enim odio pellentesque facilisis. 
            In id etiam feugiat velit. Id risus risus urna tristique arcu etiam 
            nulla scelerisque. Mauris erat sed enim lobortis. Mollis cursus 
            tristique in malesuada ultrices eget.
          </p>
        </div>

        {/* Right Image Section */}
        <div className="flex-shrink-0">
          <Image
            src="/Dadaji/Dadaji.png"
            alt="Dada ji’s Name"
            width={300}
            height={400}
            className="rounded-2xl object-cover shadow-lg brightness-110"
          />
        </div>
      </div>
    </section>
  );
}
