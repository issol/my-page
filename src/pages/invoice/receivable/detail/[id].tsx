import {
  Box,
  Button,
  Grid,
  IconButton,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import { useGetReceivableInvoiceDetail } from '@src/queries/invoice/receivable.query'
import { useRouter } from 'next/router'
import InvoiceInfo from './components/invoice-info'
import { useState, MouseEvent, SyntheticEvent } from 'react'
import TabPanel from '@mui/lab/TabPanel'
import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import useModal from '@src/hooks/useModal'
import EditAlertModal from '@src/@core/components/common-modal/edit-alert-modal'
import InvoiceLanguageAndItem from './components/language-item'
type MenuType = 'invoiceInfo' | 'history' | 'team' | 'client' | 'item'
const ReceivableInvoiceDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [invoiceInfoEdit, setInvoiceInfoEdit] = useState(false)
  const [accountingInfoEdit, setAccountingInfoEdit] = useState(false)
  const [value, setValue] = useState<MenuType>('invoiceInfo')
  const { openModal, closeModal } = useModal()

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    if (invoiceInfoEdit) {
      openModal({
        type: 'EditAlertModal',
        children: (
          <EditAlertModal
            onClose={() => closeModal('EditAlertModal')}
            onClick={() => {
              closeModal('EditAlertModal')
              setValue(newValue)
              setInvoiceInfoEdit(false)
            }}
          />
        ),
      })
      return
    }

    if (newValue === 'item') {
      // initializeData()
    }

    setValue(newValue)
  }

  const { data: invoiceInfo, isLoading: invoiceInfoIsLoading } =
    useGetReceivableInvoiceDetail(Number(id!))

  return (
    <Grid item xs={12} sx={{ pb: '100px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            {invoiceInfoEdit ? null : (
              <IconButton
                sx={{ padding: '0 !important', height: '24px' }}
                onClick={() => router.push('/orders/order-list')}
              >
                <Icon icon='mdi:chevron-left' width={24} height={24} />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img src='/images/icons/order-icons/book.svg' alt='' />
              <Typography variant='h5'>{invoiceInfo?.corporationId}</Typography>
            </Box>
          </Box>
          <Box>
            <Button
              variant='outlined'
              sx={{ display: 'flex', gap: '8px' }}
              // onClick={onClickDownloadOrder}
            >
              <Icon icon='material-symbols:request-quote' />
              Download invoice
            </Button>
          </Box>
        </Box>
        <Box>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label='Order detail Tab menu'
              style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
            >
              <CustomTap
                value='invoiceInfo'
                label='Invoice info'
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
                icon={
                  <Icon icon='mdi:account-star-outline' fontSize={'18px'} />
                }
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
            <TabPanel value='invoiceInfo' sx={{ pt: '24px' }}>
              {invoiceInfo && !invoiceInfoIsLoading ? (
                <InvoiceInfo
                  type='detail'
                  invoiceInfo={invoiceInfo!}
                  edit={invoiceInfoEdit}
                  setEdit={setInvoiceInfoEdit}
                  orderId={7}
                  accountingEdit={accountingInfoEdit}
                  setAccountingEdit={setAccountingInfoEdit}
                />
              ) : null}
            </TabPanel>
            <TabPanel value='item' sx={{ pt: '24px' }}>
              {/* <InvoiceLanguageAndItem
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
            <TabPanel value='client' sx={{ pt: '24px' }}></TabPanel>
            <TabPanel value='team' sx={{ pt: '24px' }}></TabPanel>
            <TabPanel value='history' sx={{ pt: '24px' }}></TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Grid>
  )
}
export default ReceivableInvoiceDetail

ReceivableInvoiceDetail.acl = {
  subject: 'invoice',
  action: 'read',
}
const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
