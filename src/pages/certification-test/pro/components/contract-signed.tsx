import { Icon } from '@iconify/react'
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
import { ClientUserType, UserDataType } from '@src/context/types'
import useModal from '@src/hooks/useModal'
import dayjs from 'dayjs'

import { EditorState, convertFromRaw } from 'draft-js'
import { set } from 'lodash'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
  MouseEvent,
} from 'react'
import { Loadable } from 'recoil'

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
  const [value, setValue] = useState<MenuType>('freelancer')
  const [privacyContent, setPrivacyContent] = useState(
    EditorState.createEmpty(),
  )
  const [freelancerContent, setFreelancerContent] = useState(
    EditorState.createEmpty(),
  )
  const [privacyChecked, setPrivacyChecked] = useState<boolean>(false)
  const [freelancerChecked, setFreelancerChecked] = useState<boolean>(false)

  const handlePrivacyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrivacyChecked(event.target.checked)
  }

  const handleFreelancerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFreelancerChecked(event.target.checked)
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
    if (privacyContract?.content) {
      const copyContent = { ...privacyContract.content }
      const now = dayjs(new Date()).format('MM/DD/YYYY')
      for (let i = 0; i < copyContent?.blocks?.length; i++) {
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
              privacyContractLanguage === 'ENG'
                ? copyContent?.blocks[i]?.text!.indexOf('Signature date: ')
                : copyContent?.blocks[i]?.text!.indexOf('서명 일자: '),
          },
        ]

        copyContent.blocks[i].entityRanges = []
      }

      const content = convertFromRaw(copyContent as any)

      const editorState = EditorState.createWithContent(content)
      setPrivacyContent(editorState)
    }
  }, [privacyContract, privacyContractLanguage])

  useEffect(() => {
    if (freelancerContract?.content) {
      const copyContent = { ...freelancerContract.content }
      const now = dayjs(new Date()).format('MM/DD/YYYY')
      for (let i = 0; i < copyContent?.blocks?.length; i++) {
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
            length:
              freelancerContractLanguage === 'ENG'
                ? now.length + 16
                : now.length + 8,
            offset:
              freelancerContractLanguage === 'ENG'
                ? copyContent?.blocks[i]?.text!.indexOf('Signature date: ')
                : copyContent?.blocks[i]?.text!.indexOf('서명 일자: '),
          },
        ]

        copyContent.blocks[i].entityRanges = []
      }

      const content = convertFromRaw(copyContent as any)

      const editorState = EditorState.createWithContent(content)
      setFreelancerContent(editorState)
    }
  }, [freelancerContract, freelancerContractLanguage])

  const onClickClose = () => {
    openModal({
      type: 'CancelSignContractModal',
      children: (
        <CustomModal
          onClose={() => {
            setSignContract(false)
            setPrivacyChecked(false)
            setFreelancerChecked(false)
            closeModal('CancelSignContractModal')
          }}
          onClick={() => {
            closeModal('CancelSignContractModal')
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
    //TODO API 연결 (성공 후 유저 데이터 쿼리 초기화 isSignedContract 재조회 필요)
    setSignContract(false)
    setPrivacyChecked(false)

    // closeModal('CancelSignNDAModal')
  }

  const handleMenuChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

  return (
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
        <TabContext value={value}>
          <TabList
            onChange={handleMenuChange}
            aria-label='Contract tab menu'

            // style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTab
              value='freelancer'
              label='Freelancer contract'
              // iconPosition='start'
              // icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTab
              value='privacy'
              label='Privacy contract'
              // iconPosition='start'
              // icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel value='freelancer'>
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
                    <Typography variant='h6'>
                      {freelancerContract.title}
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
                  <Box>
                    <ReactDraftWysiwyg
                      editorState={freelancerContent}
                      readOnly={true}
                    />
                  </Box>
                </Box>
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
              <Box
                sx={{ display: 'flex', gap: '24px', justifyContent: 'center' }}
              >
                <Button variant='outlined' onClick={onClickClose}>
                  Close
                </Button>
                <Button
                  variant='contained'
                  disabled={!freelancerChecked}
                  onClick={onClickSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value='privacy'>
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
                    <Typography variant='h6'>
                      {privacyContract.title}
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
                          privacyContractLanguage === 'KOR' ? 400 : 600
                        }
                        color={
                          privacyContractLanguage === 'KOR'
                            ? '#BDBDBD'
                            : '#666CFF'
                        }
                      >
                        English
                      </Typography>
                      <Switch
                        checked={privacyContractLanguage === 'KOR'}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          setPrivacyContractLanguage(
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
                          privacyContractLanguage === 'KOR' ? 600 : 400
                        }
                        color={
                          privacyContractLanguage === 'KOR'
                            ? '#666CFF'
                            : '#BDBDBD'
                        }
                      >
                        Korean
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <ReactDraftWysiwyg
                      editorState={privacyContent}
                      readOnly={true}
                    />
                  </Box>
                </Box>
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
                  After the initial agreement, you can access the signed
                  contract on My page.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={privacyChecked}
                    onChange={handlePrivacyChange}
                  />
                  <Typography variant='body1'>
                    I agree to the terms and conditions.
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{ display: 'flex', gap: '24px', justifyContent: 'center' }}
              >
                <Button variant='outlined' onClick={onClickClose}>
                  Close
                </Button>
                <Button
                  variant='contained'
                  disabled={!privacyChecked}
                  onClick={onClickSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </TabPanel>
        </TabContext>
      </Card>
    </Box>
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
