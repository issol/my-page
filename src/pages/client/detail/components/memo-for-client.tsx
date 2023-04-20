import { AuthContext } from '@src/context/AuthContext'
import { useContext } from 'react'

import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { TitleTypography } from '@src/@core/styles/typography'

import styled from 'styled-components'

// ** types
import { ClientDetailType, ClientMemoType } from '@src/types/client/client'
import { ClientStatus } from '@src/shared/const/status/statuses'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'

type Props = {
  memo: { data: Array<ClientMemoType>; count: number }
}

export default function ClientMemo({ memo }: Props) {
  const { user } = useContext(AuthContext)

  const testMemo = [
    {
      id: 12,
      createdAt: Date(),
      updatedAt: Date(),
      writerId: 12,
      writerFirstName: 'Kim',
      writerMiddleName: 'string',
      writerLastName: 'string',
      writerEmail: 'sdf@sdf.com',
      memo: '운동가야돼',
    },
    {
      id: 11,
      createdAt: Date(),
      updatedAt: Date(),
      writerId: 12,
      writerFirstName: 'Kim',
      writerMiddleName: 'string',
      writerLastName: 'string',
      writerEmail: 'sdf@sdf.com',
      memo: '운동가야돼',
    },
  ]
  return (
    <Card>
      <CardHeader
        title={
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h6'>Memo for client</Typography>
            <Button variant='contained'>Add comment</Button>
          </Box>
        }
      />
      <CardContent>
        {!memo?.data?.length
          ? '-'
          : memo.data.map(item => (
              <Box
                key={item.id}
                display='flex'
                flexDirection='column'
                gap='10px'
              >
                <Divider />
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Box display='flex' gap='8px' height={20} alignItems='center'>
                    <CustomChip
                      skin='light'
                      color='error'
                      size='small'
                      label='Writer'
                    />
                    <Typography fontWeight='bold' variant='body2'>
                      {getLegalName({
                        firstName: item.writerFirstName,
                        middleName: item?.writerMiddleName,
                        lastName: item.writerLastName,
                      })}
                    </Typography>
                    <Divider
                      component='div'
                      role='presentation'
                      orientation='vertical'
                      variant='middle'
                    />
                    <Typography variant='body2'>{item.writerEmail}</Typography>
                  </Box>

                  <Box>
                    <IconButton>
                      <Icon icon='mdi:pencil-outline' />
                    </IconButton>
                    <IconButton>
                      <Icon icon='mdi:trash-outline' />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant='body2'>
                  {FullDateTimezoneHelper(item.createdAt, user?.timezone.code!)}
                </Typography>
                <Typography>{item.memo}</Typography>
              </Box>
            ))}
        <Divider />
      </CardContent>
    </Card>
  )
}
