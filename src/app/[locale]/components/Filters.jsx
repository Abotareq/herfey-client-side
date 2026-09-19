"use client";
import { useTranslations } from "next-intl";
import { Loader2, SlidersHorizontal, X } from "lucide-react";

/**
 * The catalogue filter kit, shared by the products and stores pages so the
 * two read as one system: a sticky sidebar on lg+, a toolbar that opens the
 * same panel below lg, one field style, one pagination and one skeleton.
 *
 * Pages own their state; these only render it.
 */

/** Sidebar + results column. */
export function FilterLayout({ children }) {
  return (
    <div className="flex flex-col gap-6 px-4 pb-16 md:px-8 lg:flex-row lg:gap-8">
      {children}
    </div>
  );
}

/**
 * The filter panel. Always visible on lg+ (sticky, beside the results);
 * below lg it shows only while `open`, toggled from `FilterToolbar`.
 */
export function FilterSidebar({ id, open, onClose, onClear, children }) {
  const t = useTranslations("filters");
  return (
    <aside
      id={id}
      className={`${
        open ? "block" : "hidden"
      } enter w-full bg-white p-5 shadow-xs lg:block lg:w-64 lg:shrink-0 lg:self-start lg:sticky lg:top-20 lg:rounded-2xl`}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold text-gray-900">{t("title")}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="grid h-8 w-8 place-items-center rounded-full text-gray-500 transition hover:bg-gray-900/5 lg:hidden"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {children}

      <button
        type="button"
        className="btn btn-sm btn-secondary mt-5 w-full"
        onClick={onClear}
      >
        {t("clear")}
      </button>
    </aside>
  );
}

/** A labelled control inside the sidebar. */
export function FilterField({ id, label, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="label mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}

/** The rule between the sort control and the filters. */
export function FilterDivider() {
  return <hr className="my-5 border-gray-900/8" />;
}

/**
 * Below lg: the button that opens the panel, with a count of what is
 * applied, and the results summary on the other side.
 */
export function FilterToolbar({ open, onToggle, controls, activeCount, children }) {
  const t = useTranslations("filters");
  return (
    <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={controls}
        className="btn btn-sm btn-secondary"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        {t("title")}
        {activeCount > 0 && (
          <span className="rounded-full bg-orange-600 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">
            {activeCount}
          </span>
        )}
      </button>
      <div className="text-sm tabular-nums text-gray-500">{children}</div>
    </div>
  );
}

/**
 * "12 products" — or, while a filter change is being fetched and the old
 * results are still on screen, "Updating…" so the wait reads as work, not
 * as a page that ignored the click.
 */
export function ResultsSummary({ updating, children }) {
  const t = useTranslations("filters");
  return (
    <span role="status" className="inline-flex items-center gap-2">
      {updating ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-600" aria-hidden="true" />
          {t("updating")}
        </>
      ) : (
        children
      )}
    </span>
  );
}

/**
 * The results grid. Keeps the previous page on screen, dimmed, while the
 * next one loads, instead of swapping it for a skeleton.
 */
export function ResultsGrid({ updating, className = "", children }) {
  return (
    <section
      aria-busy={updating || undefined}
      className={`stagger transition-opacity duration-300 ${
        updating ? "pointer-events-none opacity-50" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}

/** Pill pagination. Long runs collapse to first … around … last. */
export function Pagination({ page, totalPages, onChange }) {
  const t = useTranslations("filters");
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (page <= 4) {
    pages.push(1, 2, 3, 4, 5, "…", totalPages);
  } else if (page >= totalPages - 3) {
    pages.push(1, "…");
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, "…", page - 1, page, page + 1, "…", totalPages);
  }

  return (
    <nav
      aria-label={t("pagination")}
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="btn btn-sm btn-secondary"
      >
        {t("previous")}
      </button>

      <div className="flex flex-wrap justify-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              className="grid h-9 min-w-9 place-items-center text-sm text-gray-400 select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={page === p ? "page" : undefined}
              aria-label={t("page", { page: p })}
              className={`grid h-9 min-w-9 place-items-center rounded-full px-2 text-sm font-semibold tabular-nums transition duration-300 ease-out-soft ${
                page === p
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-900/5 hover:text-gray-900"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="btn btn-sm btn-secondary"
      >
        {t("next")}
      </button>
    </nav>
  );
}

/**
 * First-load skeleton for a catalogue page: breadcrumb, sidebar, toolbar,
 * `cards` in `gridClassName`, pagination. Pages pass their own card skeleton.
 */
export function CataloguePageSkeleton({ gridClassName, cards = 8, card }) {
  return (
    <div className="min-h-screen">
      <div className="px-4 py-4 md:px-8">
        <div className="skeleton h-4 w-48" />
      </div>

      <FilterLayout>
        <aside className="hidden w-64 shrink-0 rounded-2xl bg-white p-5 shadow-xs lg:block">
          <div className="skeleton mb-4 h-6 w-32 rounded" />
          <div className="mb-4">
            <div className="skeleton mb-1 h-4 w-16 rounded" />
            <div className="skeleton h-10 rounded-md" />
          </div>
          <hr className="my-5 border-gray-900/8" />
          {[1, 2, 3].map((item) => (
            <div key={item} className="mb-4">
              <div className="skeleton mb-1 h-4 w-20 rounded" />
              <div className="skeleton h-10 rounded-md" />
            </div>
          ))}
          <div className="skeleton mt-4 h-10 rounded-md" />
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-6">
            <div className="skeleton h-10 w-56 rounded sm:h-12" />
            <div className="skeleton mt-3 hidden h-4 w-32 rounded lg:block" />
          </div>
          <div className="skeleton mb-6 h-9 w-28 rounded-full lg:hidden" />

          <section className={gridClassName}>
            {Array.from({ length: cards }, (_, i) => (
              <div key={i}>{card}</div>
            ))}
          </section>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <div className="skeleton h-9 w-20 rounded-full" />
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <div key={p} className="skeleton h-9 w-9 rounded-full" />
              ))}
            </div>
            <div className="skeleton h-9 w-16 rounded-full" />
          </div>
        </section>
      </FilterLayout>
    </div>
  );
}
