import {
  createContext,
  Dispatch,
  Fragment,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'

import styled from 'styled-components'
import { createPortal } from 'react-dom'

interface Props {
  children: ReactNode
  selector: string
}

type ModalContextType = {
  setModal: (node: ReactNode) => void
  setClickable?: Dispatch<SetStateAction<boolean>> | null
  setScrollable?: Dispatch<SetStateAction<boolean>> | null
}

const defaultProvider: ModalContextType = {
  setModal: (n: any) => {
    return null
  },
  setClickable: null,
  setScrollable: null,
}

export const ModalContext = createContext(defaultProvider)

export default function ModalProvider({ children, selector }: Props) {
  const ref = useRef<any>(null)
  const [mounted, setMounted] = useState(false)
  const [modal, setModal] = useState<ReactNode>(null)
  const [clickable, setClickable] = useState<boolean>(true)
  const [scrollable, setScrollable] = useState<boolean>(false)

  useEffect(() => {
    ref.current = document.getElementById(selector)
    setMounted(true)
  }, [selector])

  const handleClickOverlay = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) return

    setModal(null)
  }

  useEffect(() => {
    if (modal && scrollable) {
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
  }, [modal, scrollable])

  const renderModal = () => {
    return modal ? (
      <Overlay
        onClick={e => {
          if (clickable) handleClickOverlay(e)
          return
        }}
        role='presentation'
      >
        {modal}
      </Overlay>
    ) : null
  }

  return (
    <ModalContext.Provider value={{ setModal, setClickable, setScrollable }}>
      {mounted ? createPortal(renderModal(), ref.current) : null}
      {children}
    </ModalContext.Provider>
  )
}

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
