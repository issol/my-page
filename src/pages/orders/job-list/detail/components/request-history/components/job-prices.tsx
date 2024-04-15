import { Box, Divider, Grid, TableCell, Typography } from '@mui/material'
import languageHelper from '@src/shared/helpers/language.helper'
import {
  formatByRoundingProcedure,
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import { Currency } from '@src/types/common/currency.type'
import { JobType } from '@src/types/common/item.type'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  jobInfo: JobType
}
const styledTd = {
  background: '#F7F7F9',
  // 'linear-gradient( 0deg, rgba(255,255,255,0.88), rgba(255,255,255,0.88) ), #666cff',
  padding: '16px',
  fontSize: '14px',
  fontWeight: 500,
}

const HistoryJobPrices = ({ jobInfo }: Props) => {
  return (
    <Box
      sx={{
        mt: '30px',
        border: '1px solid #D8D8DD',
        borderRadius: '10px',
        padding: '20px 20px 0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Typography fontSize={20} fontWeight={500}>
        {jobInfo?.corporationId}
      </Typography>
      <Divider sx={{ my: '0 !important' }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant='subtitle1'
            fontWeight={600}
            fontSize={14}
            width={150}
          >
            Language pair
          </Typography>
          <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
            {languageHelper(jobInfo.sourceLanguage)}&nbsp;&rarr;&nbsp;
            {languageHelper(jobInfo.targetLanguage)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant='subtitle1'
            fontWeight={600}
            fontSize={14}
            width={150}
          >
            Price
          </Typography>
          <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
            {jobInfo.initialPrice[0]?.name}
          </Typography>
        </Box>
      </Box>
      <Divider />
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
                {jobInfo.initialPrice.length > 0 &&
                  jobInfo.initialPrice[0].priceUnits.map(row => (
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
                            row.price || 0,
                            jobInfo.initialPrice[0].currency || 'KRW',
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
                          {`${getCurrencyMark(jobInfo.initialPrice[0].currency)} ${jobInfo.initialPrice[0].currency}`}
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
                            formatByRoundingProcedure(
                              Number(row.prices),
                              jobInfo.initialPrice[0].numberPlace,
                              jobInfo.initialPrice[0].rounding,
                              jobInfo.initialPrice[0].currency,
                            ),
                            jobInfo.initialPrice[0].currency,
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
                {formatCurrency(
                  formatByRoundingProcedure(
                    Number(jobInfo.totalPrice),
                    jobInfo.initialPrice[0]?.numberPlace,
                    jobInfo.initialPrice[0]?.rounding,
                    jobInfo.initialPrice[0]?.currency,
                  ),
                  jobInfo.initialPrice[0]?.currency,
                )}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </>
    </Box>
  )
}

export default HistoryJobPrices
