// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'
import { Typography } from '@mui/material'

// ** components
import ReceivableCalendar from './calendar'
import ReceivableList from '../list/list'
import CalendarSideBar from '@src/pages/components/sidebar'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

// ** types
import { CalendarEventType } from '@src/types/common/calendar.type'
import {
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
} from '@src/types/invoice/receivable.type'

import { InvoiceCalenderStatus } from '@src/shared/const/status/statuses'

// ** apis
import { useGetReceivableCalendar } from '@src/queries/invoice/receivable.query'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetInvoiceStatus } from '@src/queries/invoice/common.query'
import { InvoiceReceivableStatusType } from '@src/types/invoice/common.type'

const CalendarContainer = () => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

  // ** Hooks
  const { settings } = useSettings()

  const currentRole = getCurrentRole()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [statuses, setStatuses] = useState<
    Array<{ color: string; value: number; label: string }>
  >([])

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState<InvoiceReceivableFilterType>({
    mine: 0,
    hidePaid: 0,
    skip: 0,
    take: 10,
  })

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, refetch, isLoading } = useGetReceivableCalendar(
    year,
    month,
    filter,
  )

  const { data: statusList, isLoading: statusListLoading } =
    useGetInvoiceStatus()
  const [event, setEvent] = useState<
    Array<CalendarEventType<InvoiceReceivableListType>>
  >([])

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<CalendarEventType<InvoiceReceivableListType>>
  >([])

  function getColor(status: InvoiceReceivableStatusType) {
    return status === 'In preparation'
      ? '#F572D8'
      : status === 'Checking in progress'
      ? '#FDB528'
      : status === 'Accepted by client'
      ? '#64C623'
      : status === 'Tax invoice issued'
      ? '#46A4C2'
      : status === 'Paid'
      ? '#267838'
      : status === 'Overdue'
      ? '#FF4D49'
      : status === 'Canceled'
      ? '#FF4D49'
      : status === 'Overdue (Reminder sent)'
      ? '#FF4D49'
      : status === 'New'
      ? '#666CFF'
      : status === 'Invoice confirmed'
      ? '#64C623'
      : status === 'Revised'
      ? '#AD7028'
      : status === 'Under review'
      ? '#FDB528'
      : status === 'Under revision'
      ? '#BA971A'
      : ''
  }

  useEffect(() => {
    if (currentListId && data?.data) {
      setCurrentList(data?.data.filter(item => item.id === currentListId))
    }
  }, [currentListId])

  useEffect(() => {
    if (data?.data?.length) {
      setEvent([...data.data])
    } else {
      setEvent([])
    }
  }, [data])

  useEffect(() => {
    if (statusList) {
      const res = statusList.map(value => ({
        value: value.id,
        label: value.statusName,
        color: getColor(value.statusName as InvoiceReceivableStatusType),
      }))
      setStatuses(res)
    }
  }, [statusList])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  return (
    <Box>
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && {
            border: theme => `1px solid ${theme.palette.divider}`,
          }),
          '& .fc-daygrid-event-harness': {
            '& .fc-event': {
              padding: '0 !important',
            },
            '.fc-h-event': {
              border: 'none',
            },
          },
        }}
      >
        <CalendarStatusSideBar
          alertIconStatus='Canceled'
          status={statuses}
          mdAbove={mdAbove}
          leftSidebarWidth={leftSidebarWidth}
        />
        <Box
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
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '24px',
            }}
          >
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Typography>See only my invoices</Typography>
              <Switch
                checked={filter.mine === 1}
                onChange={e =>
                  setFilter({ ...filter, mine: e.target.checked ? 1 : 0 })
                }
              />
            </Box>
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Typography>Hide paid invoices</Typography>
              <Switch
                checked={filter.hidePaid === 1}
                onChange={e =>
                  setFilter({ ...filter, hidePaid: e.target.checked ? 1 : 0 })
                }
              />
            </Box>
          </Box>
          <ReceivableCalendar
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
          />
        </Box>
      </CalendarWrapper>
      {currentListId === null ? null : (
        <Box mt={10} sx={{ background: 'white' }}>
          <ReceivableList
            isLoading={isLoading}
            skip={skip}
            setSkip={setSkip}
            pageSize={pageSize}
            setPageSize={setPageSize}
            list={
              currentList?.length
                ? { data: currentList, totalCount: currentList?.length }
                : { data: [], totalCount: 0 }
            }
            role={currentRole!}
          />
        </Box>
      )}
    </Box>
  )
}

export default CalendarContainer
