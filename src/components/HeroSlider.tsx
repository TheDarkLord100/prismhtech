import Image from "next/image";

export default function HeroSlider() {
  return (
    <section className="relative h-[500px]">
      <Image src="/Assets/category1.png" alt="Hero" fill className="object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold text-orange-400">Lorem Ipsum</h1>
        <p className="text-lg mt-4">Lorum Ipsum iubgdsfv srfvuihsd</p>
      </div>
    </section>
  );
}
