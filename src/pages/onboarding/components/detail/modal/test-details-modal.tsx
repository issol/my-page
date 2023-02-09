import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useContext,
  useState,
} from 'react'
import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import DialogContent from '@mui/material/DialogContent'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import { ModalContext } from 'src/context/ModalContext'
import { SelectedJobInfoType, TestHistoryType } from 'src/types/onboarding/list'
import Button from '@mui/material/Button'

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Autocomplete from '@mui/material/Autocomplete'
import Icon from 'src/@core/components/icon'

import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Chip from 'src/@core/components/mui/chip'
import { TestStatusColor } from 'src/shared/const/chipColors'

import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'
import { TestStatus } from 'src/shared/const/personalInfo'
import { CardProps } from '../../list/filters'
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'

type CellType = {
  row: TestHistoryType
}

type Props = {
  jobInfo: SelectedJobInfoType
  control: Control<
    {
      testStatus: {
        label: string
        value: string
      }[]
    },
    any
  >
}
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  '& .MuiTab-root': {
    minHeight: 38,
    minWidth: 110,
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))
export default function TestDetailsModal({ jobInfo, control }: Props) {
  const { setModal } = useContext(ModalContext)
  const [value, setValue] = useState<string>('1')
  const [inputStyle, setInputStyle] = useState<boolean>(true)
  const [testHistoryPage, setTestHistoryPage] = useState<number>(0)
  const [testHistoryPageSize, setTestHistoryPageSize] = useState<number>(10)
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  function getLegalName(row: TestHistoryType) {
    return !row.reviewer.firstName || !row.reviewer.lastName
      ? '-'
      : row.reviewer.firstName +
          (row.reviewer.middleName
            ? ' (' + row.reviewer.middleName + ')'
            : '') +
          ` ${row.reviewer.lastName}`
  }
  const columns = [
    {
      flex: 0.15,
      field: 'status',
      minWidth: 120,
      headerName: 'Test status',
      renderCell: ({ row }: CellType) => {
        return (
          <Chip
            size='medium'
            type='testStatus'
            label={row.status}
            /* @ts-ignore */
            customColor={TestStatusColor[row.status]}
            sx={{
              textTransform: 'capitalize',
              '& .MuiChip-label': { lineHeight: '18px' },
              mr: 1,
            }}
          />
        )
      },
    },
    {
      flex: 0.17,
      minWidth: 200,
      field: 'reviewer',
      headerName: 'Test reviewer / TAD',

      renderCell: ({ row }: CellType) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',

              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {' '}
            <Box
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {getLegalName(row)}
              </Typography>

              <Typography
                variant='body2'
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.reviewer.email}
              </Typography>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'date',
      headerName: 'Date&Time',

      renderCell: ({ row }: CellType) => (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {FullDateTimezoneHelper(row.date)}
        </Box>
      ),
    },
  ]

  return (
    <Dialog
      open={true}
      keepMounted
      fullWidth
      onClose={() => setModal(null)}
      // TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='md'
    >
      <DialogContent
        sx={{
          padding: '50px',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: '20px', right: '20px' }}
          onClick={() => setModal(null)}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label='customized tabs example'
            >
              <Tab
                value='1'
                label='Test details'
                icon={
                  <img
                    src={`/images/icons/onboarding-icons/test-details-${
                      value === '1' ? 'active' : 'inactive'
                    }.svg`}
                  />
                }
                iconPosition='start'
              />
              <Tab
                value='2'
                label='Assign reviewer'
                icon={
                  <img
                    src={`/images/icons/onboarding-icons/assign-reviewer-${
                      value === '2' ? 'active' : 'inactive'
                    }.svg`}
                  />
                }
                iconPosition='start'
              />
            </TabList>
            <TabPanel value='1' sx={{ padding: 0 }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
              >
                <Card sx={{ padding: '20px' }}>
                  <CardContent
                    sx={{ padding: 0, paddingBottom: '0 !important' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                          <Typography variant='body1' sx={{ fontWeight: 600 }}>
                            {jobInfo.jobType}
                          </Typography>
                          <Divider orientation='vertical' flexItem />
                          <Typography variant='body1' sx={{ fontWeight: 600 }}>
                            {jobInfo.role}
                          </Typography>
                        </Box>
                        <Typography
                          variant='subtitle2'
                          sx={{ fontWeight: 600 }}
                        >
                          {jobInfo.source && jobInfo.target ? (
                            <>
                              {jobInfo.source} &rarr; {jobInfo.target}
                            </>
                          ) : (
                            ''
                          )}
                        </Typography>
                      </Box>

                      <AutoCompleteComponent dropdownClose={inputStyle}>
                        <Controller
                          control={control}
                          name='testStatus'
                          render={({ field: { onChange, value } }) => (
                            <Autocomplete
                              fullWidth
                              onClose={() => {
                                setInputStyle(false)
                              }}
                              onOpen={() => {
                                setInputStyle(true)
                              }}
                              onChange={(event, item) => {
                                onChange(item)
                              }}
                              isOptionEqualToValue={(option, newValue) => {
                                return option.value === newValue.value
                              }}
                              limitTags={1}
                              options={TestStatus}
                              id='testStatus'
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField {...params} label='Test status' />
                              )}
                            />
                          )}
                        />
                      </AutoCompleteComponent>
                    </Box>
                  </CardContent>
                </Card>

                <Grid item xs={12}>
                  <Card>
                    <CardHeader title='Certification test history'></CardHeader>
                    <Box
                      sx={{
                        width: '100%',
                        '& .MuiDataGrid-columnHeaderTitle': {
                          textTransform: 'none',
                        },
                      }}
                    >
                      <DataGrid
                        components={{
                          NoRowsOverlay: () => {
                            return (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography variant='subtitle1'>
                                  There are no History
                                </Typography>
                              </Box>
                            )
                          },
                          NoResultsOverlay: () => {
                            return (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography variant='subtitle1'>
                                  There are no History
                                </Typography>
                              </Box>
                            )
                          },
                        }}
                        columns={columns}
                        // rowHeight={70}
                        rows={jobInfo.history ?? []}
                        autoHeight
                        disableSelectionOnClick
                        pageSize={testHistoryPageSize}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        page={testHistoryPage}
                        rowCount={jobInfo.history?.length}
                        onPageChange={(newPage: number) => {
                          setTestHistoryPage(newPage)
                        }}
                        onPageSizeChange={(newPageSize: number) =>
                          setTestHistoryPageSize(newPageSize)
                        }
                      />
                    </Box>
                  </Card>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel value='2'>
              <Typography>
                Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie
                gummi bears jujubes candy canes. Chupa chups sesame snaps
                halvah.
              </Typography>
            </TabPanel>
          </TabContext>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export const AutoCompleteComponent = styled(Card)<CardProps>(
  ({ theme, dropdownClose }) => ({
    '& .MuiAutocomplete-inputRoot': {
      height: !dropdownClose && '56px;',
      flexWrap: dropdownClose ? 'wrap;' : 'nowrap;',
    },
    width: '292px',
    boxShadow: 'none',

    padding: 6,
    borderRadius: '8px',
  }),
)
