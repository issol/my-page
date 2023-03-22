import Image from 'next/image'
import { useContext } from 'react'
import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'

import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import { ModalContext } from 'src/context/ModalContext'

import { AssignReviewerType } from 'src/types/onboarding/list'
type Props = {
  open: boolean
  onClose: any
  requestReview: (reviewer: AssignReviewerType | null, status: string) => void
  reviewer: AssignReviewerType | null
}
export default function RequestReviewerModal({
  requestReview,
  reviewer,
  open,
  onClose,
}: Props) {
  const { setModal } = useContext(ModalContext)

  return (
    <Dialog
      open={open}
      keepMounted
      // onClose={() => setModal(null)}
      onClose={onClose}
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
            Are you sure to request a review to this reviewer?
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

              color: 'rgba(76, 78, 100, 0.6)',
            }}
          >
            {reviewer?.email}
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size='medium'
            type='button'
            variant='contained'
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            onClick={() => {
              requestReview(reviewer, reviewer?.status!)
              onClose()
              // approveSignUpRequest(user)
            }}
          >
            Request
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
