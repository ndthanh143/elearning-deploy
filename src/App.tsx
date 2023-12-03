import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { theme } from './styles/theme'
import { Layout } from './components'
import {
  AssignmentPage,
  CourseDetailPage,
  CoursesPage,
  ForumPage,
  HomePage,
  LecturePage,
  LoginPage,
  QuizPage,
  SchedulePage,
} from './pages'

import 'react-toastify/dist/ReactToastify.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './App.css'
import { Suspense, useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { configs } from './configs'

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
      {
        path: '/courses',
        children: [
          { index: true, element: <CoursesPage /> },
          {
            path: ':courseId',
            children: [
              { index: true, element: <CourseDetailPage /> },
              {
                path: ':lectureId',
                element: <LecturePage />,
              },
            ],
          },
          {
            path: 'assign',
            children: [
              {
                path: ':assignmentId',
                element: <AssignmentPage />,
              },
            ],
          },
        ],
      },
      {
        path: '/quiz',
        element: <QuizPage />,
      },
      {
        path: '/forum',
        element: <ForumPage />,
      },
      {
        path: '/schedule',
        element: <SchedulePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
])
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

function App() {
  return (
    <GoogleOAuthProvider clientId={configs.GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position='bottom-right' />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
