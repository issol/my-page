import { Suspense, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Card, CardHeader, Grid, Switch, Typography } from '@mui/material'
import { Box } from '@mui/system'
import styled from 'styled-components'
import { StyledNextLink } from '@src/@core/components/customLink'
import PageHeader from '@src/@core/components/page-header'

// ** components
import CalendarContainer from '../calendar'
import QuotesFilters from './filters'
import QuotesList from './list'

// ** hooks
import { useForm } from 'react-hook-form'

// ** types
import { UserDataType } from '@src/context/types'
import { QuotesFilterType } from '@src/types/quotes/quote'

// ** values
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { CategoryList } from '@src/shared/const/category/categories'

// ** apis
import { useGetQuotesList } from '@src/queries/quotes.query'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetClientList } from '@src/queries/client.query'
import { useGetStatusList } from '@src/queries/common.query'
import { useGetCompanyOptions } from '@src/queries/options.query'

export type FilterType = {
  quoteDate: Date[]
  quoteDeadline?: Date[]
  quoteExpiryDate?: Date[]
  estimatedDeliveryDate?: Date[]
  projectDueDate?: Date[]
  lsp?: Array<{ label: string; value: string }>

  status: Array<{ label: string; value: number }>
  client?: Array<{ label: string; value: number }>
  category: Array<{ label: string; value: string }>
  serviceType: Array<{ label: string; value: string }>

  search: string
}

const defaultValues: FilterType = {
  quoteDate: [],
  quoteDeadline: [],
  quoteExpiryDate: [],
  projectDueDate: [],
  estimatedDeliveryDate: [],
  status: [],
  client: [],
  category: [],
  serviceType: [],
  search: '',
}

const defaultFilters: QuotesFilterType = {
  quoteDate: [],
  quoteDeadline: [],
  quoteExpiryDate: [],
  projectDueDate: [],
  estimatedDeliveryDate: [],
  status: [],
  client: [],
  clientId: [],
  category: [],
  serviceType: [],
  search: '',
  take: 10,
  skip: 0,
  hideCompletedQuotes: 0,
  seeMyQuotes: 0,
}

type Props = { id: number; user: UserDataType }
type MenuType = 'list' | 'calendar'

export default function Quotes({ id, user }: Props) {
  const { data: statusList } = useGetStatusList('Quote')

  const [menu, setMenu] = useState<MenuType>('list')

  const [quoteListPage, setClientInvoiceListPage] = useState<number>(0)
  const [quoteListPageSize, setClientInvoiceListPageSize] = useState<number>(10)

  const [hideCompletedQuotes, setHideCompletedQuotes] = useState(false)
  const [seeMyQuotes, setSeeMyQuotes] = useState(false)

  const [filters, setFilters] = useState<QuotesFilterType>(defaultFilters)
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)
  const [clientList, setClientList] = useState<
    {
      label: string
      value: number
    }[]
  >([])
  const [companiesList, setCompaniesList] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  const currentRole = getCurrentRole()

  const { data: list, isLoading } = useGetQuotesList({
    ...filters,
    skip: quoteListPage * quoteListPageSize,
    take: quoteListPageSize,
  })

  const { data: clients, isLoading: clientListLoading } = useGetClientList({
    take: 1000,
    skip: 0,
  })
  const { data: companies, isLoading: companiesListLoading } =
    currentRole?.name === 'CLIENT'
      ? useGetCompanyOptions('LSP')
      : { data: [], isLoading: false }

  const { control, handleSubmit, trigger, reset, watch, getValues } =
    useForm<FilterType>({
      defaultValues,
      mode: 'onSubmit',
    })

  const onClickResetButton = () => {
    reset({
      quoteDate: [],
      quoteDeadline: [],
      quoteExpiryDate: [],
      status: [],
      client: [],
      category: [],
      serviceType: [],
      estimatedDeliveryDate: [],
      projectDueDate: [],
      lsp: [],
      search: '',
    })

    setFilters(defaultFilters)
  }

  const handleHideCompletedQuotes = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHideCompletedQuotes(event.target.checked)
    setFilters(prevState => ({
      ...prevState,
      hideCompletedQuotes: event.target.checked ? 1 : 0,
    }))
  }

  const handleSeeMyQuotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeeMyQuotes(event.target.checked)
    setFilters(prevState => ({
      ...prevState,
      seeMyQuotes: event.target.checked ? 1 : 0,
    }))
  }

  const onSubmit = (data: FilterType) => {
    const {
      quoteDate,
      quoteDeadline,
      quoteExpiryDate,
      status,
      client,
      serviceType,
      category,
      search,
      estimatedDeliveryDate,
      projectDueDate,
      lsp,
    } = data

    const filter: QuotesFilterType = {
      quoteDate: quoteDate.map(value => value.toISOString()),
      quoteDeadline: quoteDeadline?.map(value => value.toISOString()),
      quoteExpiryDate: quoteExpiryDate?.map(value => value.toISOString()),
      status: status.map(value => value.value),
      // client: client?.map(value => value.label),
      clientId: client?.map(value => value.value),
      serviceType: serviceType.map(value => value.value),
      category: category.map(value => value.value),
      estimatedDeliveryDate: estimatedDeliveryDate?.map(value =>
        value.toISOString(),
      ),
      projectDueDate: projectDueDate?.map(value => value.toISOString()),
      lsp: lsp?.map(value => value.label),
      search: search,
      take: quoteListPageSize,
      skip: quoteListPageSize * quoteListPage,
    }

    setFilters(filter)
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
        setCompaniesList(res)
      }
    }
  }, [companies, companiesListLoading])

  return (
    <Box display='flex' flexDirection='column'>
      <Box
        display='flex'
        width={'100%'}
        alignItems='center'
        justifyContent='space-between'
        padding='10px 0 24px'
      >
        <PageHeader title={<Typography variant='h5'>Quote list</Typography>} />
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
            <Suspense>
              <QuotesFilters
                filter={filters}
                control={control}
                setFilter={setFilters}
                onReset={onClickResetButton}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                trigger={trigger}
                serviceTypeList={serviceTypeList}
                setServiceTypeList={setServiceTypeList}
                categoryList={categoryList}
                setCategoryList={setCategoryList}
                role={currentRole!}
                quoteStatusList={statusList!}
                clientList={clientList}
                companiesList={companiesList}
              />
            </Suspense>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '24px',
              }}
            >
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography>See only my quotes</Typography>
                <Switch checked={seeMyQuotes} onChange={handleSeeMyQuotes} />
              </Box>
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography>Hide completed quotes</Typography>
                <Switch
                  checked={hideCompletedQuotes}
                  onChange={handleHideCompletedQuotes}
                />
              </Box>
            </Box>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='h6'>
                        Quotes ({list?.totalCount ?? 0})
                      </Typography>{' '}
                      {currentRole && currentRole.name === 'CLIENT' ? null : (
                        <Button variant='contained'>
                          <StyledNextLink href='/quotes/add-new' color='white'>
                            Create new quote
                          </StyledNextLink>
                        </Button>
                      )}
                    </Box>
                  }
                  sx={{
                    pb: 4,
                    '& .MuiCardHeader-title': { letterSpacing: '.15px' },
                  }}
                />
                <QuotesList
                  skip={quoteListPage}
                  setSkip={setClientInvoiceListPage}
                  pageSize={quoteListPageSize}
                  setPageSize={setClientInvoiceListPageSize}
                  list={list || { data: [], totalCount: 0 }}
                  isLoading={isLoading}
                  filter={filters}
                  setFilter={setFilters}
                  role={currentRole!}
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

Quotes.acl = {
  subject: 'quote',
  action: 'read',
}
