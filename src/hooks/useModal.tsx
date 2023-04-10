import { closeModal, openModal } from '@src/store/modal'
import { useAppDispatch } from './useRedux'
import { ReactNode } from 'react'

type Props = {
  type: 'basic' | 'small'
  children: ReactNode
}

function useModal() {
  const dispatch = useAppDispatch()

  const handleOpenModal = ({ type, children }: Props) => {
    dispatch(openModal({ type, children }))
  }

  const handleCloseModal = (type: 'basic' | 'small') => {
    dispatch(closeModal(type))
  }

  return { openModal: handleOpenModal, closeModal: handleCloseModal }
}

export default useModal
