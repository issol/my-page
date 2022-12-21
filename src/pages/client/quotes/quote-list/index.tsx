const ClientQuoteList = () => {
  return <div>Client Quote List</div>
}

export default ClientQuoteList

ClientQuoteList.acl = {
  action: 'quoteCreate-read',
  subject: 'CLIENT',
}
