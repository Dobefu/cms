import { type ContentType } from './content-type'

export type Content = {
  id: number
  content_type: ContentType
  title: string
  published: boolean
  created_at: string
  updated_at: string
}
