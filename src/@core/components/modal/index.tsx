import styled from '@emotion/styled'
import { Box, Button } from '@mui/material'
import { ReactNode, useContext } from 'react'
import { ModalContext } from 'src/context/ModalContext'

type Props = {
  msg: string | ReactNode
  btnLabel: string
  onClick?: any
}
export default function SimpleModal({ msg, btnLabel, onClick }: Props) {
  const { setModal } = useContext(ModalContext)
  const handleOnOk = () => {
    setModal(null)
    if (onClick) {
      onClick()
    }
  }
  return (
    <ModalContainer>
      <Message>{msg}</Message>
      <BtnGroup>
        <Button variant='contained' onClick={handleOnOk}>
          {btnLabel}
        </Button>
      </BtnGroup>
    </ModalContainer>
  )
}

export const ModalContainer = styled(Box)`
  min-width: 250px;
  margin: 25px;
  padding: 24px;
  text-align: center;
  background: #ffffff;
  border-radius: 14px;
`

export const ModalButtonGroup = styled(Box)`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 8px;
`

const Message = styled.div`
  margin-bottom: 35px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
`
const BtnGroup = styled.div`
  display: flex;
  justify-content: center;
`
