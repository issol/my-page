import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Grid, Tab, Typography, styled } from '@mui/material'
import Icon from '@src/@core/components/icon'

import TabContext from '@mui/lab/TabContext'
import { MouseEvent, SyntheticEvent, useEffect, useState } from 'react'

import ProjectTeam from '../project-team'
import { HistoryType, VersionHistoryType } from '@src/types/orders/order-detail'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import { InvoiceVersionHistoryType } from '@src/types/invoice/receivable.type'
import InvoiceInfo from '../invoice-info'
import InvoiceLanguageAndItem from '../language-item'
import { defaultOption, languageType } from '../../../add-new'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { ItemType } from '@src/types/common/item.type'
import { useFieldArray, useForm } from 'react-hook-form'
import { itemSchema } from '@src/types/schema/item.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  MemberType,
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { UserDataType } from '@src/context/types'
import { StandardPriceListType } from '@src/types/common/standard-price'
import InvoiceClient from '../client'

type Props = {
  history: InvoiceVersionHistoryType
  prices: StandardPriceListType[]
  pricesSuccess: boolean
  user: UserDataType
  onClose: any
  onClick: any
  statusList: {
    id: number
    statusName: string
  }[]
}

const InvoiceVersionHistoryModal = ({
  history,
  onClose,
  onClick,
  user,
  prices,
  pricesSuccess,
  statusList,
}: Props) => {
  const [value, setValue] = useState<string>('1')
  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const { data: priceUnitsList } = useGetAllClientPriceList()

  console.log(history)

  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

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
    resolver: yupResolver(itemSchema),
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

  const {
    control: teamControl,
    getValues: getTeamValues,
    setValue: setTeamValues,
    watch: teamWatch,
    reset: resetTeam,
    formState: { errors: teamErrors, isValid: isTeamValid },
  } = useForm<ProjectTeamType>({
    mode: 'onChange',
    defaultValues: {
      teams: [
        { type: 'supervisorId', id: null },
        {
          type: 'projectManagerId',
          id: user?.userId!,
          name: getLegalName({
            firstName: user?.firstName!,
            middleName: user?.middleName,
            lastName: user?.lastName!,
          }),
        },
        { type: 'member', id: null },
      ],
    },
    resolver: yupResolver(projectTeamSchema),
  })

  function getPriceOptions(source: string, target: string) {
    if (!pricesSuccess) return [defaultOption]
    const filteredList = prices
      .filter(item => {
        const matchingPairs = item.languagePairs.filter(
          pair => pair.source === source && pair.target === target,
        )
        return matchingPairs.length > 0
      })
      .map(item => ({
        groupName: item.isStandard ? 'Standard client price' : 'Matching price',
        ...item,
      }))
    return [defaultOption].concat(filteredList)
  }

  useEffect(() => {
    if (history.items) {
      setLanguagePairs(
        history.items?.languagePairs?.map(item => ({
          id: String(item.id),
          source: item.source,
          target: item.target,
          price: !item?.price
            ? null
            : getPriceOptions(item.source, item.target).filter(
                price => price.id === item?.price?.id!,
              )[0],
        }))!,
      )
      const result = history.items?.items?.map(item => {
        return {
          id: item.id,
          name: item.name,
          source: item.source,
          target: item.target,
          priceId: item.priceId,
          detail: !item?.detail?.length ? [] : item.detail,
          contactPersonId: item.contactPersonId,
          description: item.description,
          analysis: item.analysis ?? [],
          totalPrice: item?.totalPrice ?? 0,
          dueAt: item?.dueAt,
        }
      })
      itemReset({ items: result })
    }
    if (history.projectTeam) {
      const teams: Array<{
        type: MemberType
        id: number | null
        name: string
      }> = history.projectTeam.map(item => ({
        type:
          item.position === 'projectManager'
            ? 'projectManagerId'
            : item.position === 'supervisor'
            ? 'supervisorId'
            : 'member',
        id: item.userId,
        name: getLegalName({
          firstName: item?.firstName!,
          middleName: item?.middleName,
          lastName: item?.lastName!,
        }),
      }))
      resetTeam({ teams })
    }
  }, [history])

  return (
    <Box
      sx={{
        maxWidth: '1266px',
        width: '100%',
        maxHeight: '900px',
        height: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        overflow: 'scroll',
      }}
    >
      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <img src='/images/icons/invoice/invoice-icon.svg' alt='' />
          <Typography variant='h5'>{`[Ver. ${history.version}] ${history.invoiceInfo.corporationId}`}</Typography>
        </Box>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Order detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTap
              value='1'
              label='Invoice info'
              iconPosition='start'
              icon={
                <Icon icon='material-symbols:receipt-long' fontSize={'18px'} />
              }
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='2'
              label='Languages & Items'
              iconPosition='start'
              icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='3'
              label='Client'
              iconPosition='start'
              icon={<Icon icon='mdi:account-star-outline' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='4'
              label='Project team'
              iconPosition='start'
              icon={
                <Icon icon='ic:baseline-people-outline' fontSize={'18px'} />
              }
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel value='1' sx={{ height: '100%', minHeight: '552px' }}>
            <InvoiceInfo
              type='history'
              invoiceInfo={history.invoiceInfo}
              edit={false}
              orderId={history.id}
              statusList={statusList}
            />
          </TabPanel>
          <TabPanel value='2' sx={{ height: '100%', minHeight: '552px' }}>
            <Grid xs={12} container>
              <InvoiceLanguageAndItem
                langItem={history.items!}
                languagePairs={languagePairs!}
                setLanguagePairs={setLanguagePairs}
                clientId={history?.client.client.clientId}
                itemControl={itemControl}
                getItem={getItem}
                setItem={setItem}
                itemErrors={itemErrors}
                isItemValid={isItemValid}
                priceUnitsList={priceUnitsList || []}
                items={items}
                removeItems={removeItems}
                getTeamValues={getTeamValues}
                invoiceInfo={history.invoiceInfo}
              />
            </Grid>
          </TabPanel>
          <TabPanel value='3' sx={{ height: '100%', minHeight: '552px' }}>
            <InvoiceClient
              type='history'
              client={history.client}
              edit={false}
              setTax={() => null}
              setTaxable={() => null}
            />
          </TabPanel>
          <TabPanel value='4' sx={{ height: '100%', minHeight: '552px' }}>
            <ProjectTeam
              type='history'
              list={history.projectTeam}
              listCount={history.projectTeam.length}
              columns={getProjectTeamColumns()}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              edit={false}
              setEdit={() => console.log('no')}
              orderId={history.id}
            />
          </TabPanel>
        </TabContext>
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant='outlined'
            color='secondary'
            sx={{ width: '226px' }}
            onClick={onClose}
          >
            Close
          </Button>
          <Button variant='contained' sx={{ width: '226px' }} onClick={onClick}>
            Restore this version
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default InvoiceVersionHistoryModal

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
