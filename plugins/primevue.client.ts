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
import TieredMenu from 'primevue/tieredmenu'
import OverlayPanel from 'primevue/overlaypanel'
import Tooltip from 'primevue/tooltip'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Panel from 'primevue/panel'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import FileUpload from 'primevue/fileupload'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Slider from 'primevue/slider'
import Rating from 'primevue/rating'
import Knob from 'primevue/knob'
import Chart from 'primevue/chart'
import Tree from 'primevue/tree'
import TreeTable from 'primevue/treetable'
import OrganizationChart from 'primevue/organizationchart'
import Timeline from 'primevue/timeline'
import Galleria from 'primevue/galleria'
import Image from 'primevue/image'
import Carousel from 'primevue/carousel'
import PickList from 'primevue/picklist'
import OrderList from 'primevue/orderlist'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import Paginator from 'primevue/paginator'
import VirtualScroller from 'primevue/virtualscroller'
import Skeleton from 'primevue/skeleton'
import ProgressSpinner from 'primevue/progressspinner'
import InlineMessage from 'primevue/inlinemessage'
import Message from 'primevue/message'
import BlockUI from 'primevue/blockui'
import DeferredContent from 'primevue/deferredcontent'
import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'
import AnimateOnScroll from 'primevue/animateonscroll'
import FocusTrap from 'primevue/focustrap'
import AutoFocus from 'primevue/autofocus'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: 'outlined',
    zIndex: {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100
    }
  })
  nuxtApp.vueApp.use(ToastService)
  nuxtApp.vueApp.use(ConfirmationService)
  
  // Register directives
  nuxtApp.vueApp.directive('ripple', Ripple)
  nuxtApp.vueApp.directive('styleclass', StyleClass)
  nuxtApp.vueApp.directive('animateonscroll', AnimateOnScroll)
  nuxtApp.vueApp.directive('focustrap', FocusTrap)
  nuxtApp.vueApp.directive('autofocus', AutoFocus)
  nuxtApp.vueApp.directive('tooltip', Tooltip)
  
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
  nuxtApp.vueApp.component('PTieredMenu', TieredMenu)
  nuxtApp.vueApp.component('POverlayPanel', OverlayPanel)
  nuxtApp.vueApp.component('PTag', Tag)
  nuxtApp.vueApp.component('PDivider', Divider)
  nuxtApp.vueApp.component('PSplitter', Splitter)
  nuxtApp.vueApp.component('PSplitterPanel', SplitterPanel)
  nuxtApp.vueApp.component('PPanel', Panel)
  nuxtApp.vueApp.component('PAccordion', Accordion)
  nuxtApp.vueApp.component('PAccordionTab', AccordionTab)
  nuxtApp.vueApp.component('PFileUpload', FileUpload)
  nuxtApp.vueApp.component('PInputNumber', InputNumber)
  nuxtApp.vueApp.component('PInputSwitch', InputSwitch)
  nuxtApp.vueApp.component('PSlider', Slider)
  nuxtApp.vueApp.component('PRating', Rating)
  nuxtApp.vueApp.component('PKnob', Knob)
  nuxtApp.vueApp.component('PChart', Chart)
  nuxtApp.vueApp.component('PTree', Tree)
  nuxtApp.vueApp.component('PTreeTable', TreeTable)
  nuxtApp.vueApp.component('POrganizationChart', OrganizationChart)
  nuxtApp.vueApp.component('PTimeline', Timeline)
  nuxtApp.vueApp.component('PGalleria', Galleria)
  nuxtApp.vueApp.component('PImage', Image)
  nuxtApp.vueApp.component('PCarousel', Carousel)
  nuxtApp.vueApp.component('PPickList', PickList)
  nuxtApp.vueApp.component('POrderList', OrderList)
  nuxtApp.vueApp.component('PDataView', DataView)
  nuxtApp.vueApp.component('PDataViewLayoutOptions', DataViewLayoutOptions)
  nuxtApp.vueApp.component('PPaginator', Paginator)
  nuxtApp.vueApp.component('PVirtualScroller', VirtualScroller)
  nuxtApp.vueApp.component('PSkeleton', Skeleton)
  nuxtApp.vueApp.component('PProgressSpinner', ProgressSpinner)
  nuxtApp.vueApp.component('PInlineMessage', InlineMessage)
  nuxtApp.vueApp.component('PMessage', Message)
  nuxtApp.vueApp.component('PBlockUI', BlockUI)
  nuxtApp.vueApp.component('PDeferredContent', DeferredContent)
})
