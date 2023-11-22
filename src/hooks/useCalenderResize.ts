import { useEffect, useRef, useState } from 'react'

export const CALENDER_MIN_WIDTH = 990

const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      result = fn(...args)
    }, delay)
    return result
  }
}

const useCalenderResize = () => {
  const containerRef = useRef<HTMLElement>(null)

  const [containerWidth, setContainerWidth] = useState(CALENDER_MIN_WIDTH)

  useEffect(() => {
    const offsetWidth = containerRef.current?.offsetWidth || 0
    setContainerWidth(offsetWidth - 40)
  }, [])

  const setCalenderContainer = () => {
    const offsetWidth = containerRef.current?.offsetWidth || 0

    if (offsetWidth > CALENDER_MIN_WIDTH) {
      // NOTE : offsetWidth -  좌우 양쪽 패딩값
      setContainerWidth(offsetWidth - 40)
      return
    }
  }

  useEffect(() => {
    window.addEventListener('resize', debounce(setCalenderContainer, 300))

    return () => {
      window.removeEventListener('resize', setCalenderContainer)
    }
  }, [])

  return { containerRef, containerWidth }
}

export default useCalenderResize
