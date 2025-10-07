import { useToast as usePrimeToast } from 'primevue/usetoast'

export default defineNuxtPlugin(() => {
  const toast = usePrimeToast()

  return {
    provide: {
      toast,
    },
  }
})
