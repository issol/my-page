import { Icon } from '@iconify/react'
import { Box, IconButton } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { MouseEvent, useEffect, useState } from 'react'
import { SyntheticEvent } from 'react-draft-wysiwyg'
import { styled } from '@mui/system'
import HistoryAssignPro from './history-assign-pro'
import useModal from '@src/hooks/useModal'
import { ItemType, JobItemType, JobType } from '@src/types/common/item.type'
import { JobHistoryType, jobPriceHistoryType } from '@src/types/jobs/jobs.type'

import { PositionType, ProjectInfoType } from '@src/types/orders/order-detail'
import { PriceUnitListType } from '@src/types/common/standard-price'
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { jobItemSchema } from '@src/types/schema/item.schema'
// import ViewPrices from '../prices/view-prices'
import ViewHistoryPrices from './history-prices'

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useGetJobInfo, useGetJobPrices } from '@src/queries/order/job.query'
import { useQueryClient } from 'react-query'

type Props = {
  id: number
  title: string
  onClose: () => void
  row: JobHistoryType
  orderDetail: ProjectInfoType
  priceUnitsList: PriceUnitListType[]
  item: JobItemType
  originJobInfo: JobType
  projectTeam: {
    userId: number
    position: PositionType
    firstName: string
    middleName: string | null
    lastName: string
    email: string
    jobTitle: string
  }[]
  statusList: Array<{ value: number; label: string }>
}

/* TODO
  JobInfo, Prices 컴포넌트 이식하기
  Assign pro에 데이터 제대로 넘기기

*/
export default function HistoryDetail({
  id,
  originJobInfo,
  title,
  onClose,
  row,
  orderDetail,
  priceUnitsList,
  item,
  projectTeam,
  statusList,
}: Props) {
  const [value, setValue] = useState<string>('jobInfo')
  const { openModal, closeModal } = useModal()
  const auth = useRecoilValueLoadable(authState)
  const queryClient = useQueryClient()

  const [proListSkip, setProListSkip] = useState(0)
  const [proPageSize, setProPageSize] = useState(10)

  const { data: jobInfo, isLoading: jobInfoLoading } = useGetJobInfo(
    id,
    true,
  ) as {
    data: JobType
    isLoading: boolean
  }

  const { data: jobPrices, isLoading: jobPricesLoading } = useGetJobPrices(
    id,
    true,
  ) as { data: jobPriceHistoryType; isLoading: boolean }

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
    resolver: yupResolver(jobItemSchema) as unknown as Resolver<{
      items: ItemType[]
    }>,
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
    if (jobPrices) {
      const result = [
        {
          id: jobPrices?.id!,
          name: jobPrices?.priceName!,
          source: jobPrices?.source!,
          target: jobPrices?.target!,
          priceId: jobPrices?.priceId!,
          detail: !jobPrices?.detail?.length ? [] : jobPrices?.detail!,
          contactPersonId: 0,
          totalPrice: jobPrices?.totalPrice!,
        },
      ]
      itemReset({ items: result })
    } else {
      appendItems({
        itemName: '',
        source: 'en',
        target: 'ko',
        contactPersonId: 0,
        priceId: null,
        detail: [],
        totalPrice: 0,
        minimumPrice: null,
        minimumPriceApplied: false,
        priceFactor: 0,
        currency: null,
      })
    }
  }, [jobPrices])

  const onClickClose = () => {
    //history-detail 모달을 닫고 JobDetailViewModal 모달을 연다
    queryClient.invalidateQueries(['jobHistory'])
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
          {/* <JobInfoDetailView
            tab={'history'}
            row={originJobInfo!}
            orderDetail={orderDetail}
            item={item}
          /> */}
        </Box>
      ),
    })
  }

  return (
    <Box sx={{ padding: '50px 60px', position: 'relative' }}>
      <IconButton
        sx={{ position: 'absolute', top: '20px', right: '20px' }}
        onClick={onClickClose}
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
            onClick={onClickClose}
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
            {/* {jobInfo && !jobInfoLoading && (
              <ViewJobInfo
                row={jobInfo!}
                type='history'
                item={item}
                projectTeam={projectTeam}
                statusList={statusList}
                jobDeliveriesFeedbacks={{ deliveries: [], feedbacks: [] }}
              />
            )} */}
          </TabPanel>
          <TabPanel value='prices' sx={{ pt: '30px' }}>
            <ViewHistoryPrices jobInfo={jobInfo!} jobPrices={jobPrices!} />
          </TabPanel>
          <TabPanel value='assignPro'>
            {/* <AssignPro
              user={auth.getValue().user!}
              row={jobInfo!}
              orderDetail={orderDetail}
              type='history'
              // assignProList={row.assignPro}
              item={item}
              //TODO: assignment status에 70000대 코드 처리 추가해야 함
              statusList={statusList!}
            /> */}
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
