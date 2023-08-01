'use client';

import { SUPPORTED_WALLETS } from '@/adapters/wallet';
import { Chain, SUPPORTED_CHAINS } from '@/utils/constants';
import { useWalletContext } from '@/contexts/walletContext';

import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useWalletStore from '@/stores/wallet';

const chains = Object.keys(SUPPORTED_CHAINS) as Chain[];
const supportedWallets = [
  {
    name: 'Coin98',
    id: SUPPORTED_WALLETS.COIN98,
    chains: [Chain.BNB, Chain.ETH],
  },
  // {
  //   name: 'Fin',
  //   id: SUPPORTED_WALLETS.FIN,
  //   chains: [Chain.SEI],
  // },
];

export default function Test() {
  // Custom hooks
  const { activeAddress, provider } = useWalletStore();
  const { onSelectWallet, onDisconnect, chain, onSelectChain, isConnected } =
    useWalletContext();

  // Variables
  const walletsByChain = supportedWallets.filter(wallet =>
    wallet.chains.includes(chain)
  );

  // Handlers
  const handleSelectWallet = (walletName: SUPPORTED_WALLETS) => {
    onSelectWallet(walletName);
  };

  return (
    <div className='p-10'>
      <div className='mb-8'>
        <Select value={chain} onValueChange={onSelectChain}>
          <SelectTrigger className='w-[180px] uppercase'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {chains.map(chain => {
              const chainData = SUPPORTED_CHAINS[chain];

              return (
                <SelectItem
                  key={chainData.chainIdHex}
                  value={chainData.chainIdHex}
                  className='uppercase'>
                  {chainData.symbol}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {isConnected && (
        <div className='mb-8'>
          <div>Active wallet: {activeAddress}</div>
          <div>Provider: {provider}</div>
        </div>
      )}

      <div className='flex gap-4'>
        {!isConnected ? (
          walletsByChain.map(wallet => (
            <Button
              key={wallet.name}
              onClick={() => handleSelectWallet(wallet.id)}>
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
