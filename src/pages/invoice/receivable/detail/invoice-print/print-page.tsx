import { useEffect } from 'react'

import { useRouter } from 'next/router'
import {
  Box,
  Divider,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { UserDataType } from '@src/context/types'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getAddress } from '@src/shared/helpers/address-helper'
import { getPhoneNumber } from '@src/shared/helpers/phone-number-helper'
import { useAppDispatch } from '@src/hooks/useRedux'
import { resetOrderLang } from '@src/store/order'
import { useMutation } from 'react-query'

import { InvoiceDownloadData } from '@src/types/invoice/receivable.type'
import { patchInvoiceInfo } from '@src/apis/invoice/receivable.api'
import MakeTable from './rows'

type Props = {
  data: InvoiceDownloadData
  type: string
  user: UserDataType
  lang: 'EN' | 'KO'
}

const PrintInvoicePage = ({ data, type, user, lang }: Props) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const patchInvoiceInfoMutation = useMutation(
    (data: {
      id: number
      form: { downloadedAt: string }
      type: 'basic' | 'accounting'
    }) => patchInvoiceInfo(data.id, data.form, data.type),
    {},
  )

  // print page에서 사용할 Currency 정보
  // const invoiceCurrency = data.currency
  const invoiceCurrency = data.orders[0].languagePairs[0].currency

  useEffect(() => {
    if (type === 'download') {
      setTimeout(() => {
        window.onafterprint = () => {
          router.back()
          dispatch(resetOrderLang('EN'))
          patchInvoiceInfoMutation.mutate({
            id: data.invoiceId,
            form: { downloadedAt: Date() },
            type: 'basic',
          })
        }
        try {
          document.title = `${data.corporationId}_${data.companyName}`
          window.print()
        } catch (error) {
          console.log(error)
        }
      }, 1000)
    }
  }, [type])

  function formatOrderId(ids: string[]) {
    console.log(ids)

    const formattedIds = ids.map((item, index) => {
      if (index === ids.length - 1) {
        return item
      } else {
        return item + ','
      }
    })

    console.log(formattedIds)

    return formattedIds.join(' ')
  }

  return (
    <Box
      sx={{ padding: '24px', width: '100%', background: '#FFFFFF' }}
      id='modal-content'
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: lang === 'EN' ? 600 : 800, fontSize: '14px' }}
          >
            {/* {data.adminCompanyName} */}
            {lang === 'EN' ? 'GloZ Inc.' : '글로지(주)'}
          </Typography>
          <Typography variant='subtitle2'>
            {lang === 'EN'
              ? '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010'
              : '서울특별시 금천구 가산디지털1로 204, 903호 (가산 반도아이비밸리)'}
          </Typography>
        </Box>
        <Box>
          <img src='/images/logos/gloz-logo-large.svg' alt='' />
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          padding: '20px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: lang === 'EN' ? 600 : 800, fontSize: '14px' }}
          >
            {lang === 'EN' ? 'Invoice No:' : '인보이스 번호:'}
          </Typography>
          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {data.corporationId}
            {/* {FullDateTimezoneHelper(data.invoicedAt, user.timezone)} */}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: lang === 'EN' ? 600 : 800, fontSize: '14px' }}
          >
            {lang === 'EN' ? 'Order No:' : '오더 번호:'}
          </Typography>
          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {formatOrderId(data.orderCorporationId)}
            {/* {data.orderCorporationId.map((value, idx) => {
              return <>{formatOrderId(data.orderCorporationId)}</>
            })} */}
            {/* {FullDateTimezoneHelper(data.invoicedAt, user.timezone)} */}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: lang === 'EN' ? 600 : 800, fontSize: '14px' }}
          >
            {lang === 'EN' ? 'Invoice date:' : '정산 요청일:'}
          </Typography>
          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {FullDateTimezoneHelper(data.invoicedAt, user.timezone)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: lang === 'EN' ? 600 : 800, fontSize: '14px' }}
            >
              {lang === 'EN' ? 'Payment due:' : '납부 기한:'}
            </Typography>
            <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
              {FullDateTimezoneHelper(
                data.paymentDueAt.date,
                data.paymentDueAt.timezone,
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 600, fontSize: '14px' }}
            >
              PM:
            </Typography>
            <Box sx={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
                {getLegalName({
                  firstName: data.pm.firstName,
                  middleName: data.pm.middleName,
                  lastName: data.pm.lastName,
                })}
                &nbsp;
              </Typography>
              <Divider orientation='vertical' flexItem variant='middle' />
              <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
                &nbsp;{data.pm.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: 1,
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 600, fontSize: '14px' }}
          >
            Invoice for:
          </Typography>
          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {data.companyName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '3px', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            {data.contactPerson ? (
              <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
                {getLegalName({
                  firstName: data.contactPerson.firstName!,
                  middleName: data.contactPerson.middleName!,
                  lastName: data.contactPerson.lastName!,
                })}
                &nbsp;
              </Typography>
            ) : null}
            {data.contactPerson && data.contactPerson.jobTitle ? (
              <>
                <Divider orientation='vertical' flexItem variant='middle' />
                <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
                  &nbsp;{data.contactPerson.jobTitle}
                </Typography>
              </>
            ) : null}
          </Box>
          {getAddress(data.clientAddress) === '-' ? null : (
            <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
              {lang === 'KO'
                ? getAddress(data.clientAddress)?.replace(
                    'Korea, Republic of,',
                    '대한민국',
                  )
                : getAddress(data.clientAddress)}
            </Typography>
          )}

          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {data.contactPerson
              ? data.contactPerson.email
              : data.client.client.email}
          </Typography>
          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {getPhoneNumber(
              data.contactPerson !== null
                ? data.contactPerson.mobile!
                : data.client.client.mobile,
              data.contactPerson !== null
                ? data.contactPerson.timezone?.phone
                : data.client.client.timezone.phone,
            )}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: 1,
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: lang === 'EN' ? 600 : 800, fontSize: '14px' }}
          >
            {lang === 'EN' ? 'Project name:' : '업무내역:'}
          </Typography>
          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {data.projectName}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ paddingRight: '6px' }}>
        <TableContainer>
          <Table aria-label='customized table'>
            <TableHead
              sx={{
                textTransform: 'none',
                background: '#F5F5F7',
                display: 'flex',
                width: '100%',
                height: '54px',
                maxHeight: '54px',
              }}
            >
              <TableRow
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  height: '54px',
                  maxHeight: '54px',
                }}
              >
                <TableCell
                  sx={{
                    flex: 0.4469,

                    height: '54px',
                    display: 'flex !important',
                    alignItems: 'center',
                  }}
                >
                  <Box>{lang === 'EN' ? 'Item description' : '상세 내역'}</Box>
                </TableCell>
                <TableCell
                  sx={{
                    height: '54px',

                    padding: '16px 0',
                    textAlign: 'center',

                    flex: 0.0022,
                  }}
                >
                  <img src='/images/icons/pro-icons/seperator.svg' alt='sep' />
                </TableCell>
                <TableCell
                  sx={{
                    flex: 0.1497,

                    height: '54px',
                    display: 'flex !important',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box>{lang === 'EN' ? 'Quantity' : '수량'}</Box>
                </TableCell>
                <TableCell
                  sx={{
                    height: '54px',

                    padding: '16px 0',
                    textAlign: 'center',

                    flex: 0.0022,
                  }}
                >
                  <img src='/images/icons/pro-icons/seperator.svg' alt='sep' />
                </TableCell>
                <TableCell
                  sx={{
                    flex: 0.1654,

                    height: '54px',
                    display: 'flex !important',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box>
                    {lang === 'EN'
                      ? `Price (${invoiceCurrency ?? ''})`
                      : `단가 (${invoiceCurrency ?? ''})`}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    height: '54px',

                    padding: '16px 0',
                    textAlign: 'center',

                    flex: 0.0022,
                  }}
                >
                  <img src='/images/icons/pro-icons/seperator.svg' alt='sep' />
                </TableCell>
                <TableCell
                  sx={{
                    flex: 0.2335,

                    height: '54px',
                    display: 'flex !important',
                    alignItems: 'center',
                    paddingLeft: '20px',
                  }}
                >
                  <Box>
                    {lang === 'EN'
                      ? `Total Price (${invoiceCurrency ?? ''})`
                      : `금액 (${invoiceCurrency ?? ''})`}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>

            <MakeTable rows={data.langItem ?? []} orders={data.orders} />
            <Box className='total'>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '50px',
                  paddingRight: '11%',

                  mt: '10px',
                }}
                className='total-price'
              >
                <Box
                  sx={{
                    display: 'flex',

                    justifyContent: 'space-between',
                    width: '221px',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontWeight: 600,
                      color: 'rgba(76, 78, 100, 0.87)',
                      fontSize: '14px',
                      flex: 1,
                      textAlign: 'right',
                    }}
                  >
                    {lang === 'EN' ? 'Subtotal' : '총 금액'}:
                  </Typography>
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontWeight: 600,
                      color: 'rgba(76, 78, 100, 0.87)',
                      fontSize: '14px',
                      flex: 1,

                      textAlign: 'right',
                    }}
                  >
                    {data.subtotal}
                  </Typography>
                </Box>
              </Box>
              {data.tax !== null && data.tax !== '' && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',

                    paddingRight: '11%',

                    mt: '10px',
                  }}
                  className='total-price'
                >
                  <Box
                    sx={{
                      display: 'flex',

                      justifyContent: 'space-between',
                      width: '221px',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontWeight: 600,

                        color: 'rgba(76, 78, 100, 0.6)',
                        fontSize: '14px',
                        flex: 1,
                        textAlign: 'right',
                      }}
                    >
                      {lang === 'EN' ? 'Tax' : '세액'}({data.taxPercent}%):
                    </Typography>
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontWeight: 600,
                        color: 'rgba(76, 78, 100, 0.87)',
                        fontSize: '14px',
                        flex: 1,
                        textAlign: 'right',
                      }}
                    >
                      {data.tax}
                    </Typography>
                  </Box>
                </Box>
              )}
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '50px',
                  paddingRight: '11%',

                  mt: '10px',
                }}
                className='total-price'
              >
                <Box
                  sx={{
                    display: 'flex',

                    justifyContent: 'space-between',
                    width: '221px',
                    // minWidth: '221px',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontWeight: 600,
                      color: '#666CFF',
                      fontSize: '14px',

                      textAlign: 'right',
                      flex: 1,
                    }}
                  >
                    {lang === 'EN' ? 'Total' : '실제 청구액'}:
                  </Typography>
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontWeight: 600,
                      color: '#666CFF',
                      fontSize: '14px',
                      textAlign: 'right',
                      flex: 1,
                    }}
                  >
                    {data.total}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ marginTop: '15px', padding: '20px' }} className='thxTo'>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            Yours sincerely,
          </Typography>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 600, fontSize: '14px' }}
          >
            The GloZ team
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default PrintInvoicePage

PrintInvoicePage.acl = {
  subject: 'invoice_receivable',
  action: 'read',
}
