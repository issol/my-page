import Image from 'next/image'

import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import { OnboardingJobInfoType } from 'src/types/onboarding/list'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { ChangeEvent, useEffect, useState } from 'react'
import { RejectReason } from 'src/shared/const/onboarding'
import { v4 as uuidv4 } from 'uuid'
import TextField from '@mui/material/TextField'
import { OnboardingProDetailsType } from 'src/types/onboarding/details'
import { getLegalName } from 'src/shared/helpers/legalname.helper'

type Props = {
  open: boolean
  onClose: any
  jobInfo: OnboardingJobInfoType
  userInfo: OnboardingProDetailsType
}
export default function RejectTestModal({
  open,
  onClose,
  jobInfo,
  userInfo,
}: Props) {
  const [rejectReason, setRejectReason] = useState<string>('')
  const [messageToPro, setMessageToPro] = useState<string>('')

  const handleChangeMessageToPro = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageToPro(event.target.value)
  }
  const handleChangeRejectReason = (event: ChangeEvent<HTMLInputElement>) => {
    setRejectReason((event.target as HTMLInputElement).value)
    /* @ts-ignore */
    const message = RejectReason[(event.target as HTMLInputElement).value]
    setMessageToPro(
      (event.target as HTMLInputElement).value === 'Others'
        ? ''
        : `Hello ${getLegalName({
            firstName: userInfo.firstName,
            middleName: userInfo.middleName,
            lastName: userInfo.lastName,
          })},\n${message}`,
    )
  }

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogContent
        sx={{
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src='/images/icons/alert/alert-error-color.svg'
            width={68}
            height={68}
            alt=''
          />
          <Box>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',

                textAlign: 'center',
                letterSpacing: '0.15px',

                color: 'rgba(76, 78, 100, 0.6)',
              }}
            >
              Are you sure you want to reject this test?
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{ fontSize: '16px', fontWeight: 600, textAlign: 'center' }}
            >
              {jobInfo.jobType}, {jobInfo.role},&nbsp;
              {jobInfo.source && jobInfo.target ? (
                <>
                  {jobInfo.source} &rarr; {jobInfo.target}
                </>
              ) : (
                ''
              )}
            </Typography>
          </Box>
        </Box>
        <RadioGroup
          row
          aria-label='controlled'
          name='controlled'
          value={rejectReason}
          onChange={handleChangeRejectReason}
          sx={{ maxWidth: 442 }}
        >
          {Object.keys(RejectReason).map(value => {
            return (
              <FormControlLabel
                key={uuidv4()}
                value={value}
                control={<Radio />}
                label={value}
              />
            )
          })}
        </RadioGroup>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant='body1'
            sx={{ fontWeight: 600, marginBottom: '0.5rem' }}
          >
            Message to Pro
          </Typography>
          <TextField
            fullWidth
            rows={4}
            multiline
            value={messageToPro}
            onChange={handleChangeMessageToPro}
            inputProps={{ maxLength: 500 }}
            placeholder={
              messageToPro === ''
                ? 'Write down a reason for rejecting this certification test.'
                : undefined
            }
            error={rejectReason !== '' && messageToPro === ''}
            helperText={
              rejectReason !== '' && messageToPro === ''
                ? 'This field is required'
                : null
            }
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              fontSize: '12px',
              lineHeight: '25px',
              color: '#888888',
            }}
          >
            {messageToPro.length}/500
          </Box>
        </Box>

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
            disabled={rejectReason === '' || messageToPro === ''}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            onClick={() => {
              onClose()
            }}
          >
            Reject
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
