import { lazy } from 'react';

export const lazyComponents = {
  Dashboard: lazy(() => import('./components/Dashboard')),
  TeamPlanner: lazy(() => import('./components/TeamPlanner')),
  FreightForms: lazy(() => import('./components/FreightForms')),
  APITester: lazy(() => import('./components/APITester')),
  LudicrousMode: lazy(() => import('./components/LudicrousMode')),
};
