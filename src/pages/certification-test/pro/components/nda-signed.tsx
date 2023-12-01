import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Switch,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { StyledViewer } from '@src/@core/components/editor/customEditor'
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'
import { currentVersionType } from '@src/apis/contract.api'
import { ClientUserType, UserDataType } from '@src/context/types'
import useModal from '@src/hooks/useModal'
import dayjs from 'dayjs'

import { EditorState, convertFromRaw } from 'draft-js'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Loadable } from 'recoil'

type Props = {
  nda: currentVersionType
  language: 'ENG' | 'KOR'
  setLanguage: Dispatch<SetStateAction<'ENG' | 'KOR'>>
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>
  setSignNDA: Dispatch<SetStateAction<boolean>>
}

const NDASigned = ({ nda, language, setLanguage, auth, setSignNDA }: Props) => {
  const { openModal, closeModal } = useModal()
  const [mainContent, setMainContent] = useState(EditorState.createEmpty())
  const [checked, setChecked] = useState<boolean>(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }
  const getAddress = (address: any) => {
    const state1 = address.baseAddress ? `${address.baseAddress}, ` : ''

    const state2 = address.detailAddress ? `${address.detailAddress}, ` : ''

    const city = address.city ? `${address.city}, ` : ''
    const state = address.state ? `${address.state}, ` : ''
    const country = address.country ? `${address.country}, ` : ''
    const zipCode = address.zipCode ? `${address.zipCode}` : ''

    if (
      state1 === '' &&
      state2 === '' &&
      city === '' &&
      state === '' &&
      country === '' &&
      zipCode === ''
    )
      return '-'

    return `${state1}${state2}${city}${state}${country}${zipCode}`
  }

  const getAllIndexes = (str: string, val: string) => {
    let indexes = []
    let i = -1
    while ((i = str.indexOf(val, i + 1)) != -1) {
      indexes.push(i)
    }
    return indexes
  }
  useEffect(() => {
    if (nda?.content) {
      const copyContent = { ...nda.content }
      const now = dayjs(new Date()).format('MM/DD/YYYY')
      for (let i = 0; i < copyContent?.blocks?.length; i++) {
        // if (!copyContent?.blocks[i]?.text.includes('{Legal name}')) continue
        // if (!copyContent?.blocks[i]?.text.includes('{Address}')) continue
        // if (!copyContent?.blocks[i]?.text.includes('{Date of birth}')) continue
        // if (!copyContent?.blocks[i]?.text.includes('Signature date: ')) continue

        copyContent.blocks[i].text = copyContent?.blocks[i]?.text?.replaceAll(
          '{Legal name}',
          auth.getValue().user?.username,
        )
        copyContent.blocks[i].text = copyContent?.blocks[i]?.text?.replaceAll(
          '{Address}',
          getAddress(auth.getValue().user?.addresses![0]),
        )
        copyContent.blocks[i].text = copyContent?.blocks[i]?.text?.replaceAll(
          '{Date of birth}',
          auth.getValue().user?.birthday,
        )

        let nameIndex = getAllIndexes(
          copyContent?.blocks[i]?.text!,
          auth.getValue().user?.username!,
        )

        let addressIndex = getAllIndexes(
          copyContent?.blocks[i]?.text!,
          getAddress(auth.getValue().user?.addresses![0]),
        )

        let dateOfBirthIndex = getAllIndexes(
          copyContent?.blocks[i]?.text!,
          auth.getValue().user?.birthday!,
        )

        let nameStyle = nameIndex.map(value => ({
          style: 'color-#666CFF',
          length: auth.getValue().user?.username?.length,
          offset: value,
        }))

        let addressStyle = addressIndex.map(value => ({
          style: 'color-#666CFF',
          length: getAddress(auth.getValue().user?.addresses![0]).length,
          offset: value,
        }))

        let dateOfBirthStyle = dateOfBirthIndex.map(value => ({
          style: 'color-#666CFF',
          length: auth.getValue().user?.birthday?.length! + 1,
          offset: value,
        }))

        console.log('hi')

        copyContent.blocks[i].type = 'unstyled'
        copyContent.blocks[i].inlineStyleRanges = [
          ...copyContent.blocks[i].inlineStyleRanges,
          ...nameStyle,
          ...addressStyle,
          ...dateOfBirthStyle,
          {
            style: 'BOLD',
            length: now.length + 16,
            offset:
              language === 'ENG'
                ? copyContent?.blocks[i]?.text!.indexOf('Signature date: ')
                : copyContent?.blocks[i]?.text!.indexOf('서명 일자: '),
          },
        ]

        copyContent.blocks[i].entityRanges = []
      }

      const content = convertFromRaw(copyContent as any)

      const editorState = EditorState.createWithContent(content)
      setMainContent(editorState)
    }
  }, [nda, language])

  const onClickClose = () => {
    openModal({
      type: 'CancelSignNDAModal',
      children: (
        <CustomModal
          onClose={() => {
            setSignNDA(false)
            setChecked(false)
            closeModal('CancelSignNDAModal')
            closeModal('StartTestModal')
          }}
          onClick={() => {
            closeModal('CancelSignNDAModal')
          }}
          title='Are you sure? To proceed with the testing process, the initial agreement to the NDA is required.'
          vary='error'
          leftButtonText='Leave this page'
          rightButtonText='Stay on this page'
        />
      ),
    })
  }

  const onClickSubmit = () => {
    //TODO API 연결 (성공 후 유저 데이터 쿼리 초기화 isSignedNDA 재조회 필요)
    setSignNDA(false)
    setChecked(false)
    // closeModal('CancelSignNDAModal')
  }

  return (
    <Box
      sx={{
        width: '782px',
        margin: '0 auto',

        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <StyledViewer>
        <Card>
          <Box
            sx={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              // gap: '20px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <Typography variant='h6'>{nda.title}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  fontSize={14}
                  fontWeight={language === 'KOR' ? 400 : 600}
                  color={language === 'KOR' ? '#BDBDBD' : '#666CFF'}
                >
                  English
                </Typography>
                <Switch
                  checked={language === 'KOR'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setLanguage(event.target.checked ? 'KOR' : 'ENG')
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                  sx={{
                    '.MuiSwitch-switchBase:not(.Mui-checked)': {
                      color: '#666CFF',
                      '.MuiSwitch-thumb': {
                        color: '#666CFF',
                      },
                    },
                    '.MuiSwitch-track': {
                      backgroundColor: '#666CFF',
                    },
                  }}
                />
                <Typography
                  fontSize={14}
                  fontWeight={language === 'KOR' ? 600 : 400}
                  color={language === 'KOR' ? '#666CFF' : '#BDBDBD'}
                >
                  Korean
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box>
              <ReactDraftWysiwyg editorState={mainContent} readOnly={true} />
            </Box>
          </Box>
        </Card>
      </StyledViewer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Typography variant='body2'>
          After the initial agreement, you can access the signed NDA on My page.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox checked={checked} onChange={handleChange} />
          <Typography variant='body1'>
            I agree to the terms and conditions.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
        <Button variant='outlined' onClick={onClickClose}>
          Close
        </Button>
        <Button variant='contained' disabled={!checked} onClick={onClickSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  )
}

export default NDASigned
