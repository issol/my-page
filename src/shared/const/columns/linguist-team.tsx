import { Icon } from '@iconify/react'
import { Box, Tooltip, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  JobTypeChip,
  ProStatusChip,
  RoleChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import JobTypeRole from 'src/pages/[companyName]/components/job-type-role-chips'
import LegalNameEmail from 'src/pages/[companyName]/onboarding/components/list/list-item/legalname-email'

import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { LinguistTeamListType } from '@src/types/pro/linguist-team'
import { ProListCellType, ProListType } from '@src/types/pro/list'
import { Loadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

type CellType = {
  row: LinguistTeamListType
}

export const getLinguistTeamColumns = (
  serviceTypeList: Array<{
    value: number
    label: string
  }>,
  clientList: Array<{
    clientId: number
    name: string
  }>,
) => {
  const columns: GridColumns<LinguistTeamListType> = [
    {
      field: 'corporationId',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' fontWeight={400} fontSize={14}>
            {row.corporationId}
          </Typography>
        )
      },
    },
    {
      field: 'name',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Team name
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {row.isPrivate ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: '5px',
                  background: '#F7F7F9',
                }}
              >
                <Icon icon='mdi:lock' color='#8D8E9A' />
              </Box>
            ) : null}
            <Typography variant='body1' fontWeight={600}>
              {row.name}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'client',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Client
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body1'>
            {clientList?.find(value => value.clientId === row.clientId)?.name ??
              '-'}
          </Typography>
        )
      },
    },
    {
      field: 'serviceType',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Service type
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <ServiceTypeChip
              label={
                serviceTypeList.find(i => i.value === row.serviceTypeId)
                  ?.label || ''
              }
            />
          </Box>
        )
      },
    },
    {
      field: 'languagePair',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Language pair
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body1' fontWeight={600}>
            {row.sourceLanguage?.toUpperCase()} &rarr;{' '}
            {row.targetLanguage?.toUpperCase()}
          </Typography>
        )
      },
    },

    {
      field: 'numberOfLinguist',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Number of linguist
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body1' fontWeight={400} fontSize={12}>
            {row.pros.length ?? 0}
          </Typography>
        )
      },
    },
  ]

  return columns
}

export const getLinguistTeamProColumns = (
  isPriorityMode: boolean,
  modal: boolean = false,
  type: 'create' | 'edit' | 'detail',
  timezone: Loadable<
    {
      offset: number
      offsetFormatted: string
      timezone: string
      timezoneCode: string
    }[]
  >,
) => {
  const columns: GridColumns<ProListType> = [
    {
      flex: type === 'detail' && isPriorityMode ? 0.032 : 0.0584,
      field: 'move',
      disableColumnMenu: true,
      sortable: false,
      hide: isPriorityMode ? false : true,
      renderHeader: () => <></>,
      renderCell: () => <></>,
    },
    {
      flex: 0.248,
      field: 'name',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Legal name / Email
        </Typography>
      ),
      renderCell: ({ row }: ProListCellType) => {
        return (
          <LegalNameEmail
            row={{
              isOnboarded: row.isOnboarded,
              isActive: row.isActive,

              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
              email: row.email,
            }}
            link={
              type === 'detail' ? `/pro/list/detail/${row.userId}` : undefined
            }
          />
        )
      },
    },
    {
      flex: 0.144,
      field: 'status',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: ProListCellType) => {
        return <ProStatusChip status={row.status} label={row.status} />
      },
    },
    {
      flex: 0.144,
      field: 'client',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Client
        </Typography>
      ),
      renderCell: ({ row }: ProListCellType) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {!row.clients?.length
              ? '-'
              : row.clients?.map(
                  (item, idx) =>
                    idx < 2 && (
                      <Box
                        key={uuidv4()}
                        sx={{
                          display: 'flex',
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '150px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.client}{' '}
                          {idx === 0 && row.clients.length > 1 && ','}&nbsp;
                        </Box>
                      </Box>
                    ),
                )}
            {row.clients?.length > 1 ? (
              <Box>+{row.clients?.length - 1}</Box>
            ) : null}
          </Box>
        )
      },
    },
    {
      flex: 0.264,
      field: 'jobTypeRole',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Roles
        </Typography>
      ),
      renderCell: ({ row }: ProListCellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {row.jobInfo && row.jobInfo.length ? (
              <>
                {/* <JobTypeChip
                  type={row.jobInfo[0]?.jobType}
                  label={row.jobInfo[0]?.jobType}
                /> */}
                {/* <RoleChip
                  type={row.jobInfo[0]?.role}
                  label={row.jobInfo[0]?.role}
                /> */}
                <JobTypeRole jobInfo={row.jobInfo} visibleType='role' />
              </>
            ) : (
              '-'
            )}
          </Box>
        )
      },
    },
    {
      flex: type === 'detail' ? 0.168 : isPriorityMode ? 0.0936 : 0.152,
      field: 'experience',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography
          variant='subtitle1'
          fontWeight={500}
          fontSize={14}
          sx={{
            overflow: 'hidden',
            wordWrap: 'break-word',
            // overflowWrap: 'break-word',
            height: '100%',
          }}
        >
          Pro's timezone
        </Typography>
      ),
      renderCell: ({ row }: ProListCellType) => {
        return (
          <Tooltip
            title={timeZoneFormatter(row.timezone, timezone.getValue()) || '-'}
          >
            <Typography
              variant='body2'
              fontWeight={400}
              sx={{
                color: '#4C4E64',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {timeZoneFormatter(row.timezone, timezone.getValue()) || '-'}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.048,
      field: 'action',
      disableColumnMenu: true,
      sortable: false,
      hide: type === 'detail' ? true : false,
      renderHeader: () => <></>,
      renderCell: () => <></>,
    },
  ]

  return columns
}
