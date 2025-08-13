import Image from "next/image";

export default function ProductCard() {
  return (
    <div className="bg-orange-100 text-black rounded-lg p-4 shadow-md">
      <Image src="/Assets/category1.png" alt="Product" width={400} height={300} />
      <h3 className="mt-2 font-semibold">Aluminum Scrap</h3>
      <p className="text-sm">₹ 23.6 per Kg</p>
      <div className="flex items-center gap-2 mt-2">
        <button className="px-2 py-1 bg-gray-300 rounded">-</button>
        <span>2</span>
        <button className="px-2 py-1 bg-gray-300 rounded">+</button>
      </div>
    </div>
  );
}
