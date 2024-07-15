import { configs } from '@/configs'
import axiosInstance from '../../axios'
import {
  AdminResponse,
  GetStudentsQuery,
  GetUsersQuery,
  RelativeMemberReponse,
  ScheduleResponse,
  SearchStudentQuery,
  UserResponse,
  UsersResponse,
} from './user.dto'
import Cookies from 'js-cookie'
import axios from 'axios'

const BASE_USER_URL = 'account'
export const userService = {
  getAll: async (query: any) => {
    const { data } = await axiosInstance.get<UsersResponse>('account/list', { params: { ...query } })

    return data.data
  },
  searchStudents: async (query: SearchStudentQuery) => {
    const { data } = await axiosInstance.get<UsersResponse>('account/auto-complete', { params: { ...query } })

    return data.data
  },
  getStudents: async (query: GetStudentsQuery) => {
    const { data } = await axiosInstance.get<UsersResponse>('/account/all-student', { params: { ...query } })

    return data.data
  },
  getCurrentUser: async () => {
    const { data } = await axiosInstance.get<UserResponse>(`${BASE_USER_URL}/me`)

    return data
  },
  getAdminProfile: async () => {
    const token = Cookies.get('admin_access_token')
    const { data } = await axios.get<AdminResponse>(`${configs.API_AUTH_URL}/v1/account/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data.data
  },
  getSchedule: async () => {
    const { data } = await axiosInstance.get<ScheduleResponse>(`${BASE_USER_URL}/my-schedule`)

    return data.data
  },
  getRelativeMember: async () => {
    const { data } = await axiosInstance.get<RelativeMemberReponse>(`${BASE_USER_URL}/member`)

    return data.data
  },
  create: async (payload: any) => {
    const { data } = await axiosInstance.post('/account/create', payload)

    return data
  },
  update: async (payload: any) => {
    const { data } = await axiosInstance.put('/account/update', payload)

    return data
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`/account/delete/${id}`)
  },
  getListTeachers: async (query: GetUsersQuery) => {
    const token = Cookies.get('admin_access_token')
    const { data } = await axiosInstance.get<UsersResponse>('/teacher/list', {
      params: { ...query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data.data
  },
  getListStudents: async (query: GetUsersQuery) => {
    const token = Cookies.get('admin_access_token')

    const { data } = await axiosInstance.get<UsersResponse>('/student/list', {
      params: { ...query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data.data
  },
  updateStatusTeacher: async (payload: { teacherId: number; status: number }) => {
    const token = Cookies.get('admin_access_token')

    await axiosInstance.post('/teacher/change-status', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
  updateStatusStudent: async (payload: { studentId: number; status: number }) => {
    const token = Cookies.get('admin_access_token')

    await axiosInstance.post('/student/change-status', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
}
