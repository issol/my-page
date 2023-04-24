import { useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import { UserDataType } from '@src/context/types'
import PageHeader from '@src/@core/components/page-header'

type Props = { id: number; user: UserDataType }
type MenuType = 'list' | 'calendar'

export default function OrderList({ id, user }: Props) {
  const [menu, setMenu] = useState<MenuType>('list')

  return (
    <Box display='flex' flexDirection='column'>
      <PageHeader title={<Typography variant='h5'>Order list</Typography>} />
      <Box
        display='flex'
        width={'100%'}
        justifyContent='right'
        padding='10px 0 24px'
      >
        <ButtonGroup variant='outlined'>
          <CustomBtn
            value='list'
            $focus={menu === 'list'}
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            List view
          </CustomBtn>
          <CustomBtn
            $focus={menu === 'calendar'}
            value='calendar'
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            Calendar view
          </CustomBtn>
        </ButtonGroup>
      </Box>
      <Box>
        {menu === 'list' ? (
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          ></Box>
        ) : (
          <Box>Calendar</Box>
        )}
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`

OrderList.acl = {
  subject: 'order_list',
  action: 'read',
}
