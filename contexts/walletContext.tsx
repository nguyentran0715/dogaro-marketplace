'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import useWalletStore from '@/stores/wallet';

import {
  MetaMaskAdapter,
  Coin98Adapter,
  FinAdapter,
  SUPPORTED_WALLETS,
} from '@/adapters/wallet';

interface WalletContextValue {
  adapter: any;
  wallets: any[];
  onSelectWallet: (walletName: SUPPORTED_WALLETS) => void;
  onDisconnect: () => void;
}

interface WalletProviderProps {
  children: React.ReactNode;
}

const WalletContext = createContext({} as WalletContextValue);

const wallets = [new MetaMaskAdapter(), new Coin98Adapter(), new FinAdapter()];

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { toast } = useToast();
  const { setActiveAddress, setProvider } = useWalletStore();

  const [walletName, setWalletName] = useState<SUPPORTED_WALLETS | null>();

  const adapter = useMemo(() => {
    return wallets.find(adapt => adapt.name === walletName);
  }, [walletName]);

  // Auto connect wallet when wallet name change
  useEffect(() => {
    if (walletName) {
      onConnect();
    }
  }, [walletName]);

  const onSelectWallet = (walletName: SUPPORTED_WALLETS) => {
    setWalletName(walletName);
  };

  const onConnect = async () => {
    if (!adapter) return;

    try {
      const activeAddress = await adapter.connect();
      setActiveAddress(activeAddress);
      setProvider(adapter.getWalletName());
    } catch (err: any) {
      onShowError(
        err.message
          ? err.message
          : `Please connect to ${adapter.getWalletName()}`
      );
    }
  };

  const onDisconnect = async () => {
    if (!adapter) return;

    try {
      adapter.disconnect();
      setWalletName(null);
      setProvider('');
      setActiveAddress('');
    } catch (err) {
      onShowError('Disconnect waller error');
    }
  };

  const onShowError = (message: string) => {
    toast({
      title: message,
      variant: 'destructive',
    });
  };

  return (
    <WalletContext.Provider
      value={{
        // variables
        adapter,
        wallets,

        // functions
        onSelectWallet,
        onDisconnect,
      }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
