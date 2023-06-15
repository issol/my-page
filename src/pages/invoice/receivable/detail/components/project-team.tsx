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
import { patchTeamForOrder } from '@src/apis/order-detail.api'
import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'
import { InvoiceProjectInfoFormType } from '@src/types/invoice/common.type'
import {
  InvoiceReceivableDetailType,
  InvoiceReceivablePatchParamsType,
} from '@src/types/invoice/receivable.type'

type Props = {
  list: Array<ProjectTeamListType>
  listCount: number
  columns: GridColumns<ProjectTeamListType>
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  type: string
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
  teamControl?: Control<ProjectTeamType, any>
  members?: FieldArrayWithId<ProjectTeamType, 'teams', 'id'>[]
  appendMember?: UseFieldArrayAppend<ProjectTeamType, 'teams'>
  removeMember?: UseFieldArrayRemove
  updateMember?: UseFieldArrayUpdate<ProjectTeamType, 'teams'>
  getTeamValues?: UseFormGetValues<ProjectTeamType>
  setTeamValues?: UseFormSetValue<ProjectTeamType>
  teamErrors?: FieldErrors<ProjectTeamType>
  isTeamValid?: boolean
  teamWatch?: UseFormWatch<ProjectTeamType>
  orderId: number
  getInvoiceInfo?: UseFormGetValues<InvoiceProjectInfoFormType>
  invoiceInfo?: InvoiceReceivableDetailType
  onSave?: (data: {
    id: number
    form: InvoiceReceivablePatchParamsType
  }) => void
}

const InvoiceProjectTeam = ({
  list,
  listCount,
  columns,
  pageSize,
  setPageSize,
  page,
  setPage,
  type,
  edit,
  setEdit,
  teamControl,
  members,
  appendMember,
  removeMember,
  updateMember,
  getTeamValues,
  setTeamValues,
  teamErrors,
  isTeamValid,
  teamWatch,
  orderId,
  getInvoiceInfo,
  invoiceInfo,
  onSave,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()

  function transformTeamData(data: ProjectTeamType) {
    let result: ProjectTeamFormType = {
      projectManagerId: 0,
      supervisorId: undefined,
      member: [],
    }

    data.teams.forEach(item => {
      if (item.type === 'supervisorId') {
        !item.id
          ? delete result.supervisorId
          : (result.supervisorId = Number(item.id))
      } else if (item.type === 'projectManagerId') {
        result.projectManagerId = Number(item.id)!
      } else if (item.type === 'member') {
        if (!item.id) {
          result.member = []
        }
        result?.member?.push(item.id!)
      }
    })
    // if (!result.member || !result?.member?.length) delete result.member

    return result
  }

  const onClickDiscard = () => {
    setEdit(false)
    closeModal('DiscardModal')
  }

  const onClickSave = () => {
    const teams = getTeamValues && transformTeamData(getTeamValues())

    const data = getInvoiceInfo && getInvoiceInfo()
    if (onSave && data && invoiceInfo && teams) {
      onSave({
        id: invoiceInfo.id,
        form: {
          ...data,
          projectManagerId: teams.projectManagerId,
          supervisorId: teams.supervisorId!,
          members: teams.member,
        },
      })
    }
  }

  return (
    <>
      {edit ? (
        <Card sx={{ padding: '24px' }}>
          <Grid container spacing={6}>
            <ProjectTeamFormContainer
              control={teamControl!}
              field={members!}
              append={appendMember!}
              remove={removeMember!}
              update={updateMember!}
              setValue={setTeamValues!}
              errors={teamErrors!}
              isValid={isTeamValid!}
              watch={teamWatch!}
            />
            <Grid item xs={12}>
              <Box
                sx={{ display: 'flex', justifyContent: 'center', gap: '16px' }}
              >
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() =>
                    openModal({
                      type: 'DiscardModal',
                      children: (
                        <DiscardModal
                          onClose={() => closeModal('DiscardModal')}
                          onClick={onClickDiscard}
                        />
                      ),
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  disabled={!isTeamValid}
                  onClick={() =>
                    openModal({
                      type: 'EditSaveModal',
                      children: (
                        <EditSaveModal
                          onClose={() => closeModal('EditSaveModal')}
                          onClick={onClickSave}
                        />
                      ),
                    })
                  }
                >
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      ) : (
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
              <IconButton onClick={() => setEdit(true)}>
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
      )}
    </>
  )
}

export default InvoiceProjectTeam