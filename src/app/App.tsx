import { useLayoutEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { content } from '@/content/loader';
import { applyTheme } from '@/themes/applyTheme';

export function App() {
  useLayoutEffect(() => applyTheme(content.theme), []);
  return <RouterProvider router={router} />;
}
