import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Radio,
  TablePagination,
  Typography,
} from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import { ChangeEvent, useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import styled from 'styled-components'
import {
  CatInterfaceType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { FieldArrayWithId } from 'react-hook-form'
import { ItemType } from '@src/types/common/item.type'
import {
  CatCalculationType,
  MemoQData,
  MemoQInterface,
  MemoQType,
} from '@src/types/common/tm-analysis.type'
import languageHelper from '@src/shared/helpers/language.helper'
import {
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import { formatByRoundingProcedure } from '@src/shared/helpers/price.helper'
import {
  DetailNewDataType,
  onCopyAnalysisParamType,
} from '../../forms/items-form'
import useModal from '@src/hooks/useModal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

type Props = {
  fileName: string
  onClose: () => void
  data: MemoQType
  priceData: StandardPriceListType | null
  priceFactor: number | undefined
  onCopyAnalysis: (data: onCopyAnalysisParamType) => void
}

export default function MemoQModal({
  fileName,
  onClose,
  data,
  priceData,
  priceFactor,
  onCopyAnalysis,
}: Props) {
  const { openModal, closeModal } = useModal()
  const [checked, setChecked] = useState<(MemoQData & { id?: number }) | null>(
    null,
  )
  const [page, setPage] = useState<number>(0)
  const catBasis = priceData?.catBasis as CatCalculationType
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)

  const catInterfaces: CatInterfaceType[] =
    priceData?.catInterface?.memoQ.map(item => ({
      ...item,
      chips: item.chips.filter(chip => chip.selected),
    })) || []

  useEffect(() => {
    if (!data.calculationBasis.includes(catBasis) || !catInterfaces.length) {
      openModal({
        isCloseable: false,
        type: 'catBasis-not-match',
        children: (
          <SimpleAlertModal
            message="The CAT interface doesn't match. Please check the price setting or the file."
            onClose={() => {
              closeModal('catBasis-not-match')
              onClose()
            }}
          />
        ),
      })
    } else if (data.toolName !== 'Memoq') {
      openModal({
        isCloseable: false,
        type: 'tool-not-match',
        children: (
          <SimpleAlertModal
            message='Only files with all CAT Tool matches can be analyzed.'
            onClose={() => {
              closeModal('tool-not-match')
              onClose()
            }}
          />
        ),
      })
    }
  }, [data, priceData, catInterfaces])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  function renderPrice(header: string, words: number) {
    let prices = 0
    let newData: DetailNewDataType | null = null

    catInterfaces?.forEach((item, idx) => {
      if (item.chips.find(chip => chip.title === header)) {
        newData = catInterfaces[idx]
        const detailPrices = newData.priceUnitPrice
        const perWords = newData.perWords
        const calculatedWordsCount =
          words && perWords ? words / perWords : words

        const newPrice = calculatedWordsCount * detailPrices

        prices = priceFactor ? priceFactor * newPrice : newPrice
      }
    })

    return { newData, prices }
  }

  function onSubmit() {
    let result: onCopyAnalysisParamType = []
    if (checked) {
      delete checked.id
      const headers: Array<MemoQInterface> = Object.keys(checked).filter(
        key => key !== 'File' && key !== 'Total' && key !== 'Chars/Word',
      ) as Array<MemoQInterface>
      headers.forEach(header => {
        result.push(
          renderPrice(
            header,
            catBasis === 'Words'
              ? Number(checked[header]?.Words) || 0
              : Number(checked[header]?.Characters) || 0,
          ),
        )
      })
    }

    onCopyAnalysis(result)
    onClose()
  }

  function renderPriceUnitTitle(header: string) {
    let res = '-'
    catInterfaces?.forEach((item, idx) => {
      if (item.chips.find(chip => chip.title === header)) {
        const data = catInterfaces[idx]
        const prices: number = data.priceUnitPrice
        if (data?.priceUnitUnit === 'Percent') {
          res = `${data.priceUnitTitle}% at ${formatCurrency(
            formatByRoundingProcedure(
              priceFactor ? prices * priceFactor : prices,
              priceData?.decimalPlace!,
              priceData?.roundingProcedure!,
              priceData?.currency!,
            ),
            priceData?.currency ?? 'USD',
          )}`
        } else {
          res = `${data.priceUnitQuantity} ${
            data.priceUnitTitle
          } at ${formatCurrency(
            formatByRoundingProcedure(
              priceFactor ? prices * priceFactor : prices,
              priceData?.decimalPlace!,
              priceData?.roundingProcedure!,
              priceData?.currency!,
            ),
            priceData?.currency ?? 'USD',
          )}`
          return
        }
      }
    })
    return res
  }

  const Row = ({ idx, item }: { idx: number; item: MemoQData }) => {
    const [cardOpen, setCardOpen] = useState(idx === 0 ? true : false)
    const filteredData: Array<MemoQInterface> = Object.keys(item).filter(
      key => key !== 'File' && key !== 'Total' && key !== 'Chars/Word',
    ) as Array<MemoQInterface>

    return (
      <Grid item xs={12}>
        <Card>
          <Box
            padding='18px 27px'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex' alignItems='center'>
              <Radio
                onChange={() => setChecked({ ...item, id: idx })}
                checked={checked?.id === idx}
              />
              <Typography fontWeight={500}>
                {idx === 0 ? 'Total' : `File ${idx + 1}`}
              </Typography>
            </Box>

            <IconButton onClick={() => setCardOpen(!cardOpen)}>
              <Icon
                icon={`${
                  cardOpen
                    ? 'material-symbols:keyboard-arrow-up'
                    : 'material-symbols:keyboard-arrow-down'
                }`}
              />
            </IconButton>
          </Box>
          {!cardOpen ? null : (
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    {['Match', 'Price unit', `${catBasis} (%)`, 'Prices'].map(
                      (item, idx) => (
                        <HeaderCell key={idx} align='left'>
                          {item}
                        </HeaderCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((header, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{header}</TableCell>
                        {/* Price unit */}
                        <TableCell>{renderPriceUnitTitle(header)}</TableCell>
                        {/* Words or Character */}
                        <TableCell>
                          {catBasis === 'Words'
                            ? item[header]?.Words
                            : item[header]?.Characters}{' '}
                          ({Number(item[header]?.Percent)?.toFixed(1)}%)
                        </TableCell>
                        {/* Prices */}
                        <TableCell>
                          {`(${getCurrencyMark(priceData?.currency)}${
                            priceData?.currency
                          }) ${formatByRoundingProcedure(
                            renderPrice(
                              header,
                              catBasis === 'Words'
                                ? Number(item[header]?.Words) || 0
                                : Number(item[header]?.Characters) || 0,
                            ).prices,
                            priceData?.decimalPlace!,
                            priceData?.roundingProcedure!,
                            priceData?.currency!,
                          )}`}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow>
                    <TableCell>Total</TableCell>
                    {/* Price unit */}
                    <TableCell></TableCell>
                    {/* Words or Character */}
                    <TableCell></TableCell>
                    {/* Prices */}
                    <TableCell>
                      {`(${getCurrencyMark(priceData?.currency)}${
                        priceData?.currency
                      }) ${formatByRoundingProcedure(
                        filteredData.reduce((res, header) => {
                          return (res += renderPrice(
                            header,
                            catBasis === 'Words'
                              ? Number(item[header]?.Words) || 0
                              : Number(item[header]?.Characters) || 0,
                          ).prices)
                        }, 0),
                        priceData?.decimalPlace!,
                        priceData?.roundingProcedure!,
                        priceData?.currency!,
                      )}`}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </Grid>
    )
  }
  return (
    <Dialog open={true} maxWidth='lg'>
      <DialogContent>
        <Grid container spacing={6}>
          <Grid
            item
            xs={12}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h5'>
              Analysis result ({data?.data?.length || 0})
            </Typography>
            <IconButton onClick={onClose}>
              <Icon icon='ic:sharp-close' />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Box display='flex' alignItems='center' gap='32px'>
              <Typography fontWeight='bold'>CAT interface</Typography>
              <CustomChip
                size='small'
                color='primary'
                skin='light'
                style={{ textTransform: 'capitalize' }}
                label={data?.toolName}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display='flex' alignItems='center' gap='32px'>
              <Typography fontWeight='bold'>File name</Typography>
              <TableTitleTypography maxWidth='400px'>
                {fileName ?? ''}
              </TableTitleTypography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' gap='32px'>
              <Typography fontWeight='bold'>Target language</Typography>
              <Typography>{languageHelper(data?.targetLanguage)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {data.data
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            ?.map((item, idx) => (
              <Row key={idx} idx={idx} item={item} />
            ))}
          <Grid item xs={12}>
            <TablePagination
              rowsPerPageOptions={[5, 15, 30]}
              component='div'
              count={data.data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center'>
            <Button variant='contained' disabled={!checked} onClick={onSubmit}>
              Copy selected result to item
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export const HeaderCell = styled(TableCell)`
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
