// ** MUI Imports
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
// import StepperCustomDot from './StepperCustomDot'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import StepperCustomDot from '@src/views/forms/form-elements/form-wizard/StepperCustomDot'
import { Card } from '@mui/material'

type Props = {
  activeStep: number
  steps: Array<{ title: string }>
}
export default function AddClientStepper({ activeStep, steps }: Props) {
  return (
    <Card>
      <CardContent sx={{ maxWidth: '80%', margin: '0 auto' }}>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps: {
                error?: boolean
              } = {}
              if (index === activeStep) {
                labelProps.error = false
              }

              return (
                <Step key={index}>
                  <StepLabel
                    {...labelProps}
                    StepIconComponent={StepperCustomDot}
                  >
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${
                        index + 1
                      }`}</Typography>
                      <div>
                        <Typography className='step-title'>
                          {step.title}
                        </Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>
    </Card>
  )
}
