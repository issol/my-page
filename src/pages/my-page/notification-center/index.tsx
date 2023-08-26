import { Box, Grid, Switch, Typography } from '@mui/material'
import { NotificationCenterFilterType } from '@src/types/my-page/notification-center/notification.type'
import { Suspense, useContext, useState } from 'react'
import NotificationCenterFilter from './components/filter'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetNotificationList } from '@src/queries/notification.query'
import NotificationList from './components/list'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useMutation, useQueryClient } from 'react-query'
import { markAllAsRead, markAsRead } from '@src/apis/notification.api'
import { useRouter } from 'next/router'

const initialFilter: NotificationCenterFilterType = {
  category: [],
  search: '',
  duration: '',
  isRead: 0,
  take: 10,
  skip: 0,
}

const NotificationCenter = () => {
  const router = useRouter()
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] =
    useState<NotificationCenterFilterType>(initialFilter)
  const [activeFilter, setActiveFilter] =
    useState<NotificationCenterFilterType>(initialFilter)

  const queryClient = useQueryClient()

  const {
    data: notifications,
    refetch,
    isLoading,
  } = useGetNotificationList(activeFilter)

  const markAsReadMutation = useMutation((ids: number[]) => markAsRead(ids), {
    onSuccess: () => {
      queryClient.invalidateQueries(['page-gnb'])
      refetch()
    },
  })

  const markAllAsReadMutation = useMutation(() => markAllAsRead(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['page-gnb'])
      refetch()
    },
  })
  const onClickMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const onClickNotification = (id: number, url: string, isRead: boolean) => {
    // console.log(isRead)

    !isRead && markAsReadMutation.mutate([id])
    if (url !== '') {
      router.push(`/${url}`)
    }
  }

  const auth = useRecoilValueLoadable(authState)

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
      <Grid
        item
        xs={12}
        display='flex'
        gap='10px'
        alignItems='center'
        justifyContent='flex-end'
      >
        <Box display='flex' alignItems='center' gap='4px'>
          <Typography>See only unread</Typography>
          <Switch
            checked={activeFilter.isRead === 1}
            onChange={e =>
              setActiveFilter({
                ...activeFilter,
                isRead: e.target.checked ? 1 : 0,
              })
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Suspense>
          <NotificationList
            list={notifications?.data ?? []}
            count={notifications?.totalCount ?? 0}
            isLoading={isLoading}
            user={auth.getValue().user!}
            pageSize={activeFilter.take}
            skip={skip}
            setSkip={(n: number) => {
              setSkip(n)
              setActiveFilter({
                ...activeFilter,
                skip: n * activeFilter.take!,
              })
            }}
            setPageSize={(n: number) =>
              setActiveFilter({ ...activeFilter, take: n })
            }
            onClickMarkAllAsRead={onClickMarkAllAsRead}
            onClickNotification={onClickNotification}
          />
        </Suspense>
      </Grid>
    </Grid>
  )
}

export default NotificationCenter

NotificationCenter.acl = {
  subject: 'my_page',
  action: 'read',
}
