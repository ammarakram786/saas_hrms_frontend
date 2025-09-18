import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import Menu from 'primevue/menu'
import MenuBar from 'primevue/menubar'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import Sidebar from 'primevue/sidebar'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Chip from 'primevue/chip'
import ProgressBar from 'primevue/progressbar'
import Textarea from 'primevue/textarea'
import MultiSelect from 'primevue/multiselect'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue)
  nuxtApp.vueApp.use(ToastService)
  nuxtApp.vueApp.use(ConfirmationService)
  
  // Register components globally
  nuxtApp.vueApp.component('PButton', Button)
  nuxtApp.vueApp.component('PInputText', InputText)
  nuxtApp.vueApp.component('PPassword', Password)
  nuxtApp.vueApp.component('PDialog', Dialog)
  nuxtApp.vueApp.component('PDataTable', DataTable)
  nuxtApp.vueApp.component('PColumn', Column)
  nuxtApp.vueApp.component('PDropdown', Dropdown)
  nuxtApp.vueApp.component('PCalendar', Calendar)
  nuxtApp.vueApp.component('PCard', Card)
  nuxtApp.vueApp.component('PMenu', Menu)
  nuxtApp.vueApp.component('PMenuBar', MenuBar)
  nuxtApp.vueApp.component('PToast', Toast)
  nuxtApp.vueApp.component('PConfirmDialog', ConfirmDialog)
  nuxtApp.vueApp.component('PSidebar', Sidebar)
  nuxtApp.vueApp.component('PAvatar', Avatar)
  nuxtApp.vueApp.component('PBadge', Badge)
  nuxtApp.vueApp.component('PChip', Chip)
  nuxtApp.vueApp.component('PProgressBar', ProgressBar)
  nuxtApp.vueApp.component('PTextarea', Textarea)
  nuxtApp.vueApp.component('PMultiSelect', MultiSelect)
  nuxtApp.vueApp.component('PCheckbox', Checkbox)
  nuxtApp.vueApp.component('PRadioButton', RadioButton)
  nuxtApp.vueApp.component('PTabView', TabView)
  nuxtApp.vueApp.component('PTabPanel', TabPanel)
})
