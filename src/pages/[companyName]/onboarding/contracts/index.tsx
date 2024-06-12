import { Button, Card, Grid, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { styled } from '@mui/system'
import Icon from 'src/@core/components/icon'
import FallbackSpinner from 'src/@core/components/spinner'
import { toast } from 'react-hot-toast'

import { Fragment, Suspense, useContext } from 'react'

import { useRouter } from 'next/router'

import {
  ContractLangEnum,
  ContractParam,
  ContractTypeEnum,
  getContractDetail,
} from 'src/apis/contract.api'
import useModal from '@src/hooks/useModal'
import Image from 'next/image'

export default function ContractForm() {
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  function onButtonClick({ type, language }: ContractParam) {
    getContractDetail({ type, language })
      .then(res => {
        if (res) {
          router.push({
            pathname: '/onboarding/contracts/detail',
            query: { type, language },
          })
        } else {
          router.push({
            pathname: '/onboarding/contracts/form/post',
            query: { type, language },
          })
        }
      })
      .catch(err => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      })
  }

  function onInfoClick() {
    openModal({
      type: 'InfoModal',
      children: (
        <ModalContainer>
          <ModalBody>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src='/images/icons/project-icons/status-alert-info.png'
                width={60}
                height={60}
                alt='role select error'
              />
              <Icon
                icon='mdi:close'
                style={{
                  opacity: '0.7',
                  position: 'absolute',
                  top: '24px',
                  right: '20px',
                }}
                cursor='pointer'
                onClick={() => closeModal('InfoModal')}
              />
            </Box>

            <Typography variant='h6'>Contracts information</Typography>
            <Typography variant='body2'>
              <Ul>
                <li>
                  Pros sign the NDA only once before taking their first
                  Certification test.
                </li>
                <li>
                  Pros sign the Privacy contract and Freelancer contract after
                  the onboarding.
                </li>
              </Ul>
            </Typography>
          </ModalBody>
        </ModalContainer>
      ),
    })
  }

  return (
    <Fragment>
      <Suspense fallback={<FallbackSpinner />}>
        <Card sx={{ width: '100%', padding: '80px', position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', top: 20, right: 20, padding: 0 }}
          >
            <Icon
              icon='mdi:question-mark-circle-outline'
              cursor='pointer'
              onClick={onInfoClick}
            />
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography fontSize={24} fontWeight={500}>
                Contract forms
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    border: '1px solid rgba(76, 78, 100, 0.12)',
                    padding: '20px',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    onButtonClick({
                      type: ContractTypeEnum.NDA,
                      language: ContractLangEnum.ENGLISH,
                    })
                  }
                >
                  <Image
                    src='/images/icons/onboarding-icons/nda.svg'
                    alt=''
                    width={58}
                    height={58}
                  />
                  <Typography fontSize={20} fontWeight={500}>
                    [ENG] NDA
                  </Typography>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    Pros will sign the NDA before taking the certification test.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                {' '}
                <Box
                  sx={{
                    border: '1px solid rgba(76, 78, 100, 0.12)',
                    padding: '20px',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    onButtonClick({
                      type: ContractTypeEnum.FREELANCER,
                      language: ContractLangEnum.ENGLISH,
                    })
                  }
                >
                  <Image
                    src='/images/icons/onboarding-icons/contract.svg'
                    alt=''
                    width={58}
                    height={58}
                  />
                  <Typography fontSize={20} fontWeight={500}>
                    [ENG] Freelancer contract
                  </Typography>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    Pros will sign the Freelancer contract after being
                    onboarded.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                {' '}
                <Box
                  sx={{
                    border: '1px solid rgba(76, 78, 100, 0.12)',
                    padding: '20px',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    onButtonClick({
                      type: ContractTypeEnum.NDA,
                      language: ContractLangEnum.KOREAN,
                    })
                  }
                >
                  <Image
                    src='/images/icons/onboarding-icons/nda.svg'
                    alt=''
                    width={58}
                    height={58}
                  />
                  <Typography fontSize={20} fontWeight={500}>
                    [KOR] NDA
                  </Typography>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    Pros will sign the NDA before taking the certification test.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                {' '}
                <Box
                  sx={{
                    border: '1px solid rgba(76, 78, 100, 0.12)',
                    padding: '20px',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    onButtonClick({
                      type: ContractTypeEnum.FREELANCER,
                      language: ContractLangEnum.KOREAN,
                    })
                  }
                >
                  <Image
                    src='/images/icons/onboarding-icons/contract.svg'
                    alt=''
                    width={58}
                    height={58}
                  />
                  <Typography fontSize={20} fontWeight={500}>
                    [KOR] Freelancer contract
                  </Typography>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    Pros will sign the Freelancer contract after being
                    onboarded.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* <Box sx={{ padding: '58px' }}>
              <Typography variant='h5' sx={{ textAlign: 'center' }}>
                Contract forms
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '24px',
                }}
                mt='24px'
              >
                <StyledBox>
                  <img
                    width={58}
                    height={58}
                    src='/images/icons/etc/icon-keyboad.png'
                    alt='NDA'
                  />
                  <Typography
                    variant='h5'
                    sx={{ textAlign: 'center', margin: '12px 0' }}
                  >
                    NDA
                  </Typography>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Pros will sign the NDA before taking the certification test.
                  </Typography>
                  <Box display='flex' gap='8px' mt='12px'>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({
                          type: ContractTypeEnum.NDA,
                          language: ContractLangEnum.KOREAN,
                        })
                      }
                    >
                      KOR
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({
                          type: ContractTypeEnum.NDA,
                          language: ContractLangEnum.ENGLISH,
                        })
                      }
                    >
                      ENG
                    </Button>
                  </Box>
                </StyledBox>

                <StyledBox>
                  <img
                    width={58}
                    height={58}
                    src='/images/icons/etc/icon-suitcase.png'
                    alt='NDA'
                  />
                  <Typography
                    variant='h5'
                    sx={{ textAlign: 'center', margin: '12px 0' }}
                  >
                    Privacy contract
                  </Typography>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Pros will sign the Privacy contract after being onboarded.
                  </Typography>
                  <Box display='flex' gap='8px' mt='12px'>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({
                          type: ContractTypeEnum.PRIVACY,
                          language: ContractLangEnum.KOREAN,
                        })
                      }
                    >
                      KOR
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({
                          type: ContractTypeEnum.PRIVACY,
                          language: ContractLangEnum.ENGLISH,
                        })
                      }
                    >
                      ENG
                    </Button>
                  </Box>
                </StyledBox>

                <StyledBox>
                  <img
                    width={58}
                    height={58}
                    src='/images/icons/etc/icon-user.png'
                    alt='NDA'
                  />
                  <Typography
                    variant='h5'
                    sx={{ textAlign: 'center', margin: '12px 0' }}
                  >
                    Freelancer contract
                  </Typography>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Pros will sign the Freelancer contract after being
                    onboarded.
                  </Typography>
                  <Box display='flex' gap='8px' mt='12px'>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({
                          type: ContractTypeEnum.FREELANCER,
                          language: ContractLangEnum.KOREAN,
                        })
                      }
                    >
                      KOR
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({
                          type: ContractTypeEnum.FREELANCER,
                          language: ContractLangEnum.ENGLISH,
                        })
                      }
                    >
                      ENG
                    </Button>
                  </Box>
                </StyledBox>
              </Box>
            </Box> */}
        </Card>
      </Suspense>
    </Fragment>
  )
}

ContractForm.acl = {
  action: 'update',
  subject: 'contract',
}

const StyledBox = styled(Box)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(76, 78, 100, 0.12);
  border-radius: 10px;
`

const Ul = styled('ul')`
  padding-left: 24px;
  text-align: left;
`

const ModalContainer = styled(Box)`
  max-width: 350px;
  position: relative;
  padding: 24px;
  text-align: center;
  background: #ffffff;
  border-radius: 14px;
`
const ModalBody = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`
