'use client';

import { SUPPORTED_WALLETS } from '@/adapters/wallet';
import { useWalletContext } from '@/contexts/walletContext';

import { Button } from '@/components/ui/Button';
import useWalletStore from '@/stores/wallet';

export default function Test() {
  const { activeAddress, provider } = useWalletStore();
  const { wallets, onSelectWallet, onDisconnect } = useWalletContext();

  const isConnected = activeAddress && provider;

  const handleSelectWallet = (walletName: SUPPORTED_WALLETS) => {
    onSelectWallet(walletName);
  };

  return (
    <div className='p-10'>
      {isConnected && (
        <div className='mb-8'>
          <div>Active wallet: {activeAddress}</div>
          <div>Provider: {provider}</div>
        </div>
      )}

      <div className='flex gap-4'>
        {!isConnected ? (
          wallets.map(wallet => (
            <Button
              key={wallet.name}
              onClick={() => handleSelectWallet(wallet.name)}>
              Connect {wallet.name}
            </Button>
          ))
        ) : (
          <Button onClick={onDisconnect}>Disconnect</Button>
        )}
      </div>
    </div>
  );
}
