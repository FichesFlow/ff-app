import { useEffect, useState } from 'react'
import { getDueCount } from '../api/review'

export function useTodayDueCount() {
  const [dueCount, setDueCount] = useState(0)

  useEffect(() => {
    let isMounted = true
    let intervalId

    async function fetchDueCount() {
      try {
        const data = await getDueCount()
        if (isMounted && data && typeof data.total === 'number') {
          setDueCount(data.total)
        }
      } catch (e) {
        // Optionally handle error
      }
    }

    fetchDueCount()
    intervalId = setInterval(fetchDueCount, 5 * 60 * 1000) // every 5 min

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  return dueCount
}