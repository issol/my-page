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
  Grid,
  IconButton,
  Tab,
  Typography,
  // styled,
} from '@mui/material'
import { AuthContext } from '@src/context/AuthContext'
import { useAppDispatch } from '@src/hooks/useRedux'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useGetQuotesDetail } from '@src/queries/quotes.query'
import QuotesProjectInfo from './components/project-info'

type MenuType = 'project' | 'history' | 'team' | 'client' | 'item'

export default function QuotesDetail() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useContext(AuthContext)

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('project')

  const dispatch = useAppDispatch()

  /* form edit states */
  const [editProject, setEditProject] = useState(false)

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
          <TabPanel value='project' sx={{ pt: '24px' }}>
            <Suspense>
              {editProject ? null : (
                <Fragment>
                  <QuotesProjectInfo setEditMode={setEditProject} />
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
