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
import './App.css'
import { Suspense, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { configs } from './configs'
import { QuizReview } from './pages/QuizPage/containers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AdminLayout } from './components/layout/AdminLayout'
import { Dashboard, UserManagement } from './pages/Admin'

const router = createBrowserRouter([
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
          {
            path: ':courseId',
            children: [
              { index: true, element: <CourseDetailPage /> },
              {
                path: 'assign',
                children: [
                  {
                    path: ':assignmentId',
                    element: <AssignmentPage />,
                  },
                ],
              },
              {
                path: 'quiz/:quizId',
                element: <QuizPage />,
              },
              {
                path: ':lectureId',
                element: <LecturePage />,
              },
            ],
          },
        ],
      },
      {
        path: 'forum',
        element: <ForumPage />,
      },
      {
        path: 'planning',
        element: <PlanningPage />,
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
      <QueryClientProvider client={queryClient}>
        <ToastContainer position='bottom-right' />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
