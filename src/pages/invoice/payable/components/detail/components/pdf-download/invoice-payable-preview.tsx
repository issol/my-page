import { Fragment, useEffect } from 'react'

// ** helpers
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import {
  contryCodeAndPhoneNumberFormatter,
  splitContryCodeAndPhoneNumber,
} from '@src/shared/helpers/phone-number-helper'

// ** types
import { LanguageAndItemType } from '@src/types/orders/order-detail'
import { UserDataType } from '@src/context/types'
import { InvoicePayableDownloadData } from '@src/types/invoice/payable.type'

// ** NextJs
import { useRouter } from 'next/router'

// ** style components
import {
  Box,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import styled from 'styled-components'

// ** store
import { useAppDispatch } from '@src/hooks/useRedux'
import { setIsReady } from '@src/store/quote'

// ** languages
import invoiceEn from '@src/shared/i18/invoice-payable/en.json'
import invoiceKo from '@src/shared/i18/invoice-payable/ko.json'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** types & helpers
import { ItemType } from '@src/types/common/item.type'
import languageHelper from '@src/shared/helpers/language.helper'
import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

type Props = {
  data: InvoicePayableDownloadData
  type: 'preview' | 'download'
  user: UserDataType
  lang: 'EN' | 'KO'
}

const PrintInvoicePayablePreview = ({ data, type, user, lang }: Props) => {
  const router = useRouter()
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  const columnName = lang === 'EN' ? invoiceEn : invoiceKo

  useEffect(() => {
    if (type === 'download') {
      setTimeout(() => {
        window.onafterprint = () => {
          router.back()
          dispatch(setIsReady(''))
          closeModal('DownloadQuotesModal')
        }
        window.print()
      }, 300)
    }
  }, [type])

  function calculateTotalPriceRows(
    rows: {
      name: string
      unitPrice: number
      quantity: number
      prices: string
    }[],
  ): number {
    return rows.reduce((total, row) => {
      return total + Number(row.quantity) * Number(row.prices)
    }, 0)
  }

  function calculateTotalPrice(row: ItemType[]): number {
    return row.reduce((total, item) => {
      return total + item.totalPrice
    }, 0)
  }

  return (
    <Fragment>
      <Grid container sx={{ padding: '24px', background: '#FFFFFF' }}>
        {/* 1번째 칸 */}
        <Grid
          item
          xs={12}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          padding='20px'
        >
          <Box display='flex' flexDirection='column' gap='3px'>
            <Typography
              variant='subtitle1'
              fontWeight={lang === 'EN' ? 600 : 800}
              fontSize={14}
            >
              {columnName.companyName}
            </Typography>
            <Typography variant='subtitle2'>{data?.companyAddress}</Typography>
          </Box>
          <Box>
            <img src='/images/logos/gloz-logo-large.svg' alt='' />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* 2번째 칸 */}
        <Grid
          item
          xs={12}
          display='flex'
          flexDirection='column'
          gap='3px'
          padding='20px'
        >
          <Box display='flex' flexDirection='column' gap='10px'>
            <Box display='flex' alignItems='center' gap='10px'>
              <Typography
                variant='subtitle1'
                fontWeight={lang === 'EN' ? 600 : 800}
                fontSize={14}
              >
                {columnName.invoiceNumber} :
              </Typography>
              <Typography variant='subtitle1' fontSize={14}>
                {data?.corporationId}
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' gap='10px'>
              <Typography
                variant='subtitle1'
                fontWeight={lang === 'EN' ? 600 : 800}
                fontSize={14}
              >
                {columnName.invoiceDate}:
              </Typography>
              <Typography variant='subtitle1' fontSize={14}>
                {convertTimeToTimezone(
                  data?.invoicedAt,
                  user?.timezone,
                  timezone.getValue(),
                )}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* 3번째 칸 */}
        <Grid
          item
          xs={12}
          display='flex'
          flexDirection='column'
          gap='20px'
          padding='20px'
        >
          <Box display='flex' alignItems='center' gap='10px' flex={1}>
            <Typography
              variant='subtitle1'
              fontWeight={lang === 'EN' ? 600 : 800}
              fontSize={14}
            >
              {columnName.invoiceFrom} :
            </Typography>
            <Typography variant='subtitle1' fontSize={14}>
              {data?.pro?.name}
            </Typography>
          </Box>
          <Box display='flex' flexDirection='column' gap='3px'>
            <Typography variant='subtitle1' fontSize={14}>
              {`${
                data.pro?.address?.baseAddress
                  ? `${data.pro.address.baseAddress}, `
                  : ''
              }${
                data.pro?.address?.detailAddress
                  ? `${data.pro.address.detailAddress}, `
                  : ''
              }${data.pro?.address?.city ? `${data.pro.address.city}, ` : ''}${
                data.pro?.address?.state ? `${data.pro.address.state}, ` : ''
              }${
                data.pro?.address?.country
                  ? `${data.pro.address.country}, `
                  : ''
              }${data.pro?.address?.zipCode ? data.pro.address.zipCode : ''}`}
            </Typography>

            <Typography variant='subtitle1' fontSize={14}>
              {data.pro?.email}
            </Typography>
            <Typography variant='subtitle1' fontSize={14}>
              {!data?.pro?.mobile
                ? '-'
                : contryCodeAndPhoneNumberFormatter(
                    splitContryCodeAndPhoneNumber(data.pro.mobile),
                  )}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* 4번째 칸 */}
        {/* 테이블 */}
        <Grid item xs={12} sx={{ paddingRight: '6px' }}>
          <TableContainer>
            <Table aria-label='customized table'>
              <TableHead
                sx={{
                  textTransform: 'none',
                  background: '#F5F5F7',
                  display: 'flex',
                  width: '100%',
                  height: '54px',
                }}
              >
                <CustomTableRow>
                  <CustomTableCell sx={{ flex: 0.4469 }}>
                    <Box>{columnName.jobDescription}:</Box>
                  </CustomTableCell>
                  <CustomTableCell
                    align='center'
                    sx={{ padding: '16px 0', flex: 0.0022 }}
                  >
                    <img
                      src='/images/icons/pro-icons/seperator.svg'
                      alt='sep'
                    />
                  </CustomTableCell>
                  <CustomTableCell
                    sx={{ flex: 0.1497, justifyContent: 'center' }}
                  >
                    <Box>{columnName.quantity}:</Box>
                  </CustomTableCell>
                  <CustomTableCell
                    align='center'
                    sx={{ padding: '16px 0', flex: 0.0022 }}
                  >
                    <img
                      src='/images/icons/pro-icons/seperator.svg'
                      alt='sep'
                    />
                  </CustomTableCell>
                  <CustomTableCell
                    sx={{ flex: 0.1654, justifyContent: 'center' }}
                  >
                    <Box>
                      {columnName.price} ({data.currency}):
                    </Box>
                  </CustomTableCell>
                  <CustomTableCell
                    align='center'
                    sx={{ padding: '16px 0', flex: 0.0022 }}
                  >
                    <img
                      src='/images/icons/pro-icons/seperator.svg'
                      alt='sep'
                    />
                  </CustomTableCell>
                  <CustomTableCell
                    sx={{
                      flex: 0.2335,
                      paddingLeft: '20px',
                    }}
                  >
                    <Box>
                      {columnName.totalPrice} ({data.currency}):
                    </Box>
                  </CustomTableCell>
                </CustomTableRow>
              </TableHead>
              {/* Table */}
              <tbody className='table-body'>
                {data?.jobList?.map((job, idx) => {
                  return (
                    <Box key={idx} className='table-item'>
                      {job.prices?.map((value, index) => {
                        return (
                          <>
                            {index === 0 ? (
                              <Typography
                                variant='subtitle1'
                                sx={{
                                  fontWeight: 600,
                                  padding: '20px',
                                  width: '100%',
                                  fontSize: '14px',
                                }}
                              >
                                [{languageHelper(job.sourceLanguage)} &rarr;{' '}
                                {languageHelper(job.targetLanguage)}
                                ]&nbsp;{job.name}
                              </Typography>
                            ) : null}
                            <TableRow
                              key={index}
                              className='table-row'
                              sx={{
                                display: 'flex',
                                background:
                                  index % 2 === 0 ? '#ffffff' : '#F5F5F7',
                                height: '30px',
                              }}
                            >
                              <td className='table-row-first'>
                                <ul style={{ paddingLeft: '20px' }}>
                                  <li>
                                    <h6 className='subtitle2'>{value.name}</h6>
                                  </li>
                                </ul>
                              </td>
                              <td className='table-row-divider'></td>
                              <td className='table-row-second'>
                                <div className='table-row-second-content'>
                                  <h6 className='subtitle2'>
                                    {value.quantity}
                                  </h6>
                                  <h6 className='subtitle3'>{value.unit}</h6>
                                </div>
                              </td>

                              <td className='table-row-divider'></td>
                              <td className='table-row-third'>
                                <div className='flex-start-box'>
                                  <h6 className='subtitle2'>
                                    {formatCurrency(
                                      value.prices,
                                      data.currency,
                                    )}
                                  </h6>
                                </div>
                              </td>
                              <td className='table-row-divider'></td>
                              <td className='table-row-fourth'>
                                <div className='table-row-fourth-content'>
                                  <h6 className='subtitle2'>
                                    {formatCurrency(
                                      value.quantity * Number(value.prices),
                                      data.currency,
                                    )}
                                  </h6>
                                </div>
                              </td>
                            </TableRow>
                            {index === job.prices.length - 1 ? (
                              <tr className='table-row-total'>
                                <td className='table-row-first'></td>
                                <td className='table-row-divider'></td>
                                <td className='table-row-second'></td>
                                <td className='table-row-divider'></td>
                                <td className='table-row-third'></td>
                                <td className='table-row-divider'></td>
                                <td className='table-row-fourth'>
                                  <div className='table-row-fourth-content'>
                                    <Typography fontWeight={600}>
                                      {formatCurrency(
                                        calculateTotalPriceRows(job.prices),
                                        data.currency,
                                      )}
                                    </Typography>
                                  </div>
                                </td>
                              </tr>
                            ) : null}
                          </>
                        )
                      })}
                    </Box>
                  )
                })}
              </tbody>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* 5번째 칸 */}
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align='right'
                    style={{ border: 'none', paddingTop: 0, paddingBottom: 0 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '50px',
                        mt: '10px',
                      }}
                      className='total-price'
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontWeight: 600,
                          fontSize: '14px',
                        }}
                      >
                        {columnName.subTotal}:
                      </Typography>
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontWeight: 600,
                          fontSize: '14px',
                        }}
                      >
                        {formatCurrency(data.subtotal, data.currency)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                {data?.tax ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align='right'
                      style={{
                        border: 'none',
                        paddingTop: 0,
                        paddingBottom: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '50px',
                          mt: '10px',
                        }}
                        className='total-price'
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontWeight: 600,
                            fontSize: '14px',
                          }}
                        >
                          {columnName.tax}{' '}
                          {`(${Number(data.taxRate)?.toFixed(2)}%)`}:
                        </Typography>
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontWeight: 600,
                            fontSize: '14px',
                          }}
                        >
                          {Math.sign(data.tax) === 1 ? '+' : '-'}{' '}
                          {formatCurrency(data.tax, data.currency)}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
              {/* 6번째 칸 */}
              {/* Table */}
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align='right'
                    style={{ border: 'none' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '50px',
                        mt: '10px',
                      }}
                      className='total-price'
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontWeight: 600,
                          color: '#666CFF',
                          fontSize: '14px',
                        }}
                      >
                        {columnName.totalPrice}:
                      </Typography>
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontWeight: 600,
                          color: '#666CFF',
                          fontSize: '14px',
                        }}
                      >
                        {formatCurrency(data.totalPrice, data.currency)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} mt='15px' padding='20px'>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <Typography variant='subtitle1' fontSize={14}>
              Yours sincerely,
            </Typography>
            <Typography variant='subtitle1' fontWeight={600} fontSize={14}>
              The GloZ team
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default PrintInvoicePayablePreview

const CustomTableRow = styled(TableRow)`
  display: flex;
  align-items: center;
  height: 54px;
  flex: 1;
`
const CustomTableCell = styled(TableCell)`
  display: flex !important;
  align-items: center;
  height: 54px;
`
