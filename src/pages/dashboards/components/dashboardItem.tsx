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

export const SectionTitle = styled('h4')(() => {
  return {
    fontSize: '20px',
    fontWeight: 500,
    margin: 0,
    marginBottom: '3px',
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
}: {
  color: string
  label: string
  value: number
}) => {
  return (
    <Box
      component='li'
      display='flex'
      flexDirection='column'
      sx={{ listStyle: 'none' }}
    >
      <Box
        display='flex'
        justifyContent='flex-start'
        alignItems='center'
        sx={{ height: '30px' }}
      >
        <StatusSquare color={color} />
        <Box
          display='flex'
          justifyContent='space-between'
          sx={{ width: '100%' }}
        >
          <Typography
            variant='body2'
            color='rgba(76, 78, 100, 0.87)'
            fontWeight={600}
          >
            {label}
          </Typography>
          <Typography
            variant='body2'
            color='rgba(76, 78, 100, 0.87)'
            fontWeight={600}
          >
            {String(value).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      <span
        style={{
          display: 'block',
          width: '1px',
          height: '16px',
          marginLeft: '8px',
          backgroundColor: 'rgba(76, 78, 100, 0.12)',
        }}
      />
    </Box>
  )
}
