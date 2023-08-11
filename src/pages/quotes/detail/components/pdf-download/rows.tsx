import { Box, TableRow, Typography } from '@mui/material'
import languageHelper from '@src/shared/helpers/language.helper'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { ItemDetailType, ItemType } from '@src/types/common/item.type'
import { useEffect, useState } from 'react'
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
type Props = {
  rows: ItemType[]
  currency: 'USD' | 'KRW' | 'SGD' | 'JPY'
}

export default function MakeTable({ 
  rows, 
  currency 
}: Props) {
  const [newRows, setNewRows] = useState(rows)

  function calculatePrice(row: ItemDetailType[]): number {
    return row.reduce((total, item) => {
      return total + Number(item.prices)
    }, 0)
  }
  // minimumPrice 정보가 없으므로 Row의 totalPrice와 Row.detail의 prices의 합이 다르면 minimumPrice가 적용된 것으로 간주한다.
  const setMinimumPriceRow = () => {
    const dummyRow = JSON.parse(JSON.stringify(rows));
    rows.map((row, idx) => {
      if(row.detail) {
        const calPrice = calculatePrice(row.detail)
        if (calPrice !== row.totalPrice) {
          const addRow = {
            createdAt: null,
            currency: row.detail[0]?.currency,
            deletedAt: null,
            id: 999999,
            priceUnit: 'Minimum price per item',
            priceUnitId: 999999,
            prices: row.totalPrice,
            quantity: 1,
            unit: 'Minimum price',
            unitPrice: row.totalPrice,
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
  }, [rows])

  return (
    <tbody className='table-body'>
      {newRows.map(row => (
        <Box className='table-item' key={uuidv4()}>
          {row?.detail?.map((value, index) => {
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
                    [{languageHelper(row.source)} &rarr;{' '}
                    {languageHelper(row.target)}
                    ]&nbsp;{row.name}
                  </Typography>
                ) : null}

                <TableRow
                  key={uuidv4()}
                  className='table-row'
                  sx={{
                    // '& > *': { borderBottom: 'unset' },
                    maxHeight:
                      value.priceUnit && value.priceUnit.length > 30
                        ? '60px'
                        : '30px',
                    height:
                      value.priceUnit && value.priceUnit.length > 30
                        ? '60px'
                        : '30px',
                    display: 'flex',

                    background: index % 2 === 0 ? '#ffffff' : '#F5F5F7',
                  }}
                >
                  <td className='table-row-first'>
                    <ul style={{ paddingLeft: '20px' }}>
                      <li>
                        <h6 className='subtitle2'>{value.priceUnit}</h6>
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
                    <div className='flex-start-box'>
                      <h6 className='subtitle2'>
                        {formatCurrency(value.unitPrice, currency || 'USD')}
                      </h6>
                    </div>
                  </td>
                  <td className='table-row-divider'></td>
                  <td className='table-row-fourth'>
                    <div className='table-row-fourth-content'>
                      <h6 className='subtitle2'>
                        {formatCurrency(value.prices, currency || 'USD')}
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
                        <h6 className='primary-subtitle'>
                          {formatCurrency(row.totalPrice, currency || 'USD')}
                        </h6>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </>
            )
          })}
          <hr className='divider' />
        </Box>
      ))}
    </tbody>
  )
}
