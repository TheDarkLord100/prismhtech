"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
};

type Props = {
  value: Product | null;
  onChange: (product: Product | null) => void;
};

export default function ProductSearchSelect({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/search?q=${query}`);
      if (!res.ok) return;

      const data = await res.json();
      setResults(data.products || []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function selectProduct(product: Product) {
    onChange(product);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="relative">
      {/* Selected product */}
      {value && (
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {value.name}
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm text-red-500"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input */}
      {!value && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          onFocus={() => query && setOpen(true)}
        />
      )}

      {/* Dropdown */}
      {open && !value && (
        <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border">
          {loading && (
            <p className="px-4 py-2 text-sm text-gray-500">Searching...</p>
          )}

          {!loading && results.length === 0 && (
            <p className="px-4 py-2 text-sm text-gray-500">
              No products found
            </p>
          )}

          {!loading &&
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => selectProduct(product)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              >
                {product.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
