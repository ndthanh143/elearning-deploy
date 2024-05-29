import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Change the opacity here
    paddingLeft: theme.spacing(2), // Increase padding here
    paddingRight: theme.spacing(2), // Increase padding here
    paddingTop: theme.spacing(1), // Increase padding here
    paddingBottom: theme.spacing(1), // Increase padding here
    borderRadius: 16,
    fontWeight: 700,
    fontSize: 14,
  },
}))
