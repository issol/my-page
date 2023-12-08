// / :  - (하이픈) 으로 변경
// 공백 : _ (언더바) 으로 변경
//<버킷>/guideline/<clinet>/<category>/<serviceType>/V<version>/<fileName>

export function getFilePath(name: string[], fileName: string) {
  const result = name
    .map(item => item !== '' && item.replaceAll('/', '-').replaceAll(' ', '_'))
    .filter(value => value)
    .join('/')
  return result + '/' + fileName
}

export function getContractFilePath(userId: number, fileName: string) {
  return 'user/' + userId + '/contracts/' + fileName
}

export function getResumeFilePath(userId: number, fileName: string) {
  return 'user/' + userId + '/resume/' + fileName
}

export function getNotesToClientFilePath(clientId: number, fileName: string) {
  return 'client/' + clientId + '/notes/' + fileName
}
