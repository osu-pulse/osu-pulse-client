import type { RouteLocationRaw } from 'vue-router'
import type { Component } from 'vue'

export interface SideMenuItem {
  label: string
  icon: Component
  to: RouteLocationRaw
}
