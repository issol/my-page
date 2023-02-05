import { useRouter } from 'next/router'

import styled from 'styled-components'

export default function ErrorFallback() {
  const router = useRouter()

  return (
    <Container>
      <h1 className='title'>Something went wrong.</h1>
      <p className='desc'>Please try again.</p>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 24px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 44px;
  .title {
    text-align: center;
    font-size: 3.75rem;
    font-weight: bold;
  }
  button {
    transition: all 100ms ease-in;
    padding: 14px;
    border: 1px solid black;
    border-radius: 45px;
    font-size: 0.875rem;
    font-weight: bold;
    &:hover {
      background: black;
      color: #fff;
    }
  }
`
