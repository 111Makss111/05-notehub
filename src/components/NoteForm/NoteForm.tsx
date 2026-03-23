import { Formik, type FormikHelpers } from 'formik'
import * as Yup from 'yup'
import css from './NoteForm.module.css'
import { type NoteTag } from '../../types/note'
import { type CreateNotePayload } from '../../services/noteService'

interface NoteFormProps {
  onSubmit: (values: CreateNotePayload) => Promise<void>
  onClose: () => void
  isCreating: boolean
}

const noteTags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']

const initialValues: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo',
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Maximum 500 characters'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(noteTags, 'Choose a valid tag')
    .required('Tag is required'),
})

export default function NoteForm({
  onSubmit,
  onClose,
  isCreating,
}: NoteFormProps) {
  const handleSubmit = async (
    values: CreateNotePayload,
    helpers: FormikHelpers<CreateNotePayload>
  ) => {
    try {
      await onSubmit(values)
      helpers.resetForm()
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnMount
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        isValid,
      }) => (
        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              className={css.input}
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.title && errors.title ? (
              <span className={css.error}>{errors.title}</span>
            ) : (
              <span className={css.error} />
            )}
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.content && errors.content ? (
              <span className={css.error}>{errors.content}</span>
            ) : (
              <span className={css.error} />
            )}
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <select
              id="tag"
              name="tag"
              className={css.select}
              value={values.tag}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {noteTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            {touched.tag && errors.tag ? (
              <span className={css.error}>{errors.tag}</span>
            ) : (
              <span className={css.error} />
            )}
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={!isValid || isSubmitting || isCreating}
            >
              Create note
            </button>
          </div>
        </form>
      )}
    </Formik>
  )
}
