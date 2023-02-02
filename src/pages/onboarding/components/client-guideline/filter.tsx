import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Grid,
  Typography,
} from '@mui/material'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Box } from '@mui/system'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// **values
import { JobList } from 'src/shared/const/personalInfo'
import { ClientCategory, ServiceType } from 'src/shared/const/client-guideline'

export default function Filters() {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Search Filters' />
        <Grid
          container
          xs={12}
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
              <TextField
                id='search'
                placeholder='Search the title and content'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:magnify' />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='flex-end' gap='15px'>
              <Button variant='outlined' size='medium' color='secondary'>
                Reset
              </Button>
              <Button variant='contained' size='medium'>
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}
