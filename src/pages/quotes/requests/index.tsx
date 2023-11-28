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

// ** apis
import {
  useGetClientRequestList,
  useGetClientRequestStatus,
} from '@src/queries/requests/client-request.query'

// ** hooks
import { useRouter } from 'next/router'
import CalendarContainer from './components/calendar'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { CategoryList } from '@src/shared/const/category/categories'
import { useForm } from 'react-hook-form'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetCompanyOptions } from '@src/queries/options.query'
import { useGetClientList } from '@src/queries/client.query'
import { getRequestListColumns } from '@src/shared/const/columns/requests'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useQueryClient } from 'react-query'
import useCalenderResize from '@src/hooks/useCalenderResize'

// ** components
export type FilterType = {
  requestDate: Date[]
  desiredDueDate: Date[]
  lsp?: Array<{ label: string; value: string }>
  client?: Array<{ label: string; value: number }>
  status: Array<{ label: string; value: number }>
  category: Array<{ label: string; value: string }>
  serviceType: Array<{ label: string; value: string }>
  search: string
}

const defaultValues: FilterType = {
  requestDate: [],
  desiredDueDate: [],
  status: [],
  category: [],
  serviceType: [],
  search: '',
  lsp: [],
  client: [],
}

export const defaultFilters: RequestFilterType = {
  status: [],
  lsp: [],
  client: [],
  category: [],
  serviceType: [],
  requestDateFrom: '',
  requestDateTo: '',
  desiredDueDateFrom: '',
  desiredDueDateTo: '',
  search: '',
  mine: '0',
  hideCompleted: '0',
  skip: 0,
  take: 10,
}

type MenuType = 'list' | 'calendar'
export default function Requests() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const currentRole = getCurrentRole()
  const [menu, setMenu] = useState<MenuType>('list')
  const auth = useRecoilValueLoadable(authState)

  const [requestListPage, setRequestListPage] = useState<number>(0)
  const [requestListPageSize, setRequestPageSize] = useState<number>(10)

  const [hideCompletedRequests, setHideCompletedRequests] =
    useState<boolean>(false)
  const [seeMyRequests, setSeeMyRequests] = useState<boolean>(false)

  const [filters, setFilters] = useState<RequestFilterType>(defaultFilters)

  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)

  const [clientList, setClientList] = useState<
    {
      label: string
      value: number
    }[]
  >([])
  const [companyList, setCompanyList] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  const { data: companies, isLoading: companiesListLoading } =
    currentRole?.name === 'CLIENT'
      ? useGetCompanyOptions('LSP')
      : { data: [], isLoading: false }

  const { data: clients, isLoading: clientListLoading } = useGetClientList({
    take: 1000,
    skip: 0,
  })

  const { data: list, isLoading } = useGetClientRequestList(filters)

  const { data: statusList, isLoading: statusListLoading } =
    useGetClientRequestStatus()

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    trigger,
    reset: filterReset,
  } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const onSubmit = (data: FilterType) => {
    const {
      requestDate,
      desiredDueDate,
      client,
      status,

      serviceType,
      category,
      search,
      lsp,
    } = data

    const filter: RequestFilterType = {
      status: status.map(value => value.value),

      serviceType: serviceType.map(value => value.value),
      category: category.map(value => value.value),
      requestDateFrom: requestDate[0]?.toISOString() ?? '',
      requestDateTo: requestDate[1]?.toISOString() ?? '',
      desiredDueDateFrom: desiredDueDate[0]?.toISOString() ?? '',
      desiredDueDateTo: desiredDueDate[1]?.toISOString() ?? '',

      lsp: lsp?.map(value => value.label),
      search: search,
      take: requestListPageSize,
      skip: requestListPageSize * requestListPage,
      ordering: 'desc',
      sort: 'corporationId',
    }

    setFilters(filter)
    queryClient.invalidateQueries(['request/client/list', filter])
  }
  console.log('default filter', getValues())

  function onReset() {
    filterReset()
    setFilters({ ...defaultFilters })
    queryClient.invalidateQueries([
      'request/client/list',
      { ...defaultFilters },
    ])
  }

  function onRowClick(id: number) {
    router.push(`/quotes/requests/${id}`)
  }

  const handleCompletedRequests = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHideCompletedRequests(event.target.checked)
    setFilters(prevState => ({
      ...prevState,
      hideCompleted: event.target.checked ? '1' : '0',
    }))
  }

  const handleSeeMyRequests = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeeMyRequests(event.target.checked)

    setFilters(prevState => ({
      ...prevState,
      mine: event.target.checked ? '1' : '0',
    }))
  }

  useEffect(() => {
    if (clients && !clientListLoading) {
      const res = clients.data.map(client => ({
        label: client.name,
        value: client.clientId,
      }))
      setClientList(res)
    }
  }, [clients, clientListLoading])
  useEffect(() => {
    if (currentRole?.name === 'CLIENT') {
      if (companies && !companiesListLoading) {
        const res = companies.map(company => ({
          label: company.name,
          value: company.id,
        }))
        setCompanyList(res)
      }
    }
  }, [companies, companiesListLoading])

  useEffect(() => {
    queryClient.invalidateQueries(['request/client/list'])
    queryClient.invalidateQueries(['request/client/calendar'])
    queryClient.invalidateQueries(['request/client/detail'])
  }, [])

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
            onClick={e => {
              queryClient.invalidateQueries(['request/client/list'])
              queryClient.invalidateQueries(['request/client/calendar'])
              setMenu(e.currentTarget.value as MenuType)
            }}
          >
            List view
          </CustomBtn>
          <CustomBtn
            $focus={menu === 'calendar'}
            value='calendar'
            onClick={e => {
              queryClient.invalidateQueries(['request/client/list'])
              queryClient.invalidateQueries(['request/client/calendar'])
              setMenu(e.currentTarget.value as MenuType)
            }}
          >
            Calendar view
          </CustomBtn>
        </ButtonGroup>
      </Box>
      <Box>
        {menu === 'list' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Filter
              serviceTypeList={serviceTypeList}
              setServiceTypeList={setServiceTypeList}
              categoryList={categoryList}
              setCategoryList={setCategoryList}
              filters={filters}
              setFilters={setFilters}
              onReset={onReset}
              onSubmit={onSubmit}
              control={control}
              handleSubmit={handleSubmit}
              trigger={trigger}
              clientList={clientList}
              statusList={statusList!}
              statusListLoading={statusListLoading}
              companyList={companyList}
              companyListLoading={companiesListLoading}
              role={currentRole!}
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
                  checked={seeMyRequests}
                  onChange={handleSeeMyRequests}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography>Hide completed requests</Typography>
                <Switch
                  checked={hideCompletedRequests}
                  onChange={handleCompletedRequests}
                />
              </Box>
            </Box>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='h6'>
                        Requests ({list?.totalCount ?? 0})
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
                  page={requestListPage}
                  pageSize={requestListPageSize}
                  setPage={setRequestListPage}
                  setPageSize={setRequestPageSize}
                  setFilters={setFilters}
                  list={list || { count: 0, data: [], totalCount: 0 }}
                  isLoading={isLoading}
                  role={currentRole!}
                  onRowClick={onRowClick}
                  columns={getRequestListColumns(
                    statusList!,
                    currentRole!,
                    auth,
                  )}
                  type='list'
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
