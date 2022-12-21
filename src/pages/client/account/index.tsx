const ClientAccount = () => {
  return <div>Client Account</div>
}

export default ClientAccount

ClientAccount.acl = {
  action: 'account-read',
  subject: 'CLIENT',
}
