import { Fragment, useContext, useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Switch,
  Typography,
} from '@mui/material'
import ToggleViewButton, {
  ToggleMenuType,
} from '@src/@core/components/toggle-view-button'

// ** contexts
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { useRecoilValue } from 'recoil'
import { authState } from '@src/states/auth'

// ** types
import { InvoicePayableFilterType } from '@src/types/invoice/payable.type'

// ** components
import Filter from './components/list/filter'
import PayableList from './components/list/list'
import ModalWithButtonName from '@src/pages/client/components/modals/modal-with-button-name'
import CalendarContainer from './components/calendar'

// ** apis
import { useGetPayableList } from '@src/queries/invoice/payable.query'
import { Icon } from '@iconify/react'
import { updateInvoicePayable } from '@src/apis/invoice/payable.api'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { InvoicePayableStatusType } from '@src/types/invoice/common.type'

const initialFilter: InvoicePayableFilterType = {
  invoiceStatus: [],
  pro: [],
  invoicedDateFrom: '',
  invoicedDateTo: '',
  payDueDateFrom: '',
  payDueDateTo: '',
  paidDateFrom: '',
  paidDateTo: '',
  search: '',
  skip: 0,
  take: 10,
}

export default function Payable() {
  const queryClient = useQueryClient()
  const ability = useContext(AbilityContext)

  const { openModal, closeModal } = useModal()

  const isAccountManager = ability.can('read', 'account_manage')

  const [menu, setMenu] = useState<ToggleMenuType>('list')

  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<InvoicePayableFilterType>(initialFilter)
  const [activeFilter, setActiveFilter] =
    useState<InvoicePayableFilterType>(initialFilter)

  const [statuses, setStatuses] = useState<number[]>([])

  const { data: list, isLoading } = useGetPayableList(activeFilter)

  function onSearch() {
    setActiveFilter({
      ...filter,
      skip: skip * activeFilter.take,
      take: activeFilter.take,
    })
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
  }

  const updateMutation = useMutation(
    (data: { id: number; status: InvoicePayableStatusType }) =>
      updateInvoicePayable(data.id, { invoiceStatus: data.status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/list' })
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  function onChangeStatusToPaid() {
    openModal({
      type: 'changeStatus',
      children: (
        <ModalWithButtonName
          message={`Are you sure you want to change ${statuses.length} invoice(s) as paid?`}
          onClick={() => {
            statuses.forEach(st => {
              updateMutation.mutateAsync({ id: st, status: 'Paid' })
            })
          }}
          onClose={() => closeModal('changeStatus')}
          rightButtonName='Change'
        />
      ),
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography variant='h5'>Invoice list</Typography>
        <ToggleViewButton menu={menu} setMenu={setMenu} />
      </Grid>
      {menu === 'list' ? (
        <Fragment>
          <Grid item xs={12}>
            <Filter
              filter={filter}
              setFilter={setFilter}
              onReset={onReset}
              search={onSearch}
            />
          </Grid>
          <Grid
            item
            xs={12}
            display='flex'
            gap='10px'
            alignItems='center'
            justifyContent='flex-end'
          >
            <Box display='flex' alignItems='center' gap='4px'>
              <Typography>See only my invoices</Typography>
              <Switch
                checked={activeFilter.mine === 1}
                onChange={e =>
                  setActiveFilter({
                    ...activeFilter,
                    mine: e.target.checked ? 1 : 0,
                  })
                }
              />
            </Box>
            <Box display='flex' alignItems='center' gap='4px'>
              <Typography>Hide paid invoices</Typography>
              <Switch
                checked={activeFilter.hidePaid === 1}
                onChange={e =>
                  setActiveFilter({
                    ...activeFilter,
                    hidePaid: e.target.checked ? 1 : 0,
                  })
                }
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='h6'>
                      Invoices ({list?.totalCount ?? 0})
                    </Typography>{' '}
                    {isAccountManager ? (
                      <Button
                        variant='contained'
                        disabled={!statuses.length}
                        onClick={onChangeStatusToPaid}
                        startIcon={<Icon icon='gg:check-o' />}
                      >
                        Paid
                      </Button>
                    ) : null}
                  </Box>
                }
                sx={{
                  pb: 4,
                  '& .MuiCardHeader-title': { letterSpacing: '.15px' },
                }}
              />
              <PayableList
                list={list || { data: [], totalCount: 0 }}
                statuses={statuses}
                setStatuses={setStatuses}
                isLoading={isLoading}
                isAccountManager={isAccountManager}
                pageSize={activeFilter.take}
                skip={skip}
                setSkip={(n: number) => {
                  setSkip(n)
                  setActiveFilter({
                    ...activeFilter,
                    skip: n * activeFilter.take!,
                  })
                }}
                setPageSize={(n: number) =>
                  setActiveFilter({ ...activeFilter, take: n })
                }
              />
            </Card>
          </Grid>
        </Fragment>
      ) : (
        <Grid item xs={12}>
          <CalendarContainer />
        </Grid>
      )}
    </Grid>
  )
}

Payable.acl = {
  subject: 'invoice_payable',
  action: 'read',
}
