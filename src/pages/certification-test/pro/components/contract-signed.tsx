import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Switch,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { StyledViewer } from '@src/@core/components/editor/customEditor'
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'
import { currentVersionType } from '@src/apis/contract.api'
import { signContract } from '@src/apis/pro/pro-certification-tests'
import { getUserInfo } from '@src/apis/user.api'
import { ClientUserType, UserDataType } from '@src/context/types'
import useModal from '@src/hooks/useModal'
import { saveUserDataToBrowser } from '@src/shared/auth/storage'
import { authState } from '@src/states/auth'
import { currentRoleSelector } from '@src/states/permission'
import { FileType } from '@src/types/common/file.type'
import dayjs from 'dayjs'

import { EditorState, convertFromRaw } from 'draft-js'
import { set } from 'lodash'
import { useRouter } from 'next/router'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
  MouseEvent,
} from 'react'
import { useMutation } from 'react-query'
import { Loadable, useSetRecoilState } from 'recoil'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { getContractFilePath } from '@src/shared/transformer/filePath.transformer'
import { getUploadUrlforCommon, uploadFileToS3 } from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import toast from 'react-hot-toast'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'

type Props = {
  privacyContract: currentVersionType
  freelancerContract: currentVersionType
  privacyContractLanguage: 'ENG' | 'KOR'
  setPrivacyContractLanguage: Dispatch<SetStateAction<'ENG' | 'KOR'>>
  freelancerContractLanguage: 'ENG' | 'KOR'
  setFreelancerContractLanguage: Dispatch<SetStateAction<'ENG' | 'KOR'>>

  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>
  setSignContract: Dispatch<SetStateAction<boolean>>
}

type MenuType = 'privacy' | 'freelancer'

const ContractSigned = ({
  privacyContract,
  freelancerContract,
  privacyContractLanguage,
  setPrivacyContractLanguage,
  freelancerContractLanguage,
  setFreelancerContractLanguage,
  auth,
  setSignContract,
}: Props) => {
  const { openModal, closeModal } = useModal()
  // const [value, setValue] = useState<MenuType>('freelancer')
  // const [privacyContent, setPrivacyContent] = useState(
  //   EditorState.createEmpty(),
  // )
  const [freelancerContent, setFreelancerContent] = useState(
    EditorState.createEmpty(),
  )
  // const [privacyChecked, setPrivacyChecked] = useState<boolean>(false)
  const [freelancerChecked, setFreelancerChecked] = useState<boolean>(false)

  // const [privacyFile, setPrivacyFile] = useState<HTMLElement | null>(null)

  const setCurrentRole = useSetRecoilState(currentRoleSelector)
  const setAuth = useSetRecoilState(authState)
  const [loading, setLoading] = useState(false)
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
        setLoading(false)
        setSignContract(false)
        // setPrivacyChecked(false)
        setFreelancerChecked(false)
      },
    },
  )

  const handleFreelancerChange = (event: ChangeEvent<HTMLInputElement>) => {
    // setFreelancerFile(document.getElementById('freelancerDownloadItem'))
    // setValue('privacy')

    setFreelancerChecked(event.target.checked)
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
    if (freelancerContract?.content && auth.getValue()) {
      const now = dayjs(new Date()).format('MM/DD/YYYY')
      const name = auth.getValue().user?.username ?? ''
      const addresses = auth.getValue().user?.addresses![0]
      const birthday = auth.getValue().user?.birthday ?? ''
      const additionalResult = {
        ...freelancerContract,
        content: {
          ...freelancerContract.content,
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
            ...freelancerContract.content.blocks,
          ],
        },
      }
      const copyContent = { ...additionalResult.content }
      for (let i = 3; i < copyContent?.blocks?.length; i++) {
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

        let signatureDateIndex = getAllIndexes(
          copyContent?.blocks[i]?.text!,
          privacyContractLanguage === 'ENG'
            ? 'Signature date: '
            : '서명 일자: ',
        )

        let nameStyle = nameIndex.map(value => ({
          style: 'color-#666CFF',
          length: auth.getValue().user?.username?.length,
          offset: value,
        }))

        let nameBoldStyle = nameIndex.map(value => ({
          style: 'BOLD',
          length: auth.getValue().user?.username?.length,
          offset: value,
        }))

        let addressStyle = addressIndex.map(value => ({
          style: 'color-#666CFF',
          length: getAddress(auth.getValue().user?.addresses![0]).length,
          offset: value,
        }))

        let addressBoldStyle = addressIndex.map(value => ({
          style: 'BOLD',
          length: getAddress(auth.getValue().user?.addresses![0]).length,
          offset: value,
        }))

        let dateOfBirthStyle = dateOfBirthIndex.map(value => ({
          style: 'color-#666CFF',
          length: auth.getValue().user?.birthday?.length! + 1,
          offset: value,
        }))

        let dateOfBirthBoldStyle = dateOfBirthIndex.map(value => ({
          style: 'BOLD',
          length: auth.getValue().user?.birthday?.length! + 1,
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
      setFreelancerContent(editorState)
    }
  }, [freelancerContract, freelancerContractLanguage, auth])

  const onClickClose = () => {
    openModal({
      type: 'CancelSignContractModal',
      children: (
        <CustomModal
          onClose={() => {
            setSignContract(false)

            setFreelancerChecked(false)
            closeModal('CancelSignContractModal')
          }}
          onClick={() => {
            closeModal('CancelSignContractModal')
          }}
          title='Before proceeding with the testing process, agreeing to the contracts is required.'
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
    const root = document.getElementById('__next')
    let fileInfo: FileType[] = []

    if (input && root) {
      setLoading(true)

      const draftEditor = input.querySelector(
        '.public-DraftEditor-content',
      ) as HTMLElement
      const cloneCopy = draftEditor.cloneNode(true) as HTMLElement
      const printFrame = document.createElement('div')
      printFrame.id = 'draftEditor'
      const frameHeight = draftEditor.scrollHeight
      const frameWidth = draftEditor.offsetWidth
      printFrame.style.position = 'absolute'
      printFrame.style.left = '-9999px'
      printFrame.style.display = 'block'
      printFrame.style.width = '19.5cm'
      printFrame.style.padding = '0 10px'

      // printFrame.setAttribute('style', 'position:absolute; left:-99999999px')
      printFrame.append(cloneCopy)
      root.appendChild(printFrame)

      html2canvas(printFrame).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm')
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const pageHeight = 297
        let heightLeft = imgHeight
        let position = 0
        heightLeft -= pageHeight
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        let downloadFile = pdf.output('blob')
        // pdf.save(`[${freelancerContractLanguage}] Freelancer contract`)
        // root.removeChild(printFrame)
        let data = new FormData()

        if (downloadFile) {
          data.append(
            'freelancer',
            downloadFile,
            `[${freelancerContractLanguage}] Freelancer contract.pdf`,
          )
        }

        const path: string = getContractFilePath(
          auth.getValue().user?.id!,
          `[${freelancerContractLanguage}] Freelancer contract.pdf`,
        )

        const promise = [
          getUploadUrlforCommon(S3FileType.PRO_CONTRACT, path).then(res => {
            fileInfo.push({
              name: `[${freelancerContractLanguage}] Freelancer contract.pdf`,
              size: downloadFile.size,
              file: path,
              type: 'pdf',
              // type: 'imported',
            })
            return uploadFileToS3(res, data)
          }),
        ]
        Promise.all(promise)
          .then(res => {
            // updateProject.mutate({ deliveries: fileInfo })
            signContractMutation.mutate({
              type: 'contract',
              file: fileInfo.map(file => file.name),
            })
          })
          .catch(err => {
            toast.error(
              'Something went wrong while uploading files. Please try again.',
              {
                position: 'bottom-left',
              },
            )
            setLoading(false)
          })
      })

      // const freelancerPromise = html2canvas(clonedFreelancerFile).then(
      //   canvas => {
      //     const imgData = canvas.toDataURL('image/png')
      //     const pdf = new jsPDF('p', 'mm')
      //     const imgWidth = 210
      //     const imgHeight = (canvas.height * imgWidth) / canvas.width
      //     const pageHeight = 295
      //     let heightLeft = imgHeight
      //     let position = 0
      //     heightLeft -= pageHeight
      //     pdf.addImage(imgData, 'JPEG', 0, 10, imgWidth, imgHeight)
      //     while (heightLeft >= 0) {
      //       position = heightLeft - imgHeight
      //       pdf.addPage()
      //       pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      //       heightLeft -= pageHeight
      //     }

      //     let downloadFile = pdf.output('blob')
      //     pdf.save(`[${freelancerContractLanguage}] Freelancer contract.pdf`)

      //     if (downloadFile) {
      //       data.append(
      //         'freelancer',
      //         downloadFile,
      //         `[${freelancerContractLanguage}] Freelancer contract.pdf`,
      //       )
      //     }
      //   },
      // )
      // const privacyPromise = html2canvas(clonedPrivacyFile).then(canvas => {
      //   const imgData = canvas.toDataURL('image/png')
      //   const pdf = new jsPDF('p', 'mm')
      //   const imgWidth = 210
      //   const imgHeight = (canvas.height * imgWidth) / canvas.width
      //   const pageHeight = 295
      //   let heightLeft = imgHeight
      //   let position = 0
      //   heightLeft -= pageHeight
      //   pdf.addImage(imgData, 'JPEG', 0, 10, imgWidth, imgHeight)
      //   while (heightLeft >= 0) {
      //     position = heightLeft - imgHeight
      //     pdf.addPage()
      //     pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      //     heightLeft -= pageHeight
      //   }

      //   let downloadFile = pdf.output('blob')

      //   if (downloadFile) {
      //     data.append(
      //       'privacy',
      //       downloadFile,
      //       `[${privacyContractLanguage}] Privacy contract.pdf`,
      //     )
      //   }
      // })

      // Promise.all([freelancerPromise]).then(() => {
      //   for (let [key, value] of data.entries()) {
      //     const val = value as File
      //     paths.push({
      //       name: val.name,
      //       path: getContractFilePath(
      //         auth.getValue().user?.id!,
      //         val.name as string,
      //       ),
      //       size: val.size,
      //     })
      //   }

      //   const promiseArr = paths.map((url, idx) => {
      //     return getUploadUrlforCommon(S3FileType.PRO_CONTRACT, url.path).then(
      //       res => {
      //         fileInfo.push({
      //           name: url.name,
      //           size: url.size,
      //           file: url.path,
      //         })
      //         return uploadFileToS3(res.url, data)
      //       },
      //     )
      //   })
      //   Promise.all(promiseArr)
      //     .then(res => {
      //       console.log(res)
      //       console.log(fileInfo)

      //       signContractMutation.mutate({
      //         type: 'contract',
      //         file: fileInfo.map(file => file.name),
      //       })
      //     })
      //     .catch(err =>
      //       toast.error(
      //         'Something went wrong while uploading files. Please try again.',
      //         {
      //           position: 'bottom-left',
      //         },
      //       ),
      //     )
      // })
    }
  }

  return (
    <>
      {loading ? <OverlaySpinner /> : null}
      <Box
        sx={{
          width: '900px',
          margin: '0 auto',

          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Card
          sx={{
            padding: '50px 60px',
            '& .MuiTabPanel-root': {
              padding: 0,
            },
          }}
        >
          <Box
            sx={{
              // margin: '0 auto',

              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <StyledViewer>
              <Box
                sx={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid rgba(76, 78, 100, 0.22)',
                  borderRadius: '10px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <Typography variant='h6'>
                    [{freelancerContractLanguage} Freelancer contract]
                  </Typography>
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
                      fontWeight={
                        freelancerContractLanguage === 'KOR' ? 400 : 600
                      }
                      color={
                        freelancerContractLanguage === 'KOR'
                          ? '#BDBDBD'
                          : '#666CFF'
                      }
                    >
                      English
                    </Typography>
                    <Switch
                      checked={freelancerContractLanguage === 'KOR'}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setFreelancerContractLanguage(
                          event.target.checked ? 'KOR' : 'ENG',
                        )
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
                      fontWeight={
                        freelancerContractLanguage === 'KOR' ? 600 : 400
                      }
                      color={
                        freelancerContractLanguage === 'KOR'
                          ? '#666CFF'
                          : '#BDBDBD'
                      }
                    >
                      Korean
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Box
                  id='downloadItem'
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
                  <ReactDraftWysiwyg
                    editorState={freelancerContent}
                    readOnly={true}
                  />
                </Box>
                <Divider sx={{ my: '20px !important' }} />
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
                    After the initial agreement, you can access the signed
                    contract on My page.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={freelancerChecked}
                      onChange={handleFreelancerChange}
                    />
                    <Typography variant='body1'>
                      I agree to the terms and conditions.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </StyledViewer>

            <Box
              sx={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'center',
                marginTop: '24px',
              }}
            >
              <Button variant='outlined' onClick={onClickClose}>
                Close
              </Button>
              <Button
                variant='contained'
                disabled={!freelancerChecked || loading}
                onClick={onClickSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  )
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  minHeight: '38px !important',
  marginBottom: '30px',
  '& .MuiTabs-indicator': {
    display: 'none',
  },

  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  '& .MuiTab-root': {
    height: '38px',
    minHeight: '38px !important',
    minWidth: 110,
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))

export default ContractSigned
