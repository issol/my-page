import { Box, TableRow, Typography } from '@mui/material'
import languageHelper from '@src/shared/helpers/language.helper'
import {
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import { ItemType } from '@src/types/common/item.type'
import { LanguagePairTypeInItem } from '@src/types/orders/order-detail'
import { Fragment, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Detail {
  id: number
  quantity: number
  priceUnit: string
  unit: string
  price: number
  totalPrice: number
}

export interface Row {
  id: number
  name: string
  source: string
  target: string
  detail: Detail[]
  priceId?: number
  totalPrice?: number
}

export default function MakeTable({
  rows,
  orders,
}: {
  rows: ItemType[]
  orders: Array<{
    orderId: number
    id: number
    projectName: string
    corporationId: string
    items: Array<ItemType>
    languagePairs: Array<LanguagePairTypeInItem>
    subtotal: number
  }>
}) {
  const [newRows, setNewRows] = useState(rows)
  // function calculateTotalPrice(row: ItemType[]): number {
  //   return row.reduce((total, item) => {
  //     return total + item.totalPrice
  //   }, 0)
  // }
  const setMinimumPriceRow = () => {
    const dummyRow = JSON.parse(JSON.stringify(rows))
    rows.map((row, idx) => {
      if (row.detail) {
        if (row.minimumPriceApplied) {
          const addRow = {
            createdAt: null,
            currency: row.detail[0]?.currency,
            deletedAt: null,
            id: 999999,
            priceUnit: 'Minimum price per item',

            initialPriceUnit: {
              title: 'Minimum price per item',
            },
            priceUnitId: 999999,
            prices: row.minimumPrice,
            quantity: 1,
            unit: 'Minimum price',
            unitPrice: row.minimumPrice,
            updatedAt: null,
          }
          dummyRow[idx].detail?.push(addRow)
          setNewRows(dummyRow)
        }
      }
    })
  }
  useEffect(() => {
    setMinimumPriceRow()
    console.log(rows)
  }, [rows])

  console.log(newRows)
  console.log(orders)

  return (
    <tbody className='table-body'>
      {orders.map(value => {
        return (
          <Box key={uuidv4()}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px 20px 10px 20px',
              }}
            >
              <Box sx={{ display: 'flex', gap: '3px' }}>
                <Typography
                  variant='body2'
                  color='#666CFF'
                  fontWeight={600}
                  sx={{ textDecoration: 'underline' }}
                >
                  [{value.corporationId}]
                </Typography>
                <Typography variant='body2' color='#666CFF' fontWeight={600}>
                  {value.projectName}
                </Typography>
              </Box>

              <Box sx={{ paddingRight: '30px' }}>
                <Typography variant='body2' color='#666CFF' fontWeight={600}>
                  {getCurrencyMark(value.items[0]?.initialPrice?.currency)}{' '}
                  {value.subtotal?.toLocaleString('ko-KR')}
                </Typography>
              </Box>
            </Box>
            {newRows
              .filter(item => item.orderId === value.id)
              .map(row => (
                <Box className='table-item' key={uuidv4()}>
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontWeight: 600,
                      padding: '10px 20px',
                      width: '100%',
                      fontSize: '14px',
                    }}
                  >
                    [{languageHelper(row.source)} &rarr;{' '}
                    {languageHelper(row.target)}
                    ]&nbsp;{row.itemName}
                  </Typography>
                  {row.detail && row.detail.length > 0 ? (
                    row?.detail?.map((value, index) => {
                      return (
                        <>
                          <TableRow
                            key={uuidv4()}
                            className='table-row'
                            sx={{
                              maxHeight:
                                value.priceUnit && value.priceUnit.length > 30
                                  ? '60px'
                                  : '30px',
                              height:
                                value.priceUnit && value.priceUnit.length > 30
                                  ? '60px'
                                  : '30px',
                              display: 'flex',

                              background:
                                index % 2 === 0 ? '#ffffff' : '#F5F5F7',
                            }}
                          >
                            <td className='table-row-first'>
                              <ul style={{ paddingLeft: '20px' }}>
                                <li>
                                  <h6 className='subtitle2'>
                                    {value.initialPriceUnit?.title}
                                  </h6>
                                </li>
                              </ul>
                            </td>
                            <td className='table-row-divider'></td>
                            <td className='table-row-second'>
                              <div className='table-row-second-content'>
                                <h6 className='subtitle2'>{value.quantity}</h6>
                                <h6 className='subtitle3'>{value.unit}</h6>
                              </div>
                            </td>
                            <td className='table-row-divider'></td>
                            <td className='table-row-third'>
                              <div className='center-box'>
                                <h6 className='subtitle2'>
                                  {formatCurrency(
                                    value.unitPrice!,
                                    row?.initialPrice?.currency!,
                                  )}
                                </h6>
                              </div>
                            </td>
                            <td className='table-row-divider'></td>
                            <td className='table-row-fourth'>
                              <div className='table-row-fourth-content'>
                                <h6 className='subtitle2'>
                                  {formatCurrency(
                                    Number(value.prices),
                                    row?.initialPrice?.currency!,
                                  )}
                                </h6>
                              </div>
                            </td>
                          </TableRow>
                          {index === row.detail?.length! - 1 ? (
                            <tr className='table-row-total'>
                              <td className='table-row-first'></td>
                              <td className='table-row-divider'></td>
                              <td className='table-row-second'></td>
                              <td className='table-row-divider'></td>
                              <td className='table-row-third'></td>
                              <td className='table-row-divider'></td>
                              <td className='table-row-fourth'>
                                <div className='table-row-fourth-content'>
                                  <h6 className='item-total-subtitle'>
                                    {formatCurrency(
                                      row?.totalPrice,
                                      row?.initialPrice?.currency!,
                                    )}
                                  </h6>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </>
                      )
                    })
                  ) : (
                    <Box
                      key={uuidv4()}
                      className='table-row'
                      sx={{ padding: '5px 20px' }}
                    >
                      <Typography variant='subtitle1' fontSize={14}>
                        No Items
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            <hr className='divider' style={{ marginTop: '1rem' }} />
          </Box>
        )
      })}
    </tbody>
  )
}
