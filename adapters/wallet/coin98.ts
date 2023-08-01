import { SUPPORTED_WALLETS } from './type';
import { AbstractWalletAdapter } from './abstract';
import { Chain } from '@/utils/constants';

// define type for browser window object
interface Coin98Window extends Window {
  coin98: any;
}
declare const window: Coin98Window;

const isClient = typeof window !== undefined;

export class Coin98Adapter extends AbstractWalletAdapter {
  name = SUPPORTED_WALLETS.COIN98;

  private _wallet: any;

  constructor() {
    super();
    this._wallet = isClient ? window.coin98 : null;
  }

  getWalletName() {
    return this.name;
  }

  async connect(chainIdHex: Chain) {
    try {
      if (!window.coin98) throw new Error('Please install Coin98 Wallet');

      // Current case is EVM
      // TODO: Check case for other chains

      const wallet = this._wallet;

      const currentNetwork = await this.getCurrentNetwork();

      if (currentNetwork !== chainIdHex) {
        await this.switchNetwork(chainIdHex);
      }

      const accounts = await wallet.provider.request({
        method: 'eth_requestAccounts',
      });

      return accounts[0];
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async disconnect() {
    const wallet = this._wallet;

    if (wallet) {
      wallet.provider.disconnect();
    }
  }

  async switchNetwork(chainIdHex: string) {
    const wallet = this._wallet;

    try {
      await wallet.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getCurrentNetwork() {
    const wallet = this._wallet;
    const chainId = await wallet.provider.request({ method: 'eth_chainId' });

    return chainId;
  }
}
