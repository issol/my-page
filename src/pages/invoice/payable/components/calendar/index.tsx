// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'
import { Typography } from '@mui/material'

// ** components
import Calendar from './calendar'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

// ** types
import { CalendarEventType } from '@src/types/common/calendar.type'
import {
  InvoicePayableFilterType,
  InvoicePayableListType,
} from '@src/types/invoice/payable.type'

// ** apis
import { useGetPayableCalendar } from '@src/queries/invoice/payable.query'
import PayableList from '../list/list'

// ** values
import { InvoicePayableCalendarStatus } from '@src/shared/const/status/statuses'

const CalendarContainer = () => {
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
    mine: 0,
    hidePaid: 0,
    skip: 0,
    take: 10,
  })

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, isLoading } = useGetPayableCalendar(year, month, filter)
  const [event, setEvent] = useState<
    Array<CalendarEventType<InvoicePayableListType>>
  >([])

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<CalendarEventType<InvoicePayableListType>>
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
          status={InvoicePayableCalendarStatus}
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
          <Calendar
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
          <PayableList
            isAccountManager={false}
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
          />
        </Box>
      )}
    </Box>
  )
}

export default CalendarContainer
