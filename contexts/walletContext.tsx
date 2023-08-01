'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import useWalletStore from '@/stores/wallet';

import {
  SUPPORTED_WALLETS,
  BaseWalletAdapter,
} from '@/adapters/wallet';
import { Chain } from '@/utils/constants';

interface WalletContextValue {
  chain: Chain;
  adapter: any;
  isConnected: boolean;
  onSelectWallet: (walletName: SUPPORTED_WALLETS) => void;
  onDisconnect: () => void;
  onSelectChain: (chainIdHex: Chain) => void
}

interface WalletProviderProps {
  children: React.ReactNode;
}

const WalletContext = createContext({} as WalletContextValue);

export const WalletProvider = ({ children }: WalletProviderProps) => {
  // Custom hooks
  const { toast } = useToast();
  const { setActiveAddress, setProvider } = useWalletStore();

  // States
  const [walletName, setWalletName] = useState<SUPPORTED_WALLETS | null>();
  const [chain, setChain] = useState(Chain.BNB);
  const [isConnected, setIsConnected] = useState(false);

  const adapter = useMemo(() => {
    if (!walletName) return null;

    return new BaseWalletAdapter(walletName);
  }, [walletName]);

  // Auto connect wallet when wallet name change
  useEffect(() => {
    if (walletName) {
      onConnect(chain);
    }
  }, [walletName]);

  // Auto switch chain after wallet is connected
  useEffect(() => {
    if (isConnected) {
      onSwitchNetwork(chain);
    }
  }, [chain])

  const onSelectWallet = (walletName: SUPPORTED_WALLETS) => setWalletName(walletName)

  const onConnect = async (chainIdHex: Chain) => {
    if (!adapter) return;

    try {
      const activeAddress = await adapter.connect(chainIdHex);
      setIsConnected(true);
      setActiveAddress(activeAddress);
      setProvider(adapter.wallet.getWalletName());
    } catch (err: any) {
      onShowError(
        err.message
          ? err.message
          : `Please connect to ${adapter.wallet.getWalletName()}`
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
      setIsConnected(false);
    } catch (err) {
      onShowError('Disconnect waller error');
    }
  };

  const onSwitchNetwork = async (chainIdHex: Chain) => {
    if (!adapter) return;

    try {
      await adapter.switchNetwork(chainIdHex);
    } catch (err) {
      console.log(err);
    }
  }

  const onShowError = (message: string) => {
    toast({
      title: message,
      variant: 'destructive',
    });
  };

  const onSelectChain = async (chainIdHex: Chain) => setChain(chainIdHex);

  return (
    <WalletContext.Provider
      value={{
        // variables
        chain,
        adapter,
        isConnected,

        // functions
        onSelectWallet,
        onDisconnect,
        onSelectChain
      }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
