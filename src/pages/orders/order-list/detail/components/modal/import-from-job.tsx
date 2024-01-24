import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns, GridSelectionModel } from '@mui/x-data-grid'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import languageHelper from '@src/shared/helpers/language.helper'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { DeliveryFileType } from '@src/types/orders/order-detail'
import { Dispatch, useState } from 'react'

type Props = {
  items: JobItemType[]
  onClickUpload: (selected: any) => void
  onClose: any
}

const ImportFromJob = ({ items, onClickUpload, onClose }: Props) => {
  const [selectedIds, setSelectedIds] = useState<GridSelectionModel>([])
  const [selectedJobs, setSelectedJobs] = useState<DeliveryFileType[]>([])

  return (
    <Box
      sx={{
        // maxWidth: '1266px',
        maxWidth: '1100px',
        width: '100%',
        maxHeight: '800px',
        // height: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        overflowY: 'scroll',
      }}
    >
      <Box
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
      </Box>
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
