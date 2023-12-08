import { useCallback, useState } from 'react'

type DialogType = [
  boolean,
  string,
  (open: boolean, key: string) => void,
  () => void,
]
const useInfoDialog = (): DialogType => {
  const [open, setOpen] = useState<boolean>(false)
  const [key, setKey] = useState<string>('')

  const setOpenInfoDialog = useCallback(
    (open: boolean, key: string) => {
      console.log(open, key)
      setOpen(open)
      setKey(key)
    },
    [open, key],
  )

  const close = () => {
    setOpen(false)
  }
  return [open, key, setOpenInfoDialog, close]
}

export default useInfoDialog
