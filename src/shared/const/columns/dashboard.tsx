import { GridColumns } from '@mui/x-data-grid'
import { RequestItem } from '@src/types/dashboard'
import { StatusSquare } from '@src/pages/dashboards/components/dashboardItem'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { timezones } from '@src/@fake-db/autocomplete'
import Typography from '@mui/material/Typography'
import { JobTypeChip, ServiceTypeChip } from '@src/@core/components/chips/chips'
import { Box } from '@mui/material'
import { Inbox } from '@mui/icons-material'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import moment from 'moment-timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

export const RequestColumns: GridColumns = [
  {
    field: 'desiredDueDate',
    headerName: 'desiredStatus',
    cellClassName: 'desiredDueDate-status__cell',
    renderCell: ({ row }: { row: RequestItem }) => {
      const code = row.desiredDueTimezone
        .code as keyof typeof timezones.countries

      const timeZone = timezones.countries[code].zones[0]
      const date1 = dayjs(row.desiredDueDate).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = date1.diff(date2, 'hour')

      let color = '#7F889B'
      if (86400000 >= remainTime && remainTime > 0) {
        color = '#FF4D49'
      }
      return (
        <StatusSquare
          style={{ margin: 0, padding: '0', marginLeft: '20px' }}
          color={color}
        />
      )
    },
  },
  {
    field: 'companyName',
    headerName: 'companyName',
    cellClassName: 'companyName__cell',
    flex: 1,
    minWidth: 120,
    renderCell: ({ row }: { row: RequestItem }) => {
      return <Typography fontWeight={600}>{row.companyName}</Typography>
    },
  },
  {
    field: 'category',
    headerName: 'category',
    flex: 1,
    minWidth: 340,
    renderCell: ({ row }: { row: RequestItem }) => {
      return (
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          gap='10px'
          sx={{ width: '340px' }}
        >
          <Box display='flex' gap='10px'>
            <JobTypeChip type={row.category} label={row.category} />
            <ServiceTypeChip label={row.serviceType} />
          </Box>
          <span
            style={{
              display: 'block',
              width: '1px',
              height: '20px',
              margin: '0 10px',
              backgroundColor: 'rgba(76, 78, 100, 0.12)',
            }}
          ></span>
        </Box>
      )
    },
  },
  {
    field: 'itemCount',
    headerName: 'itemCount',
    flex: 1,
    renderCell: ({ row }: { row: RequestItem }) => {
      return (
        <Box display='flex' alignItems='center' gap='8px'>
          <Inbox />
          <Typography>{`${row.itemCount} items(s)`}</Typography>
        </Box>
      )
    },
  },
  {
    field: 'desiredDueDate_date',
    headerName: 'desiredDueDate',
    flex: 1,
    cellClassName: 'desiredDueDate-date__cell',
    renderCell: ({ row }: { row: RequestItem }) => {
      const code = row.desiredDueTimezone
        .code as keyof typeof timezones.countries

      const timeZone = timezones.countries[code].zones[0]
      console.log('tz', timeZone)
      const date1 = moment(row.desiredDueDate)
        .tz(timeZone)
        .format('MM/DD/YYYY hh:mm A (z)')

      return (
        <Box display='flex' alignItems='center' gap='8px'>
          <Inbox />
          <Typography sx={{ width: '100%' }}>{`${date1}`}</Typography>
        </Box>
      )
    },
  },
]
