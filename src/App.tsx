import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { theme } from './styles/theme'
import { Layout } from './components'
import { CourseDetailPage, CoursesPage, HomePage, LoginPage, QuizPage } from './pages'

import 'react-toastify/dist/ReactToastify.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/courses',
        children: [
          { index: true, element: <CoursesPage /> },
          {
            path: ':courseId',
            element: <CourseDetailPage />,
          },
        ],
      },
      {
        path: '/quiz',
        element: <QuizPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
])
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
