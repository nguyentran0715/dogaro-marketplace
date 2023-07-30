import { ReactNode } from 'react';

import { WalletProvider } from '@/contexts/walletContext';
import { Toaster } from './ui/toaster';

interface Providers {
  children: ReactNode;
}

const Providers = ({ children }: Providers) => {
  return (
    <WalletProvider>
      {children}
      <Toaster />
    </WalletProvider>
  );
};

export default Providers;
