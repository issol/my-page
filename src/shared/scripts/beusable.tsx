import Script from 'next/script'

const BeusableScript = () => {
  return (
    <Script id='beusable_pro' strategy='afterInteractive'>
      {`(function(w, d, a){
    w.__beusablerumclient__ = {
        load : function(src){
            var b = d.createElement("script");
            b.src = src; b.async=true; b.type = "text/javascript";
            d.getElementsByTagName("head")[0].appendChild(b);
        }
    };w.__beusablerumclient__.load(a + "?url=" + encodeURIComponent(d.URL));
})(window, document, "//rum.beusable.net/load/b220902e104204u658");`}
      {`console.log('Inline script executed!')`}
    </Script>
  )
}

export default BeusableScript
