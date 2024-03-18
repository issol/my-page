import { useState } from 'react'

const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  const onClose = () => {
    setIsOpen(false)
  }

  const onOpen = () => {
    setIsOpen(true)
  }

  const onToggle = () => {
    setIsOpen(prev => !prev)
  }

  return {
    isOpen,
    onClose,
    onOpen,
    onToggle,
  }
}

export default useDialog
