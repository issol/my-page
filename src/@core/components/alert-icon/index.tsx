export type AlertType =
  | 'error'
  | 'info'
  | 'error-report'
  | 'progress'
  | 'successful'
  | 'question-info'
  | 'info-pie'
  | 'guideline-info'

export default function AlertIcon({ type }: { type: AlertType }) {
  const basePath = '/images/icons/project-icons/'

  function getIconPath() {
    switch (type) {
      case 'error':
        return 'status-alert-error.png'
      case 'info':
        return 'status-alert-info.png'
      case 'error-report':
        return 'status-alert-report.png'
      case 'progress':
        return 'status-progress.png'
      case 'successful':
        return 'alert-success.svg'
      case 'question-info':
        return 'status-question-info.png'

      case 'info-pie':
        return 'status-info-pie.png'

      case 'guideline-info':
        return 'status-guideline-info.png'
      default:
        return ''
    }
  }
  return (
    <img src={`${basePath}${getIconPath()}`} width={68} height={68} alt='' />
  )
}
