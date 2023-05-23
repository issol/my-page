import {
  Fragment,
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react'

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

// ** contexts
import { AuthContext } from '@src/context/AuthContext'

// ** rdk
import { useAppDispatch } from '@src/hooks/useRedux'

// ** Next
import { useRouter } from 'next/router'

// ** components
import QuotesProjectInfoDetail from './components/project-info'
import QuotesLanguageItemsDetail from './components/language-items'

// ** react hook form
import { useFieldArray, useForm } from 'react-hook-form'

// ** type & validation
import {
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import { QuotesProjectInfoFormType } from '@src/types/common/quotes.type'
import {
  quotesProjectInfoDefaultValue,
  quotesProjectInfoSchema,
} from '@src/types/schema/quotes-project-info.schema'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { useGetAllPriceList } from '@src/queries/price-units.query'
import { ItemType } from '@src/types/common/item.type'
import { itemSchema } from '@src/types/schema/item.schema'
import { languageType } from '../add-new'

type MenuType = 'project' | 'history' | 'team' | 'client' | 'item'

/**
 * TODO
 * 각 데이터 fetch
 * form reset
 * form 컴포넌트 import
 * save, delete함수 추가
 * download quote, create order기능 구현
 */

export default function QuotesDetail() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useContext(AuthContext)

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('project')

  const dispatch = useAppDispatch()

  /* form edit states */
  const [editProject, setEditProject] = useState(false)
  const [editItems, setEditItems] = useState(false)

  useEffect(() => {
    if (
      menuQuery &&
      ['project', 'history', 'team', 'client', 'item'].includes(menuQuery)
    ) {
      setMenu(menuQuery)
    }
  }, [menuQuery])

  useEffect(() => {
    router.replace(`/quotes/detail/${id}?menu=${menu}`)
  }, [menu])

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setMenu(newValue)
  }

  // ** 1. Project info
  const {
    control: projectInfoControl,
    getValues: getProjectInfoValues,
    setValue: setProjectInfo,
    watch: projectInfoWatch,
    reset: projectInfoReset,
    formState: { errors: projectInfoErrors, isValid: isProjectInfoValid },
  } = useForm<QuotesProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: quotesProjectInfoDefaultValue,
    resolver: yupResolver(quotesProjectInfoSchema),
  })

  // ** 2. Language & Items
  const [tax, setTax] = useState(0)
  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])
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

  // ** 3. Client
  const {
    control: clientControl,
    getValues: getClientValue,
    setValue: setClientValue,
    watch: clientWatch,
    reset: clientReset,
    formState: { errors: clientErrors, isValid: isClientValid },
  } = useForm<ClientFormType>({
    mode: 'onChange',
    defaultValues: {
      clientId: null,
      contactPersonId: null,
      addressType: 'shipping',
    },
    resolver: yupResolver(clientSchema),
  })

  // ** 4. Project team
  const {
    control: teamControl,
    getValues: getTeamValues,
    setValue: setTeamValues,
    handleSubmit: submitTeam,
    watch: teamWatch,
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

  const {
    fields: members,
    append: appendMember,
    remove: removeMember,
    update: updateMember,
  } = useFieldArray({
    control: teamControl,
    name: 'teams',
  })

  const { data: prices, isSuccess } = useGetPriceList({
    clientId: getClientValue('clientId'),
  })
  const { data: priceUnitsList } = useGetAllPriceList()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            background: '#ffffff',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {/* {projectInfoEdit ||
            projectTeamEdit ||
            clientEdit ||
            langItemsEdit ? null : (
              <IconButton
                sx={{ padding: '0 !important', height: '24px' }}
                onClick={() => router.push('/orders/order-list')}
              >
                <Icon icon='mdi:chevron-left' width={24} height={24} />
              </IconButton>
            )} */}
            <IconButton
              sx={{ padding: '0 !important', height: '24px' }}
              onClick={() => router.push('/quotes')}
            >
              <Icon icon='mdi:chevron-left' width={24} height={24} />
            </IconButton>
            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img src='/images/icons/quotes-icons/book.png' alt='' />
              {/* <Typography variant='h5'>{projectInfo?.corporationId}</Typography> */}
            </Box>
          </Box>
          <Box display='flex' alignItems='center' gap='14px'>
            <Button
              variant='outlined'
              sx={{ display: 'flex', gap: '8px' }}
              // onClick={onClickDownloadOrder}
            >
              <Icon icon='material-symbols:request-quote' />
              Download quote
            </Button>
            <Button
              variant='outlined'
              // onClick={onClickDownloadOrder}
            >
              Create order
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={menu}>
          <TabList
            onChange={handleChange}
            aria-label='Order detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTap
              value='project'
              label='Project info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='item'
              label='Languages & Items'
              iconPosition='start'
              icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='client'
              label='Client'
              iconPosition='start'
              icon={<Icon icon='mdi:account-star-outline' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='team'
              label='Project team'
              iconPosition='start'
              icon={
                <Icon icon='ic:baseline-people-outline' fontSize={'18px'} />
              }
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='history'
              label='Version history'
              iconPosition='start'
              icon={<Icon icon='ic:outline-history' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          {/* Project info */}
          <TabPanel value='project' sx={{ pt: '24px' }}>
            <Suspense>
              {editProject ? null : (
                <Fragment>
                  <Card sx={{ padding: '24px' }}>
                    <QuotesProjectInfoDetail setEditMode={setEditProject} />
                  </Card>
                  <Grid container sx={{ mt: '24px' }}>
                    <Grid item xs={4}>
                      <Card sx={{ padding: '20px', width: '100%' }}>
                        <Button
                          variant='outlined'
                          fullWidth
                          color='error'
                          size='large'
                          // onClick={onClickDelete}
                        >
                          Delete this quote
                        </Button>
                      </Card>
                    </Grid>
                  </Grid>
                </Fragment>
              )}
            </Suspense>
          </TabPanel>
          <TabPanel value='item' sx={{ pt: '24px' }}>
            <Card>
              <CardContent sx={{ padding: '24px' }}>
                <QuotesLanguageItemsDetail
                  languagePairs={languagePairs}
                  setLanguagePairs={setLanguagePairs}
                  clientId={getClientValue('clientId')}
                  priceUnitsList={priceUnitsList || []}
                  itemControl={itemControl}
                  items={items}
                  getItem={getItem}
                  setItem={setItem}
                  itemErrors={itemErrors}
                  isItemValid={isItemValid}
                  removeItems={removeItems}
                  getTeamValues={getTeamValues}
                  appendItems={appendItems}
                  quoteId={Number(id)}
                  isEditMode={editItems}
                  setIsEditMode={setEditItems}
                />
              </CardContent>
            </Card>

            {/* <LanguageAndItem
                langItem={langItem!}
                languagePairs={languagePairs!}
                setLanguagePairs={setLanguagePairs}
                clientId={client?.client.clientId!}
                itemControl={itemControl}
                getItem={getItem}
                setItem={setItem}
                itemTrigger={itemTrigger}
                itemErrors={itemErrors}
                isItemValid={isItemValid}
                priceUnitsList={priceUnitsList || []}
                items={items}
                removeItems={removeItems}
                getTeamValues={getTeamValues}
                projectTax={projectInfo!.tax}
                appendItems={appendItems}
                orderId={Number(id!)}
                langItemsEdit={langItemsEdit}
                setLangItemsEdit={setLangItemsEdit}
              /> */}
          </TabPanel>
          <TabPanel value='client' sx={{ pt: '24px' }}>
            {/* <OrderDetailClient
                type={'detail'}
                client={client!}
                edit={clientEdit}
                setEdit={setClientEdit}
                orderId={Number(id!)}
              /> */}
          </TabPanel>
          <TabPanel value='team' sx={{ pt: '24px' }}>
            <Suspense>
              {/* <ProjectTeam
                  type='detail'
                  list={projectTeam!}
                  listCount={projectTeam?.length!}
                  columns={getProjectTeamColumns()}
                  page={projectTeamListPage}
                  setPage={setProjectTeamListPage}
                  pageSize={projectTeamListPageSize}
                  setPageSize={setProjectTeamListPageSize}
                  edit={projectTeamEdit}
                  setEdit={setProjectTeamEdit}
                  teamControl={teamControl}
                  members={members}
                  appendMember={appendMember}
                  removeMember={removeMember}
                  updateMember={updateMember}
                  getTeamValues={getTeamValues}
                  setTeamValues={setTeamValues}
                  teamErrors={teamErrors}
                  isTeamValid={isTeamValid}
                  teamWatch={teamWatch}
                  orderId={Number(id!)}
                /> */}
            </Suspense>
          </TabPanel>
          <TabPanel value='history' sx={{ pt: '24px' }}>
            {/* <VersionHistory
                list={versionHistory!}
                listCount={versionHistory?.length!}
                columns={versionHistoryColumns}
                page={versionHistoryListPage}
                setPage={setVersionHistoryListPage}
                pageSize={versionHistoryListPageSize}
                setPageSize={setVersionHistoryListPageSize}
                onClickRow={onClickVersionHistoryRow}
              /> */}
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

QuotesDetail.acl = {
  subject: 'quotes',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
