// ** React Imports
import { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Component Import
import Error403 from 'src/pages/403'

const Error = () => <Error403 />

Error.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error
