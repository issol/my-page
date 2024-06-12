import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import { UserRoleType } from '@src/context/types'
import { NotificationCenterFilterType } from '@src/types/my-page/notification-center/notification.type'
import { Dispatch, SetStateAction, useState } from 'react'

type Props = {
  filter: NotificationCenterFilterType
  setFilter: Dispatch<SetStateAction<NotificationCenterFilterType>>
  onReset: () => void
  search: () => void
  currentRole: UserRoleType
}

const NotificationCategoryList = {
  LPM: [
    { value: 'Quotes', label: 'Quotes' },
    { value: 'Orders', label: 'Orders' },
    { value: 'Invoices', label: 'Invoices' },
    { value: 'Pros', label: 'Pros' },
    { value: 'Clients', label: 'Clients' },
    { value: 'Company', label: 'Company' },
    { value: 'Requests', label: 'Requests' },
  ],
  ACCOUNT_MANAGER: [
    { value: 'Quotes', label: 'Quotes' },
    { value: 'Orders', label: 'Orders' },
    { value: 'Invoices', label: 'Invoices' },
    { value: 'Pros', label: 'Pros' },
    { value: 'Clients', label: 'Clients' },
    { value: 'Company', label: 'Company' },
    { value: 'Requests', label: 'Requests' },
  ],
  TAD: [
    { value: 'Recruiting', label: 'Recruiting' },
    { value: 'Onboarding', label: 'Onboarding' },
    { value: 'Certification test', label: 'Certification test' },
    { value: 'Pros', label: 'Pros' },
    { value: 'Company', label: 'Company' },
  ],
  PRO: [
    { value: 'My page', label: 'My page' },
    { value: 'Certification test', label: 'Certification test' },
    { value: 'Job posting', label: 'Job posting' },
    { value: 'Jobs', label: 'Jobs' },
    { value: 'Invoice', label: 'Invoice' },
  ],
  CLIENT: [
    { value: 'Quotes', label: 'Quotes' },
    { value: 'Orders', label: 'Orders' },
    { value: 'Invoices', label: 'Invoices' },
    { value: 'Pros', label: 'Pros' },
    { value: 'LSP', label: 'LSP' },
    { value: 'Company', label: 'Company' },
  ],
}

const DurationList = [
  {
    value: 'Last 3 month',
    label: 'Last 3 month',
  },
  {
    value: 'Last 1 month',
    label: 'Last 1 month',
  },
  {
    value: 'Last 1 week',
    label: 'Last 1 week',
  },
]
const NotificationCenterFilter = ({
  filter,
  setFilter,
  onReset,
  search,
  currentRole,
}: Props) => {
  const [collapsed, setCollapsed] = useState<boolean>(true)

  function filterValue(option: any, keyName: keyof { category?: string[] }) {
    return !filter[keyName]
      ? option[0]
      : option.filter((item: { value: string; label: string }) =>
          filter[keyName]?.includes(item.value),
        )
  }
  return (
    <Grid item xs={12}>
      <Card style={{ overflow: 'visible' }}>
        <CardHeader
          title='Search Filters'
          action={
            <IconButton
              size='small'
              aria-label='collapse'
              sx={{ color: 'text.secondary' }}
              onClick={() => setCollapsed(!collapsed)}
            >
              <Icon
                fontSize={20}
                icon={!collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}
              />
            </IconButton>
          }
        />
        <Collapse in={collapsed}>
          <CardContent>
            <Grid container spacing={6} rowSpacing={4}>
              {/* status */}
              <Grid item xs={4} sm={4} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    // {...commonOptions}
                    multiple
                    // @ts-ignore
                    options={NotificationCategoryList[currentRole.name]}
                    // getOptionLabel={option => option.label}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    value={filterValue(
                      // @ts-ignore
                      NotificationCategoryList[currentRole.name],
                      'category',
                    )}
                    limitTags={1}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        category: v.map(item => item.label),
                      })
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Category'
                        // placeholder='Status'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    // {...commonOptions}

                    // @ts-ignore
                    options={DurationList}
                    // getOptionLabel={option => option.label}
                    value={
                      filter.duration
                        ? DurationList.find(
                            item => item.value === filter.duration!,
                          )
                        : { value: '', label: '' }
                    }
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    onChange={(e, v) => {
                      if (v) {
                        setFilter({
                          ...filter,
                          duration: v.value,
                        })
                      } else {
                        setFilter({
                          ...filter,
                          duration: undefined,
                        })
                      }
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Duration'
                        placeholder='Duration'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Search notifications</InputLabel>
                  <OutlinedInput
                    label='Search notifications'
                    value={filter.search}
                    onChange={e =>
                      setFilter({ ...filter, search: e.target.value })
                    }
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton edge='end'>
                          <Icon icon='mdi:magnify' />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display='flex' justifyContent='flex-end' gap='15px'>
                  <Button
                    variant='outlined'
                    size='medium'
                    color='secondary'
                    onClick={onReset}
                  >
                    Reset
                  </Button>
                  <Button variant='contained' size='medium' onClick={search}>
                    Search
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  )
}

export default NotificationCenterFilter
