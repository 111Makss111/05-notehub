import { useMutation, useQueryClient } from '@tanstack/react-query'
import css from './NoteList.module.css'
import { deleteNote } from '../../services/noteService'
import { type Note } from '../../types/note'

interface NoteListProps {
  notes: Note[]
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient()

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
  })

  const handleDelete = async (id: string) => {
    await deleteNoteMutation.mutateAsync(id)
    await queryClient.invalidateQueries({ queryKey: ['notes'] })
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              type="button"
              onClick={() => handleDelete(note.id)}
              disabled={deleteNoteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
