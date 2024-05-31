import { Icon } from '@iconify/react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Collapse,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns, GridSelectionModel } from '@mui/x-data-grid'
import {
  JobsStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import languageHelper from '@src/shared/helpers/language.helper'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { DeliveryFileType } from '@src/types/orders/order-detail'
import { Dispatch, SetStateAction, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import { JobStatus } from '@src/types/common/status.type'
import { useGetStatusList } from '@src/queries/common.query'

import {
  DataGridPro,
  GridRowSelectionModel,
  GridSlots,
} from '@mui/x-data-grid-pro'
import getImportFromJobColumns from '@src/shared/const/columns/import-from-job'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { FileType } from '@src/types/common/file.type'
import { getJobRequestReview } from '@src/apis/jobs/job-detail.api'
import { JobRequestReviewListType } from '@src/types/orders/job-detail'

type Props = {
  items: JobItemType[]
  orderId: number
  onClickUpload: (selected: any) => void
  onClose: any
  setImportedFiles: Dispatch<SetStateAction<DeliveryFileType[]>>
  setFileSize: Dispatch<SetStateAction<number>>
  fileSize: number
}

const ImportFromJob = ({
  items,
  orderId,
  onClickUpload,
  onClose,
  setImportedFiles,
  setFileSize,
  fileSize,
}: Props) => {
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({})

  const handleAccordionChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded({ ...expanded, [panel]: isExpanded })
    }

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([])

  const [targetRowSelectionModel, setTargetRowSelectionModel] =
    useState<GridRowSelectionModel>([])

  const [reviewedFiles, setReviewedFiles] = useState<
    JobRequestReviewListType[]
  >([])

  const { data: statusList } = useGetStatusList('Job')

  const [selectedJob, setSelectedJob] = useState<JobType | null>(null)

  const onClickImportFiles = () => {
    if (selectedJob) {
      const selectedTargetFiles: DeliveryFileType[] = selectedJob?.files
        ? selectedJob?.files
            .filter(value => targetRowSelectionModel.includes(value.id))
            .map(item => ({
              id: item.id,
              filePath: item.file,
              fileName: item.name,
              fileExtension: item.name.split('.')[1],
              fileSize: Number(item.size),
            }))
        : []

      const selectedReviewedFiles: DeliveryFileType[] = reviewedFiles
        .flatMap(item => item.files)
        .filter(value => rowSelectionModel.includes(value.id!))
        .map(item => ({
          uniqueId: uuidv4(),
          id: item.id,
          filePath: item.path!,
          fileName: item.name,
          fileExtension: item.name.split('.')[1],
          fileSize: Number(item.size),
        }))

      let result = fileSize
      selectedTargetFiles
        .concat(selectedReviewedFiles)
        .forEach((file: DeliveryFileType) => (result += file.fileSize))
      setImportedFiles(selectedTargetFiles.concat(selectedReviewedFiles))
      setFileSize(result)
    }
  }

  const reviewedFilesMap = reviewedFiles.flatMap(item =>
    item.files.map(file => ({
      ...file,
      reqId: item.index,
      isCompleted: item.isCompleted,
      assignedPerson: item.assigneeInfo,
    })),
  )

  console.log(reviewedFiles)

  return (
    <Box
      sx={{
        // maxWidth: '1266px',
        maxWidth: '1207px',
        width: '100%',
        maxHeight: '735px',
        height: '735px',
        // height: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              padding: '24px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #E0E0E0',
            }}
          >
            <Typography fontSize={20} fontWeight={500}>
              Import from job
            </Typography>
            <IconButton onClick={onClose}>
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>
        </Grid>

        <Grid container sx={{ height: '573px' }}>
          <Grid xs={4.5} item>
            <Box
              sx={{
                borderRight: '1px solid #E0E0E0',
                padding: '20px',
                overflowY: 'scroll',
                maxHeight: '573px',
                height: '100%',
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': {
                  borderRadius: 20,
                  background: '#CCCCCC',
                },
              }}
            >
              {items.map((value, index) => (
                <Accordion
                  key={uuidv4()}
                  disableGutters
                  expanded={expanded[value.id]}
                  onChange={handleAccordionChange(value.id)}
                  square
                  elevation={0}
                  sx={{
                    boxShadow: 'none !important',
                    // border: 'none !important',
                    margin: '0 !important',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      padding: '8px 2px',
                      height: '40px',
                      // padding:
                      //   expanded === value.id.toString() ? '20px' : '12px 20px',
                      flexDirection: 'row-reverse',
                      gap: '4px',
                      border: '0 !important',
                      // background: '#F7F8FF',
                      '& .MuiAccordionSummary-content': {
                        margin: 0,
                      },
                    }}
                  >
                    <Typography
                      fontSize={14}
                      fontWeight={600}
                      sx={{
                        overflow: 'hidden',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}. &nbsp;
                      {languageHelper(value.sourceLanguage)}
                      &nbsp;&rarr;&nbsp;
                      {languageHelper(value.targetLanguage)}&nbsp;
                      {value.itemName}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {value.jobs.length > 0 ? (
                        value.jobs.map((value, index) => (
                          <Grid
                            container
                            alignItems={'center'}
                            sx={{
                              display: 'flex',
                              padding: '8px 16px',
                              background:
                                selectedJob?.id === value.id
                                  ? '#F7F8FF'
                                  : 'transparent',
                              // alignItems: 'center',
                              // gap: '8px',
                              '&:hover': {
                                background: '#F7F8FF',
                                cursor: 'pointer',
                              },
                            }}
                            onClick={event => {
                              event.stopPropagation()
                              setSelectedJob(value)
                              getJobRequestReview(value.id, []).then(res => {
                                setReviewedFiles(res)
                              })
                              // setReviewedFiles({

                              // })
                            }}
                            key={uuidv4()}
                          >
                            <Grid item xs={2.8}>
                              <Typography
                                fontSize={14}
                                fontWeight={400}
                                sx={{
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                                onClick={event => {
                                  event.stopPropagation()
                                  router.push(
                                    `/orders/job-list/detail/?orderId=${orderId}&jobId=${value.id}&selectedJobId=${value.id}`,
                                  )
                                }}
                              >
                                {value.corporationId}
                              </Typography>
                            </Grid>
                            <Grid item xs={6.2}>
                              <Typography
                                fontSize={14}
                                fontWeight={400}
                                sx={{
                                  padding: '0 8px',
                                  overflow: 'hidden',
                                  wordBreak: 'break-all',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {value.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              {JobsStatusChip(
                                value.status as JobStatus,
                                statusList!,
                              )}
                            </Grid>
                          </Grid>
                        ))
                      ) : (
                        <Box
                          sx={{
                            padding: '8px 16px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            color='#8D8E9A'
                            fontSize={14}
                            fontWeight={400}
                          >
                            No jobs
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
          <Grid xs={7.5} item>
            <Box
              sx={{
                padding: '20px 0',
                height: '100%',
                maxHeight: '573px',
                minHeight: '573px',
                overflowY: 'scroll',
              }}
            >
              {selectedJob ? (
                <Box>
                  {reviewedFilesMap.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0 20px',
                        }}
                      >
                        <Typography fontSize={14} fontWeight={600}>
                          Reviewed files
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Icon
                            icon='ic:outline-check'
                            fontSize={24}
                            color='#64C623'
                          />
                          <Typography
                            fontSize={12}
                            fontWeight={400}
                            color='#8D8E9A'
                          >
                            {' '}
                            = Review completed
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ width: '100%', height: '100%' }}>
                        <DataGridPro
                          rowHeight={46}
                          hideFooterPagination
                          hideFooterRowCount
                          hideFooterSelectedRowCount
                          columnHeaderHeight={46}
                          sx={{
                            width: '100%',
                            height: '100%',
                            '& .MuiDataGrid-columnHeader': {
                              padding: '0 20px !important',
                            },
                            '& .MuiDataGrid-columnHeaderCheckbox': {
                              minWidth: '40px !important',
                              width: '40px !important',
                              height: '46px !important',
                              padding: '0 !important',
                            },
                            '& .MuiDataGrid-cellCheckbox': {
                              minWidth: '40px !important',
                              width: '40px !important',
                            },
                            '& .MuiDataGrid-virtualScroller': {
                              borderRadius: '0 !important',
                            },
                            '& .file-name-cell': {
                              padding: '0 !important',
                            },
                            '& .MuiDataGrid-cell': {
                              padding: '0 !important',
                            },
                          }}
                          columns={getImportFromJobColumns(
                            'reviewed',
                            auth,
                            timezone,
                          )}
                          rows={reviewedFilesMap}
                          checkboxSelection
                          onRowSelectionModelChange={newRowSelectionModel => {
                            setRowSelectionModel(newRowSelectionModel)
                          }}
                          rowSelectionModel={rowSelectionModel}
                        />
                      </Box>
                    </Box>
                  ) : null}

                  {/* {selectedJob.files &&
                  selectedJob.files?.filter(value => value.type === 'TARGET')
                    .length > 0 ? ( */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <Typography
                      fontSize={14}
                      fontWeight={600}
                      sx={{ padding: '0 20px' }}
                    >
                      Target files
                    </Typography>
                    <Box sx={{ width: '100%', height: '100%' }}>
                      <DataGridPro
                        autoHeight={
                          selectedJob.files &&
                          selectedJob.files?.filter(
                            value => value.type === 'TARGET',
                          ).length === 0
                        }
                        rowHeight={46}
                        columnHeaderHeight={46}
                        hideFooterPagination
                        hideFooterRowCount
                        hideFooterSelectedRowCount
                        slots={{
                          noRowsOverlay: () => (
                            <Typography
                              sx={{
                                display: 'flex',
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              fontSize={14}
                              color='#8D8E9A'
                            >
                              No target files
                            </Typography>
                          ),
                          loadingOverlay:
                            LinearProgress as GridSlots['loadingOverlay'],
                        }}
                        sx={{
                          '& .MuiDataGrid-columnHeader': {
                            padding: '0 20px !important',
                          },
                          '& .MuiDataGrid-columnHeaderCheckbox': {
                            minWidth: '40px !important',
                            width: '40px !important',
                            height: '46px !important',
                            padding: '0 !important',
                          },
                          '& .MuiDataGrid-cellCheckbox': {
                            minWidth: '40px !important',
                            width: '40px !important',
                          },
                          '& .MuiDataGrid-virtualScroller': {
                            borderRadius: '0 !important',
                          },
                          '& .file-name-cell': {
                            padding: '0 !important',
                          },
                          '& .MuiDataGrid-cell': {
                            padding: '0 !important',
                          },
                        }}
                        columns={getImportFromJobColumns(
                          'target',
                          auth,
                          timezone,
                        )}
                        rows={selectedJob.files
                          ?.filter(value => value.type === 'TARGET')
                          .map(value => ({
                            ...value,
                            assignedPerson: selectedJob.assignedPro,
                          }))}
                        checkboxSelection
                        onRowSelectionModelChange={newRowSelectionModel => {
                          setTargetRowSelectionModel(newRowSelectionModel)
                        }}
                        rowSelectionModel={targetRowSelectionModel}
                      />
                    </Box>
                  </Box>
                  {/* ) : null} */}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Typography color='#8D8E9A' fontSize={14} fontWeight={400}>
                    Please select job
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              borderTop: '1px solid #E0E0E0',
              padding: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              width: '100%',
            }}
          >
            <Button variant='outlined' onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              disabled={
                rowSelectionModel.length === 0 &&
                targetRowSelectionModel.length === 0
              }
              onClick={() => {
                onClickImportFiles()
                onClose()
              }}
            >
              Import files (
              {(rowSelectionModel.length ?? 0) +
                (targetRowSelectionModel.length ?? 0)}
              )
            </Button>
          </Box>
        </Grid>
      </Grid>
      {/* <Box
        sx={{
          padding: '50px 60px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <Card sx={{ overflow: 'scroll' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {items.map((value, index) => {
              return (
                <Row
                  info={value}
                  key={`${value.id}-${index}`}
                  index={index}
                  setSelectedJobs={setSelectedJobs}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              )
            })}
          </Box>
        </Card>
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          <Button variant='outlined' color='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            disabled={selectedIds.length === 0}
            onClick={() => onClickUpload(selectedJobs)}
          >
            Upload
          </Button>
        </Box>
      </Box> */}
    </Box>
  )
}

const Row = ({
  info,
  index,
  setSelectedIds,
  selectedIds = [],
  setSelectedJobs,
}: {
  info: JobItemType
  index: number
  selectedIds: GridSelectionModel
  setSelectedIds: Dispatch<GridSelectionModel>
  setSelectedJobs: Dispatch<DeliveryFileType[]>
}) => {
  const [open, setOpen] = useState<boolean>(true)
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const handleSelectionModelChange = (
    selectionModel: GridSelectionModel,
    jobs: JobType[],
  ) => {
    const filterIds = selectedIds.filter(id => !selectionModel.includes(id))
    const curSelected = selectionModel.filter(id => !filterIds.includes(id))

    const selected: DeliveryFileType[] = jobs.filter(job =>
      curSelected.includes(job.id),
    )
      ? jobs
          .filter(job => selectionModel.includes(job.id))
          .map(value => value.files)
          .flat()
          .map(value => ({
            filePath: value!.file,
            fileName: value!.name,
            fileExtension: value!.name.split('.')[1],
            fileSize: value!.size,
            type: 'imported',
          }))
      : []

    setSelectedIds(curSelected)
    setSelectedJobs(selected)
    setSelectionModel(selectionModel)
  }

  const columns: GridColumns<JobType> = [
    {
      flex: 0.1242,
      field: 'no',
      headerName: 'No.',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>No.</Box>,
      renderCell: ({ row }: { row: JobType }) => {
        return (
          <Box display='flex' flexDirection='column' maxWidth='300px'>
            <Typography>{row.corporationId}</Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.2839,

      field: 'fileName',
      headerName: 'Department',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>File name</Box>,
      renderCell: ({ row }: { row: JobType }) => {
        return (
          <Typography>
            {row.files && row.files.length && row.files[0].name}
          </Typography>
        )
      },
    },
    {
      flex: 0.213,
      field: 'Job',
      headerName: 'Job',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job</Box>,
      renderCell: ({ row }: { row: JobType }) => {
        return <ServiceTypeChip label={row.serviceType} />
      },
    },
    {
      flex: 0.2946,
      field: 'AssignPro',
      headerName: 'AssignPro',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Assigned Pro</Box>,
      renderCell: ({ row }: { row: JobType }) => {
        return (
          <Box>
            {row.assignedPro ? (
              <LegalNameEmail
                row={{
                  isOnboarded: true,
                  isActive: true,

                  firstName: row.assignedPro.firstName,
                  middleName: row.assignedPro.middleName,
                  lastName: row.assignedPro.lastName,
                  email: row.assignedPro.email,
                }}
              />
            ) : (
              '-'
            )}
          </Box>
        )
      },
    },
  ]

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          padding: '24px',
        }}
      >
        <IconButton
          aria-label='expand row'
          size='small'
          onClick={() => setOpen(!open)}
        >
          <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
        </IconButton>
        <Typography
          variant='body1'
          sx={{
            fontWeight: 600,
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
          }}
        >
          {String(index + 1).padStart(2, '0')}. &nbsp;
          {languageHelper(info.sourceLanguage)}
          &nbsp;&rarr;&nbsp;
          {languageHelper(info.targetLanguage)}&nbsp;
          {info.itemName}
        </Typography>
      </Box>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <Box sx={{ padding: '0 24px' }}>
          <DataGrid
            columns={columns}
            rows={info.jobs}
            autoHeight
            checkboxSelection
            selectionModel={selectionModel}
            onSelectionModelChange={(selectionModel: GridSelectionModel) =>
              handleSelectionModelChange(selectionModel, info.jobs)
            }
            hideFooterPagination
            hideFooterSelectedRowCount
            getRowId={row => row.id}
          />
        </Box>
      </Collapse>
    </Box>
  )
}

export default ImportFromJob
