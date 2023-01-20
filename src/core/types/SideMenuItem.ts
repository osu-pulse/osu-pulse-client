import type {Component} from 'vue';
import {RouteLocationRaw} from 'vue-router';

export interface SideMenuItem {
  label: string;
  icon: Component;
  to: RouteLocationRaw;
}
