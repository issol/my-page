// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'
import useModal from '@src/hooks/useModal'

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

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { CurrentPlanType, PlanPeriodType } from '@src/types/company/billing-plan'
import Link from 'next/link'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

import { getCustomerPortalLink, getPaymentLink } from '@src/apis/company/billing-plan.api'
import { toast } from 'react-hot-toast'
import { BASEURL } from '@src/configs/axios'
import StripeScript from '@src/shared/scripts/stripe'
import { ClientUserType, UserDataType } from '@src/context/types'
import StartSubscriptionModal from '@src/pages/company/components/billing-plan/modal/start-subscription-modal'

const defaultCurrentPlan: CurrentPlanType = {
    id: 0,
    planName: "Free",
    period: "Month",
    price: 0,
    currency: "USD",
    startedAt: "2023-02-10T07:33:53.740Z",
    startedTimezone: {label: "Asia/Seoul"},
    expiredAt: "2024-06-14T07:33:53.740Z",
    expiredTimezone: {label: "Asia/Seoul"},
    isAutoRenewalEnabled: false
}

const defaultPlanPeriod: PlanPeriodType = {
  totalPeriod: 0,
  usedPeriod: 0,
  usedPercentage: "0.000",
}

type Props = {
  auth: {
    user: UserDataType | null;
    company: ClientUserType | null | undefined;
    loading: boolean;
}
}

const BillingPlan = ({
  auth,
}: Props) => {
  // ** States
  const { openModal, closeModal } = useModal()

  const [currentPlan, setCurrentPlan] = useState<CurrentPlanType>(defaultCurrentPlan);
  const [hasPlan, setHasPlan] = useState<boolean>(false)
  const [planPeriod, setPlanPeriod] = useState<PlanPeriodType>(defaultPlanPeriod)

  const onStartSubscription = async (planId: string) => {
    try {
      const subscriptionLink = await getPaymentLink(planId)
      console.log("subscriptionLink", subscriptionLink)
      window.open(subscriptionLink, '_blank');
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    } finally {
      closeModal('signup-not-approval-modal')
    }
  }
  const onClickManageSubscription = async (option: string) => {
    const customerPortalLink = await getCustomerPortalLink(option)
    window.open(customerPortalLink, '_blank');
  }

  const onClickStartSubscription = () => {
    openModal({
      type: 'start-subscription-modal',
      children: (
        <StartSubscriptionModal
          title='Start Subscription'
          userInfo={auth.user}
          onSubscription={onStartSubscription}
          onClose={() => closeModal('signup-not-approval-modal')}
        />
      ),
    })
  }

  const isPlanExpired = (expiredDate: string) => {
    const expiredAt = new Date(expiredDate)
    const now = new Date()
    return expiredAt < now
  }

  const calculatePeriods = (startedAt: string, expiredAt: string) => {
    if (!startedAt || !expiredAt) {
      return defaultPlanPeriod
    }
  
    const startDate = new Date(startedAt);
    const endDate = new Date(expiredAt);
    const currentDate = new Date();
  
    // 총 기간 (밀리초 단위)
    const totalPeriodMs = endDate.getTime() - startDate.getTime();
    // 남은 기간 (밀리초 단위)
    const remainingPeriodMs = endDate.getTime() - currentDate.getTime();
  
    // 총 기간 (일 단위)
    const totalPeriod = totalPeriodMs / (1000 * 60 * 60 * 24);
    // 남은 기간 (일 단위)
    const remainingPeriod = remainingPeriodMs / (1000 * 60 * 60 * 24);
  
    let usedPeriodDays = Math.floor(Math.max(totalPeriod - remainingPeriod, 0));
    let usedPercentage = ((totalPeriod - remainingPeriod) / totalPeriod) * 100;
  
    if (currentDate > endDate) {
      usedPeriodDays = Math.floor(totalPeriod);
      usedPercentage = 100;
    } else if (currentDate < startDate) {
      usedPeriodDays = 0;
      usedPercentage = 0;
    }
  
    setPlanPeriod({
      totalPeriod: Math.max(totalPeriod, 0), // 총 기간이 음수가 되지 않도록 보장
      usedPeriod: usedPeriodDays, // 사용 기간이 음수가 되지 않도록 보장
      usedPercentage: usedPercentage.toFixed(3), // 퍼센트를 0~100 사이로 보장하고 소수점 3자리까지
    })
  }

  useEffect(() => {
    const eventSource = new EventSource(`${BASEURL}/api/enough/u/payment/sse?lspId=${auth?.user?.companyId}`);

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const newMessage: CurrentPlanType = JSON.parse(event.data);
        console.log('EventSource message:', newMessage);
        setCurrentPlan(newMessage); // 새로운 메시지로 상태를 업데이트
        isPlanExpired(newMessage.expiredAt)
          ? setHasPlan(true)
          : setHasPlan(true)
        calculatePeriods(newMessage.startedAt, newMessage.expiredAt)
      } catch (error) {
        console.error('Failed to parse message:', error);
        calculatePeriods(defaultCurrentPlan.startedAt, defaultCurrentPlan.expiredAt)
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
      calculatePeriods(defaultCurrentPlan.startedAt, defaultCurrentPlan.expiredAt)
    };

    return () => {
      eventSource.close();
    };
  }, []);

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
                    Plan expired date: {currentPlan.expiredAt || '-'}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, mb: 1, fontSize: '0.875rem' }}>
                  Auto Renewal: {currentPlan.isAutoRenewalEnabled !== undefined && currentPlan.isAutoRenewalEnabled !== null ? 
                    (currentPlan.isAutoRenewalEnabled ? 'On' : 'Off') : 
                    '-'
                  }
                  </Typography>
                  {/* <Typography variant='body2'>We will send you a notification upon Subscription expiration</Typography> */}
                </Box>

              </Grid>

              <Grid item xs={12} md={6} sx={{ mt: [4, 4, 0] }}>

                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Days</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{planPeriod.usedPeriod} of {planPeriod.totalPeriod} Days</Typography>
                </Box>
                <LinearProgress value={Number(planPeriod.usedPercentage)} variant='determinate' sx={{ height: 10, borderRadius: '5px' }} />
                {/* <Typography variant='body2' sx={{ mt: 2, mb: 4 }}>
                  Your plan requires update
                </Typography> */}
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '8px' }}
              >
                <Button variant='contained' onClick={onClickStartSubscription} disabled={hasPlan}>
                  Start Subscription
                </Button>
                <Button variant='outlined' onClick={() => onClickManageSubscription('view')} disabled={!hasPlan}>
                  Manage Subscription
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
          <Link
            href='#'
            onClick={() => onClickManageSubscription('cancel')}
          >
            <Typography sx={{ fontWeight: 300, fontSize: '0.875rem', textDecoration: 'none' }}>Cancel Subscription</Typography>
          </Link>
        </Box>
      </Grid>
    </Grid>
  )
}

export default BillingPlan
