const ClientEmail = () => {
  return <div>Client Email</div>
}

export default ClientEmail

ClientEmail.acl = {
  action: 'email-read',
  subject: 'CLIENT',
}
