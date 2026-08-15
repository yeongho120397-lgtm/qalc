import './AdBanner.css'

type AdConfig = {
  enabled: boolean
  publisherId: string
  slotId: string
}

function readAdConfig(): AdConfig {
  return {
    enabled: import.meta.env.VITE_AD_ENABLED === 'true',
    publisherId: import.meta.env.VITE_AD_PUBLISHER_ID?.trim() ?? '',
    slotId: import.meta.env.VITE_AD_SLOT_ID?.trim() ?? '',
  }
}

function isAdConfigured(config: AdConfig): boolean {
  return config.enabled && config.publisherId !== '' && config.slotId !== ''
}

export function AdBanner() {
  const config = readAdConfig()

  if (!isAdConfigured(config)) {
    return null
  }

  return (
    <aside className="ad-banner" aria-label="Advertisement">
      <div
        className="ad-banner__slot"
        data-ad-publisher={config.publisherId}
        data-ad-slot={config.slotId}
      />
    </aside>
  )
}
