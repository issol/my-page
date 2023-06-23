import { useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Card, CardHeader, Grid, Switch, Typography } from '@mui/material'
import { Box } from '@mui/system'
import PageHeader from '@src/@core/components/page-header'
import { StyledNextLink } from '@src/@core/components/customLink'
import styled from 'styled-components'

// ** components

type MenuType = 'list' | 'calendar'
export default function Requests() {
  const [menu, setMenu] = useState<MenuType>('list')
  return (
    <Box display='flex' flexDirection='column'>
      <Box
        display='flex'
        width={'100%'}
        alignItems='center'
        justifyContent='space-between'
        padding='10px 0 24px'
      >
        <PageHeader
          title={<Typography variant='h5'>Request list</Typography>}
        />
        <ButtonGroup variant='outlined'>
          <CustomBtn
            value='list'
            $focus={menu === 'list'}
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            List view
          </CustomBtn>
          <CustomBtn
            $focus={menu === 'calendar'}
            value='calendar'
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            Calendar view
          </CustomBtn>
        </ButtonGroup>
      </Box>
      <Box>
        {
          menu === 'list' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* <QuotesFilters
          filter={filters}
          control={control}
          setFilter={setFilters}
          onReset={onClickResetButton}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          trigger={trigger}
          serviceTypeList={serviceTypeList}
          setServiceTypeList={setServiceTypeList}
          categoryList={categoryList}
          setCategoryList={setCategoryList}
        /> */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '24px',
                }}
              >
                {/* <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>See only my quotes</Typography>
            <Switch checked={seeMyQuotes} onChange={handleSeeMyQuotes} />
          </Box>
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>Hide completed quotes</Typography>
            <Switch
              checked={hideCompletedQuotes}
              onChange={handleHideCompletedQuotes}
            />
          </Box> */}
              </Box>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title={
                      <Box display='flex' justifyContent='space-between'>
                        <Typography variant='h6'>
                          Requests {/* ({list?.totalCount ?? 0}) */}
                        </Typography>{' '}
                        <Button variant='contained'>
                          <StyledNextLink href='/quotes/add-new' color='white'>
                            Create new request
                          </StyledNextLink>
                        </Button>
                      </Box>
                    }
                    sx={{
                      pb: 4,
                      '& .MuiCardHeader-title': { letterSpacing: '.15px' },
                    }}
                  />
                  {/* <QuotesList
              skip={quoteListPage}
              setSkip={setClientInvoiceListPage}
              pageSize={quoteListPageSize}
              setPageSize={setClientInvoiceListPageSize}
              list={list || { data: [], totalCount: 0 }}
              isLoading={isLoading}
              filter={filters}
              setFilter={setFilters}
            /> */}
                </Card>
              </Grid>
            </Box>
          ) : null // <CalendarContainer />
        }
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`

Requests.acl = {
  subject: 'client_request',
  action: 'read',
}
