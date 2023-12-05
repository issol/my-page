import { GridColumns } from '@mui/x-data-grid'
import { JobItem, OrderItem, RequestItem } from '@src/types/dashboard'
import { StatusSquare } from '@src/pages/dashboards/components/dashboardItem'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { timezones } from '@src/@fake-db/autocomplete'
import Typography from '@mui/material/Typography'
import {
  JobTypeChip,
  OrderStatusChip,
  RoleChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
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
    minWidth: 160,
    renderCell: ({ row }: { row: RequestItem }) => {
      return <Typography fontWeight={600}>{row.companyName}</Typography>
    },
  },
  {
    field: 'category',
    headerName: 'category',

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
    minWidth: 160,
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
      const date1 = dayjs(row.desiredDueDate).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = date1.diff(date2, 'hour')

      let color = '#7F889B'
      if (86400000 >= remainTime && remainTime > 0) {
        color = '#FF4D49'
      }

      return (
        <Box display='flex' alignItems='center' gap='8px'>
          <Inbox />
          <Typography sx={{ width: '100%', color }}>{`${moment(
            row.desiredDueDate,
          )
            .tz(timeZone)
            .format('MM/DD/YYYY hh:mm A (z)')}`}</Typography>
        </Box>
      )
    },
  },
]

export const RecruitingRequestColumns: GridColumns = [
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
    minWidth: 160,
    renderCell: ({ row }: { row: RequestItem }) => {
      return (
        <Typography fontWeight={600} fontSize='14px'>
          {row.companyName}
        </Typography>
      )
    },
  },
  {
    field: 'category',
    headerName: 'category',

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
            <JobTypeChip
              type={row.category}
              label={row.category}
              sx={{ height: '24px', fontSize: '13px' }}
            />
            <ServiceTypeChip
              label={row.serviceType}
              sx={{ height: '24px', fontSize: '13px' }}
            />
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
    minWidth: 160,
    renderCell: ({ row }: { row: RequestItem }) => {
      return (
        <Box display='flex' alignItems='center' gap='8px'>
          <Inbox />
          <Typography fontSize='14px'>{`${row.itemCount} items(s)`}</Typography>
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
      const date1 = dayjs(row.desiredDueDate).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = date1.diff(date2, 'hour')

      let color = '#7F889B'
      if (86400000 >= remainTime && remainTime > 0) {
        color = '#FF4D49'
      }

      return (
        <Box display='flex' alignItems='center' gap='8px'>
          <Inbox />
          <Typography fontSize='14px' sx={{ width: '100%', color }}>{`${moment(
            row.desiredDueDate,
          )
            .tz(timeZone)
            .format('MM/DD/YYYY hh:mm A (z)')}`}</Typography>
        </Box>
      )
    },
  },
]

export const StatusOrderColumns: GridColumns = [
  {
    field: 'status',
    headerName: 'status',
    minWidth: 192,
    renderHeader: () => <Box>status</Box>,
    renderCell: ({ row }: { row: OrderItem }) => {
      return (
        <div>
          <OrderStatusChip
            size='small'
            status={row?.status}
            label={row?.status}
          />
        </div>
      )
    },
  },
  {
    field: 'clientName',
    headerName: 'Client / Email',
    minWidth: 192,
    renderHeader: () => <Box>Client / Email</Box>,
    renderCell: ({ row }: { row: OrderItem }) => {
      return (
        <Box>
          <Typography fontSize='14px' fontWeight={600}>
            {row.client.name || '-'}
          </Typography>
          <Typography color='#4C4E6499' fontSize='14px'>
            {row.client.email || '-'}
          </Typography>
        </Box>
      )
    },
  },
  {
    field: 'projectName',
    headerName: 'Project name',
    minWidth: 220,
    renderHeader: () => <Box>Project name</Box>,
    renderCell: ({ row }: { row: OrderItem }) => {
      return <div>{row.projectName}</div>
    },
  },
  {
    field: 'category',
    headerName: 'Category / Service type',
    minWidth: 320,
    flex: 1,
    renderHeader: () => <Box>Category / Service type</Box>,
    renderCell: ({ row }: { row: OrderItem }) => {
      return (
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          gap='10px'
          sx={{ width: '340px' }}
        >
          <Box display='flex' gap='10px'>
            {row.category ? (
              <JobTypeChip type={row.category} label={row.category} />
            ) : (
              '-'
            )}
            {row.serviceType ? (
              <ServiceTypeChip label={row.serviceType} />
            ) : (
              '-'
            )}
          </Box>
        </Box>
      )
    },
  },
]

export const StatusJobColumns: GridColumns = [
  {
    field: 'status',
    headerName: 'status',
    minWidth: 192,
    renderHeader: () => <Box>status</Box>,
    renderCell: ({ row }: { row: JobItem }) => {
      return (
        <div>
          <OrderStatusChip
            size='small'
            status={row?.status}
            label={row?.status}
          />
        </div>
      )
    },
  },
  {
    field: 'proName',
    headerName: 'Pro / Email',
    minWidth: 192,
    renderHeader: () => <Box>Pro / Email</Box>,
    renderCell: ({ row }: { row: JobItem }) => {
      return (
        <Box>
          <Typography fontSize='14px' fontWeight={600}>
            {`${row.pro?.firstName || '-'} ${row.pro?.middleName || '-'} ${
              row.pro?.lastName || '-'
            }` || '-'}
          </Typography>
          <Typography color='#4C4E6499' fontSize='14px'>
            {row.pro?.email || '-'}
          </Typography>
        </Box>
      )
    },
  },
  {
    field: 'jobName',
    headerName: 'Job name',
    minWidth: 220,
    renderHeader: () => <Box>Job name</Box>,
    renderCell: ({ row }: { row: JobItem }) => {
      return <div>{row.jobName}</div>
    },
  },
  {
    field: 'job',
    headerName: 'Job',
    minWidth: 320,
    flex: 1,
    sortable: false,
    renderHeader: () => <Box>Job</Box>,
    renderCell: ({ row }: { row: JobItem }) => {
      return (
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          gap='10px'
          sx={{ width: '340px' }}
        >
          <Box display='flex' gap='10px'>
            {row.jobType ? (
              <JobTypeChip type={row.jobType} label={row.jobType} />
            ) : (
              '-'
            )}
          </Box>
        </Box>
      )
    },
  },
]

export const JobTableColumn = [
  {
    field: 'index',
    headerName: '',
    filterable: false,
    minWidth: 60,
    renderCell: ({ row }) => {
      return (
        <Box sx={{ width: '100%', textAlign: 'left' }}>{row.numbering}</Box>
      )
    },
  },
  {
    field: 'jobType',
    headerName: 'Job type',
    minWidth: 180,
    flex: 1,
    renderHeader: () => <Box>Job type</Box>,
    renderCell: ({ row }) => {
      return (
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          gap='10px'
          sx={{ width: '340px' }}
        >
          <Box display='flex' gap='10px'>
            {row.jobType ? (
              <JobTypeChip
                sx={{ height: '24px' }}
                type={row.jobType}
                label={row.jobType}
              />
            ) : (
              '-'
            )}
          </Box>
        </Box>
      )
    },
  },
  {
    field: 'role',
    headerName: 'Role',
    minWidth: 240,
    flex: 1,
    sortable: false,
    renderHeader: () => <Box>Role</Box>,
    renderCell: ({ row }) => {
      return (
        <Box display='flex' gap='10px'>
          {row.role ? (
            <RoleChip
              sx={{ height: '24px' }}
              type={row.role}
              label={row.role}
            />
          ) : (
            '-'
          )}
        </Box>
      )
    },
  },
  {
    field: 'pros',
    headerName: 'Pros',
    minWidth: 140,

    sortable: false,
    renderHeader: () => <Box>Pros</Box>,
    renderCell: ({ row }) => {
      return <Box>{row.pros}</Box>
    },
  },
  {
    field: 'ratio',
    headerName: '%',
    minWidth: 110,

    sortable: false,
    renderHeader: () => <Box>%</Box>,
    renderCell: ({ row }) => {
      return <Box sx={{ textAlign: 'center' }}>{row.ratio}%</Box>
    },
  },
]
