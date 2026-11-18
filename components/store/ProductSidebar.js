
"use client";

import { useState } from "react";

const normalizeName = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

export default function ProductSidebar({
  categories = [],
  selectedCategory = "",
  selectedCategoryParent = "",
  onCategoryChange,
  minPrice = "",
  maxPrice = "",
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPrice,
  onResetPrice,
}) {
  const [expandedCategory, setExpandedCategory] = useState("");

  const handleCategoryClick = (categoryName) => {
    setExpandedCategory((current) =>
      current === categoryName ? "" : categoryName
    );

    // Memilih kategori utama
    onCategoryChange?.(categoryName, "");
  };

  const handleSubcategoryClick = (subcategory, parentCategory) => {
    // Memilih subkategori beserta kategori induknya
    onCategoryChange?.(subcategory, parentCategory);
  };

  return (
    <aside className="w-full space-y-6 lg:w-64 lg:shrink-0">
      {/* KATEGORI */}
      {categories.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Kategori
          </h2>

          <div className="space-y-2">
            {categories.map((category) => {
              const isExpanded =
                normalizeName(expandedCategory) ===
                normalizeName(category.name);

              const isSelected =
                !selectedCategoryParent &&
                normalizeName(selectedCategory) ===
                  normalizeName(category.name);

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

                  {isExpanded && category.children.length > 0 && (
                    <div className="ml-5 mt-1 space-y-1">
                      {category.children.map((subcategory) => (
                        <button
                          key={subcategory}
                          type="button"
                          onClick={() =>
                            handleSubcategoryClick(
                              subcategory,
                              category.name
                            )
                          }
                          className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                            normalizeName(selectedCategoryParent) ===
                              normalizeName(category.name) &&
                            normalizeName(selectedCategory) ===
                              normalizeName(subcategory)
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
      )}

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

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onApplyPrice}
              className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Terapkan
            </button>
            <button
              type="button"
              onClick={onResetPrice}
              className="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-500 hover:text-red-600"
            >
              Reset
            </button>
          </div>
        </div>
      </section>
    </aside>
  );
}
