const LpmQuoteCreate = () => {
  return <div>LPM Quote Create</div>
}

export default LpmQuoteCreate

LpmQuoteCreate.acl = {
  action: 'quoteCreate-read',
  subject: 'LPM',
}
