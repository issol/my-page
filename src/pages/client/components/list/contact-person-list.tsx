import { Box, Button, Card, CardHeader, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import {
  ClientContactPersonType,
  ContactPersonType,
} from '@src/types/schema/client-contact-person.schema'
import { FieldArrayWithId } from 'react-hook-form'

type Props = {
  // fields: FieldArrayWithId<ClientContactPersonType, 'contactPersons', 'id'>[]
  fields: Array<ContactPersonType>
  columns: GridColumns<ContactPersonType>
  openForm: () => void
  pageSize: number
  setPageSize: (n: number) => void
}
export default function ContactPersonList({
  fields,
  columns,
  openForm,
  pageSize,
  setPageSize,
}: Props) {
  function NoList() {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='subtitle1'>
          There are no contact persons
        </Typography>
      </Box>
    )
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              Contact person({fields?.length ?? 0})
            </Typography>{' '}
            <Button variant='contained' onClick={openForm}>
              Add contact person
            </Button>
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
          autoHeight
          components={{
            NoRowsOverlay: () => NoList(),
            NoResultsOverlay: () => NoList(),
          }}
          sx={{ overflowX: 'scroll' }}
          rows={fields}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 25, 50]}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        />
      </Box>
    </Card>
  )
}
