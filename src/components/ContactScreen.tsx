import { forwardRef } from 'react'
import { CONTACT_COPY, SECTION_META } from '../assessment/content'
import type { ContactErrors } from '../assessment/steps'
import type { ContactDetails } from '../assessment/types'

interface Props {
  contact: ContactDetails
  errors: ContactErrors
  onChange: (contact: ContactDetails) => void
}

const FIELDS: {
  key: keyof ContactDetails
  label: string
  type: string
  autoComplete: string
}[] = [
  { key: 'firstName', label: 'First name', type: 'text', autoComplete: 'given-name' },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { key: 'role', label: 'Job role / professional area', type: 'text', autoComplete: 'organization-title' },
]

const ContactScreen = forwardRef<HTMLHeadingElement, Props>(function ContactScreen(
  { contact, errors, onChange },
  headingRef,
) {
  const meta = SECTION_META.result
  return (
    <div>
      <p className="eyebrow text-offwhite/65">
        {meta.number} — {meta.title}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 text-[1.5rem] leading-[1.25] font-semibold text-offwhite outline-none sm:text-[1.9rem]"
      >
        {CONTACT_COPY.headline}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-offwhite/75">{CONTACT_COPY.explanation}</p>

      <div className="mt-8 space-y-6">
        {FIELDS.map((f) => {
          const id = `contact-${f.key}`
          const error = errors[f.key]
          return (
            <div key={f.key}>
              <label htmlFor={id} className="mb-2 block text-sm font-medium text-offwhite/85">
                {f.label}
              </label>
              <input
                id={id}
                type={f.type}
                autoComplete={f.autoComplete}
                value={contact[f.key]}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(e) => onChange({ ...contact, [f.key]: e.target.value })}
                className="w-full border border-transparent bg-offwhite px-4 py-3 text-base text-navy placeholder:text-graphite/60 focus:border-amber focus:outline-none aria-[invalid=true]:border-amber"
              />
              {error && (
                <p id={`${id}-error`} className="mt-2 flex items-start gap-3 text-sm text-offwhite">
                  <span aria-hidden="true" className="mt-[9px] h-px w-4 shrink-0 bg-amber" />
                  {error}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-offwhite/60">{CONTACT_COPY.privacy}</p>
    </div>
  )
})

export default ContactScreen
