import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface CoverBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function CoverBreadcrumbs({ items, className = '' }: CoverBreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`mb-4 overflow-x-auto py-1 ${className}`}>
      <ol className="flex items-center flex-wrap gap-y-1 text-xs md:text-sm text-white/80 font-medium tracking-wide">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center whitespace-nowrap">
              {index > 0 && (
                <span className="mx-2 text-white/40 select-none font-light" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.url ? (
                <span
                  className="text-white font-bold capitalize"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-white hover:underline transition-colors capitalize text-white/75"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
