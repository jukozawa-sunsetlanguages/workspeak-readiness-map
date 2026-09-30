/**
 * First-touch attribution captured from the landing URL. Values are left blank
 * when absent; nothing is inferred beyond an external referrer host.
 */
export interface Attribution {
  source: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
}

const STORAGE_KEY = 'workspeak-crm-attribution'

export const EMPTY_ATTRIBUTION: Attribution = {
  source: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
}

function fromUrl(): Attribution {
  const params = new URLSearchParams(window.location.search)
  const get = (key: string) => params.get(key)?.trim() ?? ''
  let source = get('source') || get('ref')
  if (!source && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname
      if (host && host !== window.location.hostname) source = host
    } catch {
      // Ignore malformed referrers.
    }
  }
  return {
    source,
    utmSource: get('utm_source'),
    utmMedium: get('utm_medium'),
    utmCampaign: get('utm_campaign'),
  }
}

/** Reads attribution for this session, keeping the first non-empty capture. */
export function captureAttribution(): Attribution {
  try {
    const current = fromUrl()
    const hasCurrent = Object.values(current).some(Boolean)
    const saved = window.sessionStorage.getItem(STORAGE_KEY)
    if (saved && !hasCurrent) return { ...EMPTY_ATTRIBUTION, ...(JSON.parse(saved) as Attribution) }
    if (hasCurrent || !saved) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    return current
  } catch {
    return EMPTY_ATTRIBUTION
  }
}
