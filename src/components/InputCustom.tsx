// import { CircularProgress, InputProps, Stack, TextField, TextFieldProps, Typography } from '@mui/material'
// import { Flex } from '.'

// interface IInputCustomProps extends InputProps {
//   isLoading: boolean
//   label: string
// }

// export function InputCustom({ label, isLoading, ...props }: IInputCustomProps) {
//   return (
//     <Stack gap={1}>
//       <Typography variant='body1' color='text.caption'>
//         {label}
//       </Typography>
//       <Flex alignItems='center' gap={2}>
//         <TextField
//           fullWidth
//           size='small'
//           placeholder='Find student by email...'
//           InputProps={{
//             endAdornment: isLoading && <CircularProgress sx={{ width: 10 }} size='1.2rem' />,
//           }}
//           {...props}
//         />
//       </Flex>
//     </Stack>
//   )
// }
