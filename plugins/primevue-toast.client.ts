import { useToast } from 'primevue/usetoast'

export default defineNuxtPlugin(() => {
  const toast = useToast()

  return {
    provide: {
      toast,
    },
  }
})
