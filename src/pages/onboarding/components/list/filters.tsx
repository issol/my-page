import { Button, Card, Grid, Typography } from '@mui/material'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { Box } from '@mui/system'

export default function Filters() {
  return (
    <Grid item xs={12} sx={{ mb: 5 }}>
      <Card sx={{ padding: '20px 0 20px 20px' }}>
        <Typography variant='h6' mb='15px'>
          Search Filters
        </Typography>
        <Grid container xs={12} spacing={6} rowSpacing={4}>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-outlined-label'>
                Age
              </InputLabel>
              <Select
                label='Age'
                defaultValue=''
                labelId='demo-simple-select-outlined-label'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-outlined-label'>
                Age
              </InputLabel>
              <Select
                label='Age'
                defaultValue=''
                labelId='demo-simple-select-outlined-label'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-outlined-label'>
                Age
              </InputLabel>
              <Select
                label='Age'
                defaultValue=''
                labelId='demo-simple-select-outlined-label'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-outlined-label'>
                Age
              </InputLabel>
              <Select
                label='Age'
                defaultValue=''
                labelId='demo-simple-select-outlined-label'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-outlined-label'>
                Age
              </InputLabel>
              <Select
                label='Age'
                defaultValue=''
                labelId='demo-simple-select-outlined-label'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-outlined-label'>
                Age
              </InputLabel>
              <Select
                label='Age'
                defaultValue=''
                labelId='demo-simple-select-outlined-label'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-outlined-label'>
                Age
              </InputLabel>
              <Select
                label='Age'
                defaultValue=''
                labelId='demo-simple-select-outlined-label'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
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
