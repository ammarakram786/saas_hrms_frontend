export const useToast = () => {
  const { $toast } = useNuxtApp()

  if (!$toast) {
    throw new Error('Toast plugin not initialized. Make sure plugins/primevue-toast.client.ts is loaded.')
  }

  return $toast
}
