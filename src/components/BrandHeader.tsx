import { BRAND } from '../assessment/content'

/**
 * Sunset Languages is the parent brand (official logo asset); WorkSpeak™
 * appears only as a typographic method label. No separate WorkSpeak mark is used.
 * The logo's own navy canvas matches the header, so it sits without recoloring.
 */
export default function BrandHeader() {
  return (
    <header className="border-b border-offwhite/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <img
          src={BRAND.logo.src}
          width={BRAND.logo.width}
          height={BRAND.logo.height}
          alt={BRAND.parent}
          className="h-11 w-auto shrink-0 sm:h-[52px]"
        />
        <span className="eyebrow hidden text-right text-offwhite/60 sm:block">
          {BRAND.system} · {BRAND.product}
        </span>
      </div>
    </header>
  )
}
