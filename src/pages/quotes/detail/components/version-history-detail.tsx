import { MouseEvent, SyntheticEvent, useState } from 'react'

// ** style components
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Grid,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import Icon from '@src/@core/components/icon'
import { DataGrid } from '@mui/x-data-grid'
import TabContext from '@mui/lab/TabContext'

import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'

// ** types
import { VersionHistoryType } from '@src/types/common/quotes.type'

// ** components
import QuotesProjectInfoDetail from './project-info'
import QuotesClientDetail from './client'

type Props = {
  history: VersionHistoryType
  onClose: () => void
  onClick: () => void
  isUpdatable: boolean
}

/* TODO: item&lang 추가하기 */
const VersionHistoryModal = ({
  history,
  onClose,
  onClick,
  isUpdatable,
}: Props) => {
  const [value, setValue] = useState<string>('1')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const [pageSize, setPageSize] = useState<number>(10)

  return (
    <Dialog open={true} onClose={onClose} maxWidth='lg' fullWidth>
      <DialogContent sx={{ padding: '50px 60px', minHeight: '900px' }}>
        <Grid container spacing={6}>
          <Grid
            item
            xs={12}
            display='flex'
            gap='8px'
            alignItems='center'
            padding='20px'
          >
            <img
              src='/images/icons/quotes-icons/book.png'
              alt=''
              width='50px'
              height='50px'
            />
            <Typography variant='h5'>{`[Ver.${history.version}] ${history.id}`}</Typography>
          </Grid>

          <Grid item xs={12}>
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                aria-label='Order detail Tab menu'
                style={{
                  marginBottom: '12px',
                  borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                }}
              >
                <CustomTap
                  value='1'
                  label='Project info'
                  iconPosition='start'
                  icon={
                    <Icon icon='iconoir:large-suitcase' fontSize={'18px'} />
                  }
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
                <CustomTap
                  value='2'
                  label='Languages & Items'
                  iconPosition='start'
                  icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
                <CustomTap
                  value='3'
                  label='Client'
                  iconPosition='start'
                  icon={
                    <Icon icon='mdi:account-star-outline' fontSize={'18px'} />
                  }
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
                <CustomTap
                  value='4'
                  label='Project team'
                  iconPosition='start'
                  icon={
                    <Icon icon='ic:baseline-people-outline' fontSize={'18px'} />
                  }
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
              </TabList>

              <TabPanel value='1'>
                <Card sx={{ padding: '24px' }}>
                  <QuotesProjectInfoDetail
                    project={history.projectInfo}
                    setEditMode={() => null}
                    isUpdatable={false}
                  />
                </Card>
              </TabPanel>

              <TabPanel value='2'></TabPanel>

              <TabPanel value='3'>
                <Card sx={{ padding: '24px' }}>
                  <QuotesClientDetail
                    client={history.client}
                    setIsEditMode={() => null}
                    isUpdatable={false}
                  />
                </Card>
              </TabPanel>

              <TabPanel value='4'>
                <Card>
                  <Box
                    sx={{
                      '& .MuiDataGrid-columnHeaderTitle': {
                        textTransform: 'none',
                      },
                    }}
                  >
                    <DataGrid
                      autoHeight
                      getRowId={row => row.userId}
                      columns={getProjectTeamColumns()}
                      rows={history.projectTeam ?? []}
                      rowsPerPageOptions={[10, 25, 50]}
                      pageSize={pageSize}
                      onPageSizeChange={setPageSize}
                      disableSelectionOnClick
                    />
                  </Box>
                </Card>
              </TabPanel>
            </TabContext>
          </Grid>

          <Grid
            item
            xs={12}
            display='flex'
            gap='12px'
            alignItems='center'
            justifyContent='center'
          >
            <Button
              variant='outlined'
              color='secondary'
              sx={{ width: '226px' }}
              onClick={onClose}
            >
              Close
            </Button>
            {isUpdatable ? (
              <Button
                variant='contained'
                sx={{ width: '226px' }}
                onClick={onClick}
              >
                Restore this version
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default VersionHistoryModal

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
