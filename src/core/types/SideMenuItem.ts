import type { Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface SideMenuItem {
  label: string;
  icon: Component;
  to: RouteLocationRaw;
}
