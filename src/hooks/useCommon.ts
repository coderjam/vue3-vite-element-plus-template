const { VITE_APP_TITLE } = import.meta.env

export const useDocumentTitle = (title: string | unknown) => {
  document.title = title || VITE_APP_TITLE
}
