import { Icon } from '@iconify/react'
import { Box, Tooltip, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid-pro'
import { ClientUserType, UserDataType } from '@src/context/types'
import { LegalName } from '@src/pages/onboarding/components/list/list-item/legalname-email'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { byteToKB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import Image from 'next/image'
import { Loadable } from 'recoil'

type CellType = {
  row: {
    name: string
    size: number
    file: string
    type: 'SAMPLE' | 'SOURCE' | 'TARGET' | 'REVIEWED'
    createdAt: string
    assignedPerson: {
      isOnboarded: boolean
      isActive: boolean
      firstName: string
      lastName: string
      middleName: string
    }
    isCompleted?: boolean
    reqId: string
  }
}

const getImportFromJobColumns = (
  type: 'reviewed' | 'target',
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
) => {
  const extractFileName = (path: string) => {
    return path.split('/').pop() ?? ''
  }
  const extractFileExtension = (path: string) => {
    const fileName = extractFileName(path)
    const fileExtension = fileName
      ? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
      : 'default'

    switch (fileExtension) {
      case 'doc':
      case 'docx':
        return 'doc'
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'excel'
      case 'pdf':
        return 'pdf'
      case 'ppt':
      case 'pptx':
        return 'ppt'
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'img'
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'video'
      default:
        return 'default'
    }
  }
  const columns: GridColDef[] =
    type === 'reviewed'
      ? [
          {
            flex: 0.175,

            field: 'id',
            headerName: 'Request No.',
            hideSortIcons: true,
            disableColumnMenu: true,
            sortable: false,

            renderHeader: () => (
              <Typography variant='subtitle1' fontWeight={400} fontSize={14}>
                Request No.
              </Typography>
            ),
            renderCell: ({ row }: CellType) => {
              return (
                <Box
                  sx={{
                    display: 'flex',

                    gap: '8px',
                    alignItems: 'center',
                    height: '100%',
                    padding: '16px 16px 16px 20px',
                  }}
                >
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='#8D8E9A'
                    sx={{ width: '54px' }}
                  >
                    {row.reqId}
                  </Typography>
                  {row.isCompleted ? (
                    <Icon
                      icon='ic:outline-check'
                      fontSize={24}
                      color='#64C623'
                    />
                  ) : null}
                </Box>
              )
            },
          },
          {
            flex: 0.341,

            field: 'name',
            headerName: 'File name',
            hideSortIcons: true,
            disableColumnMenu: true,
            sortable: false,
            cellClassName: 'file-name-cell',

            renderHeader: () => (
              <Typography variant='subtitle1' fontWeight={400} fontSize={14}>
                File name
              </Typography>
            ),
            renderCell: ({ row }: CellType) => {
              return (
                <Box
                  sx={{
                    display: 'flex',

                    gap: '4px',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0 16px 0 20px',
                  }}
                >
                  <Image
                    src={`/images/icons/file-icons/${extractFileExtension(row.file)}.svg`}
                    width={24}
                    height={24}
                    alt='file'
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <Tooltip title={row.name}>
                      <Typography
                        fontSize={14}
                        fontWeight={400}
                        sx={{
                          width: '90%',

                          overflow: 'hidden',
                          wordBreak: 'break-all',
                          textOverflow: 'ellipsis',
                          // display: '-webkit-box',
                          // WebkitLineClamp: 1,
                          // WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {row.name}
                      </Typography>
                    </Tooltip>

                    <Typography
                      fontSize={12}
                      fontWeight={400}
                      color='#4C4E6499'
                    >
                      {formatFileSize(row.size)}
                    </Typography>
                  </Box>
                </Box>
              )
            },
          },
          {
            flex: 0.2713,

            field: 'date',
            headerName: 'Uploaded date',
            hideSortIcons: true,
            disableColumnMenu: true,
            sortable: false,

            renderHeader: () => (
              <Typography variant='subtitle1' fontWeight={400} fontSize={14}>
                Uploaded date
              </Typography>
            ),
            renderCell: ({ row }: CellType) => {
              console.log(row.createdAt)

              return (
                <Tooltip
                  title={convertTimeToTimezone(
                    row.createdAt,
                    auth.getValue().user?.timezone,
                    timezone.getValue(),
                  )}
                >
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',

                      alignItems: 'center',
                      padding: '0 16px 0 20px',
                    }}
                  >
                    <Typography
                      fontSize={14}
                      fontWeight={400}
                      sx={{
                        overflow: 'hidden',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {convertTimeToTimezone(
                        row.createdAt,
                        auth.getValue().user?.timezone,
                        timezone.getValue(),
                      )}
                    </Typography>
                  </Box>
                </Tooltip>
              )
            },
          },
          {
            flex: 0.2105,

            field: 'assigned',
            headerName: 'Assigned Pro',
            hideSortIcons: true,
            disableColumnMenu: true,
            sortable: false,

            renderHeader: () => (
              <Typography variant='subtitle1' fontWeight={400} fontSize={14}>
                Assignee
              </Typography>
            ),
            renderCell: ({ row }: CellType) => {
              return (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 20px',
                  }}
                >
                  <LegalName
                    row={{
                      firstName: row.assignedPerson.firstName,
                      middleName: row.assignedPerson.middleName,
                      lastName: row.assignedPerson.lastName,
                      isOnboarded: row.assignedPerson.isOnboarded,
                      isActive: row.assignedPerson.isActive,
                    }}
                  />
                </Box>
              )
            },
          },
        ]
      : [
          {
            flex: 0.3287,

            field: 'name',
            headerName: 'File name',
            hideSortIcons: true,
            disableColumnMenu: true,
            sortable: false,
            cellClassName: 'file-name-cell',

            renderHeader: () => (
              <Typography variant='subtitle1' fontWeight={400} fontSize={14}>
                File name
              </Typography>
            ),
            renderCell: ({ row }: CellType) => {
              return (
                <Box
                  sx={{
                    display: 'flex',

                    gap: '4px',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0 16px 0 20px',
                  }}
                >
                  <Image
                    src={`/images/icons/file-icons/${extractFileExtension(row.file)}.svg`}
                    width={24}
                    height={24}
                    alt='file'
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <Tooltip title={row.name}>
                      <Typography
                        fontSize={14}
                        fontWeight={400}
                        sx={{
                          width: '90%',

                          overflow: 'hidden',
                          wordBreak: 'break-all',
                          textOverflow: 'ellipsis',
                          // display: '-webkit-box',
                          // WebkitLineClamp: 1,
                          // WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {row.name}
                      </Typography>
                    </Tooltip>

                    <Typography
                      fontSize={12}
                      fontWeight={400}
                      color='#4C4E6499'
                    >
                      {formatFileSize(row.size)}
                    </Typography>
                  </Box>
                </Box>
              )
            },
          },
          {
            flex: 0.2713,

            field: 'date',
            headerName: 'Uploaded date',
            hideSortIcons: true,
            disableColumnMenu: true,
            sortable: false,

            renderHeader: () => (
              <Typography variant='subtitle1' fontWeight={400} fontSize={14}>
                Uploaded date
              </Typography>
            ),
            renderCell: ({ row }: CellType) => {
              return (
                <Tooltip
                  title={convertTimeToTimezone(
                    row.createdAt,
                    auth.getValue().user?.timezone,
                    timezone.getValue(),
                  )}
                >
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 16px 0 20px',
                    }}
                  >
                    <Typography
                      fontSize={14}
                      fontWeight={400}
                      sx={{
                        overflow: 'hidden',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {convertTimeToTimezone(
                        row.createdAt,
                        auth.getValue().user?.timezone,
                        timezone.getValue(),
                      )}
                    </Typography>
                  </Box>
                </Tooltip>
              )
            },
          },
          {
            flex: 0.34,

            field: 'assigned',
            headerName: 'Assigned Pro',
            hideSortIcons: true,
            disableColumnMenu: true,
            sortable: false,

            renderHeader: () => (
              <Typography variant='subtitle1' fontWeight={400} fontSize={14}>
                Assigned Pro
              </Typography>
            ),
            renderCell: ({ row }: CellType) => {
              return (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 20px',
                  }}
                >
                  <LegalName
                    row={{
                      firstName: row.assignedPerson.firstName,
                      middleName: row.assignedPerson.middleName,
                      lastName: row.assignedPerson.lastName,
                      isOnboarded: row.assignedPerson.isOnboarded,
                      isActive: row.assignedPerson.isActive,
                    }}
                  />
                </Box>
              )
            },
          },
        ]

  return columns
}

export default getImportFromJobColumns
