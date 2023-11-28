// ** styled components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { HeaderCell } from '@src/pages/orders/add-new'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { Fragment, ReactNode, useContext, useEffect } from 'react'
import { Icon } from '@iconify/react'
import {
  Control,
  FieldArrayWithId,
  UseFormGetValues,
  useFieldArray,
} from 'react-hook-form'
import { ItemType } from '@src/types/common/item.type'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import {
  deleteCatToolFile,
  getCatToolFile,
  postCatToolFile,
} from '@src/apis/order.api'
import MemoQModal from '../modals/tm-analysis/memoq-modal'
import useModal from '@src/hooks/useModal'
import { StandardPriceListType } from '@src/types/common/standard-price'
import languageHelper from '@src/shared/helpers/language.helper'
import { onCopyAnalysisParamType } from './items-form'
import { MemSourceType, MemoQType } from '@src/types/common/tm-analysis.type'
import MemsourceModal from '../modals/tm-analysis/memsource-modal'

// ** helpers
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToMB } from '@src/shared/helpers/file-size.helper'
import { languageType } from '@src/pages/quotes/add-new'

type Props = {
  control: Control<{ items: ItemType[]; languagePairs: languageType[] }, any>
  index: number
  priceData: StandardPriceListType | null
  priceFactor: number | undefined
  onCopyAnalysis: (data: onCopyAnalysisParamType) => void
  details: FieldArrayWithId<
    { items: ItemType[] },
    `items.${number}.detail`,
    'id'
  >[]
  type: string
  getValues: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  from: 'quote' | 'order' | 'invoice'
}
export default function TmAnalysisForm({
  control,
  index,
  priceData,
  priceFactor,
  onCopyAnalysis,
  details,
  type,
  getValues,
  from,
}: Props) {
  const headers =
    type === 'detail' || type === 'invoiceDetail' || type === 'invoiceHistory'
      ? ['CAT interface', 'Target language', 'File name']
      : ['CAT interface', 'Target language', 'File name', '']

  const { openModal, closeModal } = useModal()
  const itemName: `items.${number}.analysis` = `items.${index}.analysis`
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: itemName,
  })

  const MAXIMUM_FILE_SIZE = FILE_SIZE.TM_ANALYSIS

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: MAXIMUM_FILE_SIZE,
    disabled: !priceData || priceData.id === NOT_APPLICABLE,
    accept: { 'text/csv': ['.cvs'] },
    onDrop: (acceptedFiles: File[]) => {
      const totalFileSize = reducer(fields) + reducer(acceptedFiles)
      if (totalFileSize > MAXIMUM_FILE_SIZE) {
        return onError()
      }
      const formData = new FormData()
      formData.append('files', acceptedFiles[0])
      postCatToolFile(formData)
        .then(res => {
          append({
            id: res.id,
            name: acceptedFiles[0].name,
            size: Number(res.size) ?? acceptedFiles[0].size,
            data: res,
          })
        })
        .catch(e => {
          toast.error('Something went wrong. Please try again.', {
            position: 'bottom-left',
          })
        })
    },
    onDropRejected: () => onError(),
  })

  function onError() {
    toast.error(`Maximum size is ${byteToMB(MAXIMUM_FILE_SIZE)}.`, {
      duration: 2000,
    })
  }

  function reducer(value: { size: number; name: string }[]) {
    return value.reduce((res, item) => (res += item.size), 0)
  }

  function onDeleteFile(idx: number) {
    const fileId = fields[idx]?.data?.id
    if (fileId) {
      deleteCatToolFile(fileId).then(() => remove(idx))
    }
  }

  function onViewAnalysis(index: number, name: string) {
    if (fields[index].data !== null) {
      if (fields[index].data?.toolName === 'Memoq') {
        openModal({
          type: 'memoq-modal',
          children: (
            <MemoQModal
              fileName={name}
              onClose={() => closeModal('memoq-modal')}
              data={fields[index].data! as MemoQType}
              priceData={priceData}
              priceFactor={priceFactor}
              onCopyAnalysis={onCopyAnalysis}
            />
          ),
        })
      } else {
        openModal({
          type: 'memsource-modal',
          children: (
            <MemsourceModal
              fileName={name}
              onClose={() => closeModal('memsource-modal')}
              data={fields[index].data! as MemSourceType}
              priceData={priceData}
              priceFactor={priceFactor}
              onCopyAnalysis={onCopyAnalysis}
            />
          ),
        })
      }
    }
  }

  useEffect(() => {
    if (
      type === 'detail' &&
      getValues(`items.${index}.id`) &&
      from !== 'invoice'
    ) {
      getCatToolFile(getValues(`items.${index}.id`)!, from).then(res => {
        if (res) {
          res.map((value, idx) => {
            append({
              id: value.id ?? idx + 1,
              name: value.fileName,
              size: 0,
              data: value,
            })
          })
        }
      })
    }
  }, [type, from])

  return (
    <Fragment>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='subtitle1' mb='24px' fontWeight={600}>
          TM analysis
        </Typography>
        {type === 'detail' ? null : (
          <div {...getRootProps({ className: 'dropzone' })}>
            <Button
              size='small'
              variant='contained'
              disabled={!priceData || priceData.id === NOT_APPLICABLE}
            >
              <input {...getInputProps()} />
              Upload files
            </Button>
          </div>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {headers.map((item, idx) => (
                <HeaderCell key={idx} align='left'>
                  {item}
                </HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!fields.length ? (
              <TableRow tabIndex={-1}>
                <TableCell
                  colSpan={
                    type === 'detail' ||
                    type === 'invoiceDetail' ||
                    type === 'invoiceHistory'
                      ? 3
                      : 4
                  }
                  align='center'
                >
                  {type === 'detail'
                    ? 'There are no TM files uploaded'
                    : 'Upload TM files to analyze and register price units'}
                </TableCell>
              </TableRow>
            ) : (
              fields.map((item, idx) => (
                <TableRow tabIndex={-1} key={item.id}>
                  <TableCell style={{ textTransform: 'capitalize' }}>
                    {item?.data?.toolName}
                  </TableCell>
                  <TableCell>
                    {languageHelper(item?.data?.targetLanguage)}
                  </TableCell>
                  <TableCell style={{ maxWidth: '330px' }}>
                    {item.name}
                  </TableCell>
                  {type === 'detail' ||
                  type === 'invoiceDetail' ||
                  type === 'invoiceHistory' ? null : (
                    <TableCell style={{ minWidth: '200px' }}>
                      <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Button
                          size='small'
                          variant='outlined'
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
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  )
}
