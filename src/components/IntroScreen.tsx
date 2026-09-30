import { BRAND, INTRO } from '../assessment/content'

export default function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="py-6 sm:py-14">
      <p className="eyebrow text-offwhite/70">
        {BRAND.system}
        <br />
        {BRAND.product}
      </p>

      <h1 className="mt-8 max-w-2xl text-[2.1rem] leading-[1.12] font-semibold text-offwhite sm:text-[3.1rem]">
        {INTRO.headline}
      </h1>

      <div aria-hidden="true" className="mt-10 h-px w-24 bg-amber" />

      <p className="mt-8 max-w-xl text-lg leading-relaxed text-offwhite/85">{INTRO.support}</p>

      <p className="mt-6 max-w-xl border-l border-offwhite/25 pl-4 text-[15px] leading-relaxed text-offwhite/70">
        {INTRO.clarification}
      </p>

      <dl className="mt-12 grid max-w-2xl grid-cols-1 border-t border-offwhite/12 sm:grid-cols-3">
        {INTRO.facts.map((f) => (
          <div
            key={f.label}
            className="flex items-baseline justify-between gap-4 border-b border-offwhite/12 py-4 sm:block sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"
          >
            <dt className="eyebrow text-offwhite/55">{f.label}</dt>
            <dd className="text-right text-[15px] font-medium text-offwhite sm:mt-2 sm:text-left">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <button
          type="button"
          onClick={onStart}
          className="bg-amber px-7 py-4 text-[15px] font-medium text-navy transition-colors hover:bg-amber/90"
        >
          {INTRO.cta} →
        </button>
        <p className="font-heading text-sm font-semibold text-offwhite/70">{BRAND.principle}</p>
      </div>
    </div>
  )
}
