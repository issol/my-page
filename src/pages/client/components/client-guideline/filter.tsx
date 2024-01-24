import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
} from '@mui/material'

// ** MUI Imports
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Box } from '@mui/system'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// **values
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { CategoryList } from '@src/shared/const/category/categories'

// ** types
import { ConstType, FilterType } from '../../client-guideline'
import { useGetClientList } from '@src/queries/client.query'
import { useMemo } from 'react'

type Props = {
  filter: FilterType
  setFilter: <T extends FilterType>(v: T) => void
  search: () => void
  onReset: () => void
  serviceType: Array<ConstType>
}

export default function Filters({
  filter,
  setFilter,
  search,
  onReset,
  serviceType,
}: Props) {
  const { data: clientData } = useGetClientList({ take: 1000, skip: 0 })
  const clientList = useMemo(
    () => clientData?.data?.map(i => ({ label: i.name, value: i.name })) || [],
    [clientData],
  )

  function filterValue(
    option: any,
    keyName: keyof Omit<FilterType, 'skip' | 'take'>,
  ) {
    return !filter[keyName]
      ? option[0]
      : option.filter((item: { value: string; label: string }) =>
          filter[keyName]?.includes(item.value),
        )
  }

  return (
    <Grid item xs={12}>
      <form
        onSubmit={e => {
          e.preventDefault()
          search()
        }}
      >
        <Card>
          <CardHeader title='Search Filters' />
          <Grid
            container
            spacing={6}
            rowSpacing={4}
            sx={{ padding: '0 20px 20px' }}
          >
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Autocomplete
                  autoHighlight
                  fullWidth
                  multiple
                  disableCloseOnSelect
                  value={filterValue(clientList, 'client')}
                  onChange={(e, v) =>
                    setFilter({ ...filter, client: v.map(item => item.value) })
                  }
                  options={clientList}
                  // filterSelectedOptions
                  id='client'
                  getOptionLabel={option => option.label}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Client'
                      placeholder='Client'
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
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormControl fullWidth>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    options={CategoryList}
                    value={filterValue(CategoryList, 'category')}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        category: v.map(item => item.value),
                      })
                    }
                    // filterSelectedOptions
                    id='category'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Category'
                        placeholder='Category'
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
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Autocomplete
                  autoHighlight
                  fullWidth
                  multiple
                  disableCloseOnSelect
                  options={ServiceTypeList || []}
                  value={filterValue(ServiceTypeList, 'serviceType')}
                  onChange={(e, v) =>
                    setFilter({
                      ...filter,
                      serviceType: v.map(item => item.value),
                    })
                  }
                  // filterSelectedOptions
                  id='serviceType'
                  getOptionLabel={option => option.label}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Service type'
                      placeholder='Service type'
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

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='icons-adornment-password'>
                  Search client guidelines
                </InputLabel>
                <OutlinedInput
                  label='Search client guidelines'
                  value={filter.content}
                  onChange={e =>
                    setFilter({
                      ...filter,
                      content: e.target.value,
                      title: e.target.value,
                    })
                  }
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        aria-label='toggle password visibility'
                      >
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
                <Button
                  variant='contained'
                  size='medium'
                  type='submit' /* onClick={search} */
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </form>
    </Grid>
  )
}
