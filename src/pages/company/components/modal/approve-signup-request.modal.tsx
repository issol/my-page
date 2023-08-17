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
import { MembersType, SignUpRequestsType } from 'src/types/company/members'

type Props = {
  approveSignUpRequest: (user: SignUpRequestsType) => void
  user: SignUpRequestsType
  message: string
}
export default function ApproveSignUpRequestModal({
  approveSignUpRequest,
  user,
  message,
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
            src='/images/icons/alert/alert-success.svg'
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
            {message}
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
            sx={{ borderRadius: '8px', textTransform: 'none' }}
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
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            onClick={() => {
              setModal(null)
              approveSignUpRequest(user)
            }}
          >
            Approve
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
