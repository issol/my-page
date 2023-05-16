// ** react
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
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

// ** value
import { getGloLanguage } from '@src/shared/transformer/language.transformer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** parent value imports
import { HeaderCell, languageType } from '@src/pages/orders/add-new'

// ** third parties
import { v4 as uuidv4 } from 'uuid'

// ** type
import { StandardPriceListType } from '@src/types/common/standard-price'

// ** helpers
import languageHelper from '@src/shared/helpers/language.helper'

type Props = {
  languagePairs: languageType[]
  setLanguagePairs: Dispatch<SetStateAction<languageType[]>>
  getPriceOptions: (
    source: string,
    target: string,
  ) => Array<StandardPriceListType & { groupName: string }>
  type: string
  onDeleteLanguagePair: (row: languageType) => void
}
export default function AddLanguagePairForm({
  languagePairs,
  setLanguagePairs,
  getPriceOptions,
  type,
  onDeleteLanguagePair,
}: Props) {
  const languageList = getGloLanguage()
  const defaultValue = { value: '', label: '' }

  const [languagePair, setLanguagePair] = useState<{
    source: string
    target: string[]
  }>({ source: '', target: [] })

  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)

  const header =
    type === 'detail'
      ? ['Language pair', 'Price']
      : ['Language pair', 'Price', '']

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  function onAddLanguagePair() {
    const result: Array<languageType> = []

    languagePair?.target?.forEach(target => {
      const isDuplicated = languagePairs.some(
        pair => languagePair.source === pair.source && pair.target === target,
      )
      if (isDuplicated) return
      result.push({
        id: uuidv4(),
        source: languagePair.source,
        target,
        price: null,
      })
    })
    setLanguagePairs(languagePairs.concat(result))
    setLanguagePair({ source: '', target: [] })
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
        {type === 'detail' ? (
          <></>
        ) : (
          <Box display='flex' alignItems='center' gap='15px'>
            <Autocomplete
              value={
                !languagePair?.source
                  ? defaultValue
                  : languageList.find(
                      item => item.value === languagePair.source,
                    )
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
        )}
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
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={3} align='center'>
                    Add language pairs for this project
                  </TableCell>
                </TableRow>
              ) : null}
              {languagePairs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => {
                  // value={
                  //   !row.price
                  //     ? null
                  //     : options.find(
                  //         item => item.id === row.price?.id,
                  //       ) || null
                  // }
                  console.log('row.price', row.price)
                  const updateIndex = languagePairs
                    .map(item => item.id)
                    .indexOf(row.id)
                  const options = getPriceOptions(row.source, row.target)
                  const matchingPrice = options.filter(
                    item => item.groupName === 'Matching price',
                  )
                  if (matchingPrice.length === 1 && updateIndex !== -1) {
                    // setPrice(matchingPrice[0], idx)
                    const copyPairs = [...languagePairs]
                    copyPairs[updateIndex].price = matchingPrice[0]
                    setLanguagePairs(copyPairs)
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
                        {type === 'detail' ? (
                          <Typography variant='body1' fontSize={14}>
                            {row.price?.priceName}
                          </Typography>
                        ) : (
                          <Autocomplete
                            value={
                              !row.price
                                ? null
                                : options.find(
                                    item => item.id === row.price?.id,
                                  ) || null
                            }
                            size='small'
                            sx={{ width: 300 }}
                            options={options}
                            groupBy={option => option?.groupName}
                            onChange={(e, v) => {
                              const copyPairs = [...languagePairs]
                              copyPairs[updateIndex].price = v
                              setLanguagePairs(copyPairs)
                            }}
                            id='autocomplete-controlled'
                            getOptionLabel={option => option.priceName}
                            renderInput={params => (
                              <TextField {...params} placeholder='Price' />
                            )}
                          />
                        )}
                      </TableCell>
                      {type === 'detail' ? null : (
                        <TableCell align='center'>
                          <IconButton onClick={() => onDeleteLanguagePair(row)}>
                            <Icon icon='mdi:trash-outline' />
                          </IconButton>
                        </TableCell>
                      )}
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
