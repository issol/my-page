import { Icon } from '@iconify/react'
import { Box, Divider, IconButton, Typography } from '@mui/material'
import { ClientUserType } from '@src/context/types'
import { MMDDYYYYHelper } from '@src/shared/helpers/date.helper'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'

type Props = {
  companyInfo: ClientUserType | null | undefined
}
export default function CompanyInfoDetail({ companyInfo }: Props) {
  return (
    <Box display='flex' flexDirection='column' gap='1rem' mt='20px'>
      {companyInfo?.businessClassification === 'individual' ? null : (
        <>
          <Box display='flex'>
            <Box display='flex' alignItems='center' gap='8px' flex={1}>
              <Icon
                icon='pajamas:building'
                style={{ opacity: '0.7' }}
                fontSize={24}
              />
              <Typography variant='subtitle1' fontWeight={600}>
                Headquarter:
              </Typography>
              <Typography variant='subtitle2' fontSize={16}>
                {companyInfo?.headquarter ?? '-'}
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' gap='8px' flex={1}>
              <Icon
                icon='ci:list-check'
                style={{ opacity: '0.7' }}
                fontSize={24}
              />
              <Typography variant='subtitle1' fontWeight={600}>
                Business registration number:
              </Typography>
              <Typography variant='subtitle2' fontSize={16} fontWeight={400}>
                {companyInfo?.registrationNumber ?? '-'}
              </Typography>
            </Box>
          </Box>
          <Box display='flex'>
            <Box display='flex' alignItems='center' gap='8px' flex={1}>
              <Icon
                icon='mdi:crown-outline'
                style={{ opacity: '0.7' }}
                fontSize={24}
              />
              <Typography variant='subtitle1' fontWeight={600}>
                Name of representative::
              </Typography>
              <Typography variant='subtitle2' fontSize={16}>
                {companyInfo?.representativeName ?? '-'}
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' gap='8px' flex={1}>
              <Icon
                icon='gridicons:calendar'
                style={{ opacity: '0.7' }}
                fontSize={24}
              />
              <Typography variant='subtitle1' fontWeight={600}>
                Business commencement date:
              </Typography>
              <Typography variant='subtitle2' fontSize={16}>
                {companyInfo?.commencementDate
                  ? MMDDYYYYHelper(companyInfo?.commencementDate)
                  : '-'}
              </Typography>
            </Box>
          </Box>
          <Divider />
        </>
      )}

      <Box display='flex'>
        <Box display='flex' alignItems='center' gap='8px' flex={1}>
          <Icon
            icon='mdi:email-outline'
            style={{ opacity: '0.7' }}
            fontSize={24}
          />
          <Typography variant='subtitle1' fontWeight={600}>
            Company email:
          </Typography>
          <Typography variant='subtitle2' fontSize={16}>
            {companyInfo?.email ?? '-'}
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap='8px' flex={1}>
          <Icon icon='mdi:earth' style={{ opacity: '0.7' }} fontSize={24} />
          <Typography variant='subtitle1' fontWeight={600}>
            Time zone:
          </Typography>
          <Typography variant='subtitle2' fontSize={16}>
            {getGmtTime(companyInfo?.timezone?.code)}
          </Typography>
        </Box>
      </Box>
      <Box display='flex'>
        <Box display='flex' alignItems='center' gap='8px' flex={1}>
          <Icon
            icon='material-symbols:smartphone'
            style={{ opacity: '0.7' }}
            fontSize={24}
          />
          <Typography variant='subtitle1' fontWeight={600}>
            Mobile phone:
          </Typography>
          <Typography variant='subtitle2' fontSize={16}>
            {companyInfo?.mobile
              ? `+${companyInfo?.timezone?.phone})  ${companyInfo.mobile}`
              : '-'}
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap='8px' flex={1}>
          <Icon icon='mdi:telephone' style={{ opacity: '0.7' }} fontSize={24} />
          <Typography variant='subtitle1' fontWeight={600}>
            Telephone:
          </Typography>
          <Typography variant='subtitle2' fontSize={16}>
            {companyInfo?.phone
              ? `+${companyInfo?.timezone?.phone}) ${companyInfo?.phone}`
              : '-'}
          </Typography>
        </Box>
      </Box>
      <Box display='flex'>
        <Box display='flex' alignItems='center' gap='8px' flex={1}>
          <Icon
            icon='material-symbols:fax-outline-rounded'
            style={{ opacity: '0.7' }}
            fontSize={24}
          />
          <Typography variant='subtitle1' fontWeight={600}>
            Fax:
          </Typography>
          <Typography variant='subtitle2' fontSize={16}>
            {companyInfo?.fax
              ? `+${companyInfo?.timezone?.phone}) ${companyInfo?.fax}`
              : '-'}
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap='8px' flex={1}>
          <Icon icon='ic:sharp-link' style={{ opacity: '0.7' }} fontSize={24} />
          <Typography variant='subtitle1' fontWeight={600}>
            Website:&nbsp;
            <Typography
              variant='body2'
              component={'span'}
              sx={{ alignItems: 'center' }}
            >
              {!!companyInfo?.websiteLink ? (
                <IconButton
                  edge='end'
                  disabled={!companyInfo.websiteLink}
                  sx={{ padding: 0 }}
                  onClick={() =>
                    window.open(`${companyInfo.websiteLink}`, '_blank')
                  }
                >
                  <Icon
                    icon='material-symbols:open-in-new'
                    opacity={0.7}
                    fontSize={18}
                  />
                </IconButton>
              ) : (
                '-'
              )}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
