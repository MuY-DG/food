import axios from 'axios'
import type { FileUploadResponse } from '@/types/api'

export default {
  // 上传文件
  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post<{
        code: number
        message: string | null
        data: FileUploadResponse
      }>('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.data.code !== 200) {
        throw new Error(response.data.message || '上传失败')
      }

      return response.data.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`上传失败: ${error.message}`)
      }
      throw new Error('上传失败')
    }
  },
}
