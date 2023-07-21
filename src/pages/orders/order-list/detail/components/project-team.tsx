import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'

import { Dispatch, SetStateAction } from 'react'
import Icon from '@src/@core/components/icon'
import ProjectTeamFormContainer from '@src/pages/quotes/components/form-container/project-team-container'
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { projectTeamSchema } from '@src/types/schema/project-team.schema'
import { ProjectTeamType } from '@src/types/schema/project-team.schema'
import { ProjectTeamListType } from '@src/types/orders/order-detail'
import useModal from '@src/hooks/useModal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { useMutation, useQueryClient } from 'react-query'

import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'

type Props = {
  list: Array<ProjectTeamListType>
  listCount: number
  columns: GridColumns<ProjectTeamListType>
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  type: string

  setEdit?: Dispatch<SetStateAction<boolean>>
}

const ProjectTeam = ({
  list,
  listCount,
  columns,
  pageSize,
  setPageSize,
  page,
  setPage,
  type,

  setEdit,
}: Props) => {
  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
          }}
        >
          <Typography variant='h6'>Project team</Typography>
          {type === 'detail' ? (
            <IconButton onClick={() => setEdit && setEdit(true)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          ) : null}
        </Box>
        <Box
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
            autoHeight
            // components={{
            //   NoRowsOverlay: () => NoList(),
            //   NoResultsOverlay: () => NoList(),
            // }}
            sx={{ overflowX: 'scroll', cursor: 'pointer' }}
            getRowId={row => row.userId}
            columns={columns}
            rows={list ?? []}
            rowCount={listCount ?? 0}
            // loading={isLoading}
            // onCellClick={params => {
            //   handleRowClick(params.row)
            // }}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            page={page}
            pageSize={pageSize}
            paginationMode='server'
            onPageChange={(newPage: number) => {
              // setFilters!((prevState: OrderListFilterType) => ({
              //   ...prevState,
              //   skip: newPage * rowsPerPage!,
              // }))
              setPage(newPage)
            }}
            onPageSizeChange={(newPageSize: number) => {
              // setFilters!((prevState: OrderListFilterType) => ({
              //   ...prevState,
              //   take: newPageSize,
              // }))
              setPageSize(newPageSize)
            }}
            disableSelectionOnClick
          />
        </Box>
      </Card>
    </>
  )
}

export default ProjectTeam
