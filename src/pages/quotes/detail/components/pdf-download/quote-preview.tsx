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

// ** apis
import { useMutation } from 'react-query'
import { patchQuoteProjectInfo } from '@src/apis/quote/quotes.api'

// ** languages
import quoteEn from '@src/shared/i18/quotes/en.json'
import quoteKo from '@src/shared/i18/quotes/ko.json'

// ** components
import MakeTable from './rows'

// ** hooks
import useModal from '@src/hooks/useModal'

type Props = {
  data: QuoteDownloadData
  type: 'preview' | 'download'
  user: UserDataType
  lang: 'EN' | 'KO'
}

const PrintQuotePage = ({ data, type, user, lang }: Props) => {
  const router = useRouter()
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  const columnName = lang === 'EN' ? quoteEn : quoteKo
  const patchProjectInfoMutation = useMutation(
    (data: { id: number; form: { downloadedAt: string } }) =>
      patchQuoteProjectInfo(data.id, data.form),
    {},
  )
  console.log('data', data)
  useEffect(() => {
    if (type === 'download') {
      setTimeout(() => {
        window.onafterprint = () => {
          router.back()
          dispatch(setIsReady(''))
          closeModal('DownloadQuotesModal')
          patchProjectInfoMutation.mutate({
            id: data.quoteId,
            form: { downloadedAt: Date() },
          })
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

  return (
    <Fragment>
      {!data ? null : (
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
                {data.adminCompanyName}
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
              No. {data?.corporationId}
            </Typography>

            <Box display='flex' justifyContent='space-between'>
              <Box display='flex' alignItems='center' gap='10px'>
                <Typography
                  variant='subtitle1'
                  fontWeight={lang === 'EN' ? 600 : 800}
                  fontSize={14}
                >
                  {columnName.quoteDate}:
                </Typography>
                <Typography variant='subtitle1' fontSize={14}>
                  {FullDateTimezoneHelper(data?.quoteDate.date, user?.timezone)}
                </Typography>
              </Box>
              <Box
                display='flex'
                justifyContent='flex-end'
                alignItems='center'
                gap='10px'
              >
                <Typography variant='subtitle1' fontWeight={600} fontSize={14}>
                  PM:
                </Typography>
                <Box display='flex' alignItems='center' gap='3px'>
                  <Typography variant='subtitle1' fontSize={14}>
                    {getLegalName({
                      firstName: data?.pm.firstName,
                      middleName: data?.pm.middleName,
                      lastName: data?.pm.lastName,
                    })}
                    &nbsp;
                  </Typography>
                  <Divider orientation='vertical' flexItem variant='middle' />
                  <Typography variant='subtitle1' fontSize={14}>
                    &nbsp;{data?.pm.email}
                  </Typography>
                </Box>
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
                {columnName.quoteTo} :
              </Typography>
              <Typography variant='subtitle1' fontSize={14}>
                {data?.companyName}
              </Typography>
            </Box>
            <Box display='flex' flexDirection='column' gap='3px'>
              <Box display='flex' alignItems='center' gap='3px'>
                {data?.contactPerson ? (
                  <Typography variant='subtitle1' fontSize={14}>
                    {getLegalName({
                      firstName: data?.contactPerson.firstName!,
                      middleName: data?.contactPerson.middleName!,
                      lastName: data?.contactPerson.lastName!,
                    })}
                    &nbsp;
                  </Typography>
                ) : null}
                {data?.contactPerson && data.contactPerson?.jobTitle ? (
                  <>
                    <Divider orientation='vertical' flexItem variant='middle' />
                    <Typography variant='subtitle1' fontSize={14}>
                      &nbsp;{data.contactPerson.jobTitle}
                    </Typography>
                  </>
                ) : null}
              </Box>
              {getAddress(data?.clientAddress) === '-' ? null : (
                <Typography variant='subtitle1' fontSize={14}>
                  {getAddress(data?.clientAddress)}
                </Typography>
              )}

              <Typography variant='subtitle1' fontSize={14}>
                {data?.contactPerson
                  ? data?.contactPerson.email
                  : data?.client?.client.email}
              </Typography>
              <Typography variant='subtitle1' fontSize={14}>
                {getPhoneNumber(
                  data?.contactPerson !== null
                    ? data?.contactPerson?.mobile
                    : data?.client?.client.mobile,
                  data?.contactPerson !== null
                    ? data.contactPerson?.timezone.phone
                    : data?.client?.client?.timezone.phone,
                )}
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
                {columnName.projectName}:
              </Typography>
              <Typography variant='subtitle1' fontSize={14}>
                {data.projectName}
              </Typography>
            </Box>
            {data.estimatedDeliveryDate?.date ? (
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
            ) : null}
            {data.projectDueDate?.date ? (
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
            ) : null}
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
                    <CustomTableCell sx={{ flex: 0.409 }}>
                      <Box>{columnName.itemDescription}:</Box>
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
                      sx={{ flex: 0.2434, justifyContent: 'center' }}
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
                      sx={{ flex: 0.1505, justifyContent: 'center' }}
                    >
                      <Box>{`${columnName?.price} (${data?.langItem
                        ?.languagePairs[0]?.price?.currency!})`}</Box>
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
                        flex: 0.1905,
                        paddingLeft: '20px',
                      }}
                    >
                      <Box>{`${columnName.totalPrice} (${data?.langItem
                        ?.languagePairs[0]?.price?.currency!})`}</Box>
                    </CustomTableCell>
                  </CustomTableRow>
                </TableHead>
                <MakeTable
                  rows={data?.langItem?.items ?? []}
                  currency={data?.langItem?.languagePairs[0]?.price?.currency!}
                />
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
                          Subtotal:
                        </Typography>
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontWeight: 600,
                            color: '#666CFF',
                            fontSize: '14px',
                            paddingLeft: '0px',
                          }}
                        >
                          {!data.langItem
                            ? 0
                            : formatCurrency(
                                calculateTotalPriceRows(data.langItem),
                                data?.langItem?.languagePairs[0]?.price
                                  ?.currency! || 'USD',
                              )}
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
      )}
    </Fragment>
  )
}

export default PrintQuotePage

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
