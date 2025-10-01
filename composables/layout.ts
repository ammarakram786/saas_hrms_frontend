import { ref, computed } from 'vue'

export const useLayout = () => {
  const layoutConfig = ref({
    ripple: true,
    darkTheme: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    theme: 'sakai',
    colorScheme: 'light',
    menuTheme: 'light'
  })

  const layoutState = ref({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
  })

  const isMobile = ref(false)
  const isDesktop = ref(true)

  const isSidebarActive = computed(() => {
    return layoutState.value.overlayMenuActive || layoutState.value.staticMenuMobileActive
  })

  const isSidebarVisible = computed(() => {
    return !layoutState.value.staticMenuDesktopInactive
  })

  const changeThemeSettings = (theme: string, colorScheme: string) => {
    layoutConfig.value.theme = theme
    layoutConfig.value.colorScheme = colorScheme
  }

  const setScale = (scale: number) => {
    document.documentElement.style.fontSize = scale + 'px'
  }

  const onMenuToggle = () => {
    if (isMobile.value) {
      layoutState.value.staticMenuMobileActive = !layoutState.value.staticMenuMobileActive
    } else {
      layoutState.value.staticMenuDesktopInactive = !layoutState.value.staticMenuDesktopInactive
    }
  }

  const isOverlay = () => {
    return layoutConfig.value.menuMode === 'overlay'
  }

  const isSlim = () => {
    return layoutConfig.value.menuMode === 'slim'
  }

  const isHorizontal = () => {
    return layoutConfig.value.menuMode === 'horizontal'
  }

  const isSlimPlus = () => {
    return layoutConfig.value.menuMode === 'slim-plus'
  }

  const isStatic = () => {
    return layoutConfig.value.menuMode === 'static'
  }

  return {
    layoutConfig,
    layoutState,
    isSidebarActive,
    isSidebarVisible,
    isMobile,
    isDesktop,
    changeThemeSettings,
    setScale,
    onMenuToggle,
    isOverlay,
    isSlim,
    isHorizontal,
    isSlimPlus,
    isStatic
  }
}
