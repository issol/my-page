import { useEffect, useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import { UserDataType } from '@src/context/types'
import PageHeader from '@src/@core/components/page-header'
import useModal from '@src/hooks/useModal'
import JobInfoDetailView from './detail-view'

type Props = { id: number; user: UserDataType }
type MenuType = 'list' | 'calendar'

export default function JobList({ id, user }: Props) {
  const [menu, setMenu] = useState<MenuType>('list')
  const { openModal, closeModal } = useModal()

  useEffect(() => {
    openModal({
      type: 'JobDetailViewModal',
      children: (
        <Box
          sx={{
            maxWidth: '1180px',
            width: '100%',
            maxHeight: '90vh',
            background: '#ffffff',
            boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
            borderRadius: '10px',
            overflow: 'scroll',
          }}
        >
          <JobInfoDetailView />
        </Box>
      ),
    })
  }, [])

  return (
    <Box display='flex' flexDirection='column'>
      <PageHeader title={<Typography variant='h5'>Job list</Typography>} />
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

JobList.acl = {
  subject: 'order_list',
  action: 'read',
}
