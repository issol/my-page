// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'

// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Imports
import { convertToRaw, EditorState } from 'draft-js'
import { toast } from 'react-hot-toast'

// ** Component Import
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { StyledEditor } from '@src/@core/components/editor/customEditor'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import CustomChip from '@src/@core/components/mui/chip'

// ** contexts

import { useRouter } from 'next/router'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** values
import { FormErrors } from '@src/shared/const/formErrors'

// ** fetches
import { useMutation } from 'react-query'
import {
  ContractFormType,
  postContract,
  ContractType,
  LangType,
  ContractTypeEnum,
  ContractLangEnum,
} from '@src/apis/contract.api'
import { Icon } from '@iconify/react'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

const ContractForm = () => {
  const router = useRouter()
  const type = router.query.type as ContractType
  const language = router.query.language as LangType
  const [value, setValue] = useState(EditorState.createEmpty())
  const [showError, setShowError] = useState(false)
  const auth = useRecoilValueLoadable(authState)

  const { openModal, closeModal } = useModal()

  useEffect(() => {
    if (!type || !language) router.push('/onboarding/contracts/')
  }, [router.query])

  const postContractMutation = useMutation(
    (param: ContractFormType) => postContract(param),
    {
      onSuccess: () =>
        router.push({
          pathname: '/onboarding/contracts/detail',
          query: { type, language },
        }),
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  function getTitle() {
    switch (type) {
      case ContractTypeEnum.NDA:
        if (language === ContractLangEnum.KOREAN) return '[KOR] NDA'
        else return '[ENG] NDA'
      case ContractTypeEnum.PRIVACY:
        if (language === ContractLangEnum.KOREAN)
          return '[KOR] Privacy Contract'
        else return '[ENG] Privacy Contract'
      case ContractTypeEnum.FREELANCER:
        if (language === ContractLangEnum.KOREAN)
          return '[KOR] Freelancer Contract'
        else return '[ENG] Freelancer Contract'
      default:
        return ''
    }
  }

  function onDiscard() {
    openModal({
      type: 'DiscardModal',
      children: (
        <CustomModal
          title='Are you sure to discard this contract?'
          rightButtonText='Discard'
          onClick={() => {
            closeModal('DiscardModal')
            router.push('/onboarding/contracts/')
          }}
          onClose={() => closeModal('DiscardModal')}
          vary='error'
        />
      ),
    })
  }

  function onUpload() {
    openModal({
      type: 'UploadModal',
      children: (
        <CustomModal
          title='Are you sure to upload this contract?'
          rightButtonText='Upload'
          onClick={() => {
            closeModal('UploadModal')
            onSubmit()
          }}
          onClose={() => closeModal('UploadModal')}
          vary='successful'
        />
      ),
    })
  }

  function onSubmit() {
    const data = convertToRaw(value.getCurrentContent())
    postContractMutation.mutate({
      type,
      language,
      title: getTitle(),
      writer: auth.getValue().user?.username!,
      email: auth.getValue().user?.email!,
      content: data,
      text: value.getCurrentContent().getPlainText('\u0001'),
    })
  }

  const onClickHelpIcon = () => {
    openModal({
      type: 'HelpModal',
      children: (
        <CustomModal
          noButton
          closeButton
          vary='info'
          rightButtonText=''
          onClick={() => closeModal('HelpModal')}
          onClose={() => closeModal('HelpModal')}
          title={
            <>
              <Typography variant='h6' sx={{ mb: '10px' }}>
                Writing guidelines
              </Typography>
              In the area where each Pro’s legal name, date of birth, and
              permanent address should be entered, please type as follows. Be
              sure to include the special characters {}.
              <Typography
                textAlign={'left'}
                variant='body2'
                sx={{ fontSize: '16px' }}
              >
                <ul>
                  <li>
                    Pro’s legal name ={' '}
                    <Typography
                      component={'span'}
                      variant='body2'
                      sx={{ fontSize: '16px' }}
                      color='#666CFF'
                    >{`{Legal name}`}</Typography>
                  </li>
                  <li>
                    Pro’s date of birth ={' '}
                    <Typography
                      component={'span'}
                      variant='body2'
                      sx={{ fontSize: '16px' }}
                      color='#666CFF'
                    >{`{Date of birth}`}</Typography>
                  </li>
                  <li>
                    Pro’s permanent address ={' '}
                    <Typography
                      component={'span'}
                      variant='body2'
                      sx={{ fontSize: '16px' }}
                      color='#666CFF'
                    >{`{Address}`}</Typography>
                  </li>
                </ul>
              </Typography>
            </>
          }
        />
      ),
    })
  }

  return (
    <form>
      <StyledEditor
        style={{ margin: '0 70px' }}
        error={!value.getCurrentContent().getPlainText('\u0001') && showError}
      >
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={9}>
            <Card sx={{ padding: '30px 20px 20px' }}>
              <Box display='flex' justifyContent='space-between' mb='26px'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Typography variant='h6'>{getTitle()}</Typography>
                  <IconButton onClick={onClickHelpIcon}>
                    <Icon icon='mdi:alert-circle-outline' />
                  </IconButton>
                </Box>

                <Box display='flex' alignItems='center' gap='8px'>
                  <CustomChip
                    label='Writer'
                    skin='light'
                    color='error'
                    size='small'
                  />
                  <Typography
                    sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                    color='primary'
                  >
                    {auth.getValue().user?.username}
                  </Typography>
                  <Divider orientation='vertical' variant='middle' flexItem />
                  <Typography variant='body2'>
                    {auth.getValue().user?.email}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <ReactDraftWysiwyg
                editorState={value}
                placeholder='Create a contact form'
                onEditorStateChange={data => {
                  setShowError(true)
                  setValue(data)
                }}
              />
              {!value.getCurrentContent().getPlainText('\u0001') &&
              showError ? (
                <Typography
                  color='error'
                  sx={{ fontSize: '0.75rem', marginLeft: '12px' }}
                  mt='8px'
                >
                  {FormErrors.required}
                </Typography>
              ) : (
                ''
              )}
            </Card>
          </Grid>
          <Grid item xs={3} className='match-height' sx={{ height: '152px' }}>
            <Card>
              <Box
                sx={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={onDiscard}
                >
                  Discard
                </Button>
                <Button
                  variant='contained'
                  onClick={onUpload}
                  type='button'
                  disabled={!value.getCurrentContent().getPlainText('\u0001')}
                >
                  Upload
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </StyledEditor>
    </form>
  )
}

export default ContractForm

ContractForm.acl = {
  action: 'create',
  subject: 'contract',
}
