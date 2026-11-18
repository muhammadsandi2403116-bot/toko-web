import { products } from "@/data/products";

const categoryMetadata = {
  sembako: { placeholder: "🛒" },
  atk: { placeholder: "✏️" },
  rokok: { placeholder: "🚬" },
  kardus: { placeholder: "📦" },
  minuman: { placeholder: "🥤" },
  "makanan ringan": { placeholder: "🍪" },
};

const uniqueCategories = new Map();

for (const product of products) {
  const name = String(product.category || "")
    .trim()
    .replace(/\s+/g, " ");
  const key = name.toLowerCase();

  if (key && !uniqueCategories.has(key)) {
    uniqueCategories.set(key, name);
  }
}

export const categories = Array.from(uniqueCategories, ([key, name]) => ({
  name,
  image: null,
  placeholder: categoryMetadata[key]?.placeholder || "🛍️",
}));