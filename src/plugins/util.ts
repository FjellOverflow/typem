export function formatDuration(totalSeconds: number) {
  const { t } = useI18n()

  const minutes = Math.trunc(totalSeconds / 60)
  const seconds = Math.trunc(totalSeconds - minutes * 60)
  const millis = Math.trunc((totalSeconds - (seconds + minutes * 60)) * 10)

  if (totalSeconds < 60) return `${seconds}.${millis} ${t('sec')}`

  return `${minutes}:${String(seconds).padStart(2, '0')} ${t('min')}`
}

export function matchKeyword(item: string, keyword: string) {
  const itemStr = item.replace(/ /g, '').toLowerCase()
  const keywordStr = keyword.replace(/ /g, '').toLowerCase()

  return itemStr.includes(keywordStr)
}

export function getSecondsPerItem(numberOfItems: number, seconds: number) {
  const { t } = useI18n()

  const secondsPerItem = seconds / numberOfItems

  return `${secondsPerItem.toFixed(2)} ${t('sec')}/${t('item')}`
}

export function groupByDate<T extends { timestamp: string }>(
  items: T[],
): { date: Date; items: T[] }[] {
  const groupsMap = new Map<string, { date: Date; items: T[] }>()

  items.forEach((item) => {
    const date = new Date(item.timestamp)
    const dateStr = date.toDateString()

    if (!groupsMap.has(dateStr)) groupsMap.set(dateStr, { date: new Date(dateStr), items: [item] })
    else groupsMap.get(dateStr)?.items.push(item)
  })

  return [...groupsMap.values()].sort((g1, g2) => g2.date.getTime() - g1.date.getTime())
}
