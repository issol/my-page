'use client'
import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

const Info = () => {
  return (
    <Box
      sx={{
        width: '350px',
        padding: '50px 40px',
        background: '#FFF',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Avatar
          alt='Kim, Min Kyu'
          src='/profile.webp'
          sx={{ width: 150, height: 150 }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          justifyContent: 'center',
          alignItems: 'center',
          mt: '31px',
        }}
      >
        <Typography fontWeight={500} fontSize={18} color='#2B2B2B'>
          김민규
        </Typography>
        <Typography fontWeight={400} fontSize={15} color='#767676'>
          Front-end Developer
        </Typography>
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard
                  .writeText('isolatorv@gmail.com')
                  .then(() => {
                    toast.success('이메일이 복사되었습니다.')
                  })
              }
            }}
          >
            <Image src='/gmail.png' alt='tistory' width={24} height={24} />
          </IconButton>

          <Link href='https://issol96.tistory.com/' target='_blank'>
            <Image src='/tistory.svg' alt='tistory' width={24} height={24} />
          </Link>
          <Link
            href='https://www.linkedin.com/in/%EB%AF%BC%EA%B7%9C-%EA%B9%80-20b858205/'
            target='_blank'
          >
            <Image src='/linkedin.svg' alt='linkedin' width={24} height={24} />
          </Link>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box></Box>
    </Box>
  )
}

export default Info
