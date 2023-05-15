import { useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { UserDataType } from '@src/context/types'
import PageHeader from '@src/@core/components/page-header'
import JobListView from './list-view/list-view'
import JobTrackerView from './tracker-view/tracker-view'
import { useGetClientList } from '@src/queries/client.query'

type Props = { id: number; user: UserDataType }
type MenuType = 'list' | 'calendar'

export default function JobList({ id, user }: Props) {
  const [menu, setMenu] = useState<MenuType>('list')
  const { data: clients } = useGetClientList({ take: 1000, skip: 0 })

  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12} display='flex' alignItems='center'>
        <PageHeader
          title={
            <Typography variant='h5'>
              {menu === 'list' ? 'Job list' : 'Job tracker'}
            </Typography>
          }
        />
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
            Job tracker
          </CustomBtn>
        </ButtonGroup>
      </Grid>

      {menu === 'list' ? (
        <JobListView clients={clients?.data || []} />
      ) : (
        <JobTrackerView clients={clients?.data || []} />
      )}
    </Grid>
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
