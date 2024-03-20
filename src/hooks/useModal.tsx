import { atom, useRecoilState } from 'recoil'
import { ReactNode } from 'react'

export type ModalType = {
  type: string
  children: ReactNode
  isCloseable?: boolean
}

export const modalState = atom<Array<ModalType>>({
  key: 'modalState',
  default: [],
})

export function useModal() {
  const [modal, setModal] = useRecoilState(modalState)
  console.log(modal)

  const openModal = (newValue: ModalType) => {
    setModal(oldModalState => {
      const isCloseable = newValue.isCloseable ?? false

      return oldModalState.concat({
        ...newValue,
        isCloseable: isCloseable,
      })
    })
  }

  const closeModal = (type: string) => {
    setModal(oldModalState => {
      const newModalState = [...oldModalState]
      newModalState.pop()
      return newModalState
    })
  }

  return { modal, openModal, closeModal }
}

export default useModal
