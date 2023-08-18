import defaultSettings from '@/setting'

const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle(pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
