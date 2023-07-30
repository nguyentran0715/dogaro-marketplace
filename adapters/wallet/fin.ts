import { SUPPORTED_WALLETS } from './type';
import { BaseWalletAdapter } from './base';

// define type for browser window object
interface FinWindow extends Window {
  fin: any;
}
declare const window: FinWindow;

export class FinAdapter extends BaseWalletAdapter {
  name = SUPPORTED_WALLETS.FIN;

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
      if (!window.fin) throw new Error('Please install Fin Wallet');
      // TODO: check connect by chain

      const chainId = 'atlantic-2';

      const wallet = window.fin;

      await wallet.enable(chainId);

      const offlineSigner = wallet.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const accountAddress = accounts[0]?.address

      this._wallet = wallet;

      return accountAddress;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async disconnect() {
    const wallet = this._wallet;

    if (wallet) {
      wallet.disconnect();
    }
  }
}
