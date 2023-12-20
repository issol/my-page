import React, { Dispatch, ReactElement, useMemo } from 'react'
import { Box } from '@mui/system'
import { Dialog, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'

type InfoKey = 'LPM' | 'TAD' | 'CLIENT' | 'PRO' | 'ACCOUNT'
const INFO_CONTENTS: Record<InfoKey, Record<string, string | ReactElement>> = {
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
  TAD: {
    'Number of Pros': (
      <ul>
        <li style={{ textAlign: 'left' }}>
          <b>Onboarded Pros</b> shows the number of Pros who have a certified
          role and finished signing contracts.
        </li>
        <li style={{ textAlign: 'left' }}>
          <b>Onboarding in progress</b> shows the number of new Pros whose
          onboarding process is in progress. It does not include cases where a
          Pro has been already onboarded and is taking a new test.
        </li>
        <li style={{ textAlign: 'left' }}>
          <b>Failed Pros</b> shows the number of Pros who failed the test and
          are unable to perform tasks. It does not include cases where a Pro who
          failed a particular test has another Certified role or is taking
          another test.
        </li>
      </ul>
    ),
    'Language pool':
      'It shows the languages in which Pros are certified, from the most to least. This is based on the number of Pros who have that language, and multiple certifications for the same language by a single Pro are not counted as duplicates.',
    'Job type/Role pool':
      'It shows the Job type/Role in which Pros are certified, from the most to least. This is based on the number of Pros who have that Job type/Role, and multiple certifications for the same Job type/Role by a single Pro are not counted as duplicates.',
    'Recruiting requests':
      'It shows only those recruiting requests with an ongoing status. They are sorted from closest to the due date to the top, and those having one day or fewer until their due date are colored red.',
    'Application status':
      'Applied displays tests assigned during the set period, and it does not include tests requested by Pro/TAD but not actually assigned. Passed shows certified roles assigned during the set period, and Failed shows the list of fails from the Basic test and Skill test during the set period, while excluding tests taken in other time periods.',
    'Ongoing applications':
      'Ongoing displays test in progress as of the current time. It includes all the tests from Basic tests being taken at the moment to Skill tests before TAD determines pass or fail.',
    'Applied job types':
      'It shows the job type(s) applied during the time period set by the date filter. If there are more than 7 job types applied, it shows the 6 with the highest count, and the rest are grouped together as etc. It includes both direct test applications made by Pro and tests assigned by TAD.',
    'Applied roles':
      'It shows the role(s) applied during the time period set by the date filter. If there are more than 7 roles applied, it shows the 6 with the highest count, and the rest are grouped together as etc. It includes both direct test applications made by Pro and tests assigned by TAD.',
    'Applied source languages':
      'It shows the source language(s) applied during the time period set by the date filter. If there are more than 7 source languages applied, it shows the 6 with the highest count, and the rest are grouped together as etc. It includes both direct test applications made by Pro and tests assigned by TAD.',
    'Applied target languages':
      'It shows the target language(s) applied during the time period set by the date filter. If there are more than 7 target languages applied, it shows the 6 with the highest count, and the rest are grouped together as etc. It includes both direct test applications made by Pro and tests assigned by TAD.',
  },
  CLIENT: {
    Report:
      'It shows the number of new requests, quotes, orders, and invoices created during the specified time period. Canceled is the sum of the number of all requests, quotes, orders, and invoices that have been canceled during the specified time period.',
    'Invoices - Paid this month':
      'It shows the total price and number of invoices that changed to a Paid status this month. The prices do not include taxes and are converted based on the exchange rate at the time the order was created.',
    'Invoices - Total':
      'It shows invoices in each status as of the current time. Invoiced includes invoiced orders that are being processed. Paid shows paid orders, Overdue shows the orders that have passed the due date but have not been paid yet, and Canceled shows canceled orders. The prices are converted based on the exchange rate at the time the order was created.',
    'Long-standing invoices - Action required':
      'It shows invoices that have been in a certain status for a long time and are not being processed. It does not include invoices in the Paid or Canceled status.',
    'Order status':
      'Created shows new orders created during the set period. Invoiced shows orders invoiced during the set period, and Canceled shows orders canceled during the set period. All three statuses show orders processed during the set period, and do not include the ones processed in other periods.',
    'Ongoing orders':
      'Ongoing shows orders in progress at present. It shows all orders ranging from those in progress to those before invoiced.',
    'Expense per language':
      "It shows the language(s) whose expense occurred during the time period set by the date filter, and includes only those whose order's project due date falls within the specified time period. If there are more than 7 languages, then it will show the 6 with the highest count and the rest will be grouped together as etc.",
    'Expense per category':
      "It shows the category(-ies) whose expense occurred during the time period set by the date filter, and includes only those whose order's project due date falls within the specified time period. If there are more than 7 categories, then it will show the 6 with the highest count and the rest will be grouped together as etc.",
    'Expense per service type':
      "It shows the service type(s) whose expense occurred during the time period set by the date filter, and includes only those whose order's project due date falls within the specified time period. If there are more than 7 service types, then it will show the 6 with the highest count and the rest will be grouped together as etc.",
    'Expense per area of expertise':
      "It shows the area(s) of expertise whose expense occurred during the time period set by the date filter, and includes only those whose order's project due date falls within the specified time period. If there are more than 7 areas of expertise, then it will show the 6 with the highest count and the rest will be grouped together as etc.",
  },
  PRO: {
    'Job overview':
      'In this section, you can see how many job requests need your approval or decline, as well as the number of jobs currently in progress.',
    'Job requests': (
      <div>
        In this section, you can view the total composition of job requests and
        their breakdown by job type. Additionally, you can also access monthly
        averages of job requests and the cumulative distribution of job types.{' '}
        <br /> <br />
        You can estimate expected income based on the job request date and job
        due date.
        <br /> <br />
        This income is estimated based on the job request data and may differ
        from the actual invoiced amount.
      </div>
    ),
    'Completed deliveries':
      "This is a graph that shows the trend of monthly completed deliveries. The data displayed goes back 5 months from the current date, and if there is no data for a particular month, it won't be displayed on the graph.",
    'Monthly revenue overview': (
      <div>
        This is a graph that shows the trend of monthly invoice generation
        amounts. The data displayed goes back 5 months from the current date,
        and if there is no data for a particular month, it won't be displayed on
        the graph. <br /> <br />
        The graph only
        <b>represents invoice amounts generated in the same currency</b>.
        Therefore, if the currency used for invoice generation changes in the
        middle, you should view the data for the respective month when the
        change occurred. <br /> <br />
        The rate is a measure compared to the overall average of invoiced
        amounts.
      </div>
    ),
    'Payment amount': (
      <div>
        This area shows the amount you will receive this month.
        <br /> <br />
        You can view the total Payment amount in four different currencies.
      </div>
    ),
    'Invoiced amount': (
      <div>
        This area displays the amount that has been invoiced on this month.
        <br /> <br />
        You can view the total Invoice amount in four different currencies.
      </div>
    ),
  },
  ACCOUNT: {
    'Sales recognition':
      'It shows sales recognitions during the time period set by the date filter. Only the orders whose sales recognition date falls within that time period are included. The amount is the sum of the amounts in the same currency.',
    'Paid Receivables':
      'It shows the number and the amount of the receivables paid during the time period set by the date filter, excluding those that have been canceled. The amount is the sum of the amounts in the same currency.',
    'Paid Payables':
      'It shows the number and the amount of the payables paid during the time period set by the date filter, excluding those that have been canceled. The amount is the sum of the amounts in the same currency.',
    'Clients’ payment method per office':
      'It shows the number and the ratio of clients who use the payment method by office.',
    'Pros’ payment method':
      'It shows the number and the ratio of Pros who use the payment method.',
  },
}

/**
 * 다이얼로그와 타이틀이 상이할 때 정의
 */
export const ReplaceTitle: Record<string, string> = {
  Clients: 'Sales per client',
  'Language pairs': 'Sales per language',

  'Service types': 'Sales per service type',
  'Area of expertises': 'Sales per area of expertise',
  'Onboarding overview': 'Number of Pros',
  'Language pairs@client': 'Expense per language',
  Categories: 'Expense per category',
  'Service types@client': 'Expense per service type',
  'Area of expertises@client': 'Expense per area of expertise',
  'Invoice overview': 'Monthly revenue overview',
  'Source languages': 'Sales per language',
  'Target languages': 'Sales per language',
  // Main categories
  'Main categories': 'Sales per category',
  Translation: 'Sales per category',
  Dubbing: 'Sales per category',
  Interpretation: 'Sales per category',
  'Misc.': 'Sales per category',
  Subtitle: 'Sales per category',
  'Documents/Text': 'Sales per category',
  'OTT/Subtitle': 'Sales per category',
  Webcomics: 'Sales per category',
  Webnovel: 'Sales per category',
}

const menuOptions = []
interface InfoDialogProps {
  keyName: string
  open: boolean
  infoType: InfoKey
  close: () => void
}
const Information = ({ keyName, open, infoType, close }: InfoDialogProps) => {
  const [title, content] = useMemo(() => {
    const _content1 = INFO_CONTENTS[infoType][keyName]
    if (_content1) {
      return [keyName, _content1]
    }

    const _content2 = INFO_CONTENTS[infoType][ReplaceTitle[keyName]]
    return [ReplaceTitle[keyName], _content2]
  }, [keyName])

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
          {title}
        </Typography>
        <Typography textAlign='center'>{content}</Typography>
      </Box>
    </Dialog>
  )
}

export default Information
