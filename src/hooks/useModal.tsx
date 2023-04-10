import { ModalType, closeModal, openModal } from '@src/store/modal'
import { useAppDispatch } from './useRedux'
import { ReactNode } from 'react'

function useModal() {
  const dispatch = useAppDispatch()

  const handleOpenModal = ({ type, children, isCloseable }: ModalType) => {
    dispatch(openModal({ type, children, isCloseable }))
  }

  const handleCloseModal = (type: string) => {
    dispatch(closeModal(type))
  }

  return { openModal: handleOpenModal, closeModal: handleCloseModal }
}

export default useModal
