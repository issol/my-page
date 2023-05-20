import {
  Box,
  Button,
  Card,
  CardHeader,
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

    console.log(result)

    return result
  }

  const patchProjectTeamMutation = useMutation(
    (data: { id: number; form: ProjectTeamFormType }) =>
      patchTeamForOrder(data.id, data.form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`projectTeam-${orderId}`)
        setEdit(false)
        closeModal('EditSaveModal')
      },
    },
  )

  const onClickDiscard = () => {
    setEdit(false)
    closeModal('DiscardModal')
  }

  const onClickSave = () => {
    const teams = getTeamValues && transformTeamData(getTeamValues())

    patchProjectTeamMutation.mutate({ id: orderId, form: teams! })
  }

  return (
    <>
      {edit ? (
        <Card sx={{ padding: '24px' }}>
          <ProjectTeamFormContainer
            control={teamControl!}
            field={members!}
            append={appendMember!}
            remove={removeMember!}
            update={updateMember!}
            getValues={getTeamValues!}
            setValue={setTeamValues!}
            errors={teamErrors!}
            isValid={isTeamValid!}
            watch={teamWatch!}
            onNextStep={() =>
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
            handleCancel={() =>
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
            type='edit'
          />
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

export default ProjectTeam
