import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { renderStatusChip } from '@src/@core/components/chips/chips'
import { StyledViewer } from '@src/@core/components/editor/customEditor'
import { LinkReadOnlyItem } from '@src/@core/components/linkItem'
import PageHeader from '@src/@core/components/page-header'
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'
import UserLayout from '@src/layouts/UserLayout'
import { useGetJobOpeningDetail } from '@src/queries/pro/pro-job-openings'
import {
  FullDateTimezoneHelper,
  convertDateByTimezone,
} from '@src/shared/helpers/date.helper'
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import { authState } from '@src/states/auth'
import { EditorState, convertFromRaw } from 'draft-js'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilValueLoadable } from 'recoil'
import CustomChip from 'src/@core/components/mui/chip'

const JobOpeningDetail = () => {
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const id = Number(router.query.id)
  const { data } = useGetJobOpeningDetail(id)
  const [content, setContent] = useState(EditorState.createEmpty())

  function copyTextOnClick(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`Copied ${text} to clipboard`)
      })
      .catch(err => {
        toast.error('Failed to copy text: ', err)
      })
  }

  function renderTable(
    label: string,
    value: number | string | undefined | null,
  ) {
    return (
      <Grid container mb={'11px'}>
        <Grid item xs={5}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography
            variant='body2'
            sx={{ display: 'flex', alignItems: 'center', minHeight: '20px' }}
          >
            {value ?? '-'}
            {label === 'Job post link' && (
              <IconButton onClick={() => copyTextOnClick(value as string)}>
                <Icon
                  icon='mdi:content-copy'
                  fontSize={18}
                  opacity={0.7}
                  cursor='pointer'
                />
              </IconButton>
            )}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  useEffect(() => {
    if (data?.content) {
      const content = convertFromRaw(data?.content as any)
      const editorState = EditorState.createWithContent(content)
      setContent(editorState)
    }
  }, [data])
  return (
    <StyledViewer style={{ margin: '0 70px' }}>
      <PageHeader
        title={
          <Box display='flex' alignItems='center' gap='8px'>
            <Icon
              icon='material-symbols:arrow-back-ios-new'
              style={{ cursor: 'pointer' }}
              onClick={() => router.back()}
            />
            <Typography variant='h5'>Job posting list</Typography>
          </Box>
        }
      />

      <Grid container spacing={6} sx={{ paddingTop: '20px' }}>
        <Grid item md={9} xs={12}>
          <Card sx={{ padding: '30px 20px 20px' }}>
            <Box display='flex' justifyContent='space-between' mb='26px'>
              <Box display='flex' gap='10px'>
                <CustomChip
                  label={data?.id}
                  skin='light'
                  color='primary'
                  size='small'
                />
              </Box>

              <Box display='flex' flexDirection='column' gap='8px'>
                <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                  Posted date: &nbsp;
                  {FullDateTimezoneHelper(
                    data?.postedDate,
                    data?.postedTimezone,
                  )}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Grid container spacing={12} pt='20px'>
              <Grid item xs={6}>
                {renderTable('Job type', data?.jobType)}
                {renderTable(
                  'Source language',
                  data?.sourceLanguage?.toUpperCase(),
                )}
              </Grid>
              <Grid item xs={6}>
                {renderTable('Role', data?.role)}
                {renderTable(
                  'Target language',
                  data?.targetLanguage?.toUpperCase(),
                )}
              </Grid>
            </Grid>

            <Divider />
            <Grid container spacing={12} pt='20px'>
              <Grid item xs={6}>
                {renderTable('Years of experience', data?.yearsOfExperience)}
                {renderTable(
                  'Due date',
                  convertDateByTimezone(
                    data?.dueDate!,
                    data?.vendorTimezone.code!,
                    auth.getValue().user?.timezone.code!,
                  ),
                )}
              </Grid>

              <Grid item xs={6}>
                {renderTable('', '')}
                {renderTable(
                  `Vendor's timezone`,
                  getGmtTimeEng(auth.getValue().user?.timezone?.code),
                )}
              </Grid>
            </Grid>
            <Divider />
            <Box sx={{ pt: '20px' }}>
              <ReactDraftWysiwyg editorState={content} readOnly={true} />
            </Box>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card
            sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}
          >
            <Button variant='contained' fullWidth>
              Apply now
            </Button>
          </Card>
        </Grid>
      </Grid>
    </StyledViewer>
  )
}

export default JobOpeningDetail

JobOpeningDetail.guestGuard = true
JobOpeningDetail.getLayout = function getLayout(page: ReactNode) {
  return <UserLayout>{page}</UserLayout>
}
