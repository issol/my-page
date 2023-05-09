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
import { Fragment, ReactNode, useContext } from 'react'
import { Icon } from '@iconify/react'
import { Control, FieldArrayWithId, useFieldArray } from 'react-hook-form'
import { ItemType } from '@src/types/common/item.type'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import {
  getMemoQAnalysisData,
  getMemsourceAnalysisData,
} from '@src/apis/order.api'
import { MemoQModal } from '../modals/tm-analysis/memoq-modal'
import useModal from '@src/hooks/useModal'
import { AuthContext } from '@src/context/AuthContext'
import { StandardPriceListType } from '@src/types/common/standard-price'
import languageHelper from '@src/shared/helpers/language.helper'
import { onCopyAnalysisParamType } from './items-form'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  index: number
  priceData: StandardPriceListType | null
  priceFactor: number | undefined
  onCopyAnalysis: (data: onCopyAnalysisParamType[]) => void
  details: FieldArrayWithId<
    { items: ItemType[] },
    `items.${number}.detail`,
    'id'
  >[]
}
export default function TmAnalysisForm({
  control,
  index,
  priceData,
  priceFactor,
  onCopyAnalysis,
  details,
}: Props) {
  const { user } = useContext(AuthContext)
  const { openModal, closeModal } = useModal()
  const itemName: `items.${number}.analysis` = `items.${index}.analysis`
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: itemName,
  })

  const MAXIMUM_FILE_SIZE = 50000000

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: MAXIMUM_FILE_SIZE,
    accept: { 'text/csv': ['.cvs'] },
    onDrop: (acceptedFiles: File[]) => {
      // TODO : 여기서 api로 파일 put하기
      const totalFileSize = reducer(fields) + reducer(acceptedFiles)
      if (totalFileSize > MAXIMUM_FILE_SIZE) {
        return onError()
      }
      getMemoQAnalysisData(acceptedFiles[0].name, user?.id!).then(res => {
        append({
          name: acceptedFiles[0].name,
          size: acceptedFiles[0].size,
          data: res,
        })
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

  function onViewAnalysis(index: number, name: string) {
    // } else if (tool === 'memsource') {
    //   getMemsourceAnalysisData(name, user?.id!)
    //     .then(res => {
    //       console.log('memsourceData', res)
    //       // openModal({
    //       //   type: 'memsource-modal',
    //       //   children: (
    //       //     <MemoQModal
    //       //       onClose={() => closeModal('memoq-modal')}
    //       //       data={res || []}
    //       //       priceData={priceData}
    //       //       onCopyAnalysis={onCopyAnalysis}
    //       //     />
    //       //   ),
    //       // })
    //     })
    //     .catch(e => {
    //       toast.error('Something went wrong. Please try again.', {
    //         position: 'bottom-left',
    //       })
    //     })
    // }
    if (fields[index].data !== null) {
      openModal({
        type: 'memoq-modal',
        children: (
          <MemoQModal
            fileName={name}
            onClose={() => closeModal('memoq-modal')}
            data={fields[index].data!}
            priceData={priceData}
            priceFactor={priceFactor}
            onCopyAnalysis={onCopyAnalysis}
            details={details}
          />
        ),
      })
    }
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
            //TODO : disabled 해제하기
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
                <TableRow hover tabIndex={-1} key={item.id}>
                  <TableCell style={{ textTransform: 'capitalize' }}>
                    {item?.data?.toolName}
                  </TableCell>
                  <TableCell>
                    {languageHelper(item?.data?.targetLanguage)}
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
                          onViewAnalysis(idx, item?.name)
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
