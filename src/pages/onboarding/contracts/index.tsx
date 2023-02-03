import { Button, Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'

import styled from 'styled-components'
import Icon from 'src/@core/components/icon'
import { Fragment, Suspense, useContext, useEffect, useState } from 'react'
import { ModalContext } from 'src/context/ModalContext'
import { StyledNextLink } from 'src/@core/components/customLink'
import { useRouter } from 'next/router'
import { ContractParam, getContractDetail } from 'src/apis/contract.api'
import { useGetContract } from 'src/queries/contract/contract.query'
import FallbackSpinner from 'src/@core/components/spinner'
import { toast } from 'react-hot-toast'

//** TODO : 사용자가 각 서류를 제출 했는지 안 했는지 여부 어떻게 저장할지 논의 */
export default function ContractForm() {
  const { setModal } = useContext(ModalContext)
  const router = useRouter()

  function onButtonClick({ type, language }: ContractParam) {
    getContractDetail({ type, language })
      .then(res => {
        console.log(res)
        if (res) {
          router.push({
            pathname: '/onboarding/contracts/detail',
            query: { type, language },
          })
        } else {
          router.push({
            pathname: '/onboarding/contracts/form',
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
    setModal(
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
              onClick={() => setModal(null)}
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
                Pros sign the Privacy contract and Freelancer contract after the
                onboarding.
              </li>
            </Ul>
          </Typography>
        </ModalBody>
      </ModalContainer>,
    )
  }

  return (
    <Fragment>
      <Suspense fallback={<FallbackSpinner />}>
        <Grid xs={12} container>
          <Card sx={{ width: '100%', margin: '0 70px', padding: '22px' }}>
            <Box sx={{ textAlign: 'right' }}>
              <Icon
                icon='mdi:information-outline'
                style={{ opacity: '0.7' }}
                cursor='pointer'
                onClick={onInfoClick}
              />
            </Box>
            <Box sx={{ padding: '58px' }}>
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
                {/* NDA */}
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
                    {/* TODO : 등록된 문서가 있을 경우 & 없을 경우 routing 다르게 해주기 */}
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({ type: 'nda', language: 'ko' })
                      }
                    >
                      KOR
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({ type: 'nda', language: 'en' })
                      }
                    >
                      ENG
                    </Button>
                  </Box>
                </StyledBox>
                {/* Privacy */}
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
                        onButtonClick({ type: 'privacy', language: 'ko' })
                      }
                    >
                      KOR
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({ type: 'privacy', language: 'en' })
                      }
                    >
                      ENG
                    </Button>
                  </Box>
                </StyledBox>
                {/* Freelancer */}
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
                        onButtonClick({ type: 'freelancer', language: 'ko' })
                      }
                    >
                      KOR
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        onButtonClick({ type: 'freelancer', language: 'en' })
                      }
                    >
                      ENG
                    </Button>
                  </Box>
                </StyledBox>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Suspense>
    </Fragment>
  )
}

ContractForm.acl = {
  action: 'update',
  subject: 'onboarding',
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

const Ul = styled.ul`
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
