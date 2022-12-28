import styled from '@emotion/styled'
import { Button } from '@mui/material'
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

export const ModalContainer = styled.div`
  min-width: 250px;
  margin: 25px;
  padding: 40px 34px 28px;
  border-radius: 8px;
  background: #fff;
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
