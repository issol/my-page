import { Icon } from '@iconify/react'
import {
  Box,
  Card,
  CardContent,
  Chip,
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

import { MemoQDataType } from '@src/apis/order.api'
import { ChangeEvent, useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import styled from 'styled-components'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { TitleTypography } from '@src/@core/styles/typography'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { FieldArrayWithId } from 'react-hook-form'
import { ItemType } from '@src/types/common/item.type'

type Props = {
  fileName: string
  onClose: () => void
  data: MemoQDataType[]
  priceData: StandardPriceListType | null
  onCopyAnalysis: any
  details: FieldArrayWithId<
    { items: ItemType[] },
    `items.${number}.detail`,
    'id'
  >[]
}

/* TODO : 부모한테 받을거 : priceData */
export function MemoQModal({
  fileName,
  onClose,
  data,
  priceData,
  details,
}: Props) {
  const [checked, setChecked] = useState<
    (MemoQDataType & { id: number }) | null
  >(null)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  console.log(priceData)
  console.log(details)
  console.log(priceData?.catBasis)
  console.log(priceData?.catInterface)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const Row = ({ idx, item }: { idx: number; item: MemoQDataType }) => {
    const [cardOpen, setCardOpen] = useState(false)
    const filteredData = Object.keys(item).filter(
      key => key !== 'File' && key !== 'Total',
    )

    // priceData?.catInterface.memoQ

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
                  {filteredData.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{item}</TableCell>
                        <TableCell>{item}</TableCell>
                        <TableCell>{item}</TableCell>
                        <TableCell>{item}</TableCell>
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
              Analysis result ({data.length || 0})
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
                label='Memsource'
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
              <Typography>English</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {data
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            ?.map((item, idx) => (
              <Row key={idx} idx={idx} item={item} />
            ))}
          <Grid item xs={12}>
            <TablePagination
              rowsPerPageOptions={[5, 15, 30]}
              component='div'
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
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
