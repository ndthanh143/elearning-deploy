import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
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
  StudentHomePage,
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
  ForgotPasswordPage,
  ResourcePage,
  LandingPage,
  CourseCertificatePage,
  SearchPage,
  CoursePublicPage,
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
import { useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { configs } from './configs'
import { QuizReview } from './pages/Common/QuizPage/containers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AdminLayout } from './components/layout/AdminLayout'
import { Dashboard, UserManagement } from './pages/Admin'
import { ReactFlowProvider } from 'reactflow'
import { PlanningDetailPage } from './pages/Teacher/PlanningDetailPage'
import { AuthLayout, CoursesPageLayout, PublicLayout } from './components/layout'
import { GlobalWorkerOptions, version } from 'pdfjs-dist'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { LessonLayout } from './components/layout/LessonLayout'

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.mjs`

const router = createBrowserRouter([
  {
    path: 'courses/:courseId',
    children: [
      {
        index: true,
        element: (
          <Layout>
            <CourseDetailPage />
          </Layout>
        ),
      },
      {
        path: 'certificate',
        element: (
          <Layout>
            <CourseCertificatePage />,
          </Layout>
        ),
      },
      {
        path: 'u/:unitId',
        element: <LessonLayout />,
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
          {
            path: 'resource/:resourceId',
            element: <ResourcePage />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      { path: '/search', element: <SearchPage /> },
      { path: '/search/:courseId', element: <CoursePublicPage /> },
    ],
  },

  {
    path: '/home',
    element: (
      <Layout>
        <StudentHomePage />
      </Layout>
    ),
  },
  {
    path: 'profile',
    element: (
      <Layout>
        <ProfilePage />
      </Layout>
    ),
  },
  {
    path: 'courses',
    element: <Layout />,
    children: [
      { index: true, element: <CoursesPageLayout /> },
      { path: 'create', element: <CreateNewCoursePage /> },
      { path: ':courseId/manage', element: <EditCoursePage /> },
    ],
  },
  {
    path: 'planning',
    children: [
      {
        index: true,
        element: (
          <Layout>
            <PlanningPage />
          </Layout>
        ),
      },
    ],
  },
  {
    path: 'group',
    children: [
      {
        index: true,
        element: (
          <Layout>
            <GroupManagementPage />
          </Layout>
        ),
      },
    ],
  },
  {
    path: 'student-manage',
    element: (
      <Layout>
        <StudentManagement />
      </Layout>
    ),
  },
  {
    path: 'submission-management',
    element: (
      <Layout>
        <SubmissionManagementPage />
      </Layout>
    ),
  },
  {
    path: 'schedule',
    element: (
      <Layout>
        <SchedulePage />
      </Layout>
    ),
  },
  {
    path: 'confirm-invitation',
    element: (
      <Layout>
        <ConfirmInvitationPage />
      </Layout>
    ),
  },
  {
    path: 'quiz-submission',
    children: [
      {
        path: ':quizSubmissionId',
        element: (
          <Layout>
            <QuizReview />
          </Layout>
        ),
      },
    ],
  },
  {
    path: 'tasks',
    element: (
      <Layout>
        <TaskPage />
      </Layout>
    ),
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
    path: 'forgot-password',
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
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
            <DndProvider backend={HTML5Backend}>
              <CssBaseline />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <RouterProvider router={router} />
              </LocalizationProvider>
            </DndProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ReactFlowProvider>
    </GoogleOAuthProvider>
  )
}

export default App
