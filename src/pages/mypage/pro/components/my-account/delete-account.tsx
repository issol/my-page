import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { UserDataType } from '@src/context/types'
import { Fragment, useState } from 'react'
import styled from 'styled-components'

type Props = {
  user: UserDataType
  onCancel: () => void
  onDelete: () => void
}
export default function DeleteAccount({ user, onCancel, onDelete }: Props) {
  const [step, setStep] = useState(3)
  const [currentPw, setCurrentPw] = useState('')
  const [error, setError] = useState(true)

  const [reason, setReason] = useState('')
  const [etc, setEtc] = useState('')

  const options = [
    'I don’t work with the LSP anymore.',
    'My LSP no longer uses E’nuff.',
    "I'm experiencing a lot of bugs on the website",
    'I’m receiving too much notifications.',
    'etc.',
  ]

  function validatePassword(pw: string) {
    //TODO: validate current password 해주기 (catch에서 setError)
    setCurrentPw(pw)
  }

  function onNextStep() {
    setStep(prev => prev + 1)
  }

  function checkDisabled() {
    switch (step) {
      case 1:
        return error
      case 2:
        return reason === 'etc.' ? !etc.length : !reason.length
      default:
        return false
    }
  }

  return (
    <StyledBox>
      <InnerBox>
        <Typography sx={{ mb: '20px' }} variant='h6'>
          Delete account
        </Typography>
        {step === 1 ? (
          <Fragment>
            <InnerBox>
              <Typography sx={{ alignSelf: 'start' }}>
                Please enter your current password
              </Typography>
            </InnerBox>
            <InnerBox>
              <TextField
                sx={{ width: '420px' }}
                label='Current password*'
                value={currentPw}
                onChange={e => validatePassword(e.target.value)}
                inputProps={{ maxLength: 20 }}
                type='password'
              />
            </InnerBox>
          </Fragment>
        ) : step === 2 ? (
          <Fragment>
            <InnerBox>
              <Typography sx={{ alignSelf: 'start' }} fontWeight={600}>
                Please provide us reason
              </Typography>
            </InnerBox>
            <InnerBox>
              <RadioGroup
                sx={{ display: 'flex', flexDirection: 'column' }}
                value={reason}
                name='simple-radio'
                onChange={e => setReason(e.target.value)}
              >
                {options.map((opt, idx) => (
                  <FormControlLabel
                    key={idx}
                    value={opt}
                    control={<Radio />}
                    label={opt}
                  />
                ))}
              </RadioGroup>
              {reason === 'etc.' && (
                <Box>
                  <Divider style={{ margin: '24px 0' }} />
                  <TextField
                    sx={{ width: '420px' }}
                    rows={4}
                    multiline
                    fullWidth
                    placeholder='Your feedback will greatly help us improve the website.'
                    value={etc}
                    onChange={e => setEtc(e.target.value)}
                    inputProps={{ maxLength: 200 }}
                  />
                  <Typography variant='body2' textAlign='right' mt={2}>
                    0/200
                  </Typography>
                </Box>
              )}
            </InnerBox>
          </Fragment>
        ) : (
          <Fragment>
            <InnerBox>
              <Typography fontSize='20px' color='#666CFF'>
                We’re sorry to see you go.
              </Typography>
              <Typography variant='body2'>
                Deleting account will do the following:
              </Typography>
            </InnerBox>
            <Box
              display='flex'
              flexDirection='column'
              alignContent='start'
              gap='10px'
              mt='30px'
              width='570px'
              sx={{
                borderRadius: '10px',
                border: '1px solid rgba(76, 78, 100, 0.12)',
                padding: '20px',
              }}
            >
              <Box display='flex' alignItems='center' gap='8px'>
                <Icon icon='zondicons:minus-solid' color='#666CFF' />
                <Typography>
                  You’ll be <span style={{ fontWeight: 600 }}>unable</span> to
                  proceed work with LSP
                </Typography>
              </Box>
              <Box display='flex' alignItems='center' gap='8px'>
                <Icon icon='zondicons:minus-solid' color='#666CFF' />
                <Typography>
                  You’ll be <span style={{ fontWeight: 600 }}>unable</span> to
                  to access your job-related data
                </Typography>
              </Box>
              <Box display='flex' alignItems='center' gap='8px'>
                <Icon icon='zondicons:minus-solid' color='#666CFF' />
                <Typography>
                  You’ll be <span style={{ fontWeight: 600 }}>unable</span> to
                  proceed with jobs on E’nuff
                </Typography>
              </Box>
              <Box display='flex' alignItems='center' gap='8px'>
                <Icon icon='zondicons:minus-solid' color='#666CFF' />
                <Typography>
                  All activity history associated with E'nuff will be{' '}
                  <span style={{ fontWeight: 600 }}>deleted.</span>
                </Typography>
              </Box>
              <Box display='flex' alignItems='center' gap='8px'>
                <Icon icon='zondicons:minus-solid' color='#666CFF' />
                <Typography>
                  Rejoining with the same account{' '}
                  <span style={{ fontWeight: 600 }}>does not restore</span>{' '}
                  previous data.
                </Typography>
              </Box>
            </Box>
          </Fragment>
        )}
      </InnerBox>

      {step !== 3 ? (
        <Box display='flex' justifyContent='center' gap='16px' mt={14} mb={6}>
          <Button
            variant='outlined'
            onClick={() => {
              onCancel()
              setCurrentPw('')
              setStep(1)
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            disabled={checkDisabled()}
            onClick={() => {
              onNextStep()
            }}
          >
            Next
          </Button>
        </Box>
      ) : (
        <Box mt='40px'>
          <Button variant='contained' color='secondary' onClick={onDelete}>
            Delete account
          </Button>
        </Box>
      )}
    </StyledBox>
  )
}

const InnerBox = styled(Box)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* max-width: 420px; */
  width: 420px;
`

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  /* max-width: 420px; */
`
