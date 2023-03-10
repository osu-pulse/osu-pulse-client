import type { RouteLocationRaw } from 'vue-router'

export interface SideMenuItem {
  label: string
  icon: string
  to: RouteLocationRaw
}
