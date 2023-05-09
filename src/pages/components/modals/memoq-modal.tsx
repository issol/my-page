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

import { ChangeEvent, useState } from 'react'
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
import { onCopyAnalysisParamType } from '../forms/items-form'

type Props = {
  fileName: string
  onClose: () => void
  data: MemoQType
  priceData: StandardPriceListType | null
  priceFactor: number | undefined
  details: FieldArrayWithId<
    { items: ItemType[] },
    `items.${number}.detail`,
    'id'
  >[]
  onCopyAnalysis: (data: onCopyAnalysisParamType[]) => void
}

export function MemoQModal({
  fileName,
  onClose,
  data,
  priceData,
  priceFactor,
  details,
  onCopyAnalysis,
}: Props) {
  const [checked, setChecked] = useState<(MemoQData & { id?: number }) | null>(
    null,
  )
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  const detailUnitIds = details.map(item => item.priceUnitId)
  //TODO : catInter는 id를 임시로 집어넣은 임시 데이터. 사용처는 나중에 priceData?.catInterface?.memoQ로 바꾸면 됨
  const catInter = priceData?.catInterface?.memoQ.map((item, idx) => ({
    ...item,
    priceUnitPairId: 204 || 0,
  }))

  const catInterfaces: CatInterfaceType[] =
    catInter
      ?.filter(item => detailUnitIds?.includes(item.priceUnitPairId))
      .map(item => ({
        ...item,
        chips: item.chips.filter(chip => chip.selected),
      })) || []

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  function renderPrice(header: string, words: string) {
    let prices = 0
    let detailId = undefined
    if (header === 'Total') {
      detailId = header
      const detailPrices: number =
        details
          .map(item => item.prices)
          ?.reduce((res: number, price) => (res += Number(price)), 0) || 0

      prices = priceFactor
        ? priceFactor * detailPrices * Number(words)
        : detailPrices * Number(words)
    } else {
      catInterfaces?.forEach((item, idx) => {
        if (item.chips.find(chip => chip.title === header)) {
          const data = catInterfaces[idx]
          detailId = details.find(
            detail => detail.priceUnitId === data.priceUnitPairId,
          )?.id
          const detailPrices =
            Number(
              details.find(
                detail => detail.priceUnitId === data.priceUnitPairId,
              )?.prices,
            ) || 0

          prices = priceFactor
            ? priceFactor * detailPrices * Number(words)
            : detailPrices * Number(words)
        }
      })
    }

    return { detailId: detailId, prices }
  }

  function onSubmit() {
    let result: any = []
    if (checked) {
      delete checked.id
      const headers: Array<MemoQInterface> = Object.keys(checked).filter(
        key => key !== 'File' && key !== 'Chars/Word',
      ) as Array<MemoQInterface>
      headers.forEach(header => {
        result.push(
          renderPrice(
            header,
            priceData?.catBasis === 'Words'
              ? checked[header]?.Words || '0'
              : checked[header]?.Characters || '0',
          ),
        )
      })
    }
    onCopyAnalysis(result)
  }
  function renderPriceUnitTitle(header: string) {
    let res = '-'
    catInterfaces?.forEach((item, idx) => {
      if (item.chips.find(chip => chip.title === header)) {
        const data = catInterfaces[idx]
        const prices: number =
          Number(
            details.find(detail => detail.priceUnitId === data.priceUnitPairId)
              ?.prices,
          ) || 0
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
      key => key !== 'File' && key !== 'Chars/Word',
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
              <Typography fontWeight={500}>{`File ${idx + 1}`}</Typography>
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
                    {[
                      'Match',
                      'Price unit',
                      `${priceData?.catBasis} (%)`,
                      'Prices',
                    ].map((item, idx) => (
                      <HeaderCell key={idx} align='left'>
                        {item}
                      </HeaderCell>
                    ))}
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
                          {priceData?.catBasis === 'Words'
                            ? item[header]?.Words
                            : item[header]?.Characters}{' '}
                          ({item[header]?.Percent}%)
                        </TableCell>
                        {/* Prices */}
                        <TableCell>
                          {`(${getCurrencyMark(priceData?.currency)}${
                            priceData?.currency
                          }) ${formatByRoundingProcedure(
                            renderPrice(
                              header,
                              priceData?.catBasis === 'Words'
                                ? item[header]?.Words || '0'
                                : item[header]?.Characters || '0',
                            ).prices,
                            priceData?.decimalPlace!,
                            priceData?.roundingProcedure!,
                            priceData?.currency!,
                          )}`}
                        </TableCell>
                      </TableRow>
                    )
                  })}
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
