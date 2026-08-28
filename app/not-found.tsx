import Link from "next/link";

export default function NotFound() {
  return (
    <section className="border-b-2 border-divider">
      <div className="mx-auto max-w-page px-4 py-16 min-[900px]:px-10 min-[900px]:py-24">
        <p className="t-eyebrow mb-3 text-accent-400">Error 404</p>
        <h1 className="t-h2 mb-4 text-fg">Nothing modelled here</h1>
        <p className="mb-7 max-w-[52ch] text-[16px] leading-[1.55] text-fg-muted">
          That page does not exist. It may have been renamed, or the link that
          brought you here may be out of date.
        </p>
        <Link
          href="/"
          className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider bg-accent px-[18px] py-3 text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700"
        >
          Back to the portfolio &rarr;
        </Link>
      </div>
    </section>
  );
}
