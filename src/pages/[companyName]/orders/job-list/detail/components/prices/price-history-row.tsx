import {
  Box,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Typography,
} from '@mui/material'
import Paper from '@mui/material/Paper'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { ModalType } from '@src/store/modal'
import { ItemDetailType, ItemType } from '@src/types/common/item.type'
import { styled, lighten, darken } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import {
  formatByRoundingProcedure,
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import { PriceType } from '@src/types/common/orders-and-quotes.type'
import { v4 as uuidv4 } from 'uuid'

const StyledTableCell = styled(TableCell)<{ dark: boolean }>(
  ({ theme, dark }) => ({
    [`&.${tableCellClasses.head}`]: {
      // backgroundColor: dark ?
      background: dark
        ? 'linear-gradient( 0deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) ), #bbbbbb'
        : 'linear-gradient( 0deg, rgba(255,255,255,0.88), rgba(255,255,255,0.88) ), #666cff',
      // color: theme.palette.common.white,
    },
  }),
)

const styledTd = {
  background:
    'linear-gradient( 0deg, rgba(255,255,255,0.88), rgba(255,255,255,0.88) ), #666cff',
  padding: '16px',
  fontSize: '12px',
  fontWeight: 500,
}

type Props = {
  priceHistoryDetail: Array<ItemDetailType>
  showMinimum: boolean
  minimumPrice: number | null
  initialPrice: PriceType
  totalPrice: number | null
  setDarkMode: boolean
}

const PriceHistoryRow = ({
  priceHistoryDetail,
  showMinimum,
  minimumPrice,
  initialPrice,
  totalPrice,
  setDarkMode,
}: Props) => {
  const Row = ({ idx }: { idx: number }) => {
    return (
      <TableRow tabIndex={-1}>
        <TableCell sx={{ width: '10%' }}>
          <Box display='flex' alignItems='center' gap='8px' height={38}>
            <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
              {Number(priceHistoryDetail[idx].quantity)}
            </Typography>
          </Box>
        </TableCell>

        <TableCell sx={{ width: 'auto' }}>
          <Box display='flex' alignItems='center' gap='8px' height={38}>
            <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
              {priceHistoryDetail[idx].title}
            </Typography>
          </Box>
        </TableCell>

        <TableCell align={'left'} sx={{ width: '15%' }}>
          <Box display='flex' alignItems='center' gap='8px' height={38}>
            <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
              {formatCurrency(
                priceHistoryDetail[idx].unitPrice || 0,
                initialPrice.currency || 'KRW',
              )}
            </Typography>
          </Box>
        </TableCell>

        <TableCell sx={{ width: '15%' }} align='center'>
          <Box display='flex' alignItems='center' gap='8px' height={38}>
            <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
              {`${getCurrencyMark(initialPrice.currency)} ${initialPrice.currency}`}
            </Typography>
          </Box>
        </TableCell>

        <TableCell sx={{ width: '20%' }} align='left'>
          <Typography fontSize={14}>
            {formatCurrency(
              formatByRoundingProcedure(
                Number(priceHistoryDetail[idx].prices),
                initialPrice.numberPlace,
                initialPrice.rounding,
                initialPrice.currency,
              ),
              initialPrice.currency,
            )}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: '5%' }} align='center'>
          {null}
        </TableCell>
      </TableRow>
    )
  }
  return (
    <>
      <Grid item xs={12} sx={{ height: '100%' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <colgroup>
            <col width='10%'></col>
            <col width='36%'></col>
            <col width='15%'></col>
            <col width='17%'></col>
            <col width='17%'></col>
            <col width='5%'></col>
          </colgroup>
          <thead>
            <tr>
              <td style={styledTd}>Quantity</td>
              <td style={styledTd}>Price unit</td>
              <td style={styledTd}>Unit price</td>
              <td style={styledTd}>Currency</td>
              <td style={styledTd}>Prices</td>
              <td style={styledTd}></td>
            </tr>
          </thead>
        </table>
        <Box
          sx={{
            height: 'fit-content',
            maxHeight: '160px',
            overflowY: 'scroll',
          }}
        >
          <table
            style={{
              width: '100%',
            }}
          >
            <colgroup>
              <col width='10%'></col>
              <col width='36%'></col>
              <col width='15%'></col>
              <col width='17%'></col>
              <col width='17%'></col>
              <col width='5%'></col>
            </colgroup>
            <tbody>
              {priceHistoryDetail.map(row => (
                <tr key={uuidv4()}>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Box
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: 'rgba(76, 78, 100, 0.87)',
                        lineHeight: '21px',
                      }}
                    >
                      {Number(row.quantity)}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Box
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: 'rgba(76, 78, 100, 0.87)',
                        lineHeight: '21px',
                      }}
                    >
                      {row.title}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Box
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: 'rgba(76, 78, 100, 0.87)',
                        lineHeight: '21px',
                      }}
                    >
                      {formatCurrency(
                        row.unitPrice || 0,
                        initialPrice.currency || 'KRW',
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Box
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: 'rgba(76, 78, 100, 0.87)',
                        lineHeight: '21px',
                      }}
                    >
                      {`${getCurrencyMark(initialPrice.currency)} ${initialPrice.currency}`}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Box
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: 'rgba(76, 78, 100, 0.87)',
                        lineHeight: '21px',
                      }}
                    >
                      {formatCurrency(
                        Number(row.prices),
                        initialPrice.currency,
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Box
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        color: 'rgba(76, 78, 100, 0.87)',
                        lineHeight: '21px',
                      }}
                    ></Box>
                  </TableCell>
                </tr>
              ))}
              {/* {details?.map((row, idx) => (
            <Row
              key={row.id}
              idx={idx}
              nestSubPriceUnits={nestSubPriceUnits}
              currentItem={currentItem}
              getValues={getValues}
              // getEachPrice={getEachPrice}
              detailName={detailName}
              type={type}
              isNotApplicable={isNotApplicable[index]}
              onDeletePriceUnit={onDeletePriceUnit}
              onDeleteNoPriceUnit={onDeleteNoPriceUnit}
              updateTotalPrice={updateTotalPrice}
              priceData={priceData}
              allPriceUnits={allPriceUnits}
              index={index}
              update={update}
              initialPriceName={initialPriceName}
              onChangeCurrency={onChangeCurrency}
              control={control}
              append={append}
              remove={remove}
              showCurrency={showCurrency}
              setValue={setValue}
              row={row}
              errorRefs={errorRefs}
            />
          ))} */}
            </tbody>
          </table>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ height: '100px' }}>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          sx={{ borderTop: '1px solid #E9EAEC' }}
          height={100}
        >
          <Typography fontWeight='bold' fontSize={14}>
            Total price
          </Typography>
          <Box
            display='flex'
            alignItems='center'
            marginLeft={20}
            marginRight={5}
          >
            <Typography fontWeight='bold' fontSize={14}>
              {formatCurrency(Number(totalPrice), initialPrice?.currency)}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </>

    // <Box
    //   style={{
    //     borderRadius: '8px',
    //     marginBottom: '14px',
    //   }}
    // >
    //   <Grid item xs={12}>
    //     <TableContainer
    //       component={Paper}
    //       sx={
    //         setDarkMode
    //           ? {
    //               maxHeight: 400,
    //               backgroundColor: 'rgba(76, 78, 100, 0)',
    //               // opacity: 0.7,
    //             }
    //           : { maxHeight: 400 }
    //       }
    //     >
    //       <Table stickyHeader aria-label='sticky table'>
    //         <TableHead
    //           sx={{
    //             position: 'sticky',
    //             top: 0,
    //             zIndex: 10,
    //           }}
    //         >
    //           <TableRow sx={{ border: '1px solid' }}>
    //             <StyledTableCell
    //               sx={{
    //                 width: '10%',
    //                 textTransform: 'none',
    //               }}
    //               align='left'
    //               dark={setDarkMode}
    //             >
    //               Quantity
    //             </StyledTableCell>
    //             <StyledTableCell
    //               sx={{ width: 'auto', textTransform: 'none' }}
    //               align='left'
    //               dark={setDarkMode}
    //             >
    //               Price unit
    //             </StyledTableCell>
    //             <StyledTableCell
    //               sx={{ width: '15%', textTransform: 'none' }}
    //               align='left'
    //               dark={setDarkMode}
    //             >
    //               Unit price
    //             </StyledTableCell>
    //             <StyledTableCell
    //               sx={{ width: '17%', textTransform: 'none' }}
    //               align='left'
    //               dark={setDarkMode}
    //             >
    //               Currency
    //             </StyledTableCell>
    //             <StyledTableCell
    //               sx={{ width: '17%', textTransform: 'none' }}
    //               align='left'
    //               dark={setDarkMode}
    //             >
    //               Prices
    //             </StyledTableCell>
    //             <StyledTableCell
    //               sx={{ width: '5%', textTransform: 'none' }}
    //               align='left'
    //               dark={setDarkMode}
    //             ></StyledTableCell>
    //           </TableRow>
    //         </TableHead>
    //         <TableBody>
    //           {priceHistoryDetail?.map((row, idx) => (
    //             <Row key={row.id} idx={idx} />
    //           ))}
    //           {showMinimum ? (
    //             <TableRow tabIndex={-1} /* onBlur={() => onItemBoxLeave()} */>
    //               <TableCell>
    //                 <Typography color='primary' fontSize={14}>
    //                   1
    //                 </Typography>
    //               </TableCell>
    //               <TableCell>
    //                 <Typography color='primary' fontSize={14}>
    //                   Minimum price per item
    //                 </Typography>
    //               </TableCell>
    //               <TableCell align='left'>
    //                 <Typography color='primary' fontSize={14}>
    //                   {formatCurrency(
    //                     formatByRoundingProcedure(
    //                       minimumPrice ?? 0,
    //                       initialPrice.numberPlace,
    //                       initialPrice.rounding,
    //                       initialPrice.currency,
    //                     ),
    //                     initialPrice.currency,
    //                   )}
    //                 </Typography>
    //               </TableCell>
    //               <TableCell align='center'></TableCell>
    //               <TableCell align='left'>
    //                 <Typography color='primary' fontSize={14}>
    //                   {formatCurrency(
    //                     formatByRoundingProcedure(
    //                       minimumPrice ?? 0,
    //                       initialPrice.numberPlace,
    //                       initialPrice.rounding,
    //                       initialPrice.currency,
    //                     ),
    //                     initialPrice.currency,
    //                   )}
    //                 </Typography>
    //               </TableCell>
    //               <TableCell align='center'>{null}</TableCell>
    //             </TableRow>
    //           ) : null}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>

    //     <Grid item xs={12}>
    //       <Box
    //         display='flex'
    //         alignItems='center'
    //         justifyContent='flex-end'
    //         sx={{ borderTop: '1px solid #E9EAEC' }}
    //         height={100}
    //       >
    //         <Typography fontWeight='bold' fontSize={14}>
    //           Total price
    //         </Typography>
    //         <Box
    //           display='flex'
    //           alignItems='center'
    //           marginLeft={20}
    //           marginRight={5}
    //         >
    //           <Typography fontWeight='bold' fontSize={14}>
    //             {formatCurrency(
    //               formatByRoundingProcedure(
    //                 Number(totalPrice),
    //                 initialPrice?.numberPlace,
    //                 initialPrice?.rounding,
    //                 initialPrice?.currency,
    //               ),
    //               initialPrice?.currency,
    //             )}
    //           </Typography>
    //         </Box>
    //       </Box>
    //     </Grid>
    //   </Grid>
    // </Box>
  )
}

export default PriceHistoryRow
