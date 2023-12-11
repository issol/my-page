import { GridColumns } from '@mui/x-data-grid'
import {
  JobItem,
  LongStandingPayablesItem,
  LongStandingReceivableItem,
  OrderItem,
  RecruitingRequest,
  RequestItem,
} from '@src/types/dashboard'
import { StatusSquare } from '@src/views/dashboard/dashboardItem'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { timezones } from '@src/@fake-db/autocomplete'
import Typography from '@mui/material/Typography'

import {
  InvoiceReceivableChip,
  JobTypeChip,
  OrderStatusChip,
  QuoteStatusChip,
  RoleChip,
  ServiceTypeChip,
  WorkStatusChip,
} from '@src/@core/components/chips/chips'
import { Box } from '@mui/material'
import { Inbox, Person } from '@mui/icons-material'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import moment from 'moment-timezone'
import Link from 'next/link'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

export const RequestColumns: GridColumns = [
  {
    field: 'companyName',
    headerName: 'companyName',
    cellClassName: 'companyName__cell',
    minWidth: 240,
    flex: 0.2,
    renderCell: ({ row }: { row: RequestItem }) => {
      const code = row.desiredDueTimezone
        .code as keyof typeof timezones.countries

      const timeZone = timezones.countries[code].zones[0]
      const date1 = dayjs(row.desiredDueDate).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = dayjs(date1).valueOf() - dayjs(date2).valueOf()
      let color = '#7F889B'

      if (86400000 >= remainTime && remainTime > 0) {
        color = '#FF4D49'
      }

      return (
        <Box display='flex' alignItems='center' gap='10px'>
          <StatusSquare
            style={{ margin: 0, padding: '0', marginLeft: '20px' }}
            color={color}
          />
          <Typography fontWeight={600} fontSize='14px'>
            {row.companyName}
          </Typography>
        </Box>
      )
    },
  },
  {
    field: 'category',
    headerName: 'category',
    minWidth: 340,
    flex: 0.3,
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
    minWidth: 140,
    flex: 0.2,
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
    flex: 0.3,
    cellClassName: 'desiredDueDate-date__cell',
    renderCell: ({ row }: { row: RequestItem }) => {
      const code = row.desiredDueTimezone
        .code as keyof typeof timezones.countries

      const timeZone = timezones.countries[code].zones[0]
      const date1 = dayjs(row.desiredDueDate).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = dayjs(date1).valueOf() - dayjs(date2).valueOf()
      let color = '#7F889B'

      if (86400000 >= remainTime && remainTime > 0) {
        color = '#FF4D49'
      }

      return (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          gap='8px'
          sx={{ marginLeft: '24px' }}
        >
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
    field: 'companyName',
    headerName: 'companyName',
    cellClassName: 'companyName__cell',
    minWidth: 180,
    renderCell: ({ row }: { row: RequestItem }) => {
      const code = row.desiredDueTimezone
        .code as keyof typeof timezones.countries

      const timeZone = timezones.countries[code].zones[0]
      const date1 = dayjs(row.desiredDueDate).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = dayjs(date1).valueOf() - dayjs(date2).valueOf()
      let color = '#7F889B'

      if (86400000 >= remainTime && remainTime > 0) {
        color = '#FF4D49'
      }

      return (
        <Box display='flex' alignItems='center' gap='10px'>
          <StatusSquare
            style={{ margin: 0, padding: '0', marginLeft: '20px' }}
            color={color}
          />
          <Typography fontWeight={600} fontSize='14px'>
            {row.companyName}
          </Typography>
        </Box>
      )
    },
  },
  {
    field: 'category',
    headerName: 'category',
    minWidth: 340,
    flex: 1,
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
    minWidth: 220,

    cellClassName: 'desiredDueDate-date__cell',
    renderCell: ({ row }: { row: RequestItem }) => {
      const code = row.desiredDueTimezone
        .code as keyof typeof timezones.countries

      const timeZone = timezones.countries[code].zones[0]
      const date1 = dayjs(row.desiredDueDate).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = dayjs(date1).valueOf() - dayjs(date2).valueOf()
      let color = '#7F889B'

      console.log(remainTime)
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

// "id": 33,
//   "jobType": "Documents/Text",
//   "role": "Translator",
//   "sourceLanguage": "ko",
//   "targetLanguage": "en",
//   "openings": 1,
//   "dueAt": "2023-05-30T06:00:00.000Z",
//   "dueTimezone": "KR",
//   "deadlineWarning": false

export const RecruitingRequestColumn: GridColumns = [
  {
    field: 'sourceLanguage',
    headerName: '',
    minWidth: 180,
    flex: 0.1,
    renderCell: ({ row }: { row: RecruitingRequest }) => {
      const code = row.dueTimezone as keyof typeof timezones.countries

      const timeZone = timezones.countries[code]?.zones[0]
      const date1 = dayjs(row.dueAt).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = dayjs(date1).valueOf() - dayjs(date2).valueOf()
      let color = '#7F889B'

      if (86400000 >= remainTime && remainTime > 0) {
        color = '#FF4D49'
      }

      return (
        <Box display='flex' alignItems='center' gap='10px'>
          <StatusSquare
            style={{ margin: 0, padding: '0', marginLeft: '20px' }}
            color={color}
          />
          <Typography
            fontWeight={600}
            fontSize='16px'
            sx={{ textTransform: 'uppercase' }}
          >
            {`${row.sourceLanguage} -> ${row.targetLanguage}`}
          </Typography>
        </Box>
      )
    },
  },
  {
    field: 'jobType',
    headerName: '',
    minWidth: 320,
    flex: 0.4,
    renderCell: ({ row }: { row: RecruitingRequest }) => {
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
            {row.role ? <RoleChip type={row.role} label={row.role} /> : '-'}
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
    field: 'openings',
    headerName: '',
    flex: 0.2,
    renderCell: ({ row }: { row: RecruitingRequest }) => (
      <Box display='flex' alignItems='center' gap='8px'>
        <Person />
        <Typography fontSize='16px'>{`${row.openings} person`}</Typography>
      </Box>
    ),
  },
  {
    field: 'dueAt',
    headerName: '',
    flex: 0.3,
    renderCell: ({ row }: { row: RecruitingRequest }) => {
      const code = row.dueTimezone as keyof typeof timezones.countries

      const timeZone = timezones.countries[code]?.zones[0]
      const date1 = dayjs(row.dueAt).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = dayjs(date1).valueOf() - dayjs(date2).valueOf()
      let color = '#7F889B'

      if (86400000 >= remainTime && remainTime > 0) {
        color = '#FF4D49'
      }

      return (
        <Box display='flex' alignItems='center' gap='8px'>
          <Inbox />
          <Typography fontSize='16px' sx={{ width: '100%', color }}>
            {row.dueAt && timeZone
              ? `${moment(row.dueAt).tz(timeZone)?.format('MM/DD/YYYY (z)')}`
              : '-'}
          </Typography>
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
    renderCell: () => {
      return <Box sx={{ textAlign: 'center' }}>23423</Box>
    },
  },
  {
    field: 'jobType',
    headerName: 'Job type',
    minWidth: 180,
    flex: 1,
    renderHeader: () => <Box>Job type</Box>,
    renderCell: () => {
      return <Box sx={{ textAlign: 'center' }}>23423</Box>
    },
  },
  {
    field: 'role',
    headerName: 'Role',
    minWidth: 240,
    flex: 1,
    sortable: false,
    renderHeader: () => <Box>Role</Box>,
    renderCell: () => {
      return <Box sx={{ textAlign: 'center' }}>23423</Box>
    },
  },
  {
    field: 'pros',
    headerName: 'Pros',
    minWidth: 140,

    sortable: false,
    renderHeader: () => <Box>Pros</Box>,
    renderCell: () => {
      return <Box sx={{ textAlign: 'center' }}>23423</Box>
    },
  },
  {
    field: 'ratio',
    headerName: '%',
    minWidth: 110,

    sortable: false,
    renderHeader: () => <Box>%</Box>,
    renderCell: () => {
      return <Box sx={{ textAlign: 'center' }}>23423</Box>
    },
  },
]

export const upcomingColumns: GridColumns = [
  {
    flex: 0.2,
    minWidth: 180,
    field: 'corporationId',
    headerName: 'Job Number',
    renderHeader: () => <Box>Job Number</Box>,
    renderCell: ({ row }) => (
      <Link href={''}>
        <Typography fontSize='14px' sx={{ textDecoration: 'underline' }}>
          {row.corporationId}
        </Typography>
      </Link>
    ),
  },
  {
    flex: 0.5,
    minWidth: 250,
    field: 'jobName',
    headerName: 'Job name',
    renderHeader: () => <Box>Job name</Box>,
    renderCell: ({ row }) => (
      <Typography fontSize='14px' fontWeight={600}>
        23432
      </Typography>
    ),
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: 'dueAt',
    headerName: 'dueAt',
    renderHeader: () => <Box>Job due Date / Time left</Box>,
    renderCell: ({ row }) => <Typography fontSize='14px'>23432</Typography>,
  },
]

export const ReceivableColumns: GridColumns = [
  {
    field: 'corporationId',
    headerName: 'No',
    minWidth: 192,
    renderHeader: () => <Box>No.</Box>,
    renderCell: ({ row }: { row: LongStandingReceivableItem }) => {
      return <Box>{row.corporationId}</Box>
    },
  },
  {
    field: 'status',
    headerName: 'status',
    minWidth: 192,
    renderHeader: () => <Box>Status</Box>,
    renderCell: ({ row }: { row: LongStandingReceivableItem }) => {
      return <Box>{WorkStatusChip(row.status)}</Box>
    },
  },
  {
    field: 'clientName',
    headerName: 'client / Email',
    minWidth: 220,
    renderHeader: () => <Box>Client / Email</Box>,
    renderCell: ({ row }: { row: LongStandingReceivableItem }) => {
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
    renderCell: ({ row }: { row: LongStandingReceivableItem }) => {
      return <div>{row.projectName}</div>
    },
  },
  {
    field: 'category',
    headerName: 'Category / Service type',
    minWidth: 320,
    flex: 1,
    renderHeader: () => <Box>Category / Service type</Box>,
    renderCell: ({ row }: { row: LongStandingReceivableItem }) => {
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
  {
    field: 'totalPrice',
    headerName: 'Total price',
    minWidth: 220,
    renderHeader: () => <Box>Total price</Box>,
    renderCell: ({ row }: { row: LongStandingReceivableItem }) => {
      return <Box>{row.totalPrice.toLocaleString()}</Box>
    },
  },
]

export const PayablesColumns: GridColumns = [
  {
    field: 'id',
    headerName: 'No',
    minWidth: 192,
    renderHeader: () => <Box>No.</Box>,
    renderCell: ({ row }: { row: LongStandingPayablesItem }) => {
      return <Box>{row.corporationId}</Box>
    },
  },
  {
    field: 'status',
    headerName: 'status',
    minWidth: 192,
    renderHeader: () => <Box>Status</Box>,
    renderCell: ({ row }: { row: LongStandingPayablesItem }) => {
      return <Box>{row.status}</Box>
    },
  },
  {
    field: 'proName',
    headerName: 'Pro / Email',
    minWidth: 220,
    renderHeader: () => <Box>Pro / Email</Box>,
    renderCell: ({ row }: { row: LongStandingPayablesItem }) => {
      return (
        <Box>
          <Typography fontSize='14px' fontWeight={600}>
            {`${row.pro?.firstName || '-'} ${row.pro?.middleName || '-'} ${
              row.pro?.lastName || '-'
            }` || '-'}
          </Typography>
          <Typography color='#4C4E6499' fontSize='14px'>
            {row.pro.email || '-'}
          </Typography>
        </Box>
      )
    },
  },
  {
    field: 'invoiceDate',
    headerName: 'invoicedAt',
    minWidth: 220,
    renderHeader: () => <Box>Invoice date</Box>,
    renderCell: ({ row }: { row: LongStandingPayablesItem }) => {
      return <div>{row.invoicedAt}</div>
    },
  },
  {
    field: 'paymentDueDate',
    headerName: 'payDueAt',
    minWidth: 220,
    renderHeader: () => <Box>Payment due</Box>,
    renderCell: ({ row }: { row: LongStandingPayablesItem }) => {
      return <div>{row.payDueAt}</div>
    },
  },
  {
    field: 'totalPrice',
    headerName: 'Total price',
    minWidth: 220,
    renderHeader: () => <Box>Total price</Box>,
    renderCell: ({ row }: { row: LongStandingPayablesItem }) => {
      return <Box>{row.totalPrice.toLocaleString()}</Box>
    },
  },
]
