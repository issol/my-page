import { useEffect, useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Switch, Typography } from '@mui/material'
import { Box } from '@mui/system'
import FormControlLabel from '@mui/material/FormControlLabel'
// ** components

import ClientProjectsFilter from './list/filters'
import { useForm } from 'react-hook-form'
import {
  ClientInvoiceFilterType,
  ClientInvoiceListType,
} from '@src/types/client/client-projects.type'

import { useGetClientInvoiceList } from '@src/queries/client/client-detail'

import { UserDataType } from '@src/context/types'

import ClientInvoiceList from './list/list'

import ClientInvoiceCalendarContainer from './calendar'
import { useGetStatusList } from '@src/queries/common.query'
import { useQueryClient } from 'react-query'

export type FilterType = {
  invoicedDate: Array<Date | null>
  paymentDueDate: Array<Date | null>
  status: Array<{ label: string; value: number }>
  search: string
}

const defaultValues: FilterType = {
  invoicedDate: [],
  paymentDueDate: [],
  status: [],
  search: '',
}

const initialFilter: ClientInvoiceFilterType = {
  status: [],
  search: '',
  take: 10,
  skip: 0,
  sort: 'DESC',
  invoicedDateTo: null,
  invoicedDateFrom: null,
  paymentDueDateTo: null,
  paymentDueDateFrom: null,
}

type Props = { id: number; user: UserDataType }
type MenuType = 'list' | 'calendar'

export default function ClientInvoices({ id, user }: Props) {
  const queryClient = useQueryClient()
  const [menu, setMenu] = useState<MenuType>('list')

  const [clientInvoiceListPage, setClientInvoiceListPage] = useState<number>(0)
  const [clientInvoiceListPageSize, setClientInvoiceListPageSize] =
    useState<number>(10)

  const { data: statusList, isLoading: statusListLoading } =
    useGetStatusList('InvoiceReceivable')

  const [hidePaidInvoices, setHidePaidInvoices] = useState(false)
  const [selectedInvoiceRow, setSelectedInvoiceRow] =
    useState<ClientInvoiceListType | null>(null)

  const [selected, setSelected] = useState<number | null>(null)

  const [filters, setFilters] = useState<ClientInvoiceFilterType>(initialFilter)

  const { data: clientInvoiceList, isLoading } = useGetClientInvoiceList(
    id,
    filters,
  )

  const { control, handleSubmit, trigger, reset, watch } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const onClickResetButton = () => {
    reset({
      invoicedDate: [],
      paymentDueDate: [],
      search: '',
      status: [],
    })

    setFilters(initialFilter)
    queryClient.invalidateQueries(['client-invoices', initialFilter])
  }

  const handleRowClick = (row: ClientInvoiceListType) => {
    if (row.id === selected) {
      setSelected(null)
      setSelectedInvoiceRow(null)
    } else {
      setSelected(row.id)
      setSelectedInvoiceRow(row)
    }
  }

  const isSelected = (index: number) => {
    return index === selected
  }

  const handleHideCompletedProjects = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHidePaidInvoices(event.target.checked)
    setFilters(prevState => ({
      ...prevState,
      hidePaidInvoices: event.target.checked,
    }))
  }

  const onSubmit = (data: FilterType) => {
    const { invoicedDate, paymentDueDate, search, status } = data

    const filter: ClientInvoiceFilterType = {
      invoicedDateFrom: invoicedDate[0],
      invoicedDateTo: invoicedDate[1],
      paymentDueDateFrom: paymentDueDate[0],
      paymentDueDateTo: paymentDueDate[1],
      status: status.map(value => value.value),

      search: search,
      take: clientInvoiceListPageSize,
      skip: clientInvoiceListPageSize * clientInvoiceListPage,
      sort: 'DESC',
    }

    setFilters(filter)
    queryClient.invalidateQueries(['client-invoices', filter])
  }

  return (
    <Box display='flex' flexDirection='column'>
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
            {!statusList && statusListLoading ? null : (
              <ClientProjectsFilter
                filter={filters}
                control={control}
                setFilter={setFilters}
                onReset={onClickResetButton}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                trigger={trigger}
                statusList={statusList!}
              />
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <FormControlLabel
                value='start'
                control={
                  <Switch
                    checked={hidePaidInvoices}
                    onChange={handleHideCompletedProjects}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '21px',

                      letterSpacing: '0.15px',

                      color: 'rgba(76, 78, 100, 0.6)',
                    }}
                  >
                    Hide paid invoices
                  </Typography>
                }
                labelPlacement='start'
              />
            </Box>

            <ClientInvoiceList
              list={clientInvoiceList?.data!}
              listCount={clientInvoiceList?.totalCount!}
              isLoading={isLoading}
              listPage={clientInvoiceListPage}
              listPageSize={clientInvoiceListPageSize}
              setListPage={setClientInvoiceListPage}
              setListPageSize={setClientInvoiceListPageSize}
              handleRowClick={handleRowClick}
              isSelected={isSelected}
              selected={selected}
              user={user}
              title='Invoices'
              isCardHeader={true}
            />
          </Box>
        ) : (
          <ClientInvoiceCalendarContainer id={id} user={user} />
        )}
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
