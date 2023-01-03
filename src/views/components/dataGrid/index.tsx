// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

// ** Custom Components Imports
import CardSnippet from 'src/@core/components/card-snippet'

// ** Demo Components Imports
import TableBasic from 'src/views/table/data-grid/TableBasic'
import TableFilter from 'src/views/table/data-grid/TableFilter'
import TableColumns from 'src/views/table/data-grid/TableColumns'
import TableEditable from 'src/views/table/data-grid/TableEditable'
import TableBasicSort from 'src/views/table/data-grid/TableBasicSort'
import TableSelection from 'src/views/table/data-grid/TableSelection'
import TableServerSide from 'src/views/table/data-grid/TableServerSide'

// ** Source code imports
import * as source from 'src/views/components/dataGrid/DataGridSourceCode'

const DataGrids = () => {
  return (
    <Grid className='match-height' /* container */ spacing={6}>
      <Grid item xs={12} md={6} mb={10}>
        <CardSnippet
          id='basic'
          title='Basic'
          code={{
            tsx: source.BasicJSXCode,
            jsx: source.BasicJSXCode,
          }}
        >
          <Typography variant='h5'>
            <Link href='https://mui.com/x/react-data-grid/' target='_blank'>
              Data Grid
            </Link>
          </Typography>
          <TableBasic />
        </CardSnippet>
      </Grid>
      <Grid item xs={12} md={6} mb={10}>
        <CardSnippet
          title='Editable'
          code={{
            tsx: source.EditableJSXCode,
            jsx: source.EditableJSXCode,
          }}
        >
          <TableEditable />
        </CardSnippet>
      </Grid>
      <Grid item xs={12} md={6} mb={10}>
        <CardSnippet
          title='Table Columns'
          code={{
            tsx: source.TableColumnsJSXCode,
            jsx: source.TableColumnsJSXCode,
          }}
        >
          <TableColumns />
        </CardSnippet>
      </Grid>
      <Grid item xs={12} md={6} mb={10}>
        <CardSnippet
          title='Sorting'
          code={{
            tsx: source.SortingJSXCode,
            jsx: source.SortingJSXCode,
          }}
        >
          <TableBasicSort />
        </CardSnippet>
      </Grid>
      <Grid item xs={12} md={6} mb={10}>
        <CardSnippet
          title='Filter'
          code={{
            tsx: source.FilterJSXCode,
            jsx: source.FilterJSXCode,
          }}
        >
          <TableFilter />
        </CardSnippet>
      </Grid>
      <Grid item xs={12} md={6} mb={10}>
        <CardSnippet
          title='Selection'
          code={{
            tsx: source.SelectionJSXCode,
            jsx: source.SelectionJSXCode,
          }}
        >
          <TableSelection />
        </CardSnippet>
      </Grid>
      <Grid item xs={12} md={6} mb={10}>
        <CardSnippet
          title='Server Side'
          code={{
            tsx: source.ServerSideJSXCode,
            jsx: source.ServerSideJSXCode,
          }}
        >
          <TableServerSide />
        </CardSnippet>
      </Grid>
    </Grid>
  )
}

export default DataGrids
