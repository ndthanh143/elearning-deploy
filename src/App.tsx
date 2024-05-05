import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NProgress from 'nprogress'
import ReactGA from 'react-ga'

import { theme } from './styles/theme'
import { Layout, NotFound } from './components'
import {
  AssignmentPage,
  CourseDetailPage,
  CoursesPage,
  CreateNewCoursePage,
  EditCoursePage,
  ForumPage,
  HomePage,
  LecturePage,
  LoginPage,
  ManageStudent,
  PlanningPage,
  ProfilePage,
  QuizPage,
  SchedulePage,
  SubmissionManagementPage,
} from './pages'

import 'nprogress/nprogress.css'
import 'react-toastify/dist/ReactToastify.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'react-quill/dist/quill.snow.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './App.css'
import { Suspense, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { configs } from './configs'
import { QuizReview } from './pages/QuizPage/containers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AdminLayout } from './components/layout/AdminLayout'
import { Dashboard, UserManagement } from './pages/Admin'
import { ReactFlowProvider } from 'reactflow'
import { PlanningDetailPage } from './pages/PlanningDetailPage'
import { CourseDetailLayout } from './components/layout/CourseDetailLayout'

const router = createBrowserRouter([
  {
    path: 'courses/:courseId',
    element: <CourseDetailLayout />,
    children: [
      { index: true, element: <CourseDetailPage /> },
      {
        path: 'u/:unitId',
        children: [
          {
            path: 'assign/:assignmentId',
            element: <AssignmentPage />,
          },
          {
            path: 'lecture/:lectureId',
            element: <LecturePage />,
          },
        ],
      },
      {
        path: 'quiz/:quizId',
        element: <QuizPage />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<Typography>Loading...</Typography>}>
        <Layout />
      </Suspense>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'profile', element: <ProfilePage /> },
      {
        path: 'courses',
        children: [
          { index: true, element: <CoursesPage /> },
          { path: 'create', element: <CreateNewCoursePage /> },
          { path: ':courseId/manage', element: <EditCoursePage /> },
        ],
      },
      {
        path: 'forum',
        element: <ForumPage />,
      },
      {
        path: 'planning',
        children: [{ index: true, element: <PlanningPage /> }],
      },
      {
        path: 'student-manage',
        element: <ManageStudent />,
      },
      {
        path: 'submission-management',
        element: <SubmissionManagementPage />,
      },
      {
        path: 'schedule',
        element: <SchedulePage />,
      },
      {
        path: 'quiz-submission',
        children: [
          {
            path: ':quizSubmissionId',
            element: <QuizReview />,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
    ],
  },
  {
    path: 'planning',
    children: [
      {
        path: ':lessonPlanId',
        element: <PlanningDetailPage />,
      },
    ],
  },

  { path: '*', element: <NotFound /> },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

NProgress.configure({ showSpinner: false })

ReactGA.initialize('G-PK5JR2YG6X')

function App() {
  useEffect(() => {
    NProgress.start()

    NProgress.done()
  }, [])

  return (
    <GoogleOAuthProvider clientId={configs.GOOGLE_CLIENT_ID}>
      <ReactFlowProvider>
        <QueryClientProvider client={queryClient}>
          <ToastContainer position='bottom-right' />
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <RouterProvider router={router} />
            </LocalizationProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ReactFlowProvider>
    </GoogleOAuthProvider>
  )
}

export default App
