import { formatCurrency } from '@src/shared/helpers/price.helper'
import MakeTable from '../order-list/detail/components/rows'
import { useEffect } from 'react'
import {
  LanguageAndItemType,
  OrderDownloadData,
} from '@src/types/orders/order-detail'
import { useRouter } from 'next/router'
import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { UserDataType } from '@src/context/types'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getAddress } from '@src/shared/helpers/address-helper'
import {
  contryCodeAndPhoneNumberFormatter,
  splitContryCodeAndPhoneNumber,
} from '@src/shared/helpers/phone-number-helper'
import { useAppDispatch } from '@src/hooks/useRedux'
import { resetOrderLang } from '@src/store/order'
import { useMutation } from 'react-query'

import { patchOrderProjectInfo } from '@src/apis/order/order-detail.api'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  data: OrderDownloadData
  type: string
  user: UserDataType
  lang: 'EN' | 'KO'
}

const PrintOrderPage = ({ data, type, user, lang }: Props) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const patchProjectInfoMutation = useMutation(
    (data: { id: number; form: { downloadedAt: string } }) =>
      patchOrderProjectInfo(data.id, data.form),
    {},
  )
  useEffect(() => {
    if (type === 'download') {
      setTimeout(() => {
        window.onafterprint = () => {
          router.back()
          dispatch(resetOrderLang('EN'))
          patchProjectInfoMutation.mutate({
            id: data.orderId,
            form: { downloadedAt: Date() },
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
              : '서울특별시 금천구 가산디지털1로 204, 903호 (가산 반도아이비밸리) 08502'}
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
        <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
          No. {data.corporationId}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: lang === 'EN' ? 600 : 800, fontSize: '14px' }}
          >
            {lang === 'EN' ? 'Order date:' : '주문일:'}
          </Typography>
          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {convertTimeToTimezone(
              data.orderedAt,
              user?.timezone,
              timezone.getValue(),
            )}
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
              {lang === 'EN' ? 'Project due date:' : '마감일:'}
            </Typography>
            <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
              {convertTimeToTimezone(
                data.projectDueAt?.date,
                data.projectDueAt?.timezone,
                timezone.getValue(),
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
            Order confirmation for:
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
                  firstName: data.contactPerson?.firstName!,
                  middleName: data.contactPerson?.middleName!,
                  lastName: data.contactPerson?.lastName!,
                })}
                &nbsp;
              </Typography>
            ) : null}
            {data.contactPerson && data.contactPerson?.jobTitle ? (
              <>
                <Divider orientation='vertical' flexItem variant='middle' />
                <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
                  &nbsp;{data.contactPerson?.jobTitle}
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
                : getAddress(data.clientAddress)}{' '}
              {'1'}
            </Typography>
          )}

          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {data.contactPerson
              ? data.contactPerson?.email
              : data.client?.client?.email}
          </Typography>
          <Typography variant='subtitle1' sx={{ fontSize: '14px' }}>
            {data.contactPerson?.mobile
              ? contryCodeAndPhoneNumberFormatter(
                  splitContryCodeAndPhoneNumber(data.contactPerson.mobile),
                )
              : data.client.client?.mobile
              ? contryCodeAndPhoneNumberFormatter(
                  splitContryCodeAndPhoneNumber(data.client.client.mobile),
                )
              : '-'}
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
                      ? `Price (${
                          data?.langItem?.items[0]?.initialPrice?.currency! ??
                          'USD'
                        })`
                      : `단가 (${
                          data?.langItem?.items[0]?.initialPrice?.currency! ??
                          'USD'
                        })`}
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
                      ? `Total Price (${
                          data?.langItem?.items[0]?.initialPrice?.currency! ??
                          'USD'
                        })`
                      : `금액 (${
                          data?.langItem?.items[0]?.initialPrice?.currency! ??
                          'USD'
                        })`}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>

            <MakeTable rows={data.langItem.items} />
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} align='right' style={{ border: 'none' }}>
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
                      }}
                    >
                      {!data.langItem
                        ? 0
                        : formatCurrency(
                            data?.subtotal,
                            data?.langItem?.items[0]?.initialPrice?.currency!,
                          )}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
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

export default PrintOrderPage

PrintOrderPage.acl = {
  subject: 'order',
  action: 'read',
}
