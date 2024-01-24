import React from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import Typography from '@mui/material/Typography'

const NoRatio = ({ title }: { title: string }) => {
  return (
    <Box display='flex' alignItems='center' sx={{ width: '100%', flex: 1 }}>
      <DataList>
        <li className='circle'>
          <span className='count'>(0)</span>
        </li>
      </DataList>
      <Typography textAlign='center' fontSize='14px' sx={{ width: '100%' }}>
        {title}
      </Typography>
    </Box>
  )
}

export const DataList = styled('ul')(() => {
  return {
    '& > .circle': {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '182px',
      height: '182px',
      borderRadius: '161px',
      backgroundColor: '#F1F1F3',
      marginLeft: '-24px',

      '& > .count': {
        position: 'absolute',
        color: '#4C4E6499',
        fontSize: '18px',
      },

      '&::before': {
        content: "''",
        display: 'block',
        width: '90px',
        height: '90px',
        borderRadius: '140px',
        backgroundColor: '#fff',
      },
    },
  }
})

export default NoRatio
