import Script from 'next/script'

const GAscript = () => {
  const GAID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
  const GTMID = process.env.NEXT_PUBLIC_GTM_TRACKING_ID

  return (
    <>
      {GTMID !== null && GTMID && (
        <>
          <Script
            id='GTM'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTMID}');`,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTMID}`}
              height='0'
              width='0'
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        </>
      )}

      {/* <Script
        async
        id="GA"
        strategy="beforeInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-KLKWVXWJR7"
      /> */}

      <Script
        id='GA_pro'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', "${GAID}");`,
        }}
      />
    </>
  )
}

export default GAscript
