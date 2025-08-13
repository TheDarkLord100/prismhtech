import Image from "next/image";

export default function CategoryCard({ title, imgSrc }: { title: string; imgSrc: string }) {
  return (
    <div className="bg-white text-black rounded-lg shadow-md overflow-hidden">
      <Image src={imgSrc} alt={title} width={400} height={300} />
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        <a href="/products" className="text-orange-500 mt-2 block">
          View products
        </a>
      </div>
    </div>
  );
}
