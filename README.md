# Materialize NextJS Template

## Start

- start application
  - `npm run dev`
  - `yarn run dev`
- start storybook
  - `npm run storybook`
  - `yarn storybook`

---

## Build

- `npm run build`
- `yarn build`

## Directories

- `.storybook`
  - storybook config파일이 위치
- `src/@core`\*\*
  - 어플리케이션을 구성하는 코어 components와 style이 정의되어 있음. **view와 관련된 설정** 및 hooks들이 위치
- `src/@fake-db`
  - test용 데이터 파일
- `src/apis`
  - api들이 위치
- `src/configs`
  - 권한 관리 / axios설정 / i18n 등 **어플리케이션에서 전역으로 사용**하는 config및 config가 적용된 instance를 return하는 컴포넌트들이 위치
- `src/views`
  - 복사해서 가져다 쓸 수 있게끔 완성된 view컴포넌트들이 위치. ex) calendar
- `src/shared/auth/storage.ts`
  - 브라우저 storage를 crud하는 함수들을 모아둔 곳. (ex: userData, accessToken..)

---

## docs

- [Materialize Guide](https://pixinvent.com/demo/materialize-mui-react-nextjs-admin-template/documentation/guide/)
- [Access Control](https://pixinvent.com/demo/materialize-mui-react-nextjs-admin-template/documentation/guide/development/access-control.html)
