import { useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Card, CardHeader, Grid, Switch, Typography } from '@mui/material'
import { Box } from '@mui/system'
import FormControlLabel from '@mui/material/FormControlLabel'
// ** components

import { useForm } from 'react-hook-form'
import {
  ClientInvoiceFilterType,
  ClientInvoiceListType,
} from '@src/types/client/client-projects.type'

import { useGetClientInvoiceList } from '@src/queries/client/client-detail'

import { UserDataType } from '@src/context/types'
import PageHeader from '@src/@core/components/page-header'
import { QuotesFilterType } from '@src/types/quotes/quote'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { CategoryList } from '@src/shared/const/category/categories'
import QuotesFilters from './list/filters'
import { useGetQuotesList } from '@src/queries/quotes.query'
import QuotesList from './list/list'
import CalendarContainer from './calendar'
import { StyledNextLink } from '@src/@core/components/customLink'

export type FilterType = {
  quoteDate: Date[]
  quoteDeadline: Date[]
  quoteExpiryDate: Date[]

  status: Array<{ label: string; value: string }>
  client: Array<{ label: string; value: string }>
  category: Array<{ label: string; value: string }>
  serviceType: Array<{ label: string; value: string }>

  search: string
}

const defaultValues: FilterType = {
  quoteDate: [],
  quoteDeadline: [],
  quoteExpiryDate: [],
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
  status: [],
  client: [],
  category: [],
  serviceType: [],
  search: '',
  take: 10,
  skip: 0,
  idOrder: 'DESC',
  quoteDateOrder: 'DESC',
  quoteDeadlineOrder: 'DESC',
  quoteExpiryDateOrder: 'DESC',
  hideCompletedQuotes: false,
  seeMyQuotes: false,
}

type Props = { id: number; user: UserDataType }
type MenuType = 'list' | 'calendar'

export default function Quotes({ id, user }: Props) {
  const [menu, setMenu] = useState<MenuType>('list')

  const [quoteListPage, setClientInvoiceListPage] = useState<number>(0)
  const [quoteListPageSize, setClientInvoiceListPageSize] = useState<number>(10)

  const [hideCompletedQuotes, setHideCompletedQuotes] = useState(false)
  const [seeMyQuotes, setSeeMyQuotes] = useState(false)
  const [selectedInvoiceRow, setSelectedInvoiceRow] =
    useState<ClientInvoiceListType | null>(null)

  const [filters, setFilters] = useState<QuotesFilterType>(defaultFilters)
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)

  const { data: list, isLoading } = useGetQuotesList(filters)

  const { control, handleSubmit, trigger, reset, watch } = useForm<FilterType>({
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
      search: '',
    })

    setFilters(defaultFilters)
  }

  const handleRowClick = (row: ClientInvoiceListType) => {
    setSelectedInvoiceRow(row)
  }

  const handleHideCompletedQuotes = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHideCompletedQuotes(event.target.checked)
    setFilters(prevState => ({
      ...prevState,
      hideCompletedQuotes: event.target.checked,
    }))
  }

  const handleSeeMyQuotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeeMyQuotes(event.target.checked)
    setFilters(prevState => ({
      ...prevState,
      seeMyQuotes: event.target.checked,
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
    } = data

    const filter: QuotesFilterType = {
      quoteDate: quoteDate.map(value => value),
      quoteDeadline: quoteDeadline.map(value => value),
      quoteExpiryDate: quoteExpiryDate.map(value => value),
      status: status.map(value => value.value),
      client: client.map(value => value.value),
      serviceType: serviceType.map(value => value.value),
      category: category.map(value => value.value),

      search: search,
      take: quoteListPageSize,
      skip: quoteListPageSize * quoteListPage,
      idOrder: 'DESC',
      quoteDateOrder: 'DESC',
      quoteDeadlineOrder: 'DESC',
      quoteExpiryDateOrder: 'DESC',
    }

    setFilters(filter)
  }

  return (
    <Box display='flex' flexDirection='column'>
      <PageHeader title={<Typography variant='h5'>Quote list</Typography>} />
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            />
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
                      <Button variant='contained'>
                        <StyledNextLink href='/quotes/add-new' color='white'>
                          Create new quote
                        </StyledNextLink>
                      </Button>
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
  subject: 'client',
  action: 'read',
}
