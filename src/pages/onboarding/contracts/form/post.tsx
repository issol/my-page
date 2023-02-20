// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card } from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'

// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** Third Party Imports
import { convertToRaw, EditorState } from 'draft-js'
import { toast } from 'react-hot-toast'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
import styled from 'styled-components'
import { Writer } from 'src/@core/components/chip'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'
import { useRouter } from 'next/router'
import { AuthContext } from 'src/context/AuthContext'

// ** values
import { FormErrors } from 'src/shared/const/formErrors'

// ** fetches
import { useMutation } from 'react-query'
import {
  ContractFormType,
  postContract,
  ContractType,
  LangType,
  ContractTypeEnum,
  ContractLangEnum,
} from 'src/apis/contract.api'

const ContractForm = () => {
  const router = useRouter()
  const type = router.query.type as ContractType
  const language = router.query.language as LangType
  const [value, setValue] = useState(EditorState.createEmpty())
  const [showError, setShowError] = useState(false)
  const { user } = useContext(AuthContext)
  const { setModal } = useContext(ModalContext)

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
    setModal(
      <ModalContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src='/images/icons/project-icons/status-alert-error.png'
            width={60}
            height={60}
            alt='role select error'
          />
          <Typography variant='body2'>
            Are you sure to discard this contract?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='outlined' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              setModal(null)
              setValue(EditorState.createEmpty())
            }}
          >
            Discard
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function onUpload() {
    setModal(
      <ModalContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src='/images/icons/project-icons/status-successful.png'
            width={60}
            height={60}
            alt='role select error'
          />
          <Typography variant='body2'>
            Are you sure to upload this contract?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='outlined' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='contained'
            type='button'
            onClick={() => {
              setModal(null)
              onSubmit()
            }}
          >
            Upload
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function onSubmit() {
    const data = convertToRaw(value.getCurrentContent())
    postContractMutation.mutate({
      type,
      language,
      title: getTitle(),
      writer: user?.username!,
      email: user?.email!,
      content: data,
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
                <Typography variant='h6'>{getTitle()}</Typography>

                <Box display='flex' alignItems='center' gap='8px'>
                  <Writer label='Writer' size='small' />
                  <Typography
                    sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                    color='primary'
                  >
                    {user?.username}
                  </Typography>
                  <Divider orientation='vertical' variant='middle' flexItem />
                  <Typography variant='body2'>ellie@glozinc.com</Typography>
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

const StyledEditor = styled(EditorWrapper)<{ error: boolean }>`
  .rdw-editor-main {
    border: ${({ error }) => (error ? '1px solid #FF4D49 !important' : '')};
  }
`
