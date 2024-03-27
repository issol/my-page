// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Card } from '@mui/material'

// ** components
import ReceivableCalendar from './calendar'
import ReceivableList from '../list/list'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'

// ** Hooks
import { useSettings } from '@src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from '@src/@core/styles/libs/fullcalendar'

// ** types
import { CalendarEventType } from '@src/types/common/calendar.type'
import {
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
} from '@src/types/invoice/receivable.type'

// ** apis
import { useGetReceivableCalendar } from '@src/queries/invoice/receivable.query'
import { useGetStatusList } from '@src/queries/common.query'
import { getReceivableStatusColor } from '@src/shared/helpers/colors.helper'
import { getCurrentRole } from '@src/shared/auth/storage'
// import { useGetInvoiceStatus } from '@src/queries/invoice/common.query'
import { getInvoiceReceivableListColumns } from '@src/shared/const/columns/invoice-receivable'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import useCalenderResize from '@src/hooks/useCalenderResize'
import { timezoneSelector } from '@src/states/permission'
import {
  InvoiceReceivableStatus,
  InvoiceReceivableStatusLabel,
} from '@src/types/common/status.type'

const CalendarContainer = () => {
  // ** Hooks
  const { settings } = useSettings()
  const { containerRef, containerWidth } = useCalenderResize()

  const currentRole = getCurrentRole()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const { data: statusList } = useGetStatusList(
    'InvoiceReceivable',
    currentRole?.name === 'CLIENT' ? '1' : '0',
  )
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const statuses = statusList?.map(i => ({
    value: i.value,
    label: i.label,
    color: getReceivableStatusColor(
      i.value as InvoiceReceivableStatusLabel & InvoiceReceivableStatus,
    ),
  }))

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState<InvoiceReceivableFilterType>({
    mine: '0',
    hidePaid: '0',
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

  const [event, setEvent] = useState<
    Array<CalendarEventType<InvoiceReceivableListType>>
  >([])

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<CalendarEventType<InvoiceReceivableListType>>
  >([])

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
          // alertIconStatus='Canceled'
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
        <Card sx={{ background: 'white', marginTop: 10 }}>
          <ReceivableList
            isLoading={isLoading}
            page={skip}
            setPage={setSkip}
            pageSize={pageSize}
            setPageSize={setPageSize}
            setFilters={setFilter}
            columns={getInvoiceReceivableListColumns(
              statusList!,
              currentRole!,
              auth,
              timezone.getValue(),
            )}
            list={
              currentList?.length
                ? {
                    data: currentList,
                    count: pageSize,
                    totalCount: currentList?.length,
                  }
                : { data: [], count: 0, totalCount: 0 }
            }
            role={currentRole!}
            type='calendar'
          />
        </Card>
      )}
    </Box>
  )
}

export default CalendarContainer
