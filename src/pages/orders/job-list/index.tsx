import { useEffect, useState } from 'react'

// ** style components
import styled from 'styled-components'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Grid, Typography } from '@mui/material'
import { UserDataType } from '@src/context/types'
import PageHeader from '@src/@core/components/page-header'

// ** components
import JobListView from './list-view/list-view'
import JobTrackerView from './tracker-view/tracker-view'

// ** apis
import { useGetClientList } from '@src/queries/client.query'

// ** NextJs
import { useRouter } from 'next/router'

type Props = { id: number; user: UserDataType }
type MenuType = 'list' | 'tracker'

export default function JobList({ id, user }: Props) {
  const router = useRouter()
  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('list')
  const { data: clients } = useGetClientList({ take: 1000, skip: 0 })

  useEffect(() => {
    if (menuQuery && ['list', 'tracker'].includes(menuQuery)) {
      setMenu(menuQuery)
    }
  }, [menuQuery])

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
            $focus={menu === 'tracker'}
            value='tracker'
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
  subject: 'job_list',
  action: 'read',
}
