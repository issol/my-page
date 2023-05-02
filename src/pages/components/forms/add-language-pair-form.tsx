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
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

import styled from 'styled-components'

// ** value
import { getGloLanguage } from '@src/shared/transformer/language.transformer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { defaultOption, languageType } from '@src/pages/orders/add-new'

import { v4 as uuidv4 } from 'uuid'
import useModal from '@src/hooks/useModal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import { StandardPriceListType } from '@src/types/common/standard-price'

import languageHelper from '@src/shared/helpers/language.helper'

type Props = {
  languagePairs: languageType[]
  setLanguagePairs: Dispatch<SetStateAction<languageType[]>>
  getPriceOptions: (
    source: string,
    target: string,
  ) => Array<StandardPriceListType & { groupName: string }>
}
export default function AddLanguagePairForm({
  languagePairs,
  setLanguagePairs,
  getPriceOptions,
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  function onAddLanguagePair() {
    const value = languagePair.target.map(item => ({
      id: uuidv4(),
      source: languagePair.source,
      target: item,
      price: null,
    }))
    setLanguagePairs(languagePairs.concat(value))
    setLanguagePair({ source: '', target: [] })
  }

  function onDeleteLanguagePair(row: languageType) {
    const isDeletable = row?.isDeletable === undefined ? true : row.isDeletable
    if (isDeletable) {
      openModal({
        type: 'delete-language',
        children: (
          <DeleteConfirmModal
            message='Are you sure you want to delete this language pair?'
            title={`${languageHelper(row.source)} -> ${languageHelper(
              row.target,
            )}`}
            onDelete={deleteLanguage}
            onClose={() => closeModal('delete-language')}
          />
        ),
      })
    } else {
      openModal({
        type: 'cannot-delete-language',
        children: (
          <SimpleAlertModal
            message='This language pair cannot be deleted because it’s already being used in the item.'
            title={`${languageHelper(row.source)} -> ${languageHelper(
              row.target,
            )}`}
            onClose={() => closeModal('cannot-delete-language')}
          />
        ),
      })
    }

    function deleteLanguage() {
      const idx = languagePairs.map(item => item.id).indexOf(row.id)
      const copyOriginal = [...languagePairs]
      copyOriginal.splice(idx, 1)
      setLanguagePairs([...copyOriginal])
    }
  }

  function setPrice(
    v:
      | (StandardPriceListType & {
          groupName?: string
        })
      | null,
    idx: number,
  ) {
    if (!v) return
    const newPairs = [...languagePairs]
    delete v?.groupName
    newPairs[idx].price = v
    setLanguagePairs(newPairs)
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
        <Box display='flex' alignItems='center' gap='15px'>
          <Autocomplete
            value={
              !languagePair?.source
                ? defaultValue
                : languageList.find(item => item.value === languagePair.source)
            }
            size='small'
            sx={{ width: 250 }}
            options={languageList}
            onChange={(e, v) =>
              setLanguagePair({ ...languagePair, source: v?.value ?? '' })
            }
            id='autocomplete-controlled'
            getOptionLabel={option => option.label}
            renderInput={params => <TextField {...params} label='Source' />}
          />
          <IconButton>
            <Icon icon='material-symbols:arrow-forward' />
          </IconButton>
          <Autocomplete
            value={
              !languagePair?.target.length
                ? []
                : languageList.filter(item =>
                    languagePair.target.includes(item.value),
                  )
            }
            multiple
            size='small'
            sx={{ width: 250 }}
            options={languageList}
            onChange={(e, v) =>
              setLanguagePair({
                ...languagePair,
                target: v.map(item => item.value),
              })
            }
            id='autocomplete-controlled'
            getOptionLabel={option => option.label}
            renderInput={params => <TextField {...params} label='Target' />}
          />
          <Button
            size='small'
            variant='contained'
            onClick={onAddLanguagePair}
            disabled={!languagePair?.source || !languagePair?.target?.length}
          >
            Add
          </Button>
        </Box>
      </Grid>
      {/* table */}
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {['Language pair', 'Price', ''].map((item, idx) => (
                  <HeaderCell key={idx} align='left'>
                    {item}
                  </HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!languagePairs.length ? (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={3} align='center'>
                    Add language pairs for this project
                  </TableCell>
                </TableRow>
              ) : null}
              {languagePairs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => {
                  const options = getPriceOptions(row.source, row.target)
                  const matchingPrice = options.filter(
                    item => item.groupName === 'Matching price',
                  )
                  if (matchingPrice.length === 1) {
                    setPrice(matchingPrice[0], idx)
                  }
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
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
                        <Autocomplete
                          value={
                            !row.price
                              ? null
                              : options.find(
                                  item =>
                                    item.priceName === row.price?.priceName,
                                ) || defaultOption
                          }
                          size='small'
                          sx={{ width: 300 }}
                          options={options}
                          groupBy={option => option?.groupName}
                          onChange={(e, v) => {
                            setPrice(v, idx)
                          }}
                          id='autocomplete-controlled'
                          getOptionLabel={option => option.priceName}
                          renderInput={params => (
                            <TextField {...params} placeholder='Price' />
                          )}
                        />
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={() => onDeleteLanguagePair(row)}>
                          <Icon icon='mdi:trash-outline' />
                        </IconButton>
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
          count={languagePairs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Fragment>
  )
}

const HeaderCell = styled(TableCell)`
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #666cff;
  height: 20px;
  position: relative;
  text-transform: none;
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    right: 0px;
    width: 2px;
    height: 30%;
    background: rgba(76, 78, 100, 0.12);
  }
`
