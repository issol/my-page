import React, { Dispatch } from 'react'
import { Box } from '@mui/system'
import { Dialog, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'

type InfoKey = 'LPM' | 'TAD' | 'CLIENT' | 'PRO'
const INFO_CONTENTS: Record<InfoKey, Record<string, string>> = {
  LPM: {
    'New requests':
      'It shows only those client requests that have not yet been processed. They are sorted according to how close they are to the desired due date, with those that are one day or less away from the desired due date displayed in red.',
    Report:
      'It shows the number of new requests, quotes, orders, receivables, and payables created during the specified time period. Canceled is the sum of the number of all requests, quotes, orders, and receivables that have been canceled during the specified time period.',
    'Order status':
      'Created shows new orders created and delivered to the client during the set period. Invoiced shows orders invoiced during the set period, and Canceled shows orders canceled during the set period. All three statuses show orders processed during the set period, and do not include the ones processed in other periods.',
    'Ongoing orders':
      'Ongoing shows orders in progress at present. It shows all orders ranging from those in progress to those before invoiced.',
    'Job status':
      'Created shows new jobs created during the set period. Approved shows jobs approved for delivery, and Canceled shows jobs canceled during the set period. All three statuses show orders processed during the set period, and do not include the ones processed in other periods.',
    'Ongoing jobs':
      'Ongoing shows jobs in progress at present. It shows all jobs ranging from those in progress to those before invoiced.',
    'Receivables - Paid this month':
      'It shows the total price and number of invoices that changed to a Paid status this month. The prices do not include taxes and are converted based on the exchange rate at the time the order was created.',
    'Payables - Paid this month':
      'It shows the total price and number of invoices that changed to a Paid status this month. The prices do not include taxes and are converted based on the exchange rate at the time the job was created.',
    'Receivables - Total':
      'It shows invoices in each status as of the current time. Invoiced includes invoiced orders that are being processed. Paid shows paid orders, Overdue shows the orders that have passed the due date but have not been paid yet, and Canceled shows canceled orders. The prices are converted based on the exchange rate at the time the order was created.',
    'Payables - Total':
      'It shows invoices in each status as of the current time. Invoiced includes invoiced orders that are being processed. Paid shows paid orders and Overdue shows the orders that passed the due date but have not been paid yet. The prices are converted based on the exchange rate at the time the job was created.',
    'Long-standing receivables - Action required':
      'It shows invoices that have been in a certain status for a long time and are not being processed. It does not include invoices in the Paid or Canceled status.',
    'Long-standing payables - Action required':
      'It shows invoices that have been in a certain status for a long time and are not being processed. It does not include invoices in the status of Paid, which means completed.',
    'Sales per client':
      "It shows the client(s) whose sales occurred during the time period set by the date filter, and includes only those whose order's project due date falls within the specified time period. If there are more than 7 clients, then it will show the 6 with the highest count and the rest will be grouped together as etc.",
    'Sales per language':
      "It shows the language(s) whose sales occurred during the time period set by the date filter, and includes only those whose order's project due date falls within the specified time period. If there are more than 7 languages, then it will show the 6 with the highest count and the rest will be grouped together as etc.",
    'Sales per category':
      "It shows the category(-ies) whose sales occurred during the time period set by the date filter, and includes only those whose order's project due date falls within the specified time period. If there are more than 7 categories, then it will show the 6 with the highest count and the rest will be grouped together as etc.",
    'Sales per service type':
      "It shows the service type(s) whose sales occurred during the time period set by the date filter, and includes only those whose order's project due date falls within the specified time period. If there are more than 7 service types, then it will show the 6 with the highest count and the rest will be grouped together as etc.",
    'Sales per area of expertise':
      "It shows the area(s) of expertise whose sales occurred during the time period set by the date filter, and includes only those whose order's project due date falls within the specified time period. If there are more than 7 areas of expertise, then it will show the 6 with the highest count and the rest will be grouped together as etc.",
  },
  TAD: {},
  CLIENT: {},
  PRO: {},
}

interface InfoDialogProps {
  keyName: string
  open: boolean
  infoType: 'LPM' | 'TAD' | 'CLIENT' | 'PRO'
  close: () => void
}
const InfoDialog = ({ keyName, open, infoType, close }: InfoDialogProps) => {
  const content = INFO_CONTENTS[infoType][keyName]
  console.log(keyName, infoType, content)
  return (
    <Dialog maxWidth='xs' aria-labelledby='info-dialog' open={open}>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        sx={{
          width: '361px',
          minHeight: '252px',
          padding: '20px',
          position: 'relative',
        }}
      >
        <button
          onClick={() => close()}
          style={{
            width: '24px !important',
            height: '24px',
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <CloseIcon
            sx={{
              color: 'rgba(76, 78, 100, 0.54)',
              width: '24px',
              height: '24px',
            }}
          />
        </button>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          sx={{
            width: '68px',
            height: '68px',
            backgroundColor: 'rgba(38, 198, 249, 0.2)',
            borderRadius: '50%',
          }}
        >
          <ErrorOutlineIcon
            sx={{
              color: 'rgba(38, 198, 249, 1)',
              width: '38px',
              height: '38px',
            }}
          />
        </Box>
        <Typography
          fontSize='20px'
          fontWeight={500}
          color='rgba(76, 78, 100, 0.87)'
          sx={{ padding: '8px 0', textAlign: 'center' }}
        >
          {keyName}
        </Typography>
        <Typography textAlign='center'>{content}</Typography>
      </Box>
    </Dialog>
  )
}

export default InfoDialog
