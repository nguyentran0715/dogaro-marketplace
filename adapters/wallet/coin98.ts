import { SUPPORTED_WALLETS } from './type';
import { BaseWalletAdapter } from './base';

// define type for browser window object
interface Coin98Window extends Window {
  coin98: any;
}
declare const window: Coin98Window;

export class Coin98Adapter extends BaseWalletAdapter {
  name = SUPPORTED_WALLETS.COIN98;

  private _wallet: any;

  constructor() {
    super();
    this._wallet = null;
  }

  getWalletName() {
    return this.name;
  }

  async connect() {
    try {
      if (!window.coin98) throw new Error('Please install Coin98 Wallet');
      // TODO: check connect by chain

      // Case EVM chains
      const wallet = window.coin98
      const accounts = await wallet.provider.request({
        method: 'eth_requestAccounts',
      });

      this._wallet = wallet;

      return accounts[0];

    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async disconnect() {
    const wallet = this._wallet;

    if (wallet) {
      wallet.provider.disconnect();
    }
  }
}
