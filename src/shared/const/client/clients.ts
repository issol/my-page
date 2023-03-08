import { Client } from './client.enum'
export const ClientList = [
  { label: Client.Naver, value: Client.Naver },
  { label: Client.Tapytoon, value: Client.Tapytoon },
  { label: Client.Netflix, value: Client.Netflix },
  { label: Client.Disney, value: Client.Disney },
  { label: Client.Sandbox, value: Client.Sandbox },
  { label: Client.RIDI, value: Client.RIDI },
].sort((a, b) => a.label.localeCompare(b.label))

export const ClientListIncludeGloz = [
  ...ClientList,
  { label: Client.GloZ, value: Client.GloZ },
]
