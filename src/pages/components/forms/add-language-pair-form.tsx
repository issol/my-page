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
import styled from 'styled-components'

// ** value
import { getGloLanguage } from '@src/shared/transformer/language.transformer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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
  // languagePairs: languageType[]
  setLanguagePairs: (languagePair: languageType[]) => void
  getPriceOptions: (
    source: string,
    target: string,
    index?: number,
  ) => Array<StandardPriceListType & { groupName?: string }>
  type: string
  from: string
  onDeleteLanguagePair: (row: languageType) => void
  items?: ItemType[]
  getItem: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  control: Control<{ items: ItemType[]; languagePairs: languageType[] }, any>
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  append: UseFieldArrayAppend<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'languagePairs'
  >
  update: UseFieldArrayUpdate<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'languagePairs'
  >
  languagePairs: FieldArrayWithId<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'languagePairs',
    'id'
  >[]
}
export default function AddLanguagePairForm({
  languagePairs,
  setLanguagePairs,
  getPriceOptions,
  type,
  onDeleteLanguagePair,
  items,
  getItem,
  control,
  itemTrigger,
  append,
  update,
  from,
}: Props) {
  const { openModal, closeModal } = useModal()

  console.log(languagePairs)

  console.log(getItem(`languagePairs.0.price`))

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

    languagePair?.target?.forEach((target, index) => {
      const isDuplicated = getItem('languagePairs').some(
        pair => languagePair.source === pair.source && pair.target === target,
      )
      if (isDuplicated) return

      const options = getPriceOptions(languagePair.source, target)

      const matchingPrice = options.filter(
        item => item.groupName === 'Matching price',
      )

      result.push({
        id: uuidv4(),
        source: languagePair.source,
        target,
        price: matchingPrice.length === 1 ? matchingPrice[0] : null,
      })
    })
    result.map(value => {
      append(value)
    })

    setLanguagePair({ source: '', target: [] })
    // itemTrigger('languagePairs')
  }

  const updateLanguagePairs = (
    languagePairs: languageType[],
    v: StandardPriceListType & {
      groupName?: string | undefined
    },
    idx: number,
  ) => {
    let updatedLanguagePairs = { ...languagePairs }
    let isValidCondition = true
    let type = 0
    const firstPricedPair = languagePairs.find(
      pair =>
        pair.price !== null && JSON.stringify(pair.price) !== JSON.stringify(v),
    )
    console.log(firstPricedPair, 'hi')

    const targetCurrency = firstPricedPair?.price?.currency ?? null

    console.log(targetCurrency, 'hi')

    if (targetCurrency) {
      languagePairs.forEach(pair => {
        if (pair.price && targetCurrency !== pair.price?.currency) {
          isValidCondition = v.id === -1 ? true : false
          type = 1
          // 첫번째 Language-pair를 기준으로 currency가 맞지 않는 price를 null로 변경
          updatedLanguagePairs = languagePairs.map((item, index) => ({
            ...item,
            price: v.id === -1 || index !== idx ? item.price : null,
          }))
        }
      })
    } else {
      // 첫번째 언어페어의가 null인 경우, 모든 Price를 null로 바꿈
      // isValidCondition = false
      // type = 2
      // updatedLanguagePairs = languagePairs.map(item => ({
      //   ...item,
      //   price: null,
      // }))
    }
    if (isValidCondition) {
      setLanguagePairs(languagePairs)
      itemTrigger('languagePairs')
    } else {
      selectCurrencyViolation(type)
      setLanguagePairs(updatedLanguagePairs)
      itemTrigger('languagePairs')
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
    openModal({
      type: 'error-currency-violation',
      children: (
        <CustomModal
          title={
            type === 1
              ? `Please check the currency of the selected price. You can't use different currencies in a ${from}.`
              : 'Please select the price for the first language pair first.'
          }
          soloButton
          onClick={() => closeModal('error-currency-violation')}
          onClose={() => closeModal('error-currency-violation')}
          rightButtonText='Okay'
          vary='error'
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
          Language pairs ({getItem('languagePairs')?.length ?? 0})
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
                    // options.find(option => {
                    //   if (
                    //     option.groupName &&
                    //     option.groupName === 'Matching price'
                    //   )
                    //     hasMatchingPrice = true
                    //   if (
                    //     option.groupName &&
                    //     option.groupName === 'Standard client price'
                    //   )
                    //     hasStandardPrice = true
                    // })
                    // row가 갑자기 여러번 리랜더링 되는 현상이 있음

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
                          {type === 'detail' ? (
                            <Typography variant='body1' fontSize={14}>
                              {/* {row.price?.priceName} */}
                              {items?.[idx]?.initialPrice?.name}
                            </Typography>
                          ) : (
                            <Controller
                              name={`languagePairs.${idx}.price`}
                              control={control}
                              render={({
                                field: { value, onChange },
                                fieldState: { isDirty },
                              }) => {
                                console.log(value)
                                return (
                                  <Autocomplete
                                    value={
                                      !value
                                        ? null
                                        : getPriceOptions(
                                            row.source,
                                            row.target,
                                          ).find(
                                            item => item.id === value?.id,
                                          ) || null
                                    }
                                    size='small'
                                    sx={{ width: 300 }}
                                    options={getPriceOptions(
                                      row.source,
                                      row.target,
                                    )}
                                    groupBy={option => option?.groupName ?? ''}
                                    onChange={(e, v) => {
                                      if (!v) {
                                        onChange(null)
                                      } else {
                                        // if (v.id === -1) {
                                        //   selectNotApplicableModal()
                                        // } else {
                                        onChange(v)
                                        console.log(v, 'bye')

                                        const copyPairs = [
                                          ...getItem('languagePairs'),
                                        ]
                                        copyPairs[idx].price = v
                                        updateLanguagePairs(copyPairs, v, idx)
                                      }
                                      // }
                                    }}
                                    id='autocomplete-controlled'
                                    getOptionLabel={option => option.priceName}
                                    renderInput={params => (
                                      <TextField
                                        {...params}
                                        placeholder='Price*'
                                        error={value === null}
                                      />
                                    )}
                                    renderGroup={params => (
                                      <li key={params.key}>
                                        {!getPriceOptions(
                                          row.source,
                                          row.target,
                                        ).find(
                                          value =>
                                            value.groupName ===
                                            'Matching price',
                                        ) && params.group ? (
                                          <GroupHeader>
                                            Matching price{' '}
                                            <NoResultText>
                                              (No result)
                                            </NoResultText>
                                          </GroupHeader>
                                        ) : null}
                                        {!getPriceOptions(
                                          row.source,
                                          row.target,
                                        ).find(
                                          value =>
                                            value.groupName ===
                                            'Standard client price',
                                        ) && params.group ? (
                                          <GroupHeader>
                                            Standard client price{' '}
                                            <NoResultText>
                                              (No result)
                                            </NoResultText>
                                          </GroupHeader>
                                        ) : null}
                                        <GroupHeader>
                                          {params.group}
                                        </GroupHeader>
                                        <GroupItems>
                                          {params.children}
                                        </GroupItems>
                                      </li>
                                    )}
                                  />
                                )
                              }}
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
          count={getItem('languagePairs')?.length ?? 0}
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
