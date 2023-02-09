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
import Icon from 'src/@core/components/icon'

// **values
import { JobList } from 'src/shared/const/personalInfo'
import { ClientCategory, ServiceType } from 'src/shared/const/client-guideline'

// ** types
import { FilterOmitType } from '../../client-guideline'

type Props = {
  filter: FilterOmitType
  setFilter: <T extends FilterOmitType>(v: T) => void
  search: () => void
  onReset: () => void
}

export default function Filters({ filter, setFilter, search, onReset }: Props) {
  function filterValue(option: any, keyName: keyof FilterOmitType) {
    return !filter[keyName]
      ? option[0]
      : option.filter((item: { value: string; label: string }) =>
          filter[keyName]?.includes(item.value),
        )
  }

  return (
    <Grid item xs={12}>
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
                value={filterValue(ClientCategory, 'client')}
                onChange={(e, v) =>
                  setFilter({ ...filter, client: v.map(item => item.value) })
                }
                options={ClientCategory}
                filterSelectedOptions
                id='client'
                getOptionLabel={option => option.label}
                renderInput={params => (
                  <TextField {...params} label='Client' placeholder='Client' />
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
                  options={JobList}
                  value={filterValue(JobList, 'category')}
                  onChange={(e, v) =>
                    setFilter({
                      ...filter,
                      category: v.map(item => item.value),
                    })
                  }
                  filterSelectedOptions
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
                options={ServiceType}
                value={filterValue(ServiceType, 'serviceType')}
                onChange={(e, v) =>
                  setFilter({
                    ...filter,
                    serviceType: v.map(item => item.value),
                  })
                }
                filterSelectedOptions
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
                Search the title and content
              </InputLabel>
              <OutlinedInput
                label='Search the title and content'
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
              <Button variant='contained' size='medium' onClick={search}>
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}
