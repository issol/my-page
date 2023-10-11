import { NextPage } from 'next'

interface Props {
  statusCode?: number
  err: any
}

const Error: NextPage<Props> = ({ statusCode, err }) => {
  console.log(err) // {"name":"Internal Server Error.","message":"500 - Internal Server Error.","statusCode":500}
  return (
    <>
      <h1>{err.message}</h1>
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    </>
  )
}

Error.getInitialProps = ({ res, err }: any) => {
  console.log(err?.message) // 500 - Internal Server Error. (client-side); Test error (server-side)
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode, err }
}

export default Error
