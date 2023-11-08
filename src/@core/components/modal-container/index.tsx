import React, { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppSelector } from '@src/hooks/useRedux'
import styled from 'styled-components'
import useModal from '@src/hooks/useModal'
import { ModalType } from '@src/store/modal'

function ModalContainer() {
  const modalList = useAppSelector(state => state.modal)
  const [isCSR, setIsCSR] = useState<boolean>(false)

  useEffect(() => {
    setIsCSR(true)

    return () => setIsCSR(false)
  }, [])

  const { closeModal } = useModal()

  const handleClickOverlay = (
    name: string,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.currentTarget !== event.target) return
    event.preventDefault()
    //⬇️ 이 코드가 없으면 이벤트 버블링에 의해 자동으로 closeModal이 실행되면서 중첩 모달을 띄울 수 없게 됨
    event.stopPropagation()
    closeModal(name)
  }

  useEffect(() => {
    if (modalList.length > 0) {
      document.body.style.cssText = `
          position: fixed;
          top: -${window.scrollY}px;
          overflow-y: scroll;
          width: 100%;`
      return () => {
        const scrollY = window.scrollY

        document.body.style.cssText = `position: unset`
        window.scrollTo(0, -scrollY)
      }
    }
  }, [modalList])

  const renderModal = modalList?.map(
    ({ type, children, isCloseable = true }: ModalType) => {
      return (
        <Overlay
          key={type}
          onClick={e => {
            isCloseable && handleClickOverlay(type, e)
          }}
        >
          {children}
        </Overlay>
      )
    },
  )
  const element =
    typeof window !== 'undefined' ? document.getElementById('modal') : null

  return isCSR
    ? element && renderModal && createPortal(renderModal, element)
    : null
  // if (!isCSR) return <></>
  // return createPortal(<>{renderModal}</>, document.getElementById('modal')!)
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
