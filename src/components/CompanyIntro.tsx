import Image from "next/image";

export default function CompanyIntro() {
  return (
    <section className="max-w-7xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-center bg-[var(--title-bg)]">
      {/* Left Text Section */}
      <div>
        <h2 className="text-purple-500 text-4xl font-bold mb-2">
          Radiant Metals & Alloys Pvt. Ltd.
        </h2>
        <h3 className="uppercase tracking-wide text-lg text-foreground mb-6">
          Suppliers and Distributers
        </h3>

        <p className="text-foreground/80 leading-relaxed mb-4">
          We are an ISO 9001:2015 Certified and CRISIL-rated manufacturing
          company. We manufacture Aluminium Alloy Ingots, Zinc Alloy Ingots
          and Aluminium Alloy castings in our facility located in the U.T. of
          Dadra Nagar Haveli and another facility located in Bhiwandi,
          Maharashtra, our registered office is in Mumbai, India. We have been
          in this business for more than 50 years. We have an impeccable
          reputation in the non-ferrous industry for our consistent quality,
          service and technical know-how.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          We manufacture Aluminium alloy ingots such as LM2, LM6, LM9, LM20,
          LM24, LM25, A356, AlSi7Mg, AlSi10Mg, LM9, ADC6, ADC12, AlSi132,
          AC2A, AC2B etc. for gravity die-casting (GDC), high-pressure
          die-casting (PDC), low-pressure die-casting (LPDC) sand die-casting
          and other diecasting processes. We make Zinc Alloys such as Zamak 3,
          Zamak 5, ZA 27, ZA 10 and others, Master alloys such as Aluminium
          Strontium (AlSr), Aluminium Titanium (AlTi), Aluminium Titanium
          Boron (AlTiB), Aluminium Manganese (AlMn), Aluminium Magnesium
          (AlMg), Aluminium Ferrous (AlFe) and others, and Aluminium oxidizers
          for the Steel Industries and special master alloys for the Extrusion
          Industries.
        </p>
      </div>

      {/* Right Image Section */}
      <div className="flex justify-center drop-shadow-xl">
        <Image
          src="/Assets/Category1.png"
          alt="Company"
          width={500}
          height={400}
          className="rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
