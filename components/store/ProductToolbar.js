"use client";

import { useState } from "react";

const sortOptions = [
  { label: "Populer", value: "popular" },
  { label: "Terbaru", value: "newest" },
  { label: "Terlaris", value: "bestseller" },
];

export default function ProductToolbar({
  onSortChange,
  initialSort = "popular",
}) {
  const [activeSort, setActiveSort] = useState(initialSort);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const isPriceActive =
    activeSort === "price-asc" ||
    activeSort === "price-desc";

  const handleSort = (sortValue) => {
    setActiveSort(sortValue);
    setIsPriceOpen(false);

    onSortChange?.(sortValue);
  };

  const getButtonClass = (isActive) => {
    return `rounded-md border px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "border-red-600 bg-red-600 text-white"
        : "border-gray-300 bg-white text-gray-900 hover:border-red-500 hover:text-red-600"
    }`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* LABEL URUTKAN */}
      <span className="mr-1 text-sm font-medium text-gray-700">
        Urutkan
      </span>

      {/* FILTER POPULER, TERBARU, TERLARIS */}
      {sortOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleSort(option.value)}
          className={getButtonClass(
            activeSort === option.value
          )}
        >
          {option.label}
        </button>
      ))}

      {/* FILTER HARGA */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsPriceOpen((prev) => !prev)}
          className={getButtonClass(
            isPriceActive || isPriceOpen
          )}
          aria-expanded={isPriceOpen}
        >
          Harga
          <span className="ml-2">⌄</span>
        </button>

        {/* DROPDOWN HARGA */}
        {isPriceOpen && (
          <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
            <button
              type="button"
              onClick={() => handleSort("price-asc")}
              className={`block w-full px-4 py-3 text-left text-sm transition ${
                activeSort === "price-asc"
                  ? "bg-red-50 font-medium text-red-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Harga rendah ke tinggi
            </button>

            <button
              type="button"
              onClick={() => handleSort("price-desc")}
              className={`block w-full px-4 py-3 text-left text-sm transition ${
                activeSort === "price-desc"
                  ? "bg-red-50 font-medium text-red-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Harga tinggi ke rendah
            </button>
          </div>
        )}
      </div>
    </div>
  );
}