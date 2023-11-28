import Grid from '@mui/material/Grid'
import { Box, Card, Typography } from '@mui/material'
import { ReactElement } from 'react'
import styled from '@emotion/styled'

interface GridItemProps {
  width?: number
  height: number
  sm?: boolean
  padding?: string
  children: ReactElement
}
export const GridItem = ({
  width,
  height,
  sm = false,
  padding = '20px',
  children,
}: GridItemProps) => {
  return (
    <Grid item sx={{ width }} sm={sm}>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          padding,
        }}
      >
        {children}
      </Card>
    </Grid>
  )
}

export const SectionTitle = styled('div')(() => {
  return {
    display: 'flex',
    alignItems: 'flex-start',

    '& > span': {
      display: 'block',
    },

    '& .title': {
      height: '32px',
      fontSize: '20px',
      fontWeight: 500,
      margin: 0,
      marginBottom: '3px',
    },

    '& .info_icon': {
      position: 'relative',
      width: '15px',
      marginTop: '-6px',
      cursor: 'pointer',
    },
  }
})

export const SubDateDescription = styled(Typography)(() => {
  return {
    color: 'rgba(76, 78, 100, 0.6)',
    fontSize: '14px',
  }
})

const StatusSquare = styled.span<{ color: string }>(({ color }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '18px',
    backgroundColor: `${color}31`,
    marginRight: '6px',

    '&::after': {
      content: "''",
      display: 'block',
      width: '12px',
      height: '12px',
      borderRadius: '12px',
      backgroundColor: color,
    },
  }
})

export const ReportItem = ({
  label,
  value,
  color,
  isHidden,
}: {
  color: string
  label: string
  value: number
  isHidden: boolean
}) => {
  return (
    <Box
      component='li'
      display='flex'
      flexDirection='column'
      sx={{
        listStyle: 'none',
      }}
    >
      <Box
        display='flex'
        justifyContent='flex-start'
        alignItems='center'
        sx={{ width: '100%', height: '30px' }}
      >
        <StatusSquare color={color} />
        <Box
          display='flex'
          justifyContent='space-between'
          sx={{ width: '100%' }}
        >
          <ReportLabel color='rgba(76, 78, 100, 0.87)' fontWeight={600}>
            {label}
          </ReportLabel>
          <Typography color='rgba(76, 78, 100, 0.87)' fontWeight={600}>
            {String(value).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      {!isHidden && (
        <span
          style={{
            display: 'block',
            width: '1px',
            height: '16px',
            marginLeft: '8px',
            backgroundColor: 'rgba(76, 78, 100, 0.12)',
          }}
        />
      )}
    </Box>
  )
}

const ReportLabel = styled(Typography)`
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 600;
`
