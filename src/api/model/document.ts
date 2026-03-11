export interface Document {
  id: string
  name: string
  content: ArrayBuffer
  size?: number
  mimeType?: string
}