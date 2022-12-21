const LpmOrderCreate = () => {
  return <div>LPM Order Create</div>
}

export default LpmOrderCreate

LpmOrderCreate.acl = {
  action: 'orderCreate-read',
  subject: 'LPM',
}
