import { Icon } from '@iconify/react'
import { Box, Grid, IconButton } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { MouseEvent, Suspense, useContext, useEffect, useState } from 'react'
import { SyntheticEvent } from 'react-draft-wysiwyg'
import styled from 'styled-components'
import HistoryAssignPro from './history-assign-pro'
import useModal from '@src/hooks/useModal'
import { ItemType, JobType } from '@src/types/common/item.type'
import { JobHistoryType } from '@src/types/jobs/jobs.type'
import ViewJobInfo from '../job-info/view-job-info'
import JobInfoDetailView from '../..'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import { PriceUnitListType } from '@src/types/common/standard-price'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { jobItemSchema } from '@src/types/schema/item.schema'
import ViewPrices from '../prices/view-prices'
import AssignPro from '../assign-pro/assign-pro'
import { AuthContext } from '@src/context/AuthContext'

type Props = {
  id: number
  title: string
  onClose: () => void
  row: JobHistoryType
  orderDetail: ProjectInfoType
  priceUnitsList: PriceUnitListType[]
}

/* TODO
  JobInfo, Prices 컴포넌트 이식하기
  Assign pro에 데이터 제대로 넘기기

*/
export default function HistoryDetail({
  id,
  title,
  onClose,
  row,
  orderDetail,
  priceUnitsList,
}: Props) {
  const [value, setValue] = useState<string>('jobInfo')
  const { openModal, closeModal } = useModal()
  const { user } = useContext(AuthContext)

  const [proListSkip, setProListSkip] = useState(0)
  const [proPageSize, setProPageSize] = useState(10)

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
    if (row.prices) {
      const result = [
        {
          id: row.prices?.id!,
          name: row.prices?.priceName!,
          source: row.prices?.sourceLanguage!,
          target: row.prices?.targetLanguage!,
          priceId: row.prices?.priceId!,
          detail: !row.prices?.data.length ? [] : row.prices?.data!,
          contactPersonId: 0,
          totalPrice: row.prices?.totalPrice!,
        },
      ]
      itemReset({ items: result })
    } else {
      appendItems({
        name: '',
        source: 'en',
        target: 'ko',
        contactPersonId: 0,
        priceId: null,
        detail: [],
        totalPrice: 0,
      })
    }
  }, [row])

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
          <IconButton
            sx={{ padding: '0 !important', height: '24px' }}
            onClick={() => {
              closeModal('history-detail')
              openModal({
                type: 'JobDetailViewModal',
                children: (
                  <Box
                    sx={{
                      maxWidth: '1180px',
                      width: '100%',
                      maxHeight: '90vh',
                      background: '#ffffff',
                      boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
                      borderRadius: '10px',
                      overflow: 'scroll',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                    }}
                  >
                    <JobInfoDetailView
                      tab={'history'}
                      row={row.jobInfo}
                      orderDetail={orderDetail}
                    />
                  </Box>
                ),
              })
            }}
          >
            <Icon icon='mdi:chevron-left' width={24} height={24} />
          </IconButton>

          <Typography variant='h5'>{title}</Typography>
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
          </TabList>
          <TabPanel value='jobInfo' sx={{ pt: '30px' }}>
            <ViewJobInfo row={row.jobInfo} type='history' />
          </TabPanel>
          <TabPanel value='prices' sx={{ pt: '30px' }}>
            <Suspense>
              <ViewPrices
                row={row.jobInfo}
                priceUnitsList={priceUnitsList ?? []}
                itemControl={itemControl}
                itemErrors={itemErrors}
                getItem={getItem}
                setItem={setItem}
                itemTrigger={itemTrigger}
                itemReset={itemReset}
                isItemValid={isItemValid}
                appendItems={appendItems}
                fields={items}
                type='history'
              />
            </Suspense>
          </TabPanel>
          <TabPanel value='assignPro'>
            <AssignPro
              user={user!}
              row={row.jobInfo}
              orderDetail={orderDetail}
              type='history'
              assignProList={row.assignPro}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`