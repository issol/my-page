// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'

// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** Third Party Imports
import { convertFromRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { StyledViewer } from '@src/@core/components/editor/customEditor'
import { toast } from 'react-hot-toast'
import { renderStatusChip } from '@src/@core/components/chips/chips'

// ** Custom Components Imports
import CustomChip from '@src/@core/components/mui/chip'
import EmptyPost from '@src/@core/components/page/empty-post'
import PageHeader from '@src/@core/components/page-header'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { LinkReadOnlyItem } from 'src/@core/components/linkItem'
import Icon from 'src/@core/components/icon'

// ** contexts

import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** helpers
import { convertTimeToTimezone } from 'src/shared/helpers/date.helper'

// ** NextJS
import { useRouter } from 'next/router'

// ** fetches
import { useGetJobPostingDetail } from '@src/queries/jobs/jobPosting.query'
import { deleteJobPosting } from '@src/apis/jobPosting.api'
import { useMutation } from 'react-query'

// ** types
import { CurrentHistoryType } from '@src/apis/recruiting.api'
import FallbackSpinner from '@src/@core/components/spinner'
import { job_posting } from '@src/shared/const/permission-class'
import { timezoneSelector } from '@src/states/permission'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

type CellType = {
  row: CurrentHistoryType
}

const JobPostingDetail = () => {
  const router = useRouter()
  const id = Number(router.query.id)

  const [content, setContent] = useState(EditorState.createEmpty())

  const ability = useContext(AbilityContext)
  const { openModal, closeModal } = useModal()

  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const { data, refetch, isSuccess, isError } = useGetJobPostingDetail(
    id,
    false,
  )

  useEffect(() => {
    if (!Number.isNaN(id)) {
      refetch()
    }
  }, [id])

  const writer = new job_posting(data?.userId!)
  //writer can update the post, master can update / delete the post
  const isUpdatable = ability.can('update', writer)
  const isDeletable = ability.can('delete', writer)

  const deleteMutation = useMutation((id: number) => deleteJobPosting(id), {
    onSuccess: () => {
      router.replace('/jobPosting/')
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })

  useEffect(() => {
    if (data?.content) {
      const content = convertFromRaw(data?.content as any)
      const editorState = EditorState.createWithContent(content)
      setContent(editorState)
    }
  }, [data])

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
        <Grid item xs={6}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant='body2'
            sx={{ display: 'flex', alignItems: 'center' }}
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

  function onDelete() {
    openModal({
      type: 'DeleteModal',
      children: (
        <CustomModal
          title='Are you sure to delete this recruiting request?'
          onClose={() => closeModal('DeleteModal')}
          onClick={() => {
            closeModal('DeleteModal')
            deleteMutation.mutate(id)
          }}
          vary='error'
          rightButtonText='Delete'
        />
      ),
    })
  }

  function onEdit() {
    router.push(`/jobPosting/edit/${id}`)
  }

  return (
    <>
      {!data || auth.state === 'loading' ? (
        <FallbackSpinner />
      ) : isError || auth.state === 'hasError' ? (
        <EmptyPost />
      ) : (
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
                      label={data?.corporationId}
                      skin='light'
                      color='primary'
                      size='small'
                    />

                    {renderStatusChip(data?.status!)}
                  </Box>

                  <Box display='flex' flexDirection='column' gap='8px'>
                    <Box display='flex' alignItems='center' gap='8px'>
                      <CustomChip
                        label='Writer'
                        skin='light'
                        color='error'
                        size='small'
                      />
                      <Typography
                        sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                        color={`${
                          auth.getValue().user?.email === data?.email
                            ? 'primary'
                            : ''
                        }`}
                      >
                        {data?.writer}
                      </Typography>
                      <Divider
                        orientation='vertical'
                        variant='middle'
                        flexItem
                      />
                      <Typography variant='body2'>{data?.email}</Typography>
                    </Box>
                    <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                      {convertTimeToTimezone(
                        data?.createdAt,
                        auth.getValue().user?.timezone!,
                        timezone.getValue(),
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Grid container spacing={12} pt='10px'>
                  <Grid item xs={5}>
                    {renderTable('Job type', data?.jobType)}
                    {renderTable(
                      'Source language',
                      data?.sourceLanguage?.toUpperCase(),
                    )}
                  </Grid>
                  <Grid item xs={7}>
                    {renderTable('Role', data?.role)}
                    {renderTable(
                      'Target language',
                      data?.targetLanguage?.toUpperCase(),
                    )}
                  </Grid>
                </Grid>

                <Divider />
                <Grid container spacing={12} pt='10px'>
                  <Grid item xs={5}>
                    {renderTable('Number of linguist', data?.openings)}
                    {renderTable(
                      'Due date',
                      convertTimeToTimezone(
                        data?.dueDate,
                        auth.getValue().user?.timezone!,
                        timezone.getValue(),
                      ),
                    )}
                    {renderTable('Job post link', data?.jobPostLink)}
                  </Grid>
                  <Grid item xs={7}>
                    {renderTable(
                      'Years of experience',
                      data?.yearsOfExperience,
                    )}
                    {renderTable(
                      'Due date timezone',
                      auth.getValue().user?.timezone?.label,
                    )}
                  </Grid>
                </Grid>
                <Divider />
                <ReactDraftWysiwyg editorState={content} readOnly={true} />
              </Card>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card style={{ height: '565px', overflow: 'scroll' }}>
                <Box
                  sx={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <Box display='flex' justifyContent='space-between'>
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        fontSize: '14px',
                      }}
                    >
                      <Icon icon='material-symbols:link' opacity={0.7} />
                      Link*
                    </Typography>
                    <Typography variant='body2'>
                      {data?.postLink?.length || 0}/15
                    </Typography>
                  </Box>

                  {data?.postLink?.length ? <Divider /> : null}
                  {data?.postLink?.map(item => (
                    <LinkReadOnlyItem
                      key={item.id}
                      link={item}
                      onClick={copyTextOnClick}
                    />
                  ))}
                </Box>
              </Card>
              <Card style={{ marginTop: '24px' }}>
                {isDeletable || isUpdatable ? (
                  <Box
                    sx={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {isDeletable && (
                      <Button
                        variant='outlined'
                        color='secondary'
                        startIcon={<Icon icon='mdi:delete-outline' />}
                        onClick={onDelete}
                      >
                        Delete
                      </Button>
                    )}

                    {isUpdatable ? (
                      <Button
                        variant='contained'
                        startIcon={<Icon icon='mdi:pencil-outline' />}
                        onClick={onEdit}
                      >
                        Edit
                      </Button>
                    ) : null}
                  </Box>
                ) : null}
              </Card>
            </Grid>
          </Grid>
        </StyledViewer>
      )}
    </>
  )
}

export default JobPostingDetail

JobPostingDetail.acl = {
  subject: 'job_posting',
  action: 'read',
}
