import { GridColumns } from '@mui/x-data-grid'
import {
  ApplicationItem,
  JobItem,
  JobTypeAndRole,
  LongStandingPayablesItem,
  LongStandingReceivableItem,
  OrderItem,
  RecruitingRequest,
  RequestItem,
  UpcomingItem,
} from '@src/types/dashboard'
import { CurrencyUnit, StatusSquare } from '@src/views/dashboard/dashboardItem'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { timezones } from '@src/@fake-db/autocomplete'
import Typography from '@mui/material/Typography'

import {
  ExtraNumberChip,
  invoicePayableStatusChip,
  InvoiceReceivableChip,
  JobsStatusChip,
  JobTypeChip,
  OrderStatusChip,
  RoleChip,
  ServiceTypeChip,
  TestStatusChip,
} from '@src/@core/components/chips/chips'
import { Box } from '@mui/material'
import { Inbox, Person } from '@mui/icons-material'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import moment from 'moment-timezone'
import Link from 'next/link'
import {
  InvoiceReceivable,
  InvoiceStatusList,
  JobStatusList,
  OrderChipLabel,
} from '@src/shared/const/dashboard/chip'
import { JobStatusType } from '@src/types/jobs/jobs.type'
import { InvoiceReceivableStatusType } from '@src/types/invoice/common.type'
import { TestStatusColor } from '@src/shared/const/chipColors'

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

      const timeZone = timezones.countries[code]?.zones[0]
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
      if (
        !row?.category &&
        (!row?.serviceType || row.serviceType?.length === 0)
      ) {
        return <Box>-</Box>
      }
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
              <JobTypeChip
                size='small'
                type={row.category}
                label={row.category}
              />
            ) : (
              '-'
            )}
            {row.serviceType?.length !== 0 ? (
              <ServiceTypeChip size='small' label={row.serviceType} />
            ) : (
              '-'
            )}
            {row.serviceType?.length > 1 ? (
              <ExtraNumberChip
                size='small'
                label={`+ ${row.serviceType?.length - 1}`}
              />
            ) : null}
          </Box>
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
      let color = '#7F889B'
      const code = row.desiredDueTimezone
        .code as keyof typeof timezones.countries

      if (!code) {
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
            ).format('MM/DD/YYYY hh:mm A')}`}</Typography>
          </Box>
        )
      }

      const timeZone = timezones.countries[code]?.zones[0]
      const date1 = dayjs(row.desiredDueDate).tz(timeZone)
      const date2 = dayjs().tz(timeZone)
      const remainTime = dayjs(date1).valueOf() - dayjs(date2).valueOf()

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
            ?.format('MM/DD/YYYY hh:mm A (z)')}`}</Typography>
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
              <JobTypeChip
                size='small'
                type={row.jobType}
                label={row.jobType}
              />
            ) : (
              '-'
            )}
            {row.role ? (
              <RoleChip size='small' type={row.role} label={row.role} />
            ) : (
              '-'
            )}
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
    minWidth: 160,
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
    minWidth: 180,
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
      const label =
        typeof row?.status === 'number'
          ? OrderChipLabel[row?.status]
          : row?.status
      return (
        <Box>
          <OrderStatusChip
            size='small'
            status={row?.status}
            label={label || '-'}
          />
        </Box>
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
      return <Box>{row.projectName}</Box>
    },
  },
  {
    field: 'category',
    headerName: 'Category / Service type',
    minWidth: 320,
    flex: 1,
    renderHeader: () => <Box>Category / Service type</Box>,
    renderCell: ({ row }: { row: OrderItem }) => {
      if (
        !row?.category &&
        (!row?.serviceType || row.serviceType?.length === 0)
      ) {
        return <Box>-</Box>
      }
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
              <JobTypeChip
                size='small'
                type={row.category}
                label={row.category}
              />
            ) : (
              '-'
            )}
            {row.serviceType?.length !== 0 ? (
              <ServiceTypeChip size='small' label={row.serviceType} />
            ) : (
              '-'
            )}
            {row.serviceType?.length > 1 ? (
              <ExtraNumberChip
                size='small'
                label={`+ ${row.serviceType?.length - 1}`}
              />
            ) : null}
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
    renderCell: ({ row }: { row: OrderItem }) => {
      const status = row?.status as JobStatusType
      return <div>{JobsStatusChip(status, JobStatusList)}</div>
    },
  },
  {
    field: 'proName',
    headerName: 'Pro / Email',
    minWidth: 192,
    renderHeader: () => <Box>Pro / Email</Box>,
    renderCell: ({ row }: { row: JobItem }) => {
      if (!row.pro?.firstName && !row.pro?.middleName && !row.pro?.lastName) {
        return <Box>-</Box>
      }
      let name = '-'

      if (row.pro?.firstName && row.pro?.lastName && !row.pro?.middleName) {
        name = `${row.pro?.firstName} ${row.pro?.lastName}`
      }

      if (row.pro?.firstName && row.pro?.lastName && row.pro?.middleName) {
        name = `${row.pro?.firstName} ${row.pro?.middleName} ${row.pro?.lastName}`
      }
      return (
        <Box>
          <Typography fontSize='14px' fontWeight={600}>
            {name}
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
      return <Box>{row?.jobName || '-'}</Box>
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

export const StatusApplicationColumns: GridColumns = [
  {
    field: 'status',
    headerName: 'status',
    minWidth: 192,
    renderHeader: () => <Box>status</Box>,
    renderCell: ({ row }: { row: ApplicationItem }) => {
      return (
        <Box>
          <TestStatusChip
            label={row.status as string}
            status={row.status as string}
          />
        </Box>
      )
    },
  },
  {
    field: 'proName',
    headerName: 'Legal name / Email',
    minWidth: 192,
    renderHeader: () => <Box>Legal name / Email</Box>,
    renderCell: ({ row }: { row: ApplicationItem }) => {
      if (!row.pro?.firstName && !row.pro?.middleName && !row.pro?.lastName) {
        return (
          <Box>
            <Typography fontSize='14px' fontWeight={600}>
              -
            </Typography>
            <Typography color='#4C4E6499' fontSize='14px'>
              {row.pro?.email || '-'}
            </Typography>
          </Box>
        )
      }
      let name = '-'

      if (row.pro?.firstName && row.pro?.lastName && !row.pro?.middleName) {
        name = `${row.pro?.firstName} ${row.pro?.lastName}`
      }

      if (row.pro?.firstName && row.pro?.lastName && row.pro?.middleName) {
        name = `${row.pro?.firstName} ${row.pro?.middleName} ${row.pro?.lastName}`
      }
      return (
        <Box>
          <Typography fontSize='14px' fontWeight={600}>
            {name}
          </Typography>
          <Typography color='#4C4E6499' fontSize='14px'>
            {row.pro?.email || '-'}
          </Typography>
        </Box>
      )
    },
  },
  {
    field: 'jobType',
    headerName: 'Job Type/ Role',
    minWidth: 220,
    flex: 0.4,
    renderHeader: () => <Box>Job Type/ Role</Box>,
    renderCell: ({ row }: { row: ApplicationItem }) => {
      return (
        <Box display='flex' gap='10px'>
          <JobTypeChip size='small' type={row.jobType} label={row.jobType} />
          <RoleChip size='small' type={row.role || ''} label={row.role || ''} />
        </Box>
      )
    },
  },
  {
    field: 'sourceLanguage',
    headerName: 'Language pair',
    minWidth: 220,
    flex: 0.4,
    renderHeader: () => <Box>Language pair</Box>,
    renderCell: ({ row }: { row: ApplicationItem }) => {
      return (
        <Box display='flex' gap='10px'>
          {`${row.sourceLanguage.toUpperCase()} -> ${row.targetLanguage.toUpperCase()}`}
        </Box>
      )
    },
  },
]
export const JobTableColumn: GridColumns = [
  {
    field: 'numbering',
    headerName: '',
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ row }: { row: JobTypeAndRole }) => {
      return <Box sx={{ textAlign: 'center' }}>{row?.numbering}</Box>
    },
  },
  {
    field: 'jobType',
    headerName: 'Job type',
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    minWidth: 180,
    flex: 1,
    renderHeader: () => <Box>Job type</Box>,
    renderCell: ({ row }: { row: JobTypeAndRole }) => {
      return (
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          gap='10px'
          sx={{ width: '180px' }}
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
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    minWidth: 240,
    flex: 1,
    renderHeader: () => <Box>Role</Box>,
    renderCell: ({ row }: { row: JobTypeAndRole }) => {
      return (
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          gap='10px'
          sx={{ width: '180px' }}
        >
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
        </Box>
      )
    },
  },
  {
    field: 'pros',
    headerName: 'Pros',
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    minWidth: 140,
    renderHeader: () => <Box>Pros</Box>,
    renderCell: ({ row }: { row: JobTypeAndRole }) => {
      return <Box sx={{ textAlign: 'center' }}>{row.count}</Box>
    },
  },
  {
    field: 'ratio',
    headerName: '%',
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    minWidth: 110,
    renderHeader: () => <Box>%</Box>,
    renderCell: ({ row }: { row: JobTypeAndRole }) => {
      return <Box sx={{ textAlign: 'center' }}>{row.ratio}%</Box>
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
    renderCell: ({ row }: { row: UpcomingItem }) => (
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
    renderCell: ({ row }: { row: UpcomingItem }) => (
      <Typography fontSize='14px' fontWeight={600}>
        {row?.name || '-'}
      </Typography>
    ),
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: 'dueAt',
    headerName: 'dueAt',
    renderHeader: () => <Box>Job due Date / Time left</Box>,
    renderCell: ({ row }: { row: UpcomingItem }) => (
      <Typography fontSize='14px'>23432</Typography>
    ),
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
      const status = row.status as InvoiceReceivableStatusType
      if (!status) return <Box>-</Box>
      return (
        <Box>{InvoiceReceivableChip(InvoiceReceivable[status], status)}</Box>
      )
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
      if (
        !row?.category &&
        (!row?.serviceType || row.serviceType?.length === 0)
      ) {
        return <Box>-</Box>
      }
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
              <JobTypeChip
                size='small'
                type={row.category}
                label={row.category}
              />
            ) : (
              '-'
            )}
            {row.serviceType?.length !== 0 ? (
              <ServiceTypeChip size='small' label={row.serviceType} />
            ) : (
              '-'
            )}
            {row.serviceType?.length > 1 ? (
              <ExtraNumberChip
                size='small'
                label={`+ ${row.serviceType?.length - 1}`}
              />
            ) : null}
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
      return (
        <Box>
          {CurrencyUnit[row.currency]}
          {row.totalPrice.toLocaleString()}
        </Box>
      )
    },
  },
]

export const InvoiceColumns: GridColumns = [
  ...ReceivableColumns.slice(0, 2),
  {
    field: 'clientName',
    headerName: 'LSP / Email',
    minWidth: 220,
    renderHeader: () => <Box>LSP / Email</Box>,
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
  ...ReceivableColumns.slice(3, 6),
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
    renderCell: ({ row }: { row: LongStandingReceivableItem }) => {
      const status = row.status as number
      return <Box>{invoicePayableStatusChip(status, InvoiceStatusList)}</Box>
    },
  },
  {
    field: 'proName',
    headerName: 'Pro / Email',
    minWidth: 220,
    renderHeader: () => <Box>Pro / Email</Box>,
    renderCell: ({ row }: { row: LongStandingPayablesItem }) => {
      if (!row.pro?.firstName && !row.pro?.middleName && !row.pro?.lastName) {
        return <Box>-</Box>
      }
      let name = '-'

      if (row.pro?.firstName && row.pro?.lastName && !row.pro?.middleName) {
        name = `${row.pro?.firstName} ${row.pro?.lastName}`
      }

      if (row.pro?.firstName && row.pro?.lastName && row.pro?.middleName) {
        name = `${row.pro?.firstName} ${row.pro?.middleName} ${row.pro?.lastName}`
      }
      return (
        <Box>
          <Typography fontSize='14px' fontWeight={600}>
            {name}
          </Typography>
          <Typography color='#4C4E6499' fontSize='14px'>
            {row.pro?.email || '-'}
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
      if (!row.invoicedAt) return <div>-</div>
      if (!row.invoicedTimezone) {
        return (
          <div>{`${
            dayjs(row.invoicedAt).format('MM/DD/YYYY hh:mm A') || '-'
          }`}</div>
        )
      }

      const code = row.invoicedTimezone
        ?.code as keyof typeof timezones.countries

      const timeZone = timezones.countries[code].zones[0]
      console.log(timeZone)
      const date = moment(row.invoicedAt)
        .tz(timeZone)
        .format('MM/DD/YYYY hh:mm A (z)')

      return <div>{`${date || '-'}`}</div>
    },
  },
  {
    field: 'paymentDueDate',
    headerName: 'payDueAt',
    minWidth: 220,
    renderHeader: () => <Box>Payment due</Box>,
    renderCell: ({ row }: { row: LongStandingPayablesItem }) => {
      if (!row.payDueAt) return <div>-</div>
      if (!row.payDueTimezone) {
        return (
          <div>{`${
            dayjs(row.payDueAt).format('MM/DD/YYYY hh:mm A') || '-'
          }`}</div>
        )
      }

      const code = row.payDueTimezone?.code as keyof typeof timezones.countries

      const timeZone = timezones.countries[code].zones[0]
      const date = moment(row.payDueAt)
        .tz(timeZone)
        .format('MM/DD/YYYY hh:mm A (z)')

      return <div>{`${date || '-'}`}</div>
    },
  },
  {
    field: 'totalPrice',
    headerName: 'Total price',
    minWidth: 220,
    renderHeader: () => <Box>Total price</Box>,
    renderCell: ({ row }: { row: LongStandingPayablesItem }) => {
      return (
        <Box>
          {CurrencyUnit[row.currency]}
          {row.totalPrice.toLocaleString()}
        </Box>
      )
    },
  },
]
