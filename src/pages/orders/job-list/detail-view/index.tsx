'use client'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, IconButton, Tab, Typography, styled } from '@mui/material'
import Icon from '@src/@core/components/icon'
import useModal from '@src/hooks/useModal'
import {
  SyntheticEvent,
  useState,
  MouseEvent,
  Suspense,
  useEffect,
  useContext,
} from 'react'
import JobInfo from './components/job-info'
import Prices from './components/prices'
import { useGetAllPriceList } from '@src/queries/price-units.query'
import { PriceUnitListType } from '@src/types/common/standard-price'
import { useFieldArray, useForm } from 'react-hook-form'
import { ItemType } from '@src/types/common/item.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { itemSchema, jobItemSchema } from '@src/types/schema/item.schema'
import { is } from 'date-fns/locale'
import AssignPro from './components/assign-pro/assign-pro'
import { AssignProFilterPostType } from '@src/types/orders/job-detail'
import { useGetAssignProList } from '@src/queries/order/job.query'
import { AuthContext } from '@src/context/AuthContext'

type Props = {
  tab?: string
}

const JobInfoDetailView = ({ tab }: Props) => {
  const { openModal, closeModal } = useModal()
  const [value, setValue] = useState<string>(tab ?? 'jobInfo')
  const { user } = useContext(AuthContext)

  const { data: priceUnitsList } = useGetAllPriceList()

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const {
    control: itemControl,
    getValues: getItem,
    setValue: setItem,
    trigger: itemTrigger,
    reset: itemReset,
    formState: { errors: itemErrors, isValid: isItemValid },
  } = useForm<{ items: ItemType[] }>({
    mode: 'onBlur',
    defaultValues: { items: [] },
    resolver: yupResolver(jobItemSchema),
  })

  const {
    fields: items,
    append: appendItems,
    remove: removeItems,
    update: updateItems,
  } = useFieldArray({
    control: itemControl,
    name: 'items',
  })

  useEffect(() => {
    appendItems({
      name: '',
      source: 'en',
      target: 'ko',
      contactPersonId: 0,
      priceId: null,
      detail: [],
      totalPrice: 0,
    })
  }, [])

  return (
    <Box sx={{ padding: '50px 60px', position: 'relative' }}>
      <IconButton
        sx={{ position: 'absolute', top: '20px', right: '20px' }}
        onClick={() => closeModal('JobDetailViewModal')}
      >
        <Icon icon='mdi:close'></Icon>
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <img src='/images/icons/order-icons/job-detail.svg' alt='' />
          <Typography variant='h5'>TRA-001</Typography>
        </Box>

        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Order detail Tab menu'
            style={{
              borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
            }}
          >
            <CustomTab
              value='jobInfo'
              label='Job info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTab
              value='prices'
              label='Prices'
              iconPosition='start'
              icon={<Icon icon='mdi:dollar' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTab
              value='assignPro'
              label='Assign pro'
              iconPosition='start'
              icon={<Icon icon='mdi:account-outline' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTab
              value='history'
              label='Request history'
              iconPosition='start'
              icon={<Icon icon='ic:outline-history' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel value='jobInfo' sx={{ pt: '30px' }}>
            <JobInfo />
          </TabPanel>
          <TabPanel value='prices' sx={{ pt: '30px' }}>
            <Suspense>
              <Prices
                priceUnitsList={priceUnitsList ?? []}
                itemControl={itemControl}
                itemErrors={itemErrors}
                getItem={getItem}
                setItem={setItem}
                itemTrigger={itemTrigger}
                itemReset={itemReset}
                isItemValid={isItemValid}
                appendItems={appendItems}
              />
            </Suspense>
          </TabPanel>
          <TabPanel value='assignPro' sx={{ pt: '30px' }}>
            <AssignPro user={user!} />
          </TabPanel>
          <TabPanel value='history' sx={{ pt: '30px' }}></TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default JobInfoDetailView

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
