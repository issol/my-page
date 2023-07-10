import { Box, Grid, Typography } from '@mui/material'
import { NotificationCenterFilterType } from '@src/types/my-page/notification-center/notification.type'
import { useState } from 'react'
import NotificationCenterFilter from './components/filter'
import { getCurrentRole } from '@src/shared/auth/storage'

const initialFilter: NotificationCenterFilterType = {
  category: [],
  search: '',
  duration: '',
  isShowUnread: 0,
  take: 10,
  skip: 0,
}

const NotificationCenter = () => {
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] =
    useState<NotificationCenterFilterType>(initialFilter)
  const [activeFilter, setActiveFilter] =
    useState<NotificationCenterFilterType>(initialFilter)

  function onSearch() {
    setActiveFilter({
      ...filter,
      skip: skip * activeFilter.take,
      take: activeFilter.take,
    })
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
  }

  const currentRole = getCurrentRole()

  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography variant='h5'>Notification center</Typography>
      </Grid>
      <Grid item xs={12}>
        <NotificationCenterFilter
          filter={filter}
          setFilter={setFilter}
          search={onSearch}
          onReset={onReset}
          currentRole={currentRole!}
        />
      </Grid>
    </Grid>
  )
}

export default NotificationCenter

NotificationCenter.acl = {
  subject: 'my_page',
  action: 'read',
}
