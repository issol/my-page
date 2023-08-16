import { useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Card, CardHeader, Grid, Switch, Typography } from '@mui/material'
import { Box } from '@mui/system'
import PageHeader from '@src/@core/components/page-header'
import { StyledNextLink } from '@src/@core/components/customLink'
import styled from 'styled-components'

// ** components
import Filter from './components/filter'
import List from './components/list'

// ** types
import { ConstType } from '@src/pages/onboarding/client-guideline'
import { RequestFilterType } from '@src/types/requests/filters.type'

// ** values
// import {
//   ServiceTypeList,
//   ServiceTypePair,
// } from '@src/shared/const/service-type/service-types'

// ** apis
import { useGetClientRequestList } from '@src/queries/requests/client-request.query'

// ** hooks
import { useRouter } from 'next/router'
import CalendarContainer from './components/calendar'

// ** components

export const initialFilter: RequestFilterType = {
  status: [],
  lsp: [],
  category: [],
  serviceType: [],
  requestDateFrom: '',
  requestDateTo: '',
  desiredDueDateFrom: '',
  desiredDueDateTo: '',
  search: '',
  mine: 0,
  hideCompleted: 0,
  skip: 0,
  take: 10,
}

type MenuType = 'list' | 'calendar'
export default function Requests() {
  const router = useRouter()

  const [menu, setMenu] = useState<MenuType>('list')

  const [requestListPage, setrequestListPage] = useState<number>(0)
  const [requestListPageSize, setrequestPageSize] = useState<number>(10)

  // const [skip, setSkip] = useState(0)
  const [serviceType, setServiceType] = useState<Array<ConstType>>([])
  const [filter, setFilter] = useState<RequestFilterType>(initialFilter)
  const [activeFilter, setActiveFilter] =
    useState<RequestFilterType>(initialFilter)

  const { data: list, isLoading } = useGetClientRequestList(
    {
       ...activeFilter,
       skip: requestListPage * requestListPageSize,
       take: requestListPageSize,
    }
  )

  // function findServiceTypeFilter() {
  //   let category: Array<ConstType> = []
  //   if (filter.category?.length) {
  //     filter.category.forEach(item => {
  //       if (!ServiceTypePair[item as keyof typeof ServiceTypePair]) return
  //       category = category.concat(
  //         ServiceTypePair[item as keyof typeof ServiceTypePair],
  //       )
  //     })
  //   }

  //   if (category?.length) {
  //     const result = category.reduce(
  //       (acc: Array<ConstType>, item: ConstType) => {
  //         const found = acc.find(ac => ac.value === item.value)
  //         if (!found) return acc.concat(item)
  //         return acc
  //       },
  //       [],
  //     )
  //     return result
  //   }
  //   return ServiceTypeList
  // }

  // 기존 코드는 category의 변화에 따라 service type의 리스트가 변화하는게 아니라
  // 변화된 service type을 필터에 추가하는 방식임. 필터의 리스트만 바껴야 하므로 사용하지 않음
  // useEffect(() => {
  //   const newFilter = findServiceTypeFilter()
  //   setServiceType(newFilter)
  //   if (newFilter.length)
  //     setFilter({
  //       ...filter,
  //       serviceType: newFilter
  //         .filter(item => filter.serviceType?.includes(item.value))
  //         .map(item => item.value),
  //     })
  // }, [filter.category])

  function onSearch() {
    setActiveFilter({
      ...filter,
      mine: activeFilter.mine,
      hideCompleted: activeFilter.hideCompleted,
      skip: requestListPage * requestListPageSize,
      take: requestListPageSize,
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
    router.push(`/quotes/requests/${id}`)
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
              // serviceType={serviceType}
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
                <Typography>See only my requests</Typography>
                <Switch
                  checked={activeFilter.mine === 1}
                  onChange={e =>
                    setActiveFilter({
                      ...activeFilter,
                      mine: e.target.checked ? 1 : 0,
                    })
                  }
                />
              </Box>
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
                      <Button variant='contained'>
                        <StyledNextLink
                          href='/quotes/requests/add-new'
                          color='white'
                        >
                          Create new request
                        </StyledNextLink>
                      </Button>
                    </Box>
                  }
                  sx={{
                    pb: 4,
                    '& .MuiCardHeader-title': { letterSpacing: '.15px' },
                  }}
                />

                <List
                  skip={requestListPage}
                  pageSize={requestListPageSize}
                  setSkip={setrequestListPage}
                  setPageSize={setrequestPageSize}
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

Requests.acl = {
  subject: 'client_request',
  action: 'read',
}
