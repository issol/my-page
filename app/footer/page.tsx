const Footer = () => {
  return (
    <footer id='footer' className='section bg-dark text-white'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6 text-center text-lg-start wow fadeInUp'>
            <p className='mb-2 mb-lg-0'>
              Copyright © 2024{' '}
              <a className='fw-600' href='/'>
                Issol
              </a>
              . All Rights Reserved.
            </p>
          </div>
          <div className='col-lg-6 wow fadeInUp'>
            <p className='mb-0 text-center text-lg-end'>
              Nextjs, Bootstrap 으로 이루어진 페이지입니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
