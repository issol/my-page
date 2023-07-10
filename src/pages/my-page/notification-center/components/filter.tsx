import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Collapse,
  FormControl,
  Grid,
  IconButton,
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
  ],
  TAD: [
    { value: 'Quotes', label: 'Quotes' },
    { value: 'Orders', label: 'Orders' },
  ],
}
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
              <Grid item xs={6} sm={6} md={3}>
                <FormControl fullWidth>
                  <Autocomplete
                    // {...commonOptions}
                    multiple
                    // @ts-ignore
                    options={NotificationCategoryList[currentRole.name]}
                    // getOptionLabel={option => option.label}
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
                        label='Status'
                        placeholder='Status'
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
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  )
}

export default NotificationCenterFilter
