import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp } from 'antd';

import { MainLayout } from '@/components/layouts/MainLayout';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { HomePage } from '@/pages/HomePage';
import { UsersPage } from '@/pages/UsersPage';
import { TokensPage } from '@/pages/TokensPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { MinersPage } from '@/pages/MinersPage';
import { ExplorerPage } from '@/pages/ExplorerPage';
import { SystemPage } from '@/pages/SystemPage';
import { useSystemStore } from '@/stores';
import { ROUTES } from '@/config/constants';

// 创建Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30秒内数据被认为是新鲜的
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const { isLoading, checkSystemHealth } = useSystemStore();

  useEffect(() => {
    checkSystemHealth();
  }, [checkSystemHealth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.USERS} element={<UsersPage />} />
          <Route path={ROUTES.TOKENS} element={<TokensPage />} />
          <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
          <Route path={ROUTES.MINERS} element={<MinersPage />} />
          <Route path={ROUTES.EXPLORER} element={<ExplorerPage />} />
          <Route path={ROUTES.SYSTEM} element={<SystemPage />} />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AntApp>
        <AppContent />
      </AntApp>
    </QueryClientProvider>
  );
};

export default App;
