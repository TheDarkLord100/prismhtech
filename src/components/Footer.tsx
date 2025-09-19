"use client";

import { useState, useEffect } from "react";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

type Category = {
  id: string;
  name: string;
};

export default function Footer() {
  const [open, setOpen] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleSection = (section: string) => {
    setOpen(open === section ? null : section);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <footer className="bg-transparent text-white py-10 px-6 md:px-20 border-t-4 border-[#FFC107]">
      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-3 gap-10">
        {/* Company Details */}
        <div>
          <h3 className="font-bold text-lg border-b-2 border-yellow-400 inline-block pb-1">
            Company Details
          </h3>
          <p className="mt-3 text-sm leading-relaxed">
            Jaha bhi he wahi ka location dal dena bhai jase ki mera he pariyavaran complex.
            only an example sach me mat dal dena
          </p>
          <p className="mt-3 text-sm">📞 +91 *********  +91 *********</p>
          <p className="mt-2 text-sm">✉️ manavkakar@sexyboy.com</p>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-bold text-lg border-b-2 border-yellow-400 inline-block pb-1">
            Products
          </h3>
          {loading ? (
            <p className="mt-3 text-sm">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="mt-3 text-sm">No products found.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>• {cat.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-bold text-lg border-b-2 border-yellow-400 inline-block pb-1">
            Social media
          </h3>
          <div className="flex gap-4 mt-3 text-2xl">
            <a href="#" className="hover:text-yellow-400">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {/* Company Details */}
        <div>
          <button
            className="w-full flex justify-between items-center font-bold text-lg"
            onClick={() => toggleSection("company")}
          >
            Company Details
            <span>{open === "company" ? "▲" : "▼"}</span>
          </button>
          {open === "company" && (
            <div className="mt-2 text-sm leading-relaxed">
              <p>
                Jaha bhi he wahi ka location dal dena bhai jase ki mera he pariyavaran complex.
                only an example sach me mat dal dena
              </p>
              <p className="mt-2">📞 +91 *********  +91 *********</p>
              <p className="mt-1">✉️ manavkakar@sexyboy.com</p>
            </div>
          )}
        </div>

        {/* Products */}
        <div>
          <button
            className="w-full flex justify-between items-center font-bold text-lg"
            onClick={() => toggleSection("products")}
          >
            Products
            <span>{open === "products" ? "▲" : "▼"}</span>
          </button>
          {open === "products" && (
            loading ? (
              <p className="mt-2 text-sm">Loading...</p>
            ) : categories.length === 0 ? (
              <p className="mt-2 text-sm">No products found.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {categories.map((cat) => (
                  <li key={cat.id}>• {cat.name}</li>
                ))}
              </ul>
            )
          )}
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-bold text-lg border-b-2 border-yellow-400 inline-block pb-1">
            Social media
          </h3>
          <div className="flex gap-4 mt-3 text-2xl">
            <a href="#" className="hover:text-yellow-400">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
