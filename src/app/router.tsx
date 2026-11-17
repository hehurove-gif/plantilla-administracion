import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ContentPage } from '@/pages/ContentPage';
import { NotFound } from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <ContentPage /> },
      { path: '/404', element: <NotFound /> },
      { path: '/:slug', element: <ContentPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
