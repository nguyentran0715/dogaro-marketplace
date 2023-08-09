'use client';

import { SUPPORTED_WALLETS } from '@/adapters/wallet';
import { Chain, SUPPORTED_CHAINS } from '@/utils/constants';
import { useWalletContext } from '@/contexts/walletContext';
import Web3 from 'web3';

import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useWalletStore from '@/stores/wallet';
import { useEffect } from 'react';
import { erc721 } from '@/config/abi/erc721';

const chains = Object.keys(SUPPORTED_CHAINS) as Chain[];
const supportedWallets = [
  {
    name: 'Coin98',
    id: SUPPORTED_WALLETS.COIN98,
    chains: [Chain.BNB, Chain.ETH, Chain.MUMBAI],
  },
  // {
  //   name: 'Fin',
  //   id: SUPPORTED_WALLETS.FIN,
  //   chains: [Chain.SEI],
  // },
];

const CONTRACT_ADDRESS = '0xAF183eE56485371B045f68B299e7C93d0C991C0E';
const web3 = new Web3((window as any).coin98.provider);
const contract = new web3.eth.Contract(erc721, CONTRACT_ADDRESS) as any;

export default function Test() {
  // Custom hooks
  const { activeAddress, provider } = useWalletStore();
  const { onSelectWallet, onDisconnect, chain, onSelectChain, isConnected } =
    useWalletContext();

  useEffect(() => {
    if (activeAddress) {
      const testWeb3 = async () => {
        const totalSupply = await contract.methods.totalSupply().call();
        const tokenURI = await contract.methods.tokenURI(0).call();

        console.log({ totalSupply, tokenURI });
      };

      testWeb3();
    }
  }, [activeAddress]);

  const testMint = async () => {
    const mint = await contract.methods
      .mintTo(
        activeAddress,
        'ipfs://QmRq3Ky5rWpBaJ2gKCVV6DxTF1zmwEoiPC5WMZESr5QSru/0'
      )
      .encodeABI();

    const hash = await (window as any).coin98.provider.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: activeAddress,
          to: CONTRACT_ADDRESS,
          data: mint,
        },
      ],
    });
    console.log('testMint ~ hash: ', hash);
  };

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
          <Button onClick={testMint}>Mint</Button>
        )}
      </div>
    </div>
  );
}
