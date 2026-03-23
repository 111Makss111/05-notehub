import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import css from './App.module.css'
import SearchBox from '../SearchBox/SearchBox'
import Pagination from '../Pagination/Pagination'
import Modal from '../Modal/Modal'
import NoteForm from '../NoteForm/NoteForm'
import NoteList from '../NoteList/NoteList'
import {
  createNote,
  deleteNote,
  fetchNotes,
  type CreateNotePayload,
  type FetchNotesResponse,
} from '../../services/noteService'

const PER_PAGE = 12

export default function App() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setCurrentPage(1)
    setSearchQuery(value.trim())
  }, 500)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    updateSearchQuery(value)
  }

  const { data, isLoading, isError, error, isFetching } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ['notes', currentPage, searchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search: searchQuery || undefined,
      }),
  })

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      setIsModalOpen(false)
      setCurrentPage(1)
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const notes = data?.notes ?? []
  const totalPages = data?.totalPages ?? 0

  const handleCreateNote = async (values: CreateNotePayload) => {
    await createNoteMutation.mutateAsync(values)
  }

  const handleDeleteNote = (id: string) => {
    if (notes.length === 1 && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }

    deleteNoteMutation.mutate(id)
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>{error.message}</p>}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList
          notes={notes}
          onDelete={handleDeleteNote}
          isDeleting={deleteNoteMutation.isPending}
        />
      )}

      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}

      {isFetching && !isLoading && <p>Updating...</p>}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onClose={() => setIsModalOpen(false)}
            isCreating={createNoteMutation.isPending}
          />
        </Modal>
      )}
    </div>
  )
}
