import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Providers } from './app/providers';
import { router } from './app/router';
import logo from '@/assets/text/open-ev-data.txt?raw';
import introduction from '@/assets/text/introduction.txt?raw';
import '@/shared/styles/global.css';

console.log(`${logo}\n${introduction}`);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>
);
