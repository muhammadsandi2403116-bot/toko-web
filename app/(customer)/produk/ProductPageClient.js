
"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import Breadcrumb from "@/components/store/Breadcrumb";
import ProductSidebar from "@/components/store/ProductSidebar";
import ProductToolbar from "@/components/store/ProductToolbar";
import ProductGrid from "@/components/store/ProductGrid";

import { products } from "@/data/products";

const PRODUCTS_PER_PAGE = 12;

const supportedSorts = new Set([
  "popular",
  "newest",
  "bestseller",
  "price-asc",
  "price-desc",
]);

const sortTitles = {
  popular: "Produk Terpopuler",
  newest: "Produk Terbaru",
  bestseller: "Produk Terlaris",
  "price-asc": "Harga Terendah",
  "price-desc": "Harga Tertinggi",
};

const getSortFromUrl = (sort) =>
  supportedSorts.has(sort) ? sort : "popular";

const normalizeName = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

export default function ProductPageClient() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryFromUrl = searchParams.get("category");
  const searchQuery = searchParams.get("q") || "";
  const sortFromUrl = searchParams.get("sort");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryParent, setSelectedCategoryParent] =
    useState("");

  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");

  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");

  const [sortSelection, setSortSelection] = useState(() => ({
    source: sortFromUrl,
    value: getSortFromUrl(sortFromUrl),
  }));
  const sortBy =
    sortSelection.source === sortFromUrl
      ? sortSelection.value
      : getSortFromUrl(sortFromUrl);

  const navigateWithParams = (params, method = "push") => {
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    router[method](href, { scroll: false });
  };

  const resetPage = () => {
    if (!searchParams.has("page")) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    navigateWithParams(params, "replace");
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    navigateWithParams(params);
  };

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    setSortSelection({ source: sortFromUrl, value });
    navigateWithParams(params);
  };

  // MEMBUAT DAFTAR KATEGORI DARI DATA PRODUK
  const availableCategories = useMemo(() => {
    const categoryMap = new Map();

    for (const product of products) {
      const categoryName = String(product.category || "")
        .trim()
        .replace(/\s+/g, " ");
      const categoryKey = normalizeName(categoryName);

      if (!categoryKey) continue;

      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          name: categoryName,
          children: new Map(),
        });
      }

      const category = categoryMap.get(categoryKey);
      const subcategoryName = String(product.subcategory || "")
        .trim()
        .replace(/\s+/g, " ");
      const subcategoryKey = normalizeName(subcategoryName);

      if (subcategoryKey && !category.children.has(subcategoryKey)) {
        category.children.set(subcategoryKey, subcategoryName);
      }
    }

    return Array.from(categoryMap.values(), ({ name, children }) => ({
      name,
      children: Array.from(children.values()),
    }));
  }, []);

  // MEMBACA KATEGORI DARI URL
  useEffect(() => {
    startTransition(() => {
      setSelectedCategory(categoryFromUrl || "");
      setSelectedCategoryParent("");
    });
  }, [categoryFromUrl]);

  // MEMILIH KATEGORI ATAU SUBKATEGORI
  const handleCategoryChange = (category, parent = "") => {
    setSelectedCategory(category);
    setSelectedCategoryParent(parent);
    resetPage();
  };

  // MENERAPKAN FILTER HARGA
  const handleApplyPrice = () => {
    setAppliedMinPrice(draftMinPrice);
    setAppliedMaxPrice(draftMaxPrice);
    resetPage();
  };

  const handleResetPrice = () => {
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    resetPage();
  };

  // FILTER DAN SORTING PRODUK
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // PENCARIAN
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

    // FILTER KATEGORI DAN SUBKATEGORI
    if (selectedCategory) {
      const normalizedCategory = normalizeName(selectedCategory);
      const normalizedParent = normalizeName(selectedCategoryParent);

      result = result.filter((product) => {
        const category = normalizeName(product.category);
        const subcategory = normalizeName(product.subcategory);

        if (normalizedParent) {
          return (
            category === normalizedParent &&
            subcategory === normalizedCategory
          );
        }

        const isCategory = availableCategories.some(
          (item) => normalizeName(item.name) === normalizedCategory
        );

        return isCategory
          ? category === normalizedCategory
          : subcategory === normalizedCategory;
      });
    }

    // FILTER HARGA MINIMUM
    if (appliedMinPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) >= Number(appliedMinPrice)
      );
    }

    // FILTER HARGA MAKSIMUM
    if (appliedMaxPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) <= Number(appliedMaxPrice)
      );
    }

    // SORTING
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
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );
        break;

      case "bestseller":
        result.sort(
          (a, b) =>
            Number(b.sales || 0) -
            Number(a.sales || 0)
        );
        break;

      case "popular":
      default:
        result.sort(
          (a, b) =>
            Number(b.popularity || 0) -
            Number(a.popularity || 0)
        );
        break;
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedCategoryParent,
    availableCategories,
    appliedMinPrice,
    appliedMaxPrice,
    sortBy,
  ]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );
  const requestedPage = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const currentPage = Math.min(requestedPage, pageCount);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );
  const firstProductNumber =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const lastProductNumber = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredProducts.length
  );

  const hasProductsInSelectedCategory =
    !selectedCategory ||
    products.some((product) => {
      const category = normalizeName(product.category);
      const subcategory = normalizeName(product.subcategory);
      const selected = normalizeName(selectedCategory);
      const parent = normalizeName(selectedCategoryParent);

      return parent
        ? category === parent && subcategory === selected
        : availableCategories.some(
            (item) => normalizeName(item.name) === selected
          )
          ? category === selected
          : subcategory === selected;
    });

  // BREADCRUMB
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

          {/* SIDEBAR */}
          <aside>
            <ProductSidebar
              categories={availableCategories}
              selectedCategory={selectedCategory}
              selectedCategoryParent={selectedCategoryParent}
              onCategoryChange={handleCategoryChange}
              minPrice={draftMinPrice}
              maxPrice={draftMaxPrice}
              onMinPriceChange={setDraftMinPrice}
              onMaxPriceChange={setDraftMaxPrice}
              onApplyPrice={handleApplyPrice}
              onResetPrice={handleResetPrice}
            />
          </aside>

          {/* KATALOG PRODUK */}
          <section className="min-w-0">

            <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
              <ProductToolbar
                sortBy={sortBy}
                onSortChange={handleSortChange}
              />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">
                {searchQuery
                  ? `Hasil pencarian: "${searchQuery}"`
                  : selectedCategory || sortTitles[sortBy]}
              </h1>

              <p className="text-sm text-gray-500">
                {filteredProducts.length} produk
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <ProductGrid products={paginatedProducts} />
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mb-4 text-5xl">🔎</div>

                <h2 className="text-lg font-semibold text-gray-800">
                  {products.length === 0 || !hasProductsInSelectedCategory
                    ? "Produk belum tersedia"
                    : "Produk tidak ditemukan"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {products.length === 0 || !hasProductsInSelectedCategory
                    ? "Katalog akan ditampilkan setelah data produk tersedia."
                    : `Maaf, kami tidak menemukan produk${
                        searchQuery
                          ? ` dengan kata kunci "${searchQuery}"`
                          : ""
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

            {filteredProducts.length > 0 && (
              <nav
                aria-label="Navigasi halaman produk"
                className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
              >
                <p className="text-sm text-gray-500">
                  Menampilkan {firstProductNumber}-{lastProductNumber} dari{" "}
                  {filteredProducts.length} produk
                </p>

                {pageCount > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Sebelumnya
                    </button>

                    {Array.from({ length: pageCount }, (_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          aria-current={isCurrentPage ? "page" : undefined}
                          aria-label={`Halaman ${page}`}
                          className={`min-w-10 rounded-md border px-3 py-2 text-sm font-medium transition ${
                            isCurrentPage
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-red-500 hover:text-red-600"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pageCount}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Berikutnya
                    </button>
                  </div>
                )}
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
