import { Avatar, Box, Typography } from '@mui/material'

export const ListStudent = () => {
  const listStudent = [
    {
      avatar:
        'https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg',
      name: 'Lionel Messi',
      mssv: '20110565',
    },
    {
      avatar:
        'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt12dbddde5342ce4c/648866ff21a8556da61fa167/GOAL_-_Blank_WEB_-_Facebook_-_2023-06-13T135350.847.png?auto=webp&format=pjpg&width=3840&quality=60',
      name: 'Cristiano Ronaldo',
      mssv: '20110565',
    },
    {
      avatar:
        'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt12dbddde5342ce4c/648866ff21a8556da61fa167/GOAL_-_Blank_WEB_-_Facebook_-_2023-06-13T135350.847.png?auto=webp&format=pjpg&width=3840&quality=60',
      name: 'Cristiano Ronaldo',
      mssv: '20110565',
    },
    {
      avatar:
        'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt12dbddde5342ce4c/648866ff21a8556da61fa167/GOAL_-_Blank_WEB_-_Facebook_-_2023-06-13T135350.847.png?auto=webp&format=pjpg&width=3840&quality=60',
      name: 'Cristiano Ronaldo',
      mssv: '20110565',
    },
    {
      avatar:
        'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt12dbddde5342ce4c/648866ff21a8556da61fa167/GOAL_-_Blank_WEB_-_Facebook_-_2023-06-13T135350.847.png?auto=webp&format=pjpg&width=3840&quality=60',
      name: 'Cristiano Ronaldo',
      mssv: '20110565',
    },
    {
      avatar:
        'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt12dbddde5342ce4c/648866ff21a8556da61fa167/GOAL_-_Blank_WEB_-_Facebook_-_2023-06-13T135350.847.png?auto=webp&format=pjpg&width=3840&quality=60',
      name: 'Cristiano Ronaldo',
      mssv: '20110565',
    },
    {
      avatar:
        'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt12dbddde5342ce4c/648866ff21a8556da61fa167/GOAL_-_Blank_WEB_-_Facebook_-_2023-06-13T135350.847.png?auto=webp&format=pjpg&width=3840&quality=60',
      name: 'Cristiano Ronaldo',
      mssv: '20110565',
    },
  ]
  return (
    <Box display='flex' flexDirection='column' gap={1} overflow='auto' maxHeight={700}>
      {listStudent.map((student) => (
        <Box
          key={student.name}
          display='flex'
          alignItems='center'
          gap={2}
          p={1}
          sx={{
            ':hover': {
              bgcolor: '#ddd',
              cursor: 'pointer',
              borderRadius: 3,
            },
          }}
        >
          <Avatar src={student.avatar} alt={student.name} />
          <Box>
            <Typography fontWeight={500}>{student.name}</Typography>
            <Typography variant='body2'>{student.mssv}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
