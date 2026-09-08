import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FocusStyleManager } from '@blueprintjs/core';
// Vendor CSS (bootstrap-icons, Blueprint) is imported inside theme.css so it can
// be placed in a lower cascade layer than Tailwind's utilities.
import './styles/theme.css';
import { queryClient } from './lib/queryClient';

// Only show focus outlines during keyboard navigation, not on mouse click.
FocusStyleManager.onlyShowFocusOnTabs();
import { AuthProvider } from './auth/AuthContext';
import { ThemeProvider } from './theme/ThemeContext';
import router from './router';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>
);
