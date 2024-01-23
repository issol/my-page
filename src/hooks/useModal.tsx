import { ModalType, closeModal, openModal } from '@src/store/modal'
import { useAppDispatch } from './useRedux'
import { ReactNode } from 'react'

function useModal() {
  const dispatch = useAppDispatch()
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

  const openModal = (newValue: ModalType) => {
    setModal(oldModalState => {
      const isCloseable = newValue.isCloseable ?? false

  const handleOpenModal = ({ type, children, isCloseable }: ModalType) => {
    dispatch(openModal({ type, children, isCloseable }))
  }

  const handleCloseModal = (type: string) => {
    dispatch(closeModal(type))
  }

  return { openModal: handleOpenModal, closeModal: handleCloseModal }
}

export default useModal
