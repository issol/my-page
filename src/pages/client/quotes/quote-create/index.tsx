const ClientCreateQuote = () => {
  return <div>Client Create Quote</div>
}

export default ClientCreateQuote

ClientCreateQuote.acl = {
  action: 'quoteCreate-read',
  subject: 'CLIENT',
}
