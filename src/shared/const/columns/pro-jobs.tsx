import { Icon } from '@iconify/react'
import { Box, IconButton, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  ProJobStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { authState } from '@src/states/auth'
import { ProJobListType } from '@src/types/jobs/jobs.type'
import dayjs from 'dayjs'
import { useRecoilValueLoadable } from 'recoil'

export const getProJobColumns = () => {
  const auth = useRecoilValueLoadable(authState)

  const getJobDateDiff = (jobDueDate: string) => {
    const now = dayjs()
    const dueDate = dayjs(jobDueDate)
    const diff = dueDate.diff(now, 'second')
    const isPast = diff < 0

    const days = Math.abs(Math.floor(diff / 86400))
    const hours = Math.abs(Math.floor((diff % 86400) / 3600))
    const minutes = Math.abs(Math.floor((diff % 3600) / 60))
    const seconds = Math.abs(diff % 60)

    if (isPast) {
      return (
        <>
          <Typography
            variant='body1'
            fontWeight={600}
            fontSize={14}
            color='#e04440'
          >
            {FullDateTimezoneHelper(jobDueDate, auth.getValue().user?.timezone)}
          </Typography>
          <Typography
            variant='body1'
            fontWeight={400}
            fontSize={14}
            color='#e04440'
          >{`Overdue by ${hours.toString().padStart(2, '0')} hrs ${minutes
            .toString()
            .padStart(2, '0')} mins`}</Typography>
        </>
      )
    } else if (!isPast && days === 0 && hours < 24) {
      return (
        <>
          <Typography variant='body1' fontWeight={600} fontSize={14}>
            {FullDateTimezoneHelper(jobDueDate, auth.getValue().user?.timezone)}
          </Typography>
          <Typography
            variant='body1'
            fontWeight={400}
            fontSize={14}
            color='#666CFF'
          >{`${hours.toString().padStart(2, '0')} hrs ${minutes
            .toString()
            .padStart(2, '0')} mins left`}</Typography>
        </>
      )
    }
  }

  const columns: GridColumns<ProJobListType> = [
    {
      flex: 0.144,
      minWidth: 180,
      field: 'corporationId',
      headerName: 'No.',
      disableColumnMenu: true,
      // hideSortIcons: true,
      sortable: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: { row: ProJobListType }) => {
        return (
          <Typography variant='body1' fontWeight={400} fontSize={14}>
            {row.corporationId}
          </Typography>
        )
      },
    },
    {
      flex: 0.1568,
      minWidth: 196,
      field: 'status',
      headerName: 'Status',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: { row: ProJobListType }) => {
        return <>{ProJobStatusChip(row.status)}</>
      },
    },
    {
      flex: 0.192,
      minWidth: 240,
      field: 'serviceType',
      headerName: 'Job',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Job
        </Typography>
      ),
      renderCell: ({ row }: { row: ProJobListType }) => {
        return <ServiceTypeChip label={row.serviceType} />
      },
    },
    {
      flex: 0.24,
      minWidth: 300,
      field: 'name',
      headerName: 'Job name',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Job name
        </Typography>
      ),
      renderCell: ({ row }: { row: ProJobListType }) => {
        return (
          <Typography variant='body1' fontWeight={600}>
            {row.name}
          </Typography>
        )
      },
    },
    {
      flex: 0.1872,
      minWidth: 234,
      field: 'jobDueDate',
      headerName: 'Job due date',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Job due date
        </Typography>
      ),
      renderCell: ({ row }: { row: ProJobListType }) => {
        return (
          <>
            {auth.state === 'hasValue' ? (
              <Box>{getJobDateDiff(row.jobDueDate)}</Box>
            ) : null}
          </>
        )
      },
    },
    {
      flex: 0.08,
      minWidth: 100,
      field: 'message',
      headerName: 'Message',
      disableColumnMenu: true,

      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Message
        </Typography>
      ),
      renderCell: ({ row }: { row: ProJobListType }) => {
        return (
          <Box sx={{ margin: '0 auto' }}>
            <IconButton
              sx={{ padding: 0 }}
              // disabled={row.assignmentStatus === null}
              // onClick={() => onClickMessage(row)}
            >
              <Icon
                icon='material-symbols:chat'
                color='rgba(76, 78, 100, 0.87)'
              />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  return columns
}
