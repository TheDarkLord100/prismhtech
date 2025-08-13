export default function Navbar() {
  return (
    <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">Radiant Metals</div>
      <ul className="flex gap-6 text-sm">
        <li><a href="/" className="hover:text-orange-400">Home</a></li>
        <li><a href="/products" className="hover:text-orange-400">Products</a></li>
        <li><a href="/blogs" className="hover:text-orange-400">Blogs</a></li>
        <li><a href="/about" className="hover:text-orange-400">About Us</a></li>
        <li><a href="/contact" className="hover:text-orange-400">Contact</a></li>
      </ul>
    </nav>
  );
}