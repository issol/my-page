// ** styled components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Box, Grid, Typography } from '@mui/material'
import { HeaderCell } from '@src/pages/orders/add-new'

// ** types

import { ItemDetailType, ItemType } from '@src/types/common/item.type'

// ** helpers
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

type Props = {
  itemDetail: ItemDetailType[]
  totalPrice: number | string
}

export default function ItemPriceUnitTable({ itemDetail, totalPrice }: Props) {
  const Row = ({ idx, item }: { idx: number; item: ItemDetailType }) => {
    console.log('item', item)
    return (
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Typography variant='subtitle1' fontSize={14}>
            {item.quantity}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant='subtitle1' fontSize={14}>
            {item.priceUnit}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant='subtitle1' fontSize={14}>
            {`${getCurrencyMark(item.currency)} ${item.unitPrice}`}
          </Typography>
        </TableCell>
        <TableCell align='center'></TableCell>
        <TableCell align='center'>
          <Typography fontSize={14}>
            {`${getCurrencyMark(item.currency)} ${item.prices}`}
          </Typography>
        </TableCell>
        <TableCell align='center'></TableCell>
      </TableRow>
    )
  }

  return (
    <Grid item xs={12}>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {[
                'Quantity',
                'Price unit',
                'Unit price',
                'Currency',
                'Prices',
                '',
              ].map((item, idx) => (
                <HeaderCell key={idx} align='left'>
                  {item}
                </HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {itemDetail.map((item, idx) => (
              <Row key={idx} idx={idx} item={item} />
            ))}

            <TableRow tabIndex={-1}>
              <TableCell colSpan={5} align='right'>
                <Typography fontWeight='bold'>Total price</Typography>
              </TableCell>
              <TableCell colSpan={1} align='right'>
                <Box
                  display='flex'
                  alignItems='center'
                  gap='8px'
                  justifyContent='flex-end'
                >
                  <Typography fontWeight='bold'>
                    {totalPrice}
                    {getCurrencyMark(itemDetail[0].currency)}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}
