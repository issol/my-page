// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'

// ** components

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

import { Typography } from '@mui/material'

import { ClientInvoiceCalendarEventType } from '@src/apis/client.api'

import { useGetClientInvoicesCalendar } from '@src/queries/client/client-detail'

import { UserDataType } from '@src/context/types'
import { ClientInvoiceListType } from '@src/types/client/client-projects.type'

import ClientInvoiceCalendar from './client-invoice-calendar'
import ClientInvoiceList from '../list/list'
import { useGetStatusList } from '@src/queries/common.query'
import { getReceivableStatusColor } from '@src/shared/helpers/colors.helper'
import { InvoiceReceivableStatusType } from '@src/types/invoice/common.type'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import useCalenderResize from '@src/hooks/useCalenderResize'

type Props = {
  id: number
  user: UserDataType
}

const ClientInvoiceCalendarContainer = ({ id, user }: Props) => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [hideFilter, setHideFilter] = useState(false)
  const { data: statusList, isLoading: statusListLoading } =
    useGetStatusList('InvoiceReceivable')

  const [statuses, setStatuses] = useState<
    Array<{ color: string; value: number; label: string }>
  >([])

  // ** Hooks
  const { settings } = useSettings()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data } = useGetClientInvoicesCalendar(id, year, month)
  const [event, setEvent] = useState<Array<ClientInvoiceCalendarEventType>>([])

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<ClientInvoiceCalendarEventType>
  >([])

  const [selected, setSelected] = useState<number | null>(null)

  // ** custom hooks
  const { containerRef, containerWidth } = useCalenderResize()

  const handleRowClick = (row: ClientInvoiceListType) => {
    if (row.id === selected) {
      setSelected(null)
      // setSelectedProjectRow(null)
    } else {
      setSelected(row.id)
      // setSelectedProjectRow(row)
    }
  }

  const isSelected = (index: number) => {
    return index === selected
  }

  useEffect(() => {
    if (currentListId && data?.data) {
      // console.log(currentListId)

      setCurrentList(data?.data.filter(item => item.id === currentListId))
    }
  }, [currentListId])

  useEffect(() => {
    if (data?.data?.length) {
      setEvent([...data.data])
    } else {
      setEvent([
        //@ts-ignore
        {
          id: 0,

          invoiceName: '',
          totalPrice: 0,

          currency: 'USD',
          extendedProps: {
            calendar: 'primary',
          },
        },
      ])
    }
  }, [data])

  useEffect(() => {
    if (data?.data.length && hideFilter) {
      setEvent(
        data.data.filter(
          item => item.invoiceStatus !== 30900 && item.invoiceStatus !== 301200,
        ),
      )
    } else if (data?.data.length && !hideFilter) {
      setEvent([...data.data])
    }
  }, [data, hideFilter])

  useEffect(() => {
    if (statusList) {
      const res = statusList.map(value => ({
        ...value,
        color: getReceivableStatusColor(
          value.value as InvoiceReceivableStatusType,
        ),
      }))
      setStatuses(res)
    }
  }, [statusList])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && {
            border: theme => `1px solid ${theme.palette.divider}`,
          }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
          }}
        >
          <Box
            sx={{
              display: 'flex',

              borderRight: '1px solid rgba(76, 78, 100, 0.12)',
              padding: '40px 20px 0 20px',
            }}
          >
            <Typography variant='body2' fontWeight={600}>
              Invoice status
            </Typography>
          </Box>
          <CalendarStatusSideBar
            alertIconStatus=''
            status={statuses!}
            mdAbove={mdAbove}
            leftSidebarWidth={leftSidebarWidth}
            title='Invoice'
          />
        </Box>

        <Box
          ref={containerRef}
          sx={{
            px: 5,
            pt: 3.75,
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 'none',
            backgroundColor: 'background.paper',
            ...(mdAbove
              ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
              : {}),
          }}
        >
          <Box
            display='flex'
            alignItems='center'
            gap='20px'
            justifyContent='right'
            padding='0 0 20px'
          ></Box>
          <ClientInvoiceCalendar
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
            filter={hideFilter}
            setFilter={setHideFilter}
            containerWidth={containerWidth}
          />
        </Box>
      </CalendarWrapper>

      {currentList.length ? (
        <ClientInvoiceList
          list={currentList}
          listCount={currentList.length}
          handleRowClick={handleRowClick}
          isSelected={isSelected}
          selected={selected}
          user={user}
          isCardHeader={false}
        />
      ) : null}
    </Box>
  )
}

export default ClientInvoiceCalendarContainer
