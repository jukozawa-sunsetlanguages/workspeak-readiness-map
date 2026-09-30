import { BRAND } from '../assessment/content'

/**
 * Sunset Languages is the parent brand; WorkSpeak™ appears only as a
 * typographic product label. No separate WorkSpeak mark is used.
 */
export default function BrandHeader() {
  return (
    <header className="border-b border-offwhite/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <span className="font-heading text-[15px] font-semibold tracking-tight text-offwhite">
          {BRAND.parent}
        </span>
        <span className="eyebrow hidden text-offwhite/60 sm:block">
          {BRAND.system} · {BRAND.product}
        </span>
      </div>
    </header>
  )
}
