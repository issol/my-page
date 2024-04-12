import React from 'react'
import { Box, Divider, Typography } from '@mui/material'
import CustomChip from '@src/@core/components/mui/chip'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { etcStyles, lpmStyles } from '@src/views/jobDetails/messageModal/index'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

const MessageItem = () => {
  const auth = useRecoilValueLoadable(authState)

  return (
    <Box
      // key={`message-${item.id}-${index}`}
      display='flex'
      flexDirection='column'
      padding='20px'
      gap='8px'
    >
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center' gap='8px'>
          <CustomChip
            label='LPM'
            skin='light'
            size='small'
            sx={{
              ...('lpm' ? lpmStyles : etcStyles),
              width: 'fit-content',
            }}
          />
          <Typography
            variant='body2'
            fontWeight={1 ? 500 : 600}
            color={1 ? 'rgba(90, 95, 224, 1)' : 'rgba(76, 78, 100, 1)'}
          >
            {getLegalName({
              firstName: auth.getValue().user?.firstName,
              middleName: auth.getValue().user?.middleName,
              lastName: auth.getValue().user?.lastName,
            })}
            {1 ? ' (Me)' : ''}
          </Typography>
          <Divider
            orientation='vertical'
            variant='middle'
            flexItem
            sx={{ margin: '4px 0 !important' }}
          />
          <Typography
            variant='body2'
            fontWeight={400}
            color='rgba(76, 78, 100, 0.60)'
          >
            {auth.getValue().user?.email}
          </Typography>
        </Box>
        <Typography fontSize={12} fontWeight={400} color='#4C4E6499'>
          {/*{convertTimeToTimezone(*/}
          {/*  item.createdAt,*/}
          {/*  auth.getValue()?.user?.timezone,*/}
          {/*  timezone.getValue(),*/}
          {/*)}*/}
          08/20/2023, 12:20 PM (KST)
        </Typography>
      </Box>
      <Typography
        variant='body2'
        fontWeight={400}
        bgcolor='rgba(255, 251, 244, 1)'
        color='rgba(76, 78, 100, 1)'
        width='fit-content'
        lineHeight='21px'
        paddingRight='12px'
      >
        (Tagged: Aria (Soyoung) Jeong, Chloe Yu, Ellie Park, Hope Kim)
      </Typography>
      <Typography variant='body2' fontWeight={400} color='rgba(76, 78, 100, 1)'>
        {/* {item.content} */}
      </Typography>
    </Box>
  )
}

export default MessageItem
