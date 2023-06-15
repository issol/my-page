import { Fragment, useEffect } from 'react'

// ** helpers
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getAddress } from '@src/shared/helpers/address-helper'
import { getPhoneNumber } from '@src/shared/helpers/phone-number-helper'

// ** types
import { LanguageAndItemType } from '@src/types/orders/order-detail'
import { UserDataType } from '@src/context/types'
import { QuoteDownloadData } from '@src/types/common/quotes.type'

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
import quoteEn from '@src/shared/i18/invoice-payable/en.json'
import quoteKo from '@src/shared/i18/invoice-payable/ko.json'

// ** components
// import MakeTable from './rows'

// ** hooks
import useModal from '@src/hooks/useModal'
import { ItemType } from '@src/types/common/item.type'

//TODO: data 타입수정하기
//TODO: 실데이터로 채우기
type Props = {
  data: any
  type: 'preview' | 'download'
  user: UserDataType
  lang: 'EN' | 'KO'
}

const PrintInvoicePayablePreview = ({ data, type, user, lang }: Props) => {
  const router = useRouter()
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  const columnName = lang === 'EN' ? quoteEn : quoteKo

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

  function calculateTotalPriceRows(rows: LanguageAndItemType): number {
    return rows.items.reduce((total, row) => {
      return total + row.totalPrice
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
            <Typography variant='subtitle2'>
              {columnName.companyAddress}
            </Typography>
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
          <Typography variant='subtitle1' fontSize={14}>
            {/* No. {data?.corporationId} */}
          </Typography>

          <Box display='flex' flexDirection='column' gap='10px'>
            <Box display='flex' alignItems='center' gap='10px'>
              <Typography
                variant='subtitle1'
                fontWeight={lang === 'EN' ? 600 : 800}
                fontSize={14}
              >
                {columnName.invoiceNumber}:
              </Typography>
              <Typography variant='subtitle1' fontSize={14}>
                {/* {FullDateTimezoneHelper(data?.quoteDate, user?.timezone)} */}
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
                {/* {FullDateTimezoneHelper(data?.quoteDate, user?.timezone)} */}
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
              {/* {data?.companyName} */}
            </Typography>
          </Box>
          <Box display='flex' flexDirection='column' gap='3px'>
            <Box display='flex' alignItems='center' gap='3px'>
              {/* {data?.contactPerson ? (
                  <Typography variant='subtitle1' fontSize={14}>
                    {getLegalName({
                      firstName: data?.contactPerson.firstName!,
                      middleName: data?.contactPerson.middleName!,
                      lastName: data?.contactPerson.lastName!,
                    })}
                    &nbsp;
                  </Typography>
                ) : null} */}
              {/* {data?.contactPerson && data.contactPerson?.jobTitle ? (
                  <>
                    <Divider orientation='vertical' flexItem variant='middle' />
                    <Typography variant='subtitle1' fontSize={14}>
                      &nbsp;{data.contactPerson.jobTitle}
                    </Typography>
                  </>
                ) : null} */}
            </Box>
            {/* {getAddress(data?.clientAddress) === '-' ? null : (
                <Typography variant='subtitle1' fontSize={14}>
                  {getAddress(data?.clientAddress)}
                </Typography>
              )} */}

            <Typography variant='subtitle1' fontSize={14}>
              {/* {data?.contactPerson
                  ? data?.contactPerson.email
                  : data?.client?.client.email} */}
            </Typography>
            <Typography variant='subtitle1' fontSize={14}>
              {/* {getPhoneNumber(
                  data?.contactPerson !== null
                    ? data?.contactPerson?.mobile
                    : data?.client?.client.mobile,
                  data?.contactPerson !== null
                    ? data.contactPerson?.timezone.phone
                    : data?.client?.client?.timezone.phone,
                )} */}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* 4번째 칸 */}
        <Grid
          item
          xs={12}
          display='flex'
          flexDirection='column'
          gap='4px'
          padding='20px'
        >
          <Box display='flex' alignItems='center' gap='10px' flex={1}>
            <Typography
              variant='subtitle1'
              fontWeight={lang === 'EN' ? 600 : 800}
              fontSize={14}
            >
              {/* {columnName.projectName}: */}
            </Typography>
            <Typography variant='subtitle1' fontSize={14}>
              {/* {data.projectName} */}
            </Typography>
          </Box>
          {/* {data.estimatedDeliveryDate?.date ? (
              <Box display='flex' alignItems='center' gap='10px'>
                <Typography
                  variant='subtitle1'
                  fontWeight={lang === 'EN' ? 600 : 800}
                  fontSize={14}
                >
                  {columnName.estimatedDeliveryDate} :
                </Typography>
                <Typography variant='subtitle1' fontSize={14}>
                  {FullDateTimezoneHelper(
                    data?.estimatedDeliveryDate.date,
                    data?.estimatedDeliveryDate?.timezone,
                  )}
                </Typography>
              </Box>
            ) : null} */}
          {/* {data.projectDueDate?.date ? (
              <Box display='flex' alignItems='center' gap='10px'>
                <Typography
                  variant='subtitle1'
                  fontWeight={lang === 'EN' ? 600 : 800}
                  fontSize={14}
                >
                  {columnName.projectDueDate} :
                </Typography>
                <Typography variant='subtitle1' fontSize={14}>
                  {FullDateTimezoneHelper(
                    data?.projectDueDate.date,
                    data?.projectDueDate?.timezone,
                  )}
                </Typography>
              </Box>
            ) : null} */}
        </Grid>

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
                    <Box>{columnName.price} (USD):</Box>
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
                    <Box>{columnName.totalPrice} (USD):</Box>
                  </CustomTableCell>
                </CustomTableRow>
              </TableHead>
              {/* <MakeTable rows={data?.langItem?.items ?? []} /> */}
              {/* Table */}
              <tbody className='table-body'>
                {[1, 2].map((item, index) => (
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
                        {/* [{languageHelper(row.source)} &rarr;{' '}
                    {languageHelper(row.target)}
                    ]&nbsp;{row.name} */}
                        korean - english
                      </Typography>
                    ) : null}

                    <TableRow
                      className='table-row'
                      sx={{
                        display: 'flex',
                        background: index % 2 === 0 ? '#ffffff' : '#F5F5F7',
                      }}
                    >
                      <td
                        className='table-row-first'
                        style={{ height: '20px' }}
                      >
                        <ul style={{ paddingLeft: '20px', height: '20px' }}>
                          <li>
                            <h6 className='subtitle2'>price unit</h6>
                          </li>
                        </ul>
                      </td>
                      <td className='table-row-divider'></td>
                      <td className='table-row-second'>
                        <div className='table-row-second-content'>
                          <h6 className='subtitle2'>quantity</h6>
                          <h6 className='subtitle3'>unit</h6>
                        </div>
                      </td>
                      <td className='table-row-divider'></td>
                      <td className='table-row-third'>
                        <div className='center-box'>
                          <h6 className='subtitle2'>
                            {/* {formatCurrency(value.unitPrice, 'USD')} */}
                          </h6>
                        </div>
                      </td>
                      <td className='table-row-divider'></td>
                      <td className='table-row-fourth'>
                        <div className='table-row-fourth-content'>
                          <h6 className='subtitle2'>
                            {/* {formatCurrency(row.totalPrice, 'USD')} */}
                          </h6>
                        </div>
                      </td>
                    </TableRow>
                    {/* {index === row.detail?.length! - 1 ? (
                  <tr className='table-row-total'>
                    <td className='table-row-first'></td>
                    <td className='table-row-divider'></td>
                    <td className='table-row-second'></td>
                    <td className='table-row-divider'></td>
                    <td className='table-row-third'></td>
                    <td className='table-row-divider'></td>
                    <td className='table-row-fourth'>
                      <div className='table-row-fourth-content'>
                        <h6 className='primary-subtitle'>
                          {formatCurrency(calculateTotalPrice(rows), 'USD')}
                        </h6>
                      </div>
                    </td>
                  </tr>
                ) : null} */}
                  </>
                ))}
              </tbody>

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
                        Total:
                      </Typography>
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontWeight: 600,
                          color: '#666CFF',
                          fontSize: '14px',
                        }}
                      >
                        {/* {!data.langItem
                            ? 0
                            : formatCurrency(
                                calculateTotalPriceRows(data.langItem),
                                'USD',
                              )} */}
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
