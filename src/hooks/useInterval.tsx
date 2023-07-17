import { useEffect, useRef } from 'react'

const useInterval = (callback: any, delay: any) => {
  const savedCallback = useRef<any>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const executeCallback = () => {
      savedCallback.current?.()
    }

    const timerId = setInterval(executeCallback, delay)

    return () => clearInterval(timerId)
  }, [delay])
}

export default useInterval
