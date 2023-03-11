import { useAxios } from '@vueuse/integrations/useAxios'
import { readonly, ref } from 'vue'

export const useDownload = (url: string, name: string) => {
  const progress = ref<number>()

  const { data, isLoading, execute } = useAxios<Blob>(url,
    {
      responseType: 'blob',
      onDownloadProgress: progressEvent => progress.value = progressEvent.progress,
    },
    { immediate: false },
  )

  async function start() {
    await execute()
    progress.value = undefined

    if (data.value) {
      const href = URL.createObjectURL(data.value)
      const link = document.createElement('a')
      link.href = href
      link.download = name
      link.click()

      URL.revokeObjectURL(href)
    }
  }

  return {
    loading: readonly(isLoading),
    progress: readonly(progress),

    start,
  }
}
