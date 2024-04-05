import { Icon } from '@iconify/react'
import { Badge, Box, IconButton, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  ProJobStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import useModal from '@src/hooks/useModal'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { authState } from '@src/states/auth'
import { ProJobListType } from '@src/types/jobs/jobs.type'
import dayjs from 'dayjs'
import { useRecoilValueLoadable } from 'recoil'
import React, { MouseEvent } from 'react'
import { timezoneSelector } from '@src/states/permission'
import InfoDialogButton, { InfoDialogProps } from '@src/views/pro/infoDialog'
import Message from '@src/views/jobDetails/messageModal'

const AwaitingPriorJobProps: InfoDialogProps = {
  title: 'Awaiting prior job',
  alertType: 'question-info',
  iconName: 'fe:question',
  contents:
    'This state indicates that the previous job is waiting for completion. Once the previous job is finished, this job can start.',
}

const RedeliveryProps: InfoDialogProps = {
  title: 'Reason for redelivery',
  alertType: 'question-info',
  iconName: 'fe:question',
  contents: (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '16px',
      }}
    >
      <Box component='ul' sx={{ listStyle: 'inside' }}>
        <li>Did not follow the guidelines/glossary Typo</li>
        <li>Timecode sync-error (video translation)</li>
      </Box>
      <Typography
        variant='h6'
        textAlign='center'
        mt='10px'
        color='rgba(76, 78, 100, 0.87)'
        margin='8px 0'
      >
        Message from LPM
      </Typography>
      <p>Please check the attached guidelines and glossary.</p>
    </div>
  ),
}

export const getProJobColumns = (
  statusList: {
    value: number
    label: string
  }[],
) => {
  const { openModal, closeModal } = useModal()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const onClickMessage = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    row: ProJobListType,
  ) => {
    event.stopPropagation()
    openModal({
      type: 'ProJobsMessageModal',
      children: (
        <Message
          jobId={row.jobId}
          info={row}
          onClose={() => closeModal('ProJobsMessageModal')}
        />
      ),
    })
  }

  const getJobDateDiff = (jobDueDate: string, useRemainingTime: Boolean, deliveredDate?: string) => {
    const now = deliveredDate
      ? dayjs(deliveredDate)
      : dayjs()

    const dueDate = dayjs(jobDueDate)

    const diff = dueDate.diff(now, 'second')

    const isPast = diff < 0

    const days = Math.floor(Math.abs(diff) / 86400)
    const hours = Math.floor((Math.abs(diff) % 86400) / 3600)
    const minutes = Math.floor((Math.abs(diff) % 3600) / 60)
    const seconds = diff % 60

    if (isPast) {
      return (
        <>
          <Typography
            variant='body1'
            fontWeight={600}
            fontSize={14}
            color={useRemainingTime ? '#e04440' : undefined}
          >
            {convertTimeToTimezone(
              jobDueDate,
              auth.getValue().user?.timezone,
              timezone.getValue(),
            )}
          </Typography>
          {useRemainingTime && (
            <Typography
              variant='body1'
              fontWeight={400}
              fontSize={14}
              color='#e04440'
            >{`${days > 0 ? days : ''} day(s) ${hours
              .toString()
              .padStart(2, '0')} hr(s) ${minutes
              .toString()
              .padStart(2, '0')} min(s) over`}</Typography>
          )}
        </>
      )
    } else if (!isPast && days === 0 && hours < 24) {
      return (
        <>
          <Typography variant='body1' fontWeight={600} fontSize={14}>
            {convertTimeToTimezone(
              jobDueDate,
              auth.getValue().user?.timezone,
              timezone.getValue(),
            )}
          </Typography>
          {useRemainingTime && (
            <Typography
              variant='body1'
              fontWeight={400}
              fontSize={14}
              color='#666CFF'
            >{`${hours.toString().padStart(2, '0')} hrs ${minutes
              .toString()
              .padStart(2, '0')} mins left`}</Typography>
          )}
        </>
      )
    } else if (!isPast) {
      return (
        <Typography variant='body1' fontWeight={600} fontSize={14}>
          {convertTimeToTimezone(
            jobDueDate,
            auth.getValue().user?.timezone,
            timezone.getValue(),
          )}
        </Typography>
      )
    }
  }

  const columns: GridColumns<ProJobListType> = [
    {
      flex: 0.0219,
      minWidth: 28,
      field: 'new',
      headerName: '',
      disableColumnMenu: true,
      sortable: false,

      hideSortIcons: true,
      renderCell: ({ row }: { row: ProJobListType }) => {
        return (
          <>
            {row.lightUpDot ? (
              <Badge
                variant='dot'
                color='primary'
                sx={{ marginLeft: '4px' }}
              ></Badge>
            ) : null}
          </>
        )
      },
    },
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
      flex: 0.18,
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
        const statusLabel =
          statusList?.find(i => i.value === row.status)?.label || ''

        const viewInfoIcon = [60250, 60110]
        let infoProps

        if (viewInfoIcon.includes(row.status)) {
          infoProps =
            row.status === 60250 ? RedeliveryProps : AwaitingPriorJobProps
        }

        return (
          <Box display='flex' alignItems='center'>
            {ProJobStatusChip(statusLabel, row.status)}
            {infoProps && viewInfoIcon.includes(row.status) && (
              <InfoDialogButton {...infoProps} />
            )}
          </Box>
        )
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
        return (
          <Box display='flex' gap='8px'>
            <ServiceTypeChip size='small' label={row.serviceType} />
            {row.isPreviousAndNextJob && (
              <Icon icon='ic:outline-people' fontSize={24} color='#8D8E9A' />
            )}
          </Box>
        )
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
        const status = [60100, 60200, 60300, 60400, 60500, 7000, 70100, 70300]
        return (
          <>
            {auth.state === 'hasValue' ? (
              <Box>
                {getJobDateDiff(
                  row.dueAt,
                  status.includes(row.status),
                  row.finalProDeliveredAt,
                )}
              </Box>
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
            <Badge badgeContent={row.message?.unReadCount} color='primary'>
              <IconButton
                disabled
                sx={{ padding: 0 }}
                onClick={event => onClickMessage(event, row)}
              >
                <Icon
                  icon='material-symbols:chat'
                  color='rgba(187, 188, 196, 1)'
                />
              </IconButton>
            </Badge>
          </Box>
        )
      },
    },
  ]

  return columns
}
