import { useEffect, useState } from 'react'

const useStickyHeader = () => {
  const [isSticky, setSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 152) {
        setSticky(false)
      }
      if (window.scrollY > 152) {
        setSticky(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', () => handleScroll)
    }
  }, [isSticky])

  return { isSticky }
}

export default useStickyHeader
