import { Icon } from '@iconify/react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  JobTypeChip,
  ProStatusChip,
  RoleChip,
} from '@src/@core/components/chips/chips'
import { ClientUserType, UserDataType } from '@src/context/types'
import LegalNameEmail, {
  LegalName,
} from 'src/pages/[companyName]/onboarding/components/list/list-item/legalname-email'

import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import {
  ProFilterType,
  ProListCellType,
  ProListFilterType,
  ProListType,
} from '@src/types/pro/list'

import { Dispatch, SetStateAction } from 'react'
import { Loadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import { styled } from '@mui/system'

import { FilterKey, saveUserFilters } from '@src/shared/filter-storage'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { GridColDef } from '@mui/x-data-grid-pro'
import ListResume from 'src/pages/[companyName]/pro/list/list/list-resume'
import JobTypeRole from 'src/pages/[companyName]/components/job-type-role-chips'

export const getProListColumns = (
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
  timezone: Loadable<
    {
      offset: number
      offsetFormatted: string
      timezone: string
      timezoneCode: string
    }[]
  >,
  setIsHoverId: Dispatch<SetStateAction<boolean>>,
  isHoverId: boolean,
  idOrder: boolean,
  setIdOrder: Dispatch<SetStateAction<boolean>>,
  setFilters: Dispatch<SetStateAction<ProListFilterType | null>>,
  setIsSorting: Dispatch<SetStateAction<boolean>>,
  filters: ProListFilterType,
  setIsDateHoverId: Dispatch<SetStateAction<boolean>>,
  isDateHoverId: boolean,
  dateOrder: boolean,
  setDateOrder: Dispatch<SetStateAction<boolean>>,
  defaultFilter: ProFilterType,
  onClickFile: (
    file: {
      id: number
      url: string
      filePath: string
      fileName: string
      fileExtension: string
    },
    fileType: string,
  ) => void,
) => {
  const columns: GridColDef[] = [
    {
      flex: 0.051,
      minWidth: 120,
      field: 'id',
      headerName: 'No.',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Box
          onMouseOver={() => setIsHoverId(true)}
          onMouseLeave={() => setIsHoverId(false)}
          sx={{
            display: 'flex',
            minWidth: 120,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box>No.</Box>
          {isHoverId ? (
            <IconButton>
              <Icon
                icon={`mdi:${idOrder ? 'arrow-up' : 'arrow-down'}`}
                fontSize={18}
                onClick={() => {
                  setIdOrder(!idOrder)
                  saveUserFilters(FilterKey.PRO_LIST, {
                    ...defaultFilter,
                    sortDate: undefined,
                    sortId: idOrder ? 'ASC' : 'DESC',
                  })
                  setFilters(prevState => {
                    const { sortDate, ...filteredState } = prevState!

                    return {
                      ...filteredState,
                      sortDate: undefined,
                      sortId: idOrder ? 'ASC' : 'DESC',
                    }
                  })
                }}
              />
            </IconButton>
          ) : null}
        </Box>
      ),
    },
    {
      flex: 0.1019,
      minWidth: 240,
      field: 'name',
      headerName: 'Legal name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      cellClassName: 'highlight-cell',
      renderHeader: () => <Box>Legal name</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return (
          <LegalName
            row={{
              isOnboarded: row.isOnboarded,
              isActive: row.isActive,
              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
            }}
          />
        )
      },
    },
    {
      flex: 0.1019,
      minWidth: 240,
      field: 'email',
      headerName: 'Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Email</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return (
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {row.email}
          </Typography>
        )
      },
    },
    {
      minWidth: 155,
      flex: 0.0616,
      field: 'resume',
      headerName: 'Resume',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Resume</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return (
          <ListResume
            resume={row.resume}
            onClickFile={onClickFile}
          ></ListResume>
        )
      },
    },
    {
      flex: 0.0764,
      minWidth: 180,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: ProListCellType) => {
        const label =
          row.status === 'Onboard'
            ? 'Onboarded'
            : row.status === 'Off-board'
              ? 'Offboarded'
              : row.status
        return <ProStatusChip status={row.status} label={label} />
      },
    },

    {
      flex: 0.1019,
      minWidth: 240,
      field: 'languages',
      headerName: 'Language pair',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: ProListCellType) => (
        <Box>
          {row.jobInfo && row.jobInfo.length ? (
            <Box key={row.id}>
              <Typography
                variant='body2'
                fontWeight={400}
                sx={{ color: '#4C4E64' }}
              >
                {row.jobInfo[0].source && row.jobInfo[0].target ? (
                  <>
                    {row.jobInfo[0].source.toUpperCase()} &rarr;{' '}
                    {row.jobInfo[0].target.toUpperCase()}
                  </>
                ) : (
                  '-'
                )}
              </Typography>
            </Box>
          ) : (
            '-'
          )}
        </Box>
      ),
    },
    {
      flex: 0.1529,
      minWidth: 360,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Roles</Box>,
      renderCell: ({ row }: ProListCellType) => {
        if (row.jobInfo && row.jobInfo.length) {
          setIsSorting(true)
          row.jobInfo.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return dateB - dateA
          })

          // 필터에 Source, Target, jobType, role이 있는 경우 매칭되는 jobInfo를 jobInfo의 0번째 인덱스로 이동시켜
          // 리스트에서 Job type/Role, Language Pair를 볼수있게 처리
          const sourceFilters = filters?.source || []
          const targetFilters = filters?.target || []
          // const jobTypeFilters = filters.jobType || []
          const roleFilters = filters?.role || []

          row.jobInfo.some((value, idx) => {
            const source = value.source || ''
            const target = value.target || ''
            const jobType = value.jobType || ''
            const role = value.role || ''
            if (
              (sourceFilters.length === 0 || sourceFilters.includes(source)) &&
              (targetFilters.length === 0 || targetFilters.includes(target)) &&
              // (jobTypeFilters.length === 0 ||
              //   jobTypeFilters.includes(jobType)) &&
              (roleFilters.length === 0 || roleFilters.includes(role))
            ) {
              const dummy = row.jobInfo[idx]
              for (let i = idx; i > 0; i--) {
                row.jobInfo[i] = row.jobInfo[i - 1]
              }
              row.jobInfo[0] = dummy
              return true
            }
            return false
          })
          setIsSorting(false)
        }
        const jobInfo = row.jobInfo.map(value => ({
          jobType: '',
          role: value.role,
        }))
        const seenRoles = new Set()
        const uniqueJobInfo = jobInfo.filter(item => {
          if (!seenRoles.has(item.role)) {
            seenRoles.add(item.role)
            return true
          }
          return false
        })
        return <JobTypeRole jobInfo={uniqueJobInfo} visibleType='role' />
      },
    },
    {
      flex: 0.0807,
      minWidth: 190,
      field: 'clients',
      headerName: 'Clients',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Clients</Box>,
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
      flex: 0.0807,
      minWidth: 190,
      field: 'experience',
      headerName: 'Years of experience',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Years of experience</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return (
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {row.experience}
          </Typography>
        )
      },
    },
    {
      flex: 0.0849,
      minWidth: 200,
      field: 'timezone',
      headerName: `Pro's timezone`,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Pro's timezone</Box>,
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
      minWidth: 250,
      flex: 0.1062,
      field: 'onboardedAt',
      headerName: 'Date of onboarded',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Box
          onMouseOver={() => setIsDateHoverId(true)}
          onMouseLeave={() => setIsDateHoverId(false)}
          sx={{
            display: 'flex',
            minWidth: 180,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box>Date of onboarded</Box>
          {isDateHoverId ? (
            <IconButton>
              <Icon
                icon={`mdi:${dateOrder ? 'arrow-up' : 'arrow-down'}`}
                fontSize={18}
                onClick={() => {
                  setDateOrder(!dateOrder)
                  saveUserFilters(FilterKey.PRO_LIST, {
                    ...defaultFilter,
                    sortId: undefined,
                    sortDate: dateOrder ? 'ASC' : 'DESC',
                  })
                  setFilters(prevState => {
                    const { sortId, ...filteredState } = prevState!

                    return {
                      ...filteredState,
                      sortId: undefined,
                      sortDate: dateOrder ? 'ASC' : 'DESC',
                    }
                  })
                }}
              />
            </IconButton>
          ) : null}
        </Box>
      ),
      renderCell: ({ row }: ProListCellType) => {
        return (
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {convertTimeToTimezone(
              row.onboardedAt,
              auth.getValue().user?.timezone!,
              timezone.getValue(),
            )}
          </Typography>
        )
      },
    },
  ]
  return columns
}

const CountChip = styled('p')`
  padding: 3px 4px;
  text-align: center;
  width: 40px;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #6d788d;
  border: 1px solid rgba(76, 78, 100, 0.6);
  border-radius: 16px;
  font-weight: 500;
  font-size: 0.813rem;
`
