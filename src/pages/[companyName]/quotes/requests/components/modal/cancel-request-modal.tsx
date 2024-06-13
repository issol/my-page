import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { useState, useRef } from 'react'

type Props = {
  onClose: () => void
  onClick: (data: { option: string; reason?: string }) => void
}

export default function CancelRequestModal({ onClose, onClick }: Props) {
  const textFieldRef = useRef<HTMLInputElement | null>(null)

  const [selected, setSelected] = useState('')
  const [reason, setReason] = useState('')
  const options = [
    'The project has been canceled/put on hold.',
    'The project will be handled by a different agency.',
    'Others',
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          width='100%'
          display='flex'
          flexDirection='column'
          alignItems='center'
          gap='14px'
        >
          <AlertIcon type='error' />
          <Typography variant='body2' textAlign='center'>
            Are you sure you want to cancel this <br />
            request?
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          row
          value={selected}
          name='simple-radio'
          onChange={e => {
            setSelected(e.target.value)
            textFieldRef?.current?.focus()
          }}
          aria-label='simple-radio'
        >
          {options.map(opt => (
            <Grid item xs={12} key={opt}>
              <FormControlLabel
                value={opt}
                checked={opt === selected}
                control={<Radio />}
                label={opt}
              />
            </Grid>
          ))}
        </RadioGroup>
      </Grid>
      <Grid item xs={12}>
        <Typography fontWeight={600} mb='8px'>
          Message to LSP
        </Typography>
        <TextField
          rows={4}
          autoComplete='off'
          multiline
          fullWidth
          placeholder='Write down a reason for canceling this request.'
          value={reason}
          onChange={e => {
            setReason(e.target.value)
          }}
          inputProps={{ maxLength: 500 }}
        />
        <Typography variant='body2' mt='12px' textAlign='right'>
          {reason?.length ?? 0}/500
        </Typography>
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='center' gap='10px'>
        <Button variant='outlined' onClick={onClose}>
          No
        </Button>
        <Button
          variant='contained'
          onClick={() => onClick({ option: selected, reason })}
          disabled={!selected}
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  )
}