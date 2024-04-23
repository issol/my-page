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
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Loadable, useSetRecoilState } from 'recoil'
import {
  getContractFilePath,
  getFilePath,
} from '@src/shared/transformer/filePath.transformer'
import { getUploadUrlforCommon, uploadFileToS3 } from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { signContract } from '@src/apis/pro/pro-certification-tests'
import { useMutation } from 'react-query'
import { FileType } from '@src/types/common/file.type'
import toast from 'react-hot-toast'
import { getUserInfo } from '@src/apis/user.api'
import { saveUserDataToBrowser } from '@src/shared/auth/storage'
import { currentRoleSelector } from '@src/states/permission'
import { useRouter } from 'next/router'
import { authState } from '@src/states/auth'
import { UseFormGetValues } from 'react-hook-form'
import { ProPersonalInfo } from '@src/types/sign/personalInfoTypes'

type Props = {
  nda: currentVersionType
  language: 'ENG' | 'KOR'
  setLanguage: Dispatch<SetStateAction<'ENG' | 'KOR'>>
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>
  signNDA: boolean
  setSignNDA: Dispatch<SetStateAction<boolean>>
  type: 'additional' | 'certi'
  address?: {
    baseAddress: string | null //street1
    detailAddress: string | null //street2
    city: string | null
    state: string | null
    country: string | null
    zipCode: string | null
  }
  user?: {
    name: string
    birthday: string | null
  }
}

const NDASigned = ({
  nda,
  language,
  setLanguage,
  auth,
  signNDA,
  setSignNDA,
  type,
  address,
  user,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const [mainContent, setMainContent] = useState(EditorState.createEmpty())
  const [checked, setChecked] = useState<boolean>(false)
  const setCurrentRole = useSetRecoilState(currentRoleSelector)
  const setAuth = useSetRecoilState(authState)
  const router = useRouter()

  const signContractMutation = useMutation(
    (data: { type: 'nda' | 'contract'; file: string[] }) =>
      signContract(data.type, data.file),
    {
      onSuccess: () => {
        getUserInfo(auth.getValue().user?.userId!)
          .then(value => {
            console.log(value)

            const profile = value
            const userInfo = {
              ...profile,
              id: value.userId,
              email: value.email,
              username: `${profile.firstName} ${
                profile?.middleName ? '(' + profile?.middleName + ')' : ''
              } ${profile.lastName}`,
              firstName: profile.firstName,
              timezone: profile.timezone,
            }
            saveUserDataToBrowser(userInfo)
            setAuth(prev => ({ ...prev, user: userInfo }))

            // 컴퍼니 데이터 패칭이 늦어 auth-provider에서 company 데이터가 도착하기 전에 로직체크가 됨
            // user, company 데이터를 동시에 set 하도록 변경

            setCurrentRole(
              value?.roles && value?.roles.length > 0 ? value?.roles[0] : null,
            )
          })
          .catch(e => {
            router.push('/login')
          })

        setSignNDA(false)
        setChecked(false)
      },
    },
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    type === 'certi'
      ? setChecked(event.target.checked)
      : setSignNDA(event.target.checked)
  }
  const getAddress = (address: any) => {
    if (!address) return ''
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
      const now = dayjs(new Date()).format('MM/DD/YYYY')
      const addresses =
        type === 'certi'
          ? auth.getValue().user?.addresses![0]
          : address
            ? address
            : null

      const name =
        type === 'certi'
          ? auth.getValue().user?.username ?? ''
          : user
            ? user.name
            : ''

      const birthday =
        type === 'certi'
          ? auth.getValue().user?.birthday ?? ''
          : user
            ? user.birthday ?? ''
            : ''
      const additionalResult = {
        ...nda,
        content: {
          ...nda.content,
          blocks: [
            {
              data: {},
              depth: 0,
              inlineStyleRanges: [
                {
                  style: 'BOLD',
                  length: 12 + name.length,
                  offset: 0,
                },
              ],
              text: `Legal name: ${name}`,
              type: 'unstyled',
            },
            {
              data: {},
              depth: 0,
              inlineStyleRanges: [
                {
                  style: 'BOLD',
                  length: 19 + getAddress(addresses).length ?? 0,
                  offset: 0,
                },
              ],
              text: `Permanent address: ${getAddress(addresses)}`,
              type: 'unstyled',
            },
            {
              data: {},
              depth: 0,
              inlineStyleRanges: [
                {
                  style: 'BOLD',
                  length: 15 + birthday.length,
                  offset: 0,
                },
              ],
              text: `Date of birth: ${birthday}`,
              type: 'unstyled',
            },
            {
              data: {},
              depth: 0,
              inlineStyleRanges: [],
              text: '',
              type: 'unstyled',
            },
            ...nda.content.blocks,
          ],
        },
      }
      console.log(additionalResult)

      const copyContent =
        type === 'certi' ? { ...nda.content } : { ...additionalResult.content }
      let i = type === 'certi' ? 0 : 3

      for (i; i < copyContent?.blocks?.length; i++) {
        copyContent.blocks[i].text = copyContent?.blocks[i]?.text?.replaceAll(
          '{Legal name}',
          name,
        )
        copyContent.blocks[i].text = copyContent?.blocks[i]?.text?.replaceAll(
          '{Address}',
          getAddress(addresses),
        )
        copyContent.blocks[i].text = copyContent?.blocks[i]?.text?.replaceAll(
          '{Date of birth}',
          birthday,
        )

        let nameIndex = getAllIndexes(copyContent?.blocks[i]?.text!, name)

        let addressIndex = getAllIndexes(
          copyContent?.blocks[i]?.text!,
          getAddress(addresses),
        )

        let dateOfBirthIndex = getAllIndexes(
          copyContent?.blocks[i]?.text!,
          birthday,
        )

        let signatureDateIndex = getAllIndexes(
          copyContent?.blocks[i]?.text!,
          language === 'ENG' ? 'Signature date: ' : '서명 일자: ',
        )

        let nameStyle = nameIndex.map(value => ({
          style: 'color-#666CFF',
          length: name.length,
          offset: value,
        }))

        let nameBoldStyle = nameIndex.map(value => ({
          style: 'BOLD',
          length: name.length,
          offset: value,
        }))

        let addressStyle = addressIndex.map(value => ({
          style: 'color-#666CFF',
          length: getAddress(addresses).length,
          offset: value,
        }))

        let addressBoldStyle = addressIndex.map(value => ({
          style: 'BOLD',
          length: getAddress(addresses).length,
          offset: value,
        }))

        let dateOfBirthStyle = dateOfBirthIndex.map(value => ({
          style: 'color-#666CFF',
          length: birthday.length! + 1,
          offset: value,
        }))

        let dateOfBirthBoldStyle = dateOfBirthIndex.map(value => ({
          style: 'BOLD',
          length: birthday.length! + 1,
          offset: value,
        }))

        let signatureDateStyle = signatureDateIndex.map(value => ({
          style: 'BOLD',
          length: now.length + 16,
          offset: value,
        }))

        copyContent.blocks[i].type = 'unstyled'
        copyContent.blocks[i].inlineStyleRanges = [
          ...copyContent.blocks[i].inlineStyleRanges,
          ...nameStyle,
          ...nameBoldStyle,
          ...addressStyle,
          ...addressBoldStyle,
          ...dateOfBirthStyle,
          ...dateOfBirthBoldStyle,
          ...signatureDateStyle,
        ]

        copyContent.blocks[i].entityRanges = []
      }

      const content = convertFromRaw(copyContent as any)

      const editorState = EditorState.createWithContent(content)
      setMainContent(editorState)
    }
  }, [nda, language, address, user])

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

    const input = document.getElementById('downloadItem')
    let fileInfo: FileType[] = []

    if (input) {
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm')
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const pageHeight = 295
        let heightLeft = imgHeight
        let position = 0
        heightLeft -= pageHeight
        pdf.addImage(imgData, 'JPEG', 0, 10, imgWidth, imgHeight)
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        let downloadFile = pdf.output('blob')
        let data = new FormData()

        if (downloadFile) {
          data.append('data', downloadFile, `[${language}] NDA`)
        }

        const path: string = getContractFilePath(
          auth.getValue().user?.id!,
          `[${language}] NDA.pdf`,
        )

        const promise = [
          getUploadUrlforCommon(S3FileType.PRO_CONTRACT, path).then(res => {
            fileInfo.push({
              name: `[${language}] NDA.pdf`,
              size: downloadFile.size,
              file: path,
              type: 'pdf',
              // type: 'imported',
            })
            return uploadFileToS3(res.url, data)
          }),
        ]

        Promise.all(promise)
          .then(res => {
            // updateProject.mutate({ deliveries: fileInfo })
            signContractMutation.mutate({
              type: 'nda',
              file: fileInfo.map(file => file.name),
            })
          })
          .catch(err =>
            toast.error(
              'Something went wrong while uploading files. Please try again.',
              {
                position: 'bottom-left',
              },
            ),
          )
      })
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Box
        sx={{
          width: type === 'certi' ? '782px' : '100%',
          margin: type === 'certi' ? '0 auto' : 0,

          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          border: '1px solid #D8D8DD',
          borderRadius: '10px',
          padding: '20px',
        }}
      >
        <StyledViewer id='downloadItem'>
          <Box
            sx={{
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
              <Typography variant='h6'>[{language} NDA]</Typography>
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
            <Box
              sx={{
                maxHeight: '570px',
                overflowY: 'scroll',
                '&::-webkit-scrollbar': {
                  width: 4,
                },

                '&::-webkit-scrollbar-thumb': {
                  borderRadius: 10,
                  background: '#aaa',
                },
              }}
            >
              <ReactDraftWysiwyg editorState={mainContent} readOnly={true} />
            </Box>
          </Box>
        </StyledViewer>
        {type === 'certi' ? null : <Divider />}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Typography
            variant={type === 'certi' ? 'body2' : 'body1'}
            fontSize={14}
          >
            After the initial agreement, you can access the signed NDA on My
            page.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={type === 'certi' ? checked : signNDA}
              onChange={handleChange}
            />
            <Typography
              variant='body1'
              fontWeight={type === 'certi' ? 500 : 600}
            >
              I agree to the terms and conditions.
            </Typography>
          </Box>
        </Box>
        {type === 'certi' ? (
          <Box sx={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <Button variant='outlined' onClick={onClickClose}>
              Close
            </Button>
            <Button
              variant='contained'
              disabled={!checked}
              onClick={onClickSubmit}
            >
              Submit
            </Button>
          </Box>
        ) : null}
      </Box>

      <Box
        sx={{
          display: 'flex',
          padding: '10px 20px',
          background: '#FFF6E5',
          borderRadius: '10px',
        }}
      >
        <ul style={{ margin: '0 !important', paddingLeft: '20px' }}>
          <li>
            <Typography fontSize={14} fontWeight={600}>
              {language === 'ENG'
                ? 'This NDA is a document that must be signed before taking a test.'
                : '본 NDA는 추후에 테스트를 진행하기 위해 사전에 작성하는 서류이며, '}
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              {language === 'ENG'
                ? 'Completing the NDA does not guarantee that you will be able to take a test or onboard immediately.'
                : 'NDA를 작성해도 바로 테스트 응시나 온보딩이 가능한 것은 아닙니다.'}
            </Typography>
          </li>
        </ul>
      </Box>
    </Box>
  )
}

export default NDASigned
