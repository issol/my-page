import { Box, Button, Card, CardHeader, Typography } from '@mui/material'
import { DataGrid, GridColumns, GridRowParams } from '@mui/x-data-grid'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'

type Props<T extends string | number> = {
  fields: Array<ContactPersonType<T>>
  columns: GridColumns<ContactPersonType<T>>
  isUpdatable?: boolean
  openForm: () => void
  pageSize: number
  setPageSize: (n: number) => void
  onRowClick?: (row: GridRowParams<ContactPersonType<T>>) => void
}
export default function ContactPersonList<T extends string | number>({
  fields,
  columns,
  isUpdatable,
  openForm,
  pageSize,
  setPageSize,
  onRowClick,
}: Props<T>) {
  const updatable = isUpdatable === undefined ? true : isUpdatable

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
            {updatable ? (
              <Button variant='contained' onClick={openForm}>
                Add contact person
              </Button>
            ) : null}
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
          onRowClick={e => onRowClick && onRowClick(e)}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        />
      </Box>
    </Card>
  )
}
