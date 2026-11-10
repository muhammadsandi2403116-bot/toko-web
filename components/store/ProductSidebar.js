"use client";

import { useState } from "react";

const categories = [
  {
    name: "Sembako",
    children: ["Beras", "Gula", "Garam", "Telur", "Lainnya"],
  },
  {
    name: "ATK",
    children: ["Buku", "Pulpen", "Pensil", "Lainnya"],
  },
  {
    name: "Rokok",
    children: ["Rokok Kretek", "Rokok Filter", "Lainnya"],
  },
  {
    name: "Kardus",
    children: ["Kardus kecil", "Kardus sedang", "Kardus besar"],
  },
  {
    name: "Minuman",
    children: ["Air mineral", "Teh", "Kopi", "Lainnya"],
  },
  {
    name: "Makanan Ringan",
    children: ["Keripik", "Biskuit", "Permen", "Lainnya"],
  },
];

export default function ProductSidebar({
  selectedCategory = "",
  onCategoryChange,
  minPrice = "",
  maxPrice = "",
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPrice,
}) {
  const [expandedCategory, setExpandedCategory] = useState("");

  const handleCategoryClick = (categoryName) => {
    setExpandedCategory((current) =>
      current === categoryName ? "" : categoryName
    );

    onCategoryChange?.(categoryName);
  };

  const handleSubcategoryClick = (subcategory) => {
    onCategoryChange?.(subcategory);
  };

  return (
    <aside className="w-full space-y-6 lg:w-64 lg:shrink-0">
      {/* KATEGORI */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Kategori
        </h2>

        <div className="space-y-2">
          {categories.map((category) => {
            const isExpanded =
              expandedCategory === category.name;

            const isSelected =
              selectedCategory === category.name;

            return (
              <div key={category.name}>
                <button
                  type="button"
                  onClick={() =>
                    handleCategoryClick(category.name)
                  }
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition ${
                    isSelected
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-gray-900 hover:border-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">
                      {isExpanded ? "⌄" : "›"}
                    </span>

                    <span className="text-sm font-medium">
                      {category.name}
                    </span>
                  </span>
                </button>

                {isExpanded && (
                  <div className="ml-5 mt-1 space-y-1">
                    {category.children.map((subcategory) => (
                      <button
                        key={subcategory}
                        type="button"
                        onClick={() =>
                          handleSubcategoryClick(subcategory)
                        }
                        className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                          selectedCategory === subcategory
                            ? "bg-red-50 font-medium text-red-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FILTER HARGA */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Filter Harga
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={minPrice ?? ""}
              onChange={(event) =>
                onMinPriceChange?.(event.target.value)
              }
              placeholder="Harga minimum"
              className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
            />

            <span className="text-gray-400">-</span>

            <input
              type="number"
              min="0"
              value={maxPrice ?? ""}
              onChange={(event) =>
                onMaxPriceChange?.(event.target.value)
              }
              placeholder="Harga maksimum"
              className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
            />
          </div>
          
          <button
            type="button"
            onClick={onApplyPrice}
            className="w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Terapkan
          </button>
        </div>
      </section>
    </aside>
  );
}