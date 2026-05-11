export function TitleBar() {
  const isMacElectron = typeof window !== 'undefined'
    && window.navigator.userAgent.includes('Electron')
    && window.navigator.platform.includes('Mac')

  if (!isMacElectron) return null

  return <div className="titlebar" />
}
