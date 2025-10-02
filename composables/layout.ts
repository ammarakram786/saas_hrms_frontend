import { ref, computed } from 'vue'

// Layout state
const layoutConfig = ref({
  menuMode: 'static', // static, overlay, slim, horizontal, slim-plus
  menuTheme: 'light', // light, dark
  colorScheme: 'light', // light, dark
  inputStyle: 'outlined', // outlined, filled
  ripple: true
})

const layoutState = ref({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  rightMenuActive: false,
  topbarMenuActive: false,
  activeMenuItem: null,
  configSidebarVisible: false
})

const isMobile = ref(false)
const isDesktop = ref(true)

// Computed properties
const isSidebarActive = computed(() => {
  return layoutState.value.staticMenuDesktopInactive || layoutState.value.overlayMenuActive
})

const isSidebarVisible = computed(() => {
  return !layoutState.value.staticMenuDesktopInactive || layoutState.value.overlayMenuActive
})

// Methods
const toggleMenu = () => {
  if (isMobile.value) {
    layoutState.value.staticMenuMobileActive = !layoutState.value.staticMenuMobileActive
  } else {
    layoutState.value.staticMenuDesktopInactive = !layoutState.value.staticMenuDesktopInactive
  }
}

const toggleOverlayMenu = () => {
  layoutState.value.overlayMenuActive = !layoutState.value.overlayMenuActive
}

const toggleConfigSidebar = () => {
  layoutState.value.configSidebarVisible = !layoutState.value.configSidebarVisible
}

const onMenuToggle = () => {
  if (isMobile.value) {
    layoutState.value.staticMenuMobileActive = !layoutState.value.staticMenuMobileActive
  } else {
    layoutState.value.staticMenuDesktopInactive = !layoutState.value.staticMenuDesktopInactive
  }
}

const onOverlayMenuToggle = () => {
  layoutState.value.overlayMenuActive = !layoutState.value.overlayMenuActive
}

const onMenuHover = () => {
  if (layoutConfig.value.menuMode === 'slim' || layoutConfig.value.menuMode === 'slim-plus') {
    layoutState.value.menuHoverActive = !layoutState.value.menuHoverActive
  }
}

const onRightMenuToggle = () => {
  layoutState.value.rightMenuActive = !layoutState.value.rightMenuActive
}

const onTopbarMenuToggle = () => {
  layoutState.value.topbarMenuActive = !layoutState.value.topbarMenuActive
}

const onMenuItemClick = (event: any) => {
  if (event.item && !event.item.items) {
    layoutState.value.overlayMenuActive = false
    layoutState.value.staticMenuMobileActive = false
  }
}

const onConfigClick = () => {
  layoutState.value.configSidebarVisible = !layoutState.value.configSidebarVisible
}

const onConfigButtonClick = () => {
  layoutState.value.configSidebarVisible = !layoutState.value.configSidebarVisible
}

const onConfigClose = () => {
  layoutState.value.configSidebarVisible = false
}

const changeTheme = (theme: string) => {
  layoutConfig.value.colorScheme = theme
  layoutConfig.value.menuTheme = theme
}

const changeMenuMode = (mode: string) => {
  layoutConfig.value.menuMode = mode
}

const changeInputStyle = (style: string) => {
  layoutConfig.value.inputStyle = style
}

const toggleRipple = () => {
  layoutConfig.value.ripple = !layoutConfig.value.ripple
}

// Responsive handling
const checkScreenSize = () => {
  if (process.client) {
    const width = window.innerWidth
    isMobile.value = width < 992
    isDesktop.value = width >= 992
  }
}

// Initialize responsive handling
if (process.client) {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
}

export function useLayout() {
  return {
    layoutConfig,
    layoutState,
    isMobile,
    isDesktop,
    isSidebarActive,
    isSidebarVisible,
    toggleMenu,
    toggleOverlayMenu,
    toggleConfigSidebar,
    onMenuToggle,
    onOverlayMenuToggle,
    onMenuHover,
    onRightMenuToggle,
    onTopbarMenuToggle,
    onMenuItemClick,
    onConfigClick,
    onConfigButtonClick,
    onConfigClose,
    changeTheme,
    changeMenuMode,
    changeInputStyle,
    toggleRipple
  }
}