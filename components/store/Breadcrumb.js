
import Link from "next/link";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {index > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="h-3 w-3 text-white"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            )}

            {isLast ? (
              <span className="font-medium text-red-600">
                {item.label}
              </span>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="text-gray-900 transition hover:text-red-600"
              >
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href || "/"}
                className="text-gray-900 transition hover:text-red-600"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
