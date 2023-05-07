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
import { Fragment, ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { Control, useFieldArray } from 'react-hook-form'
import { ItemType } from '@src/types/common/item.type'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  index: number
  onViewAnalysis: (tool: 'memsource' | 'memoq', name: string) => void
}
export default function TmAnalysisForm({
  control,
  index,
  onViewAnalysis,
}: Props) {
  const itemName: `items.${number}.analysis` = `items.${index}.analysis`
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: itemName,
  })

  const MAXIMUM_FILE_SIZE = 50000000

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 2,
    maxSize: MAXIMUM_FILE_SIZE,
    accept: { 'text/csv': ['.cvs'] },
    onDrop: (acceptedFiles: File[]) => {
      // TODO : 여기서 api로 파일 put하기
      const totalFileSize = reducer(fields) + reducer(acceptedFiles)
      if (totalFileSize > MAXIMUM_FILE_SIZE) {
        return onError()
      }

      acceptedFiles.forEach(item => {
        append({ name: item.name, size: item.size })
      })
    },
    onDropRejected: () => onError(),
  })

  function onError() {
    toast.error('Maximum size is 50 MB.', {
      duration: 2000,
    })
  }

  function reducer(value: { size: number; name: string }[]) {
    return value.reduce((res, item) => (res += item.size), 0)
  }

  function onDeleteFile(idx: number) {
    // TODO : file delete api호출
    remove(idx)
  }

  return (
    <Fragment>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='h6' mb='24px'>
          TM analysis
        </Typography>

        <div {...getRootProps({ className: 'dropzone' })}>
          <Button
            size='small'
            variant='contained'
            // disabled={!data?.priceId || !data?.source || !data?.target}
          >
            <input {...getInputProps()} />
            Upload files
          </Button>
        </div>
      </Box>
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
            {!fields.length ? (
              <TableRow hover tabIndex={-1}>
                <TableCell colSpan={4} align='center'>
                  Upload TM files to analyze and register price units
                </TableCell>
              </TableRow>
            ) : (
              fields.map((item, idx) => (
                <TableRow hover tabIndex={-1} key={item.name}>
                  <TableCell>
                    Upload TM files to analyze and register price units
                  </TableCell>
                  <TableCell>
                    Upload TM files to analyze and register price units
                  </TableCell>
                  <TableCell style={{ maxWidth: '330px' }}>
                    {item.name}
                  </TableCell>
                  <TableCell style={{ minWidth: '200px' }}>
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Button
                        size='small'
                        variant='outlined' // TODO : tool은 동적으로 들어가게 수정해야 함.
                        onClick={e => {
                          e.stopPropagation()
                          onViewAnalysis('memoq', item.name)
                        }}
                      >
                        View analysis
                      </Button>
                      <IconButton onClick={() => onDeleteFile(idx)}>
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
    </Fragment>
  )
}
