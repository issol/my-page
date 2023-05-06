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
import { FileType } from '@src/types/common/file.type'
import { ReactNode } from 'react'
import { Icon } from '@iconify/react'

/* TODO
1. 파일 다운로드 form 만들기
2. 파일 형식 및 용량 제한 걸기
3. 백엔드의 response와 item의 price uint 데이터 받아 display
*/

type Props = {
  files: File[]
  removeFile: (file: FileType) => void
}
export default function TmAnalysisForm({ files, removeFile }: Props) {
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
          {!files.length ? (
            <TableRow hover tabIndex={-1}>
              <TableCell colSpan={4} align='center'>
                Upload TM files to analyze and register price units
              </TableCell>
            </TableRow>
          ) : (
            files.map(item => (
              <TableRow hover tabIndex={-1} key={item.name}>
                <TableCell>
                  Upload TM files to analyze and register price units
                </TableCell>
                <TableCell>
                  Upload TM files to analyze and register price units
                </TableCell>
                <TableCell style={{ maxWidth: '330px' }}>{item.name}</TableCell>
                <TableCell style={{ minWidth: '200px' }}>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Button size='small' variant='outlined'>
                      View analysis
                    </Button>
                    <IconButton
                    // onClick={() => onDeletePriceUnit(idx, savedValue.priceUnit)}
                    >
                      <Icon icon='mdi:trash-outline' />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
