import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">Radiant Metals</div>
      <ul className="flex gap-6 text-sm">
        <li><Link href="/" className="hover:text-orange-400">Home</Link></li>
        <li><Link href="/products" className="hover:text-orange-400">Products</Link></li>
        <li><Link href="/blogs" className="hover:text-orange-400">Blogs</Link></li>
        <li><Link href="/about" className="hover:text-orange-400">About Us</Link></li>
        <li><Link href="/contact" className="hover:text-orange-400">Contact</Link></li>
      </ul>
    </nav>
  );
}