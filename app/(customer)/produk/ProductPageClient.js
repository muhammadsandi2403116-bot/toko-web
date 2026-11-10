
"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/store/Breadcrumb";
import ProductSidebar from "@/components/store/ProductSidebar";
import ProductToolbar from "@/components/store/ProductToolbar";
import ProductGrid from "@/components/store/ProductGrid";

import { products } from "@/data/products";

export default function ProductPageClient() {
  const searchParams = useSearchParams();

  const categoryFromUrl = searchParams.get("category");
  const searchQuery = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryParent, setSelectedCategoryParent] = useState("");

  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");

  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");

  const [sortBy, setSortBy] = useState("popular");

  const availableCategories = useMemo(() => {
    const categoryMap = new Map();

    for (const product of products) {
      if (!product.category) {
        continue;
      }

      const category = categoryMap.get(product.category) || new Set();
      if (product.subcategory) {
        category.add(product.subcategory);
      }
      categoryMap.set(product.category, category);
    }

    return Array.from(categoryMap, ([name, children]) => ({
      name,
      children: Array.from(children),
    }));
  }, []);

  useEffect(() => {
    startTransition(() => {
      setSelectedCategory(categoryFromUrl || "");
      setSelectedCategoryParent("");
    });
  }, [categoryFromUrl]);

  const handleCategoryChange = (category, parent = "") => {
    setSelectedCategory(category);
    setSelectedCategoryParent(parent);
  };

  const handleApplyPrice = () => {
    setAppliedMinPrice(draftMinPrice);
    setAppliedMaxPrice(draftMaxPrice);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter berdasarkan kata kunci pencarian
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery) {
        result = result.filter((product) => {
        const searchableText = [
            product.name,
            product.category,
            product.subcategory,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchableText.includes(normalizedQuery);
        });
    }

    if (selectedCategory) {
      const normalizedCategory = selectedCategory.trim().toLowerCase();

      result = result.filter((product) => {
        const category = (product.category || "").trim().toLowerCase();
        const subcategory = (product.subcategory || "").trim().toLowerCase();

        return (
          category === normalizedCategory ||
          subcategory === normalizedCategory
        );
      });
    }

    if (appliedMinPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) >= Number(appliedMinPrice)
      );
    }

    if (appliedMaxPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) <= Number(appliedMaxPrice)
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "bestseller":
        result.sort(
          (a, b) => Number(b.sales || 0) - Number(a.sales || 0)
        );
        break;
      case "popular":
      default:
        result.sort(
          (a, b) =>
            Number(b.popularity || 0) - Number(a.popularity || 0)
        );
        break;
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    appliedMinPrice,
    appliedMaxPrice,
    sortBy,
  ]);

  const breadcrumbItems = [
    { label: "Beranda", href: "/" },
    ...(selectedCategoryParent
      ? [
          {
            label: selectedCategoryParent,
            onClick: () =>
              handleCategoryChange(selectedCategoryParent),
          },
          { label: selectedCategory },
        ]
      : [{ label: selectedCategory || "Semua Produk" }]),
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside>
            <ProductSidebar
              categories={availableCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              minPrice={draftMinPrice}
              maxPrice={draftMaxPrice}
              onMinPriceChange={setDraftMinPrice}
              onMaxPriceChange={setDraftMaxPrice}
              onApplyPrice={handleApplyPrice}
            />
          </aside>

          <section className="min-w-0">
            <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
              <ProductToolbar
                onSortChange={setSortBy}
                initialSort="popular"
              />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">
                {searchQuery
                  ? `Hasil pencarian: "${searchQuery}"`
                  : selectedCategory || "Semua Produk"}
              </h1>

              <p className="text-sm text-gray-500">
                {filteredProducts.length} produk
              </p>
            </div>
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mb-4 text-5xl">🔎</div>

                <h2 className="text-lg font-semibold text-gray-800">
                {products.length === 0
                  ? "Produk belum tersedia"
                  : "Produk tidak ditemukan"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                {products.length === 0
                  ? "Katalog akan ditampilkan setelah data produk tersedia."
                  : `Maaf, kami tidak menemukan produk${
                      searchQuery ? ` dengan kata kunci "${searchQuery}"` : ""
                    }. Coba gunakan kata kunci lainnya.`}
                </p>

                {products.length > 0 && (
                  <Link
                    href="/produk"
                    className="mt-5 inline-flex rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
                  >
                    Lihat Semua Produk
                  </Link>
                )}
            </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
