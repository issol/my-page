import { useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Card, CardHeader, Grid, Switch, Typography } from '@mui/material'
import { Box } from '@mui/system'
import PageHeader from '@src/@core/components/page-header'
import styled from 'styled-components'

// ** components
import Filter from './components/filter'
import List from './components/list'

// ** types
import { ConstType } from '@src/pages/onboarding/client-guideline'
import { RequestFilterType } from '@src/types/requests/filters.type'

// ** values
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'

// ** apis
import { useGetClientRequestList } from '@src/queries/requests/client-request.query'

// ** hooks
import { useRouter } from 'next/router'
import CalendarContainer from './components/calendar'

// ** components
export const initialFilter: RequestFilterType = {
  status: [],
  client: [],
  category: [],
  serviceType: [],
  requestDateFrom: '',
  requestDateTo: '',
  desiredDueDateFrom: '',
  desiredDueDateTo: '',
  search: '',
  hideCompleted: 0,
  skip: 0,
  take: 10,
}

type MenuType = 'list' | 'calendar'
export default function LpmRequests() {
  const router = useRouter()

  const [menu, setMenu] = useState<MenuType>('list')

  const [skip, setSkip] = useState(0)
  const [serviceType, setServiceType] = useState<Array<ConstType>>([])
  const [filter, setFilter] = useState<RequestFilterType>(initialFilter)
  const [activeFilter, setActiveFilter] =
    useState<RequestFilterType>(initialFilter)

  const { data: list, isLoading } = useGetClientRequestList({ ...activeFilter })

  function findServiceTypeFilter() {
    let category: Array<ConstType> = []
    if (filter.category?.length) {
      filter.category.forEach(item => {
        if (!ServiceTypePair[item as keyof typeof ServiceTypePair]) return
        category = category.concat(
          ServiceTypePair[item as keyof typeof ServiceTypePair],
        )
      })
    }

    if (category?.length) {
      const result = category.reduce(
        (acc: Array<ConstType>, item: ConstType) => {
          const found = acc.find(ac => ac.value === item.value)
          if (!found) return acc.concat(item)
          return acc
        },
        [],
      )
      return result
    }
    return ServiceTypeList
  }

  useEffect(() => {
    const newFilter = findServiceTypeFilter()
    setServiceType(newFilter)
    if (newFilter.length)
      setFilter({
        ...filter,
        serviceType: newFilter
          .filter(item => filter.serviceType?.includes(item.value))
          .map(item => item.value),
      })
  }, [filter.category])

  function onSearch() {
    setActiveFilter({
      ...filter,
      mine: activeFilter.mine,
      hideCompleted: activeFilter.hideCompleted,
      skip: skip * activeFilter.take,
      take: activeFilter.take,
    })
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({
      ...initialFilter,
      mine: activeFilter.mine,
      hideCompleted: activeFilter.hideCompleted,
    })
  }

  function onRowClick(id: number) {
    router.push(`/quotes/lpm/requests/${id}`)
  }

  return (
    <Box display='flex' flexDirection='column'>
      <Box
        display='flex'
        width={'100%'}
        alignItems='center'
        justifyContent='space-between'
        padding='10px 0 24px'
      >
        <PageHeader
          title={<Typography variant='h5'>Request list</Typography>}
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
            Calendar view
          </CustomBtn>
        </ButtonGroup>
      </Box>
      <Box>
        {menu === 'list' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Filter
              serviceType={serviceType}
              filter={filter}
              setFilter={setFilter}
              onReset={onReset}
              search={onSearch}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '24px',
              }}
            >
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography>Hide completed requests</Typography>
                <Switch
                  checked={activeFilter.hideCompleted === 1}
                  onChange={e =>
                    setActiveFilter({
                      ...activeFilter,
                      hideCompleted: e.target.checked ? 1 : 0,
                    })
                  }
                />
              </Box>
            </Box>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='h6'>
                        Requests ({list?.count ?? 0})
                      </Typography>{' '}
                    </Box>
                  }
                  sx={{
                    pb: 4,
                    '& .MuiCardHeader-title': { letterSpacing: '.15px' },
                  }}
                />

                <List
                  skip={skip}
                  pageSize={activeFilter.skip}
                  setSkip={(n: number) => {
                    setSkip(n)
                    setActiveFilter({
                      ...activeFilter,
                      skip: n * activeFilter.take,
                    })
                  }}
                  setPageSize={(n: number) =>
                    setActiveFilter({ ...activeFilter, take: n })
                  }
                  filter={activeFilter}
                  setFilter={setActiveFilter}
                  list={list || { count: 0, data: [], totalCount: 0 }}
                  isLoading={isLoading}
                  onRowClick={onRowClick}
                />
              </Card>
            </Grid>
          </Box>
        ) : (
          <CalendarContainer />
        )}
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`

LpmRequests.acl = {
  subject: 'lpm_request',
  action: 'read',
}
