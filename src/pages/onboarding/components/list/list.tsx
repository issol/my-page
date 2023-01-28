import { Button, Card, Grid, Typography } from '@mui/material'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import
import { rows } from 'src/@fake-db/table/static-data'

export default function OnboardingList() {
  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'ID',
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'full_name',
      headerName: 'Name',
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'email',
      headerName: 'Email',
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'start_date',
      headerName: 'Date',
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'experience',
      headerName: 'Experience',
    },
    {
      flex: 0.1,
      field: 'age',
      minWidth: 80,
      headerName: 'Age',
    },
  ]
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Pros (1,032)' />
        <Box sx={{ height: 500 }}>
          <DataGrid columns={columns} rows={rows.slice(0, 10)} />
        </Box>
      </Card>
    </Grid>
  )
}
