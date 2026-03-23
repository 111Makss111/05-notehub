import axios, { type AxiosResponse } from 'axios'
import { type Note, type NoteTag } from '../types/note'

const notehubApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
})

function getAuthHeaders() {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN

  if (!token) {
    throw new Error('VITE_NOTEHUB_TOKEN is not defined')
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

export interface FetchNotesParams {
  page: number
  perPage?: number
  search?: string
}

export interface FetchNotesResponse {
  notes: Note[]
  totalPages: number
}

export interface CreateNotePayload {
  title: string
  content: string
  tag: NoteTag
}

export async function fetchNotes({
  page,
  perPage = 12,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await notehubApi.get(
    '/notes',
    {
      params: {
        page,
        perPage,
        ...(search ? { search } : {}),
      },
      headers: getAuthHeaders(),
    }
  )

  return response.data
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response: AxiosResponse<Note> = await notehubApi.post(
    '/notes',
    payload,
    {
      headers: getAuthHeaders(),
    }
  )

  return response.data
}

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await notehubApi.delete(
    `/notes/${id}`,
    {
      headers: getAuthHeaders(),
    }
  )

  return response.data
}
