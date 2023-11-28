import {
  Box,
  Button,
  Card,
  CardHeader,
  Switch,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import useModal from '@src/hooks/useModal'
import { useGetProAppliedRoles } from '@src/queries/pro-certification-test/applied-roles'

import { getProAppliedRolesColumns } from '@src/shared/const/columns/pro-applied-roles'
import {
  ProAppliedRolesFilterType,
  ProAppliedRolesType,
  ProAppliedRolesStatusHistoryType,
} from '@src/types/pro-certification-test/applied-roles'
import { Dispatch, SetStateAction, useState } from 'react'
import { Loadable } from 'recoil'
import StatusHistoryModal from './modal/status-history-modal'

type Props = {
  role: UserRoleType

  statusList: { value: number; label: string }[]
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>
}

const defaultFilters: ProAppliedRolesFilterType = {
  take: 10,
  skip: 0,
  seeOnlyActiveTests: '0',
}

const ProAppliedRoles = ({
  role,

  statusList,
  auth,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const [filters, setFilters] =
    useState<ProAppliedRolesFilterType>(defaultFilters)
  const [seeOnlyActiveTests, setSeeOnlyActiveTests] = useState(false)
  const handleSeeOnlyActiveTests = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked
    setSeeOnlyActiveTests(checked)
    setFilters(prevState => ({
      ...prevState,
      seeOnlyActiveTests: checked ? '1' : '0',
    }))
  }

  const { data: appliedRoles, isLoading: appliedRolesLoading } =
    useGetProAppliedRoles(filters)

  const viewHistory = (history: ProAppliedRolesStatusHistoryType[]) => {
    openModal({
      type: 'ViewHistoryModal',
      children: (
        <StatusHistoryModal
          onClose={() => closeModal('ViewHistoryModal')}
          history={history}
          statusList={statusList}
          auth={auth}
        />
      ),
    })
  }
  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              Applied roles ({appliedRoles?.totalCount ?? 0})
            </Typography>
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Typography variant='body2' fontSize={16}>
                Show only my active tests
              </Typography>
              <Switch
                checked={seeOnlyActiveTests}
                onChange={handleSeeOnlyActiveTests}
              />
            </Box>
          </Box>
        }
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      />
      <Box
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        <DataGrid
          sx={{
            overflowX: 'scroll',
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'inherit',
            },
          }}
          autoHeight
          rows={appliedRoles?.data ?? []}
          rowCount={appliedRoles?.totalCount ?? 0}
          loading={appliedRolesLoading}
          columns={getProAppliedRolesColumns(
            statusList,
            role,
            auth,
            viewHistory,
          )}
          pagination
          page={page}
          pageSize={rowsPerPage}
          paginationMode='server'
          onPageChange={(newPage: number) => {
            setFilters!((prevState: ProAppliedRolesFilterType) => ({
              ...prevState,
              skip: newPage * rowsPerPage!,
            }))
            setPage!(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            setFilters!((prevState: ProAppliedRolesFilterType) => ({
              ...prevState,
              take: newPageSize,
            }))
            setRowsPerPage!(newPageSize)
          }}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default ProAppliedRoles
