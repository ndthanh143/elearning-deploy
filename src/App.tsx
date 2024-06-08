import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NProgress from 'nprogress'
import ReactGA from 'react-ga'

import { theme } from './styles/theme'
import { AlertComponent, Layout, NotFound } from './components'
import {
  AssignmentPage,
  CourseDetailPage,
  CreateNewCoursePage,
  EditCoursePage,
  HomePage,
  LecturePage,
  LoginPage,
  StudentManagement,
  PlanningPage,
  ProfilePage,
  QuizPage,
  SchedulePage,
  SignUpPage,
  SubmissionManagementPage,
  ConfirmInvitationPage,
  GroupManagementPage,
  TaskPage,
} from './pages'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'nprogress/nprogress.css'
import 'react-toastify/dist/ReactToastify.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './App.css'
import { Suspense, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { configs } from './configs'
import { QuizReview } from './pages/Common/QuizPage/containers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AdminLayout } from './components/layout/AdminLayout'
import { Dashboard, UserManagement } from './pages/Admin'
import { ReactFlowProvider } from 'reactflow'
import { PlanningDetailPage } from './pages/Teacher/PlanningDetailPage'
import { AuthLayout, CoursesPageLayout } from './components/layout'

const router = createBrowserRouter([
  {
    path: 'courses/:courseId',
    element: <Layout />,
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
          {
            path: 'quiz/:quizId',
            element: <QuizPage />,
          },
        ],
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
          { index: true, element: <CoursesPageLayout /> },
          { path: 'create', element: <CreateNewCoursePage /> },
          { path: ':courseId/manage', element: <EditCoursePage /> },
        ],
      },
      {
        path: 'planning',
        children: [{ index: true, element: <PlanningPage /> }],
      },
      {
        path: 'group',
        children: [{ index: true, element: <GroupManagementPage /> }],
      },
      {
        path: 'student-manage',
        element: <StudentManagement />,
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
        path: 'confirm-invitation',
        element: <ConfirmInvitationPage />,
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
      {
        path: 'tasks',
        element: <TaskPage />,
      },
    ],
  },
  {
    path: 'login',
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: 'signup',
    element: (
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    ),
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
          <AlertComponent />
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
