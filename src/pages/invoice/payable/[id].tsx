import { MouseEvent, useContext, useEffect, useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tab,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { DataGrid, GridColumns } from '@mui/x-data-grid'

import { AbilityContext } from '@src/layouts/components/acl/Can'

import { useRouter } from 'next/router'
import InvoiceInfo from './components/detail/invoice-info'

type MenuType = 'info' | 'history'

export default function PayableDetail() {
  const router = useRouter()
  const { id } = router.query

  const ability = useContext(AbilityContext)

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('info')

  useEffect(() => {
    if (menuQuery && ['info', 'history'].includes(menuQuery)) {
      setMenu(menuQuery)
    }
  }, [menuQuery])

  useEffect(() => {
    router.replace(`/invoice/payable/${id}?menu=${menu}`)
  }, [menu, id])

  const data = {
    corporationId: '123123',
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          sx={{ background: '#ffffff', padding: '20px', borderRadius: '6px' }}
        >
          <Box display='flex' alignItems='center' gap='4px'>
            <IconButton>
              <Icon
                icon='mdi:chevron-left'
                onClick={() => router.push('/invoice/payable/')}
              />
            </IconButton>
            <img
              src={'/images/icons/invoice/coin.png'}
              width={50}
              height={50}
              alt='invoice detail'
            />
            <Typography variant='h5'>{data.corporationId}</Typography>
          </Box>
          <Button
            variant='outlined'
            startIcon={<Icon icon='ic:baseline-download' />}
          >
            Download invoice
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={menu}>
          <TabList
            onChange={(e, v) => setMenu(v)}
            aria-label='Quote detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTap
              value='info'
              label='Invoice info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='history'
              label='Version history'
              iconPosition='start'
              icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          {/* Invoice info */}
          <TabPanel value='info' sx={{ pt: '24px' }}>
            <InvoiceInfo />
          </TabPanel>
          {/* Version history */}
          <TabPanel value='history' sx={{ pt: '24px' }}>
            <Card>
              <CardContent sx={{ padding: '24px' }}></CardContent>
            </Card>
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

PayableDetail.acl = {
  subject: 'invoice_payable',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
