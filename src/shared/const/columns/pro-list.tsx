import { Icon } from '@iconify/react'
import { Box, IconButton, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  JobTypeChip,
  ProStatusChip,
  RoleChip,
} from '@src/@core/components/chips/chips'
import { ClientUserType, UserDataType } from '@src/context/types'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import ListResume from '@src/pages/pro/list/list/list-resume'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import {
  ProListCellType,
  ProListFilterType,
  ProListType,
} from '@src/types/pro/list'
import { TimeZoneType } from '@src/types/sign/personalInfoTypes'
import { Dispatch, SetStateAction } from 'react'
import { Loadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

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
  setFilters: Dispatch<SetStateAction<ProListFilterType>>,
  setIsSorting: Dispatch<SetStateAction<boolean>>,
  filters: ProListFilterType,
  setIsDateHoverId: Dispatch<SetStateAction<boolean>>,
  isDateHoverId: boolean,
  dateOrder: boolean,
  setDateOrder: Dispatch<SetStateAction<boolean>>,
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
  const columns: GridColumns<ProListType> = [
    {
      field: 'id',
      minWidth: 120,
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
            minWidth: 80,
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
                  setFilters(prevState => ({
                    ...prevState,
                    sortId: idOrder ? 'ASC' : 'DESC',
                  }))
                }}
              />
            </IconButton>
          ) : null}
        </Box>
      ),
    },
    {
      minWidth: 310,
      field: 'name',
      headerName: 'Legal name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Legal name / Email</Box>,
      renderCell: ({ row }: ProListCellType) => {
        {
          console.log('USERID', row.userId)
        }
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
            link={`/pro/list/detail/${row.userId}`}
          />
        )
      },
    },
    {
      minWidth: 180,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return <ProStatusChip status={row.status} label={row.status} />
      },
    },
    {
      minWidth: 260,
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
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
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
      minWidth: 330,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job type / Role</Box>,
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
          const sourceFilters = filters.source || []
          const targetFilters = filters.target || []
          const jobTypeFilters = filters.jobType || []
          const roleFilters = filters.role || []

          row.jobInfo.some((value, idx) => {
            const source = value.source || ''
            const target = value.target || ''
            const jobType = value.jobType || ''
            const role = value.role || ''
            if (
              (sourceFilters.length === 0 || sourceFilters.includes(source)) &&
              (targetFilters.length === 0 || targetFilters.includes(target)) &&
              (jobTypeFilters.length === 0 ||
                jobTypeFilters.includes(jobType)) &&
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
        // 리턴받은 jobInfo를 createdAt 기준으로 내림차순 정렬, 나중에 백엔드에 정렬된 데이터를 달라고 요구해도 될듯

        return (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {row.jobInfo && row.jobInfo.length ? (
              <>
                {' '}
                <JobTypeChip
                  type={row.jobInfo[0]?.jobType}
                  label={row.jobInfo[0]?.jobType}
                />
                <RoleChip
                  type={row.jobInfo[0]?.role}
                  label={row.jobInfo[0]?.role}
                />
              </>
            ) : (
              '-'
            )}
          </Box>
        )
        // const jobInfo = row.jobInfo.map(value => ({
        //   jobType: value.jobType,
        //   role: value.role,
        // }))
        // return <JobTypeRole jobInfo={jobInfo} />
      },
    },
    {
      minWidth: 160,
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
      minWidth: 190,
      field: 'experience',
      headerName: 'Years of experience',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Years of experience</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return <Typography variant='body1'>{row.experience}</Typography>
      },
    },
    {
      minWidth: 313,
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
                  setFilters(prevState => ({
                    ...prevState,
                    sortDate: dateOrder ? 'ASC' : 'DESC',
                  }))
                }}
              />
            </IconButton>
          ) : null}
        </Box>
      ),
      renderCell: ({ row }: ProListCellType) => {
        return (
          <Typography variant='body1'>
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
