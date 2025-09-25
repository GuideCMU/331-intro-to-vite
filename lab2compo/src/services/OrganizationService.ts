import axios from 'axios'
import type { Organization } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getOrganizers(perPage: number, page: number) {
    return apiClient.get('/organizers?_limit=' + perPage + '&_page=' + page)
  },

  getOrganizer(id: number) {
    return apiClient.get('/organizers/' + id)
  },

  createOrganization(org: Organization) {
    const payload = { ...org } as Record<string, unknown>
    delete payload.id
    return apiClient.post('/organizers', payload)
  },
}
