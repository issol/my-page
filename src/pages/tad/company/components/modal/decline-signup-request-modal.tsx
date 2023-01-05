import styled from '@emotion/styled'
import Image from 'next/image'
import { ReactNode, useContext } from 'react'
import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'

import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import { ModalContext } from 'src/context/ModalContext'
import { SignUpRequestsType } from '../../types'

type Props = {
  declineSignUpRequest: (user: SignUpRequestsType) => void
  user: SignUpRequestsType
  onClose: any
}
export default function DeclineSignUpRequestModal({
  declineSignUpRequest,
  onClose,
  user,
}: Props) {
  const { setModal } = useContext(ModalContext)
  return (
    <Dialog
      open={true}
      keepMounted
      onClose={() => setModal(null)}
      // TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='xs'
    >
      <DialogContent
        sx={{
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Image
            src='/images/icons/alert/alert-error-color.svg'
            width={68}
            height={68}
            alt=''
          />
        </Box>

        <DialogContentText id='alert-dialog-slide-description'>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              /* or 150% */

              textAlign: 'center',
              letterSpacing: '0.15px',

              /* Light/Text/Secondary */

              color: 'rgba(76, 78, 100, 0.6)',
            }}
          >
            Are you sure to decline the sign up <br />
            request for this account?
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              /* or 150% */

              textAlign: 'center',
              letterSpacing: '0.15px',

              /* Light/Text/Secondary */

              color: '#666CFF',
            }}
          >
            {user.email}
          </Typography>
        </DialogContentText>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '18px',
          }}
        >
          <Button
            size='medium'
            type='button'
            variant='outlined'
            onClick={() => {
              setModal(null)
            }}
          >
            Cancel
          </Button>
          <Button
            size='medium'
            type='button'
            variant='contained'
            onClick={() => {
              setModal(null)
              declineSignUpRequest(user)
            }}
          >
            Decline
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
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
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  /* or 150% */

  text-align: center;
  letter-spacing: 0.15px;

  /* Light/Text/Secondary */

  color: rgba(76, 78, 100, 0.6);
`
const BtnGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`
