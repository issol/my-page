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
  Checkbox,
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

// ** parent value imports
import { HeaderCell, languageType } from '@src/pages/orders/add-new'

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

type Props = {
  languagePairs: languageType[]
  setLanguagePairs: Dispatch<SetStateAction<languageType[]>>
  getPriceOptions: (
    source: string,
    target: string,
    index?: number,
  ) => Array<StandardPriceListType & { groupName?: string }>
  type: string
  onDeleteLanguagePair: (row: languageType) => void
  items?: ItemType[]
}
export default function AddLanguagePairForm({
  languagePairs,
  setLanguagePairs,
  getPriceOptions,
  type,
  onDeleteLanguagePair,
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

  const updateLanguagePairs = (languagePairs: languageType[]) => {
    let updatedLanguagePairs = { ...languagePairs }
    let isValidCondition = true
    let type = 0
    const targetCurrency = languagePairs[0]?.price?.currency! ?? null
    if (targetCurrency) {
      if (languagePairs[0].price) {
        languagePairs.map((pair, index) => {
          if (pair.price && targetCurrency !== pair.price?.currency) {
            isValidCondition = false
            type = 1
            // 첫번째 Language-pair를 기준으로 currency가 맞지 않는 price를 null로 변경
            updatedLanguagePairs = languagePairs.map(item => ({
              ...item,
              price:
                item.price?.currency === targetCurrency ? item.price : null,
            }))
          }
        })
      }
    } else {
      // 첫번째 언어페어의가 null인 경우, 모든 Price를 null로 바꿈
      isValidCondition = false
      type = 2
      updatedLanguagePairs = languagePairs.map(item => ({
        ...item,
        price: null,
      }))
    }
    if (isValidCondition) setLanguagePairs(languagePairs)
    else {
      selectCurrencyViolation(type)
      setLanguagePairs(updatedLanguagePairs)
    }
  }

  const selectNotApplicableModal = () => {
    openModal({
      type: 'info-not-applicable-unavailable',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('info-not-applicable-unavailable')}
          message={`The "Not Applicable" option is currently unavailable.\n\nPlease select a price or\ncreate a new price if there is no suitable price according to the conditions.`}
          vary='info'
        />
      ),
    })
  }

  const selectCurrencyViolation = (type: number) => {
    const message1 = `Please check the currency of the selected price. You can't use different currencies in a quote.`
    const message2 =
      'Please select the price for the first language pair first.'
    openModal({
      type: 'error-currency-violation',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('error-currency-violation')}
          message={type === 1 ? message1 : message2}
          vary={type === 1 ? 'error' : 'info'}
        />
      ),
    })
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
          Language pairs ({languagePairs?.length ?? 0})
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
              onChange={(e, v) => {
                if (v) {
                  setLanguagePair({ ...languagePair, source: v?.value })
                } else {
                  setLanguagePair({ ...languagePair, source: '' })
                  setSourceFocused(false)
                }
              }}
              id='autocomplete-controlled'
              onClickCapture={() => setSourceFocused(true)}
              onClose={() => setSourceFocused(false)}
              disableClearable={languagePair.source === ''}
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={sourceFocused ? '' : 'Source'}
                />
              )}
            />

            <Icon
              icon='material-symbols:arrow-forward'
              fontSize={24}
              color='rgba(76, 78, 100, 0.54)'
            />

            <Autocomplete
              value={
                !languagePair?.target.length
                  ? []
                  : languageList.filter(item =>
                      languagePair.target.includes(item.value),
                    )
              }
              multiple
              limitTags={1}
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
              onClickCapture={() => setTargetFocused(true)}
              onClose={() => setTargetFocused(false)}
              disableClearable={languagePair.target.length === 0}
              disableCloseOnSelect
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={
                    targetFocused || languagePair.target.length > 0
                      ? ''
                      : 'Target'
                  }
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} sx={{ mr: 2 }} />
                  {option.label}
                </li>
              )}
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
              {!languagePairs?.length ? (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={3} align='center'>
                    There are no language pairs for this project
                  </TableCell>
                </TableRow>
              ) : null}
              {languagePairs &&
                languagePairs
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    const options = getPriceOptions(row.source, row.target, idx)

                    const matchingPrice = options.filter(
                      item => item.groupName === 'Matching price',
                    )
                    if (
                      matchingPrice.length === 1 &&
                      languagePairs[idx].price === null
                    ) {
                      const copyPairs = [...languagePairs]
                      copyPairs[idx].price = matchingPrice[0]
                      updateLanguagePairs(copyPairs)
                    }
                    let hasMatchingPrice = false
                    let hasStandardPrice = false
                    options.find(option => {
                      if (
                        option.groupName &&
                        option.groupName === 'Matching price'
                      )
                        hasMatchingPrice = true
                      if (
                        option.groupName &&
                        option.groupName === 'Standard client price'
                      )
                        hasStandardPrice = true
                    })
                    // row가 갑자기 여러번 리랜더링 되는 현상이 있음
                    console.log('Re-rendering-row', row)
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
                              {/* {row.price?.priceName} */}
                              {items?.[idx]?.initialPrice?.name}
                            </Typography>
                          ) : (
                            <Autocomplete
                              value={
                                !row.price
                                  ? null
                                  : options.find(
                                      item => item.id === row.price?.id,
                                    ) || null
                                // options[0].groupName === 'Current price'
                                //   ? options[0]
                                //   : options.find(
                                //       item => item.id === row.price?.id,
                                //     ) || null
                              }
                              size='small'
                              sx={{ width: 300 }}
                              options={options}
                              groupBy={option => option?.groupName ?? ''}
                              onChange={(e, v) => {
                                if (v && v.id === -1) {
                                  selectNotApplicableModal()
                                } else {
                                  const copyPairs = [...languagePairs]
                                  copyPairs[idx].price = v
                                  updateLanguagePairs(copyPairs)
                                }
                              }}
                              id='autocomplete-controlled'
                              getOptionLabel={option => option.priceName}
                              renderInput={params => (
                                <TextField {...params} placeholder='Price' />
                              )}
                              renderGroup={params => (
                                <li key={params.key}>
                                  {!hasMatchingPrice && params.group ? (
                                    <GroupHeader>
                                      Matching price{' '}
                                      <NoResultText>(No result)</NoResultText>
                                    </GroupHeader>
                                  ) : null}
                                  {!hasStandardPrice && params.group ? (
                                    <GroupHeader>
                                      Standard client price{' '}
                                      <NoResultText>(No result)</NoResultText>
                                    </GroupHeader>
                                  ) : null}
                                  <GroupHeader>{params.group}</GroupHeader>
                                  <GroupItems>{params.children}</GroupItems>
                                </li>
                              )}
                            />
                          )}
                        </TableCell>
                        {type === 'detail' ? null : (
                          <TableCell align='center'>
                            <IconButton
                              onClick={() => onDeleteLanguagePair(row)}
                            >
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
