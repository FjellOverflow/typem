export function formatSeconds(s: number) {
  const { t } = useI18n()

  const minutes = Math.trunc(s / 60)
  const seconds = Math.trunc(s - minutes * 60)
  const millis = Math.trunc((s - seconds) * 10)

  if (s < 60) return `${seconds}.${millis} ${t('timer.seconds.short')}`

  return `${minutes}:${String(seconds).padStart(2, '0')} ${t('timer.minutes.short')}`
}

export function matchKeyword(item: string, keyword: string) {
  const itemStr = item.replace(/ /g, '').toLowerCase()
  const keywordStr = keyword.replace(/ /g, '').toLowerCase()

  return itemStr.includes(keywordStr)
}
