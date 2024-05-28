// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import Payment from 'payment'
import Cards, { Focused } from 'react-credit-cards'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { CompanyInfoType } from '@src/types/company/info'
import { CurrentPlanType } from '@src/types/company/billing-plan'
import Link from 'next/link'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

interface DataType {
  name: string
  imgSrc: string
  imgAlt: string
  cardCvc: string
  expiryDate: string
  cardNumber: string
  cardStatus?: string
  badgeColor?: ThemeColor
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const data: DataType[] = [
  {
    cardCvc: '587',
    name: 'Tom McBride',
    expiryDate: '12/24',
    imgAlt: 'Mastercard',
    badgeColor: 'primary',
    cardStatus: 'Popular',
    cardNumber: '5577 0000 5577 9865',
    imgSrc: '/images/logos/mastercard.png'
  },
  {
    cardCvc: '681',
    imgAlt: 'Visa card',
    expiryDate: '02/24',
    name: 'Mildred Wagner',
    cardNumber: '4532 3616 2070 5678',
    imgSrc: '/images/logos/visa.png'
  },
  {
    cardCvc: '3845',
    expiryDate: '08/20',
    badgeColor: 'error',
    cardStatus: 'Expired',
    name: 'Lester Jennings',
    imgAlt: 'American Express card',
    cardNumber: '3700 000000 00002',
    imgSrc: '/images/logos/american-express.png'
  }
]

const defaultCurrentPlan: CurrentPlanType = {
    id: 0,
    planName: "Free",
    period: "Month",
    price: 0,
    currency: "USD",
    startedAt: "",
    startedTimezone: {label: "Asia/Seoul"},
    expiredAt: "",
    expiredTimezone: {label: "Asia/Seoul"},
    isAutoRenewalEnabled: false
}

type Props = {

}

const BillingPlan = ({

}: Props) => {
  // ** States
  const [cvc, setCvc] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [focus, setFocus] = useState<Focused>()
  const [cardId, setCardId] = useState<number>(0)
  const [expiry, setExpiry] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [dialogTitle, setDialogTitle] = useState<string>('Add')
  const [openEditCard, setOpenEditCard] = useState<boolean>(false)
  const [openAddressCard, setOpenAddressCard] = useState<boolean>(false)
  const [openUpgradePlans, setOpenUpgradePlans] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)

  const [currentPlan, setCurrentPlan] = useState<CurrentPlanType>(defaultCurrentPlan);

  useEffect(() => {
    const eventSource = new EventSource('/api/sse');

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const newMessage: CurrentPlanType = JSON.parse(event.data);
        console.log('EventSource message:', newMessage);
        setCurrentPlan(newMessage); // 새로운 메시지로 상태를 업데이트
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Handle Edit Card dialog and get card ID
  const handleEditCardClickOpen = (id: number) => {
    setDialogTitle('Edit')
    setCardId(id)
    setCardNumber(data[id].cardNumber)
    setName(data[id].name)
    setCvc(data[id].cardCvc)
    setExpiry(data[id].expiryDate)
    setOpenEditCard(true)
  }

  const handleAddCardClickOpen = () => {
    setDialogTitle('Add')
    setCardNumber('')
    setName('')
    setCvc('')
    setExpiry('')
    setOpenEditCard(true)
  }

  const handleEditCardClose = () => {
    setDialogTitle('Add')
    setCardNumber('')
    setName('')
    setCvc('')
    setExpiry('')
    setOpenEditCard(false)
  }

  const onClickManageSubscription = () => {
    window.open('https://billing.stripe.com/p/session/test_YWNjdF8xR3kxaUZBbHF2S3B4SkN1LF9RQm9HN2R0Y3FiSThuYVNyTW1hN25mN2JJTkMzSENM0100AGHkzZDP/subscriptions/sub_1PLQe9AlqvKpxJCud6jg31lk/preview/price_1Gy5zeAlqvKpxJCuvoRf2DEF?quantity=1', '_blank');
  };

  const onClickStartSubscription = () => {
    window.open('https://buy.stripe.com/test_00g162djy7ZY0Fi4gy', '_blank');
  }

  const handleBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Current plan' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ fontWeight: 500, mb: 1, fontSize: '0.875rem' }}>
                    Your Company Current Plan: <strong>{currentPlan.planName}</strong>{` (${getCurrencyMark(currentPlan.currency)}${currentPlan.price} Per ${currentPlan.period})`}
                  </Typography>
                  {/* <Typography variant='body2'>A simple start for everyone</Typography> */}
                </Box>
                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ fontWeight: 500, mb: 1, fontSize: '0.875rem' }}>
                    Plan expired date: {currentPlan.expiredAt}
                  </Typography>
                  {/* <Typography variant='body2'>We will send you a notification upon Subscription expiration</Typography> */}
                </Box>

              </Grid>

              <Grid item xs={12} md={6} sx={{ mt: [4, 4, 0] }}>

                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Days</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>26 of 30 Days</Typography>
                </Box>
                <LinearProgress value={86.6666666} variant='determinate' sx={{ height: 10, borderRadius: '5px' }} />
                {/* <Typography variant='body2' sx={{ mt: 2, mb: 4 }}>
                  Your plan requires update
                </Typography> */}
              </Grid>

              <Grid item xs={12} sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Button variant='contained' onClick={onClickStartSubscription} sx={{ mr: 3, mb: [3, 0] }}>
                  Start Subscription
                </Button>
                <Button variant='outlined' onClick={onClickManageSubscription} >
                  Manage Subscription
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            href='#'
            onClick={onClickManageSubscription}
          >
            <Typography sx={{ fontWeight: 300, fontSize: '0.875rem' }}>Cancel Subscription</Typography>
          </Link>
        </Box>
      </Grid>
    </Grid>
  )
}

export default BillingPlan
