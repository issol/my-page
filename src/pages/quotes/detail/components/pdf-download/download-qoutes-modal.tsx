import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { ChangeEvent, useState } from 'react'

type Props = {
  onClose: any
  onClick: (lang: 'EN' | 'KO') => void
}

const DownloadQuotesModal = ({ onClose, onClick }: Props) => {
  const [lang, setLang] = useState<string | null>(null)

  const handleLangChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLang(event.target.value)
  }

  return (
    <Box
      sx={{
        maxWidth: '362px',
        width: '100%',
        maxHeight: '296px',
        height: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Box>
            <img src='/images/icons/order-icons/download-order.svg' alt='' />
          </Box>

          <Typography variant='h6'>Download quote</Typography>
          <Typography variant='subtitle2' sx={{ fontSize: '16px' }}>
            Select template language
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <RadioGroup
            row
            sx={{
              padding: '12px 0px',
              justifyContent: 'center',
              display: 'flex',
            }}
            aria-label='controlled'
            name='controlled'
            value={lang}
            onChange={handleLangChange}
          >
            <FormControlLabel
              value='English'
              control={<Radio />}
              label='English'
              sx={{
                marginLeft: '0 !important',
                '& .MuiTypography-root': {
                  fontWeight: 600,
                },
              }}
            />
            <FormControlLabel
              value='Korean'
              control={<Radio />}
              label='Korean'
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 600,
                },
              }}
            />
          </RadioGroup>
        </Box>

        <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => onClick(lang && lang === 'English' ? 'EN' : 'KO')}
            disabled={lang === null}
          >
            Preview
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default DownloadQuotesModal