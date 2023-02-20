// / :  - (하이픈) 으로 변경
// 공백 : _ (언더바) 으로 변경
//<버킷>/guideline/<clinet>/<category>/<serviceType>/V<version>/<fileName>

export function getFilePath(name: string[]) {
  const result = name
    .map(item => item.replaceAll('/', '-').replaceAll(' ', '_'))
    .join('/')
  return result
}
