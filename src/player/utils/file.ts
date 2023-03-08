import axios from 'axios'

export async function download(url: string, name: string): Promise<Blob> {
  const { data } = await axios<Blob>(url, { responseType: 'blob' })

  const href = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = href
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(href)

  return data
}
