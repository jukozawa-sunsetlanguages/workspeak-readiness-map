export default function ValidationMessage({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" className="min-h-0">
      {message && (
        <p role="alert" className="mt-6 flex items-start gap-3 text-sm text-offwhite">
          <span aria-hidden="true" className="mt-[9px] h-px w-5 shrink-0 bg-amber" />
          {message}
        </p>
      )}
    </div>
  )
}
