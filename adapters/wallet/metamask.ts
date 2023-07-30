import { BaseWalletAdapter } from './base';
import { SUPPORTED_WALLETS } from './type';

// define type for browser window object
interface MetaMaskWindow extends Window {
  ethereum: any;
}
declare const window: MetaMaskWindow;

export class MetaMaskAdapter extends BaseWalletAdapter {
  name = SUPPORTED_WALLETS.METAMASK;

  private _wallet: null;

  constructor() {
    super();
    this._wallet = null;
  }

  getWalletName() {
    return this.name;
  }

  async connect() {
    try {
      const wallet = window.ethereum
      const accounts = await wallet.request({
        method: 'eth_requestAccounts',
      });

      this._wallet = wallet;

      return accounts[0];

    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async disconnect() {
    return 'Disconnecting from MetaMask Wallet';
  }
}
