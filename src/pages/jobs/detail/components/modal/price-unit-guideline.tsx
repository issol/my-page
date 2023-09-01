import { Icon } from '@iconify/react'
import { Box, Card, IconButton, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'

type Props = {
  title?: string | JSX.Element
  subtitle?: string
  firstItem?: {
    title: string
    value: string
    titleWidth: number
    valueWidth: number
  }
  secondItem?: {
    title: string
    value: string | JSX.Element
    titleWidth: number
    valueWidth: number
  }
  extra?: string
  notify?: string
  onClose: any
}

const PriceUnitGuideline = ({
  title,
  subtitle,
  firstItem,
  secondItem,
  notify,
  extra,
  onClose,
}: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '361px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={onClose}
      >
        <Icon icon='mdi:close'></Icon>
      </IconButton>
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px',
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
          <AlertIcon type={'info'} />
          {title ? (
            <Typography
              variant='body1'
              textAlign='center'
              mt='10px'
              sx={{ fontSize: '20px', fontWeight: 500 }}
            >
              {title}
            </Typography>
          ) : null}
        </Box>
        {subtitle ? (
          <Typography
            variant='body2'
            textAlign='center'
            sx={{ fontSize: '16px' }}
          >
            {subtitle}
          </Typography>
        ) : null}
        <Box
          sx={{
            padding: '20px',
            border: '1px solid rgba(76, 78, 100, 0.22)',
            borderRadius: '10px',
            gap: '8px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {firstItem ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant='body1'
                width={firstItem.titleWidth}
                fontSize={14}
                fontWeight={600}
              >
                {firstItem.title}:
              </Typography>
              <Typography variant='body2' width={firstItem.valueWidth}>
                {firstItem.value}
              </Typography>
            </Box>
          ) : null}
          {secondItem ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant='body1'
                width={secondItem.titleWidth}
                fontSize={14}
                fontWeight={600}
              >
                {secondItem.title}:
              </Typography>
              <Typography variant='body2' width={secondItem.valueWidth}>
                {secondItem.value}
              </Typography>
            </Box>
          ) : null}
        </Box>
        {extra ? (
          <Box>
            <Typography
              variant='body2'
              textAlign='center'
              fontSize={14}
              fontWeight={400}
            >
              {extra}
            </Typography>
          </Box>
        ) : null}
        {notify ? (
          <Box>
            <Typography
              variant='body1'
              textAlign='center'
              fontSize={16}
              fontWeight={600}
            >
              {notify}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

export default PriceUnitGuideline
