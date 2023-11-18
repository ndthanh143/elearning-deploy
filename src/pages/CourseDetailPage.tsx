import {
  ArrowBack,
  ArrowDownward,
  Article,
  ArticleOutlined,
  Check,
  Circle,
  FiberManualRecord,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material'
import { Avatar, Box, Button, Collapse, Divider, Grid, Stack, Typography } from '@mui/material'
import { PageContentHeading } from '../components'
import { useNavigate, useParams } from 'react-router-dom'
import { icons } from '../assets/images/icons'
import { useState } from 'react'
import { courseKeys } from '../services/course/course.query'
import { useQuery } from '@tanstack/react-query'

const keys = [
  'Understand the psychology of human behaviour',
  'Motivate your students, staff, customers, users and yourself',
  'Build an engagement plan to create change in a community',
]
const requirements = [
  'You must have an open mind',
  "You'll need to invest time in the student discussions",
  "Ideally you'll have a comunity to test your idea on",
]

const sections = [
  {
    id: 1,
    title: 'Section 1',
    lectures: [
      {
        name: 'Lecture 1',
      },
      {
        name: 'Lecture 2',
      },
    ],
  },
  {
    id: 2,
    title: 'Section 2',
    lectures: [
      {
        name: 'Lecture 1',
      },
      {
        name: 'Lecture 2',
      },
      {
        name: 'Lecture 3',
      },
      {
        name: 'Lecture 4',
      },
    ],
  },
]

export const CourseDetailPage = () => {
  const navigate = useNavigate()

  const [expandModuleList, setExpandModuleList] = useState<Number[]>([])

  const { courseId } = useParams()

  // const sections = [
  //   {
  //     content: (
  //       <Stack direction='column' gap={1} mb={2}>
  //         <Typography variant='h6' fontWeight={500}>
  //           Thông tin về môn học
  //         </Typography>
  //         <Typography>
  //           Học phần nhằm cung cấp cho người học kiến thức cơ bản về kiểm thử phần mềm, quy trình kiểm thử phần mềm,
  //           phân tích, thiết kế và cài đặt những kĩ thuật kiểm thử, mô hình CMMi. Sau khi kết thúc khoá học, sinh viên
  //           có thể nắm vững những thuật ngữ, định nghĩa, khái niệm trong kiểm thử phần mềm, có khả năng áp dụng kiến
  //           thức để thiết kế, thực thi và đánh giá chất lượng phần mềm. Ngoài ra, sinh viên còn có thể sử dụng những
  //           công cụ quản lí lỗi, và công cụ kiểm thử tự động.
  //         </Typography>
  //         <Typography>Link Google Meet cho các buổi học online:</Typography>
  //         <Typography>http://meet.google.com/eog-wegv-gki</Typography>
  //         <Typography>Thời gian học: từ 12h30 PM đến 16h00 PM chiều THỨ HAI</Typography>
  //         <Typography>Địa điểm: phòng A5-103</Typography>
  //       </Stack>
  //     ),
  //     resources: [
  //       {
  //         id: 1,
  //         name: '[Bài giảng] Kế hoạch kiểm thử',
  //         src: 'haha.ptt',
  //       },
  //       {
  //         id: 2,
  //         name: '[Bài giảng] Test cases',
  //         src: 'hihi.ptt',
  //       },
  //       {
  //         id: 3,
  //         name: 'Bài tập nhóm số 03',
  //         src: 'hihi.doc',
  //       },
  //       {
  //         id: 4,
  //         name: 'Mẫu test caseFile',
  //         src: 'hahaha.xls',
  //       },
  //     ],
  //   },
  //   {
  //     content: (
  //       <Stack direction='column' gap={1}>
  //         <Typography variant='h6' fontWeight={500}>
  //           Thông tin về môn học
  //         </Typography>
  //         <Typography>
  //           Học phần nhằm cung cấp cho người học kiến thức cơ bản về kiểm thử phần mềm, quy trình kiểm thử phần mềm,
  //           phân tích, thiết kế và cài đặt những kĩ thuật kiểm thử, mô hình CMMi. Sau khi kết thúc khoá học, sinh viên
  //           có thể nắm vững những thuật ngữ, định nghĩa, khái niệm trong kiểm thử phần mềm, có khả năng áp dụng kiến
  //           thức để thiết kế, thực thi và đánh giá chất lượng phần mềm. Ngoài ra, sinh viên còn có thể sử dụng những
  //           công cụ quản lí lỗi, và công cụ kiểm thử tự động.
  //         </Typography>
  //         <Typography>Link Google Meet cho các buổi học online:</Typography>
  //         <Typography>http://meet.google.com/eog-wegv-gki</Typography>
  //         <Typography>Thời gian học: từ 12h30 PM đến 16h00 PM chiều THỨ HAI</Typography>
  //         <Typography>Địa điểm: phòng A5-103</Typography>
  //       </Stack>
  //     ),
  //   },
  //   {
  //     content: (
  //       <Stack direction='column' gap={1}>
  //         <Typography variant='h6' fontWeight={500}>
  //           Thông tin về môn học
  //         </Typography>
  //         <Typography>
  //           Học phần nhằm cung cấp cho người học kiến thức cơ bản về kiểm thử phần mềm, quy trình kiểm thử phần mềm,
  //           phân tích, thiết kế và cài đặt những kĩ thuật kiểm thử, mô hình CMMi. Sau khi kết thúc khoá học, sinh viên
  //           có thể nắm vững những thuật ngữ, định nghĩa, khái niệm trong kiểm thử phần mềm, có khả năng áp dụng kiến
  //           thức để thiết kế, thực thi và đánh giá chất lượng phần mềm. Ngoài ra, sinh viên còn có thể sử dụng những
  //           công cụ quản lí lỗi, và công cụ kiểm thử tự động.
  //         </Typography>
  //         <Typography>Link Google Meet cho các buổi học online:</Typography>
  //         <Typography>http://meet.google.com/eog-wegv-gki</Typography>
  //         <Typography>Thời gian học: từ 12h30 PM đến 16h00 PM chiều THỨ HAI</Typography>
  //         <Typography>Địa điểm: phòng A5-103</Typography>
  //       </Stack>
  //     ),
  //   },
  // ]
  const courseInstance = courseKeys.detail(Number(courseId))
  const { data } = useQuery(courseInstance)
  console.log(data)

  const footerDetailCourse = data && (
    <Stack gap={1}>
      <Typography variant='h5' fontWeight={500}>
        Instructor
      </Typography>
      <Stack direction='row' gap={1}>
        <Avatar
          src={data.data.teacherInfo.fullName}
          alt={data.data.teacherInfo.fullName}
          sx={{ width: 60, height: 60 }}
        />
        <Stack justifyContent='center'>
          <Typography fontWeight={500}>{data.data.teacherInfo.fullName}</Typography>
          <Typography variant='body2'>{data.data.teacherInfo.email}</Typography>
        </Stack>
      </Stack>
    </Stack>
  )

  const handleBackToCourses = () => {
    navigate('/courses')
  }

  const handleExpandModuleList = (moduleId: number) => {
    if (expandModuleList.includes(moduleId)) {
      setExpandModuleList((prev) => prev.filter((item) => item !== moduleId))
    } else {
      setExpandModuleList((prev) => [...prev, moduleId])
    }
  }

  const handleToggleModuleListAll = () => {
    if (sections.length === expandModuleList.length) {
      setExpandModuleList([])
    } else {
      const moduleIdList = sections.map((section) => section.id)
      setExpandModuleList(moduleIdList)
    }
  }

  return (
    data && (
      <Box>
        <PageContentHeading />
        <Grid container>
          <Grid item xs={12} md={12} lg={9}>
            <Stack direction='column' gap={3}>
              <Box bgcolor='#fff' padding={2} borderRadius={3}>
                <Button sx={{ gap: 1, mb: 1 }} color='secondary' onClick={handleBackToCourses}>
                  <ArrowBack fontSize='small' />
                  Courses
                </Button>
                <Stack gap={3}>
                  <Typography variant='h6' fontWeight={500}>
                    {data.data.courseName}
                  </Typography>
                  <Typography variant='body2'>
                    Learn how to motivate and engage anyone by learning the psychology that underpins human behaviour
                  </Typography>
                  <Stack direction='row' gap={1} alignItems='center'>
                    <Avatar
                      src={data.data.teacherInfo.avatarPath}
                      alt={data.data.teacherInfo.fullName}
                      sx={{ width: 30, height: 30 }}
                    />
                    <Typography>{data.data.teacherInfo.fullName}</Typography>
                  </Stack>
                  <Box border={1} p={3} borderRadius={3}>
                    <Typography variant='h6' mb={3}>
                      What you'll learn
                    </Typography>
                    <Grid container spacing={2}>
                      {keys.map((key) => (
                        <Grid item xs={6}>
                          <Box key={key} display='flex' alignItems='start' gap={3}>
                            <Check color='primary' />
                            <Typography>{key}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Stack gap={2}>
                    <Typography variant='h6'>Requirements</Typography>
                    {requirements.map((requirement) => (
                      <Box display='flex' gap={2} alignItems='center'>
                        <FiberManualRecord fontSize='small' color='primary' />
                        <Typography>{requirement}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Stack gap={2}>
                    <Typography variant='h6'>Descriptions</Typography>
                    <Typography>
                      This subject delves into the fundamental principles of C++ programming, offering a comprehensive
                      exploration of its syntax, features, and advanced concepts. Students are introduced to the core
                      concepts of object-oriented programming (OOP) that form the backbone of C++, enabling them to
                      design and implement robust, modular, and reusable software solutions.
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
              {/* {sections.map((section, index) => (
              <Box bgcolor='#fff' padding={2} borderRadius={3} key={index}>
                {index === 0 && (
                  <Button sx={{ gap: 1, mb: 1 }} color='secondary' onClick={handleBackToCourses}>
                    <ArrowBack fontSize='small' />
                    Courses
                  </Button>
                )}
                {section.content}
                {section.resources?.map((resource) => (
                  <>
                    <Stack direction='row' gap={1} key={resource.id} p={2}>
                      <Box component='img' width={30} height={30} borderRadius={1} src={icons.resource.excel} />
                      <Typography>{resource.name}</Typography>
                    </Stack>
                    <Divider />
                  </>
                ))}
              </Box>
            ))} */}
              {
                <Box bgcolor='#fff' padding={2} borderRadius={3}>
                  <Typography variant='h5' fontWeight={500}>
                    Course content
                  </Typography>
                  <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                    <Typography variant='body2'>{sections.length} sections</Typography>
                    <Button variant='text' onClick={handleToggleModuleListAll}>
                      {sections.length === expandModuleList.length ? (
                        <>
                          Collapse All <KeyboardArrowUp />
                        </>
                      ) : (
                        <>
                          Expand all <KeyboardArrowDown />
                        </>
                      )}
                    </Button>
                  </Box>
                  <Stack gap={2}>
                    {sections.map((section) => (
                      <Stack border={1} borderRadius={3} padding={2} gap={2}>
                        <Box
                          display='flex'
                          alignItems='center'
                          justifyContent='space-between'
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleExpandModuleList(section.id)}
                        >
                          <Box display='flex' alignItems='center' gap={2}>
                            <KeyboardArrowDown />
                            <Typography fontWeight={500}>{section.title}</Typography>
                          </Box>
                          <Box display='flex' alignItems='center' gap={2}>
                            <ArticleOutlined />
                            <Typography>{section.lectures.length} lectures</Typography>
                          </Box>
                        </Box>
                        <Collapse in={expandModuleList.includes(section.id)} timeout='auto' unmountOnExit>
                          <Divider />
                          <Stack gap={1} mt={1}>
                            {section.lectures.map((lecture) => (
                              <Box display='flex' alignItems='center' gap={2} py={1} sx={{ cursor: 'pointer' }}>
                                <ArticleOutlined color='primary' />
                                <Typography>{lecture.name}</Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Collapse>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              }
              <Box bgcolor='#fff' padding={2} borderRadius={3}>
                {footerDetailCourse}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    )
  )
}
