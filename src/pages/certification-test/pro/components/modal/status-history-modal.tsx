import { Icon } from '@iconify/react'
import { Box, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { ClientUserType, UserDataType } from '@src/context/types'
import NoList from '@src/pages/components/no-list'
import { getProAppliedRolesStatusHistoryColumns } from '@src/shared/const/columns/pro-applied-roles'
import { ProAppliedRolesStatusHistoryType } from '@src/types/pro-certification-test/applied-roles'
import { Loadable } from 'recoil'

type Props = {
  onClose: any
  history: Array<ProAppliedRolesStatusHistoryType>
  statusList: { value: number; label: string }[]
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>
}

const StatusHistoryModal = ({ onClose, history, statusList, auth }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '610px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={onClose}
      >
        <Icon icon='mdi:close'></Icon>
      </IconButton>
      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '30px',
        }}
      >
        <Typography variant='h6'>Status history</Typography>
        <Box
          sx={{
            border: '1px solid rgba(76, 78, 100, 0.22)',
            borderRadius: '10px',
          }}
        >
          <DataGrid
            getRowId={row => row.id}
            rows={history ?? []}
            components={{
              NoRowsOverlay: () => NoList('There is no status history.'),
              NoResultsOverlay: () => NoList('There is no status history.'),
            }}
            sx={{
              // overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
            rowCount={history.length ?? 0}
            // autoPageSize
            // pagination
            // paginationMode='client'
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            columns={getProAppliedRolesStatusHistoryColumns(statusList, auth)}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default StatusHistoryModal
