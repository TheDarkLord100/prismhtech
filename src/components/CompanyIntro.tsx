import Image from "next/image";

export default function CompanyIntro() {
  return (
    <section className="max-w-7xl mx-auto py-12 px-4 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 className="text-orange-400 text-2xl font-semibold mb-4">
          Radiant Metals & Alloys Pvt. Ltd.
        </h2>
        <p className="text-gray-300 leading-relaxed">
          We are an ISO 9001:2015 Certified and CRISIL-rated manufacturing
          company. We manufacture Aluminium Alloy Ingots...
        </p>
      </div>
      <Image
        src="/Assets/category1.png"
        alt="Company"
        width={500}
        height={400}
        className="rounded-lg"
      />
    </section>
  );
}
