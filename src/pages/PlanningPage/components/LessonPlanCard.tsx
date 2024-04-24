// import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
// import { gray } from '@/styles/theme'
// import { formatDate } from '@/utils'
// import { Box, ListItemButton, ListItemText, Typography } from '@mui/material'
// import { blue } from '@mui/material/colors'
// import { useNavigate } from 'react-router-dom'

// export type LessonPlanCardProps = {
//   data: LessonPlan
//   isActive: boolean
//   onClick: (data: LessonPlan) => void
// }
// export const LessonPlanCard = ({ data, isActive, onClick }: LessonPlanCardProps) => {
//   const navigate = useNavigate()

//   return (
//     <Box
//       borderRadius={4}
//       overflow='hidden'
//       border={1}
//       borderColor={gray[200]}
//       bgcolor={gray[50]}
//       sx={{ cursor: 'pointer', ':hover': { bgcolor: gray[100], transition: 'all ease 0.2s' } }}
//     >
//       <Box
//         component='img'
//         src='https://images.wondershare.com/edrawmind/articles2023/how-to-make-a-mind-map/mind-map.png'
//         alt='mindmap'
//         sx={{ width: '100%', height: 150, backgroundColor: 'white' }}
//         onClick={() => navigate(`/planning/${data.id}`)}
//       />
//       <Box paddingX={2} paddingY={2}>
//         <Typography variant='body1' fontWeight='bold'>
//           {data.name}
//         </Typography>
//         <Typography variant='body2' color={gray[300]}>
//           {formatDate.toRelative(new Date())}
//         </Typography>
//         <Flex justifyContent='space-between'>
//           <Chip variant='filled' label='Mind map' color='primary' size='small' sx={{ mt: 1 }} />
//           <IconButton
//             onClick={(e) => {
//               e.preventDefault()
//               setSelectedLessonPlan(plan)
//               openMoreMenu(e)
//             }}
//             color={isOpenMoreMenu ? 'primary' : 'default'}
//           >
//             <MoreHorizOutlined fontSize='small' />
//           </IconButton>
//         </Flex>
//       </Box>
//     </Box>
//   )
// }
