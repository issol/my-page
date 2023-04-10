import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useAppSelector } from '@src/hooks/useRedux'
import styled from 'styled-components'
import useModal from '@src/hooks/useModal'

// const MODAL_COMPONENTS = {
//   basic: TestModal,
//   small: TestModal,
// }
type Props = {
  type: 'basic' | 'small'
  children: ReactNode
}
function ModalContainer() {
  const modalList = useAppSelector(state => state.modal)

  const { closeModal } = useModal()

  const handleClickOverlay = (
    name: 'basic' | 'small',
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.currentTarget !== event.target) return
    event.preventDefault()
    //⬇️ 이 코드가 없으면 이벤트 버블링에 의해 자동으로 closeModal이 실행되면서 중첩 모달을 띄울 수 없게 됨
    event.stopPropagation()
    closeModal(name)
  }
  const renderModal = modalList.map(({ type, children }: Props) => {
    // const ModalComponent = MODAL_COMPONENTS[type]
    return (
      <Overlay
        key={type}
        onClick={e => {
          handleClickOverlay(type, e)
        }}
      >
        {children}
      </Overlay>
    )
  })
  return createPortal(<>{renderModal}</>, document.getElementById('modal')!)
}

export default ModalContainer

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1300;
`
