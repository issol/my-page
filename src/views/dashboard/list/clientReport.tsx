import {
  ChartBoxIcon,
  GridItem,
  Title,
} from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import {
  Add,
  DoNotDisturbAlt,
  ListAlt,
  ReceiptLong,
  RequestQuoteOutlined,
} from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import React from 'react'

interface ClientReportProps {
  reportData: Record<string, number>
  userViewDate: string
  setOpenInfoDialog: (open: boolean, key: string) => void
}

const ClientReport = ({
  reportData,
  userViewDate,
  setOpenInfoDialog,
}: ClientReportProps) => {
  return (
    <GridItem height={289} sm>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Title
          title='Report'
          subTitle={userViewDate}
          openDialog={setOpenInfoDialog}
          marginBottom='20px'
        />
        <Box display='flex' flexWrap='wrap'>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            sx={{ width: '50%', height: '62px', padding: '5px 10px 5px 0' }}
          >
            <Box display='flex' alignItems='center' gap='10px'>
              <ChartBoxIcon icon={Add} color='102, 108, 255' boxSize='30px' />
              <Typography fontWeight={600} fontSize='14px'>
                Requests
              </Typography>
            </Box>
            <Typography fontWeight={600} fontSize='14px'>
              {reportData.requests.toLocaleString()}
            </Typography>
          </Box>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            sx={{ width: '50%', height: '62px', padding: '5px 10px 5px 10px' }}
          >
            <Box display='flex' alignItems='center' gap='10px'>
              <ChartBoxIcon
                icon={RequestQuoteOutlined}
                color='253, 181, 40'
                boxSize='30px'
              />
              <Typography fontWeight={600} fontSize='14px'>
                Quotes
              </Typography>
            </Box>
            <Typography fontWeight={600} fontSize='14px'>
              {reportData.quotes.toLocaleString()}
            </Typography>
          </Box>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            sx={{ width: '50%', height: '62px', padding: '5px 10px 5px 0' }}
          >
            <Box display='flex' alignItems='center' gap='10px'>
              <ChartBoxIcon
                icon={ListAlt}
                color='38, 198, 249'
                boxSize='30px'
              />
              <Typography fontWeight={600} fontSize='14px'>
                Orders
              </Typography>
            </Box>
            <Typography fontWeight={600} fontSize='14px'>
              {reportData.orders.toLocaleString()}
            </Typography>
          </Box>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            sx={{ width: '50%', height: '62px', padding: '5px 10px 5px 10px' }}
          >
            <Box display='flex' alignItems='center' gap='10px'>
              <ChartBoxIcon
                icon={ReceiptLong}
                color='114, 225, 40'
                boxSize='30px'
              />
              <Typography fontWeight={600} fontSize='14px'>
                Invoices
              </Typography>
            </Box>
            <Typography fontWeight={600} fontSize='14px'>
              {(
                reportData.invoicePayables + reportData.invoiceReceivables
              ).toLocaleString()}
            </Typography>
          </Box>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            sx={{ width: '50%', height: '62px', padding: '5px 10px 5px 0' }}
          >
            <Box display='flex' alignItems='center' gap='10px'>
              <ChartBoxIcon
                icon={DoNotDisturbAlt}
                color='255, 77, 73'
                boxSize='30px'
              />
              <Typography fontWeight={600} fontSize='14px'>
                Canceled
              </Typography>
            </Box>
            <Typography fontWeight={600} fontSize='14px'>
              {reportData.canceled.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </GridItem>
  )
}

export default ClientReport
