// ** react
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

// ** MUI Imports
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
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'

// ** value
import { getGloLanguage } from '@src/shared/transformer/language.transformer'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** parent value imports
import { HeaderCell } from '@src/pages/orders/add-new'

// ** third parties
import { v4 as uuidv4 } from 'uuid'

// ** type
import { StandardPriceListType } from '@src/types/common/standard-price'

// ** helpers
import languageHelper from '@src/shared/helpers/language.helper'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** modals
import SimpleMultilineAlertModal from '@src/pages/components/modals/custom-modals/simple-multiline-alert-modal'
import { ItemType } from '@src/types/common/item.type'
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormTrigger,
} from 'react-hook-form'
import { languageType } from '@src/pages/quotes/add-new'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

type Props = {
  languagePairs: languageType[]
  items: ItemType[]
}
export default function InvoiceReceivableLanguagePairInfoForm({
  languagePairs,
  items,
}: Props) {
  const { openModal, closeModal } = useModal()

  const languageList = getGloLanguage()
  const defaultValue = { value: '', label: '' }

  const [languagePair, setLanguagePair] = useState<{
    source: string
    target: string[]
  }>({ source: '', target: [] })

  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)

  const [sourceFocused, setSourceFocused] = useState<boolean>(false)
  const [targetFocused, setTargetFocused] = useState<boolean>(false)

  const header = ['Language pair', 'Price']

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Fragment>
      <Grid
        item
        xs={12}
        display='flex'
        padding='24px'
        alignItems='center'
        justifyContent='space-between'
        sx={{ background: '#F5F5F7', marginBottom: '24px' }}
      >
        <Typography variant='h6'>
          Language pairs ({languagePairs.length ?? 0})
        </Typography>
      </Grid>
      {/* table */}
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {header.map((item, idx) => (
                  <HeaderCell key={idx} align='left'>
                    {item}
                  </HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!languagePairs.length ? (
                <TableRow tabIndex={-1}>
                  <TableCell colSpan={3} align='center'>
                    There are no language pairs for this project
                  </TableCell>
                </TableRow>
              ) : null}
              {languagePairs &&
                languagePairs
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    return (
                      <TableRow tabIndex={-1} key={row.id}>
                        <TableCell>
                          <Box display='flex' alignItems='center' gap='4px'>
                            <Typography fontWeight='bold' variant='body2'>
                              {languageHelper(row.source)}
                            </Typography>

                            <Icon
                              icon='material-symbols:arrow-forward'
                              fontSize='20px'
                              opacity={0.7}
                            />
                            <Typography fontWeight='bold' variant='body2'>
                              {languageHelper(row.target)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body1' fontSize={14}>
                            {/* {row.price?.priceName} */}
                            {items?.[idx]?.initialPrice?.name}
                          </Typography>
                        </TableCell>
                   
                      </TableRow>
                    )
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 15, 30]}
          component='div'
          count={languagePairs?.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Fragment>
  )
}

const GroupHeader = styled('div')({
  paddingTop: '6px',
  paddingBottom: '6px',
  paddingLeft: '20px',
  fontWeight: 'bold',
})

const NoResultText = styled('span')({
  fontWeight: 'normal',
})

const GroupItems = styled('ul')({
  paddingTop: '0px',
  paddingBottom: '0px',
  paddingLeft: '5px',
})
