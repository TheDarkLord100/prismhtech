import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MemorialSection from '@/components/MemorialSection'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] text-white">
      <Navbar />
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-28 gap-10">

        {/* Left Content */}
        <div className="flex-[2] w-full text-left font-[Proxima-Nova] pl-16">
          <p className="text-yellow-400 text-lg mb-1">About</p>

          {/* Changed items-start to push Pvt. Ltd. to the top */}
          <div className="flex items-start gap-2 mb-2">
            <h1 className="text-4xl md:text-5xl font-bold leading-none italic">
              Pervesh Rasayan
            </h1>

            <span className="text-sm md:text-lg font-medium mt-1">
              Pvt. Ltd.
            </span>
          </div>

          {/* Reduced margin-top by adjusting the parent gap and mb-2 above */}
          <p className="text-gray-200 text-base md:text-lg">
            Your One Stop Shop for all Chemical Solutions
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full flex justify-center md:justify-end flex-1">
          <Image
            src="/Assets/about.png"
            alt="Chemical Products"
            width={450}
            height={350}
            className="object-contain"
          />
        </div>

      </section>


      <section className="px-6 md:px-20 py-4 font-[Proxima-Nova]">
        {/* Header Part */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
            Legacy of <span className="italic">Pervesh Rasayan</span>
          </h2>
        </div>

        {/* Body Text Part */}
        <div className="max-w-6xl mx-auto space-y-8 text-gray-100 text-base md:text-lg leading-relaxed">
          <p>
            Pervesh Rasayan is a trusted name in the chemical supply chain industry, with over 41 years
            of experience serving the electroplating and industrial chemicals sector. Since our
            establishment in 1984, we have been committed to delivering high-quality products and
            building reliable connections between leading manufacturers and end-users. Our focus
            has always been on consistency, trust, and long-term value.
          </p>

          <p>
            Founded by Shri M.L. Kakar, the company was built on strong principles of integrity,
            professionalism, and customer-centricity. His vision transformed Pervesh Rasayan into
            more than just a trading business—it became a dependable partner known for ethical
            practices and unwavering service. Today, his legacy continues to guide our operations
            and relationships.
          </p>

          <p>
            At Pervesh Rasayan, we take pride in fostering lasting partnerships with our customers,
            suppliers, and stakeholders. Our deep industry expertise, combined with a commitment
            to quality and reliability, enables us to meet evolving market needs with confidence.
            As we move forward, we remain dedicated to upholding our values while continuing to
            grow and serve with excellence.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-20 py-20 font-[Proxima-Nova]">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
            A few of the products we offer
          </h2>
          <p className="text-gray-200 mx-20 text-sm md:text-base">
            For over four decades, Pervesh Rasayan has been supplying high-quality industrial
            and specialty chemicals trusted by businesses across electroplating, metal finishing,
            water treatment, and manufacturing industries. Our carefully sourced products ensure reliability,
            consistency, and performance for every application.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">

          {/* Product Card 1 */}
          <div className="flex flex-col sm:flex-row bg-[#0B3D2E] rounded-xl overflow-hidden shadow-xl min-h-[280px]">
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                Electroplating Chemicals
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                High-performance electroplating chemicals designed for superior
                metal finishing, corrosion resistance, and industrial durability.
                We supply reliable solutions trusted by manufacturers and plating
                units across industries.
              </p>
            </div>
            <div className="flex-1 relative min-h-[200px]">
              <Image
                src="/Assets/p1.png"
                alt="Product 1"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Card 2 */}
          <div className="flex flex-col sm:flex-row bg-[#0B3D2E] rounded-xl overflow-hidden shadow-xl min-h-[280px]">
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                Laboratory Reagents & Specialty Chemicals
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Premium-grade laboratory reagents and specialty chemicals suitable
                for industrial processing, testing, and technical applications.
                Sourced from trusted manufacturers to ensure quality and consistency.              </p>
            </div>
            <div className="flex-1 relative min-h-[200px]">
              <Image
                src="/Assets/p2.png"
                alt="Product 2"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Card 3 */}
          <div className="flex flex-col sm:flex-row bg-[#0B3D2E] rounded-xl overflow-hidden shadow-xl min-h-[280px]">
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                Water Treatment & Testing Solutions
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Comprehensive water treatment chemicals and testing solutions for industrial
                plants, cooling towers, and process industries. Engineered to maintain efficiency,
                safety, and operational performance.
              </p>
            </div>
            <div className="flex-1 relative min-h-[200px]">
              <Image
                src="/Assets/p3.png"
                alt="Product 3"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Card 4 */}
          <div className="flex flex-col sm:flex-row bg-[#0B3D2E] rounded-xl overflow-hidden shadow-xl min-h-[280px]">
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                Industrial Metals & Raw Materials
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Supplying high-quality industrial metals including zinc, nickel, copper, tin,
                and allied raw materials for electroplating, manufacturing, and engineering
                applications with dependable sourcing and timely delivery.
              </p>
            </div>
            <div className="flex-1 relative min-h-[200px]">
              <Image
                src="/Assets/p4.png"
                alt="Product 4"
                fill
                className="object-cover"
              />
            </div>
          </div>
    
        </div>
      </section>

      <section className="px-6 md:px-20 py-20 font-[Proxima-Nova]">
        <div className="flex flex-col lg:flex-row items-start gap-12 max-w-7xl mx-auto">

          {/* Left Side: Heading and Text */}
          <div className="flex-2 lg:max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6 leading-tight">
              The companies we have been working with for decades
            </h2>
            <div className="space-y-4 text-gray-200 text-sm md:text-base leading-relaxed">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.
              </p>
            </div>
          </div>

          {/* Right Side: Logo Grid */}
          <div className="flex-[1] w-full grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-items-center">
            {/* Replace src with your actual logo paths */}
            {[
              { name: 'Unique Rubber', src: '/Assets/about-companies/c1.png' },
              { name: 'Atotech', src: '/Assets/about-companies/c2.png' },
              { name: 'GACL', src: '/Assets/about-companies/c3.png' },
              { name: 'Artek', src: '/Assets/about-companies/c4.png' },
              { name: 'Hindustan Zinc', src: '/Assets/about-companies/c5.png' },
              { name: 'Hindu', src: '/Assets/about-companies/c6.png' },
            ].map((logo, index) => (
              <div key={index} className="w-full h-32 relative flex items-center justify-center p-4">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={200}
                  height={80}
                  className="object-contain hover:grayscale-0 hover:brightness-100 transition-all duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>

        </div>
      </section>
      <Footer />
    </main>
  )
}
