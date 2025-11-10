const zeroPad = (num: number) => (num < 10 ? `0${num}` : String(num))

export const formatISODate = (d: Date) => {
  const y = d.getFullYear()
  const m = zeroPad(d.getMonth() + 1)
  const day = zeroPad(d.getDate())
  return `${y}-${m}-${day}`
}

export const getISODatePlus = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return formatISODate(d)
}

export const testData = {
  create: {
    name: 'Team Meeting',
    email: 'team@example.com',
    date: () => getISODatePlus(5),
    time: '09:00',
    duration: '60',
    notes: 'Weekly team sync meeting',
  },
  update: {
    name: 'Updated Title',
    notes: 'Updated description',
  },
  toDelete: {
    name: 'To Be Deleted',
    email: 'delete@example.com',
    date: () => getISODatePlus(6),
    time: '11:00',
    duration: '60',
  },
  apiError: {
    name: 'API Error Test',
    email: 'apierror@example.com',
    date: () => getISODatePlus(7),
    time: '10:00',
    duration: '60',
  },
}
