// ** styled components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { HeaderCell } from '@src/pages/orders/add-new'

export default function TmAnalysisForm() {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label='sticky table'>
        <TableHead>
          <TableRow>
            {['CAT interface', 'Target language', 'File name', ''].map(
              (item, idx) => (
                <HeaderCell key={idx} align='left'>
                  {item}
                </HeaderCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow hover tabIndex={-1}>
            <TableCell colSpan={3} align='center'>
              Upload TM files to analyze and register price units
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
