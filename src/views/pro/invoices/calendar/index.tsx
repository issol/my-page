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

import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'

// ** Hooks
import { useSettings } from '@src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from '@src/@core/styles/libs/fullcalendar'

// ** types
import { CalendarEventType } from '@src/types/common/calendar.type'

// ** apis
import ProInvoiceList from '../list/list'
import {
  InvoicePayableStatusType,
  InvoiceReceivableStatusType,
  ProInvoiceListFilterType,
  ProInvoiceListType,
} from '@src/types/invoice/common.type'
import { useGetStatusList } from '@src/queries/common.query'
import {
  getPayableColor,
  getReceivableStatusColor,
} from '@src/shared/helpers/colors.helper'
import { useGetPayableCalendar } from '@src/queries/invoice/payable.query'
import {
  InvoicePayableFilterType,
  InvoicePayableListType,
} from '@src/types/invoice/payable.type'
import useCalenderResize from '@src/hooks/useCalenderResize'

type Props = {
  statusList: Array<{
    label: string
    value: number
  }>
  userId: number
}
const CalendarContainer = ({ statusList, userId }: Props) => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

  // ** Hooks
  const { settings } = useSettings()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState<InvoicePayableFilterType>({
    mine: '0',
    hidePaid: '0',
    skip: 0,
    take: 10,
  })

  const statuses = statusList?.map(i => ({
    value: i.value,
    label: i.label,
    color: getPayableColor(i.value as InvoicePayableStatusType),
  }))

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, isLoading } = useGetPayableCalendar(
    year,
    month,
    { ...filter, proId: [userId] },
    'lpm',
  )
  const [event, setEvent] = useState<
    Array<CalendarEventType<InvoicePayableListType>>
  >([])

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<CalendarEventType<InvoicePayableListType>>
  >([])

  // ** custom hooks
  const { containerRef, containerWidth } = useCalenderResize()

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
          status={statuses || []}
          mdAbove={mdAbove}
          leftSidebarWidth={leftSidebarWidth}
          title='Invoice'
        />
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
          <ReceivableCalendar
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
            filter={filter}
            setFilter={setFilter}
            containerWidth={containerWidth}
          />
        </Box>
      </CalendarWrapper>
      {currentListId === null ? null : (
        <Box mt={10} sx={{ background: 'white' }}>
          <ProInvoiceList
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
            statusList={statusList}
          />
        </Box>
      )}
    </Box>
  )
}

export default CalendarContainer
