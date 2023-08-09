import { Chain, SUPPORTED_CHAINS } from '@/utils/constants';

// types
import { SUPPORTED_WALLETS } from './type';

// adapters
import { Coin98Adapter } from './coin98';

export class BaseWalletAdapter {
  private _walletName: SUPPORTED_WALLETS;
  wallet: any;

  constructor(walletName: SUPPORTED_WALLETS) {
    this._walletName = walletName;
    this.wallet = null;
  }

  async connect(chainIdHex: Chain) {
    try {
      const walletName = this._walletName;
      const wallet = this._getWalletProvider(walletName);

      if (!wallet) throw new Error('Connect Error');

      const response = await wallet.connect(chainIdHex);

      this.wallet = wallet;

      return response;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  _getWalletProvider(walletName: SUPPORTED_WALLETS) {
    switch (walletName) {
      case SUPPORTED_WALLETS.COIN98:
        return new Coin98Adapter();

      default:
        return null;
    }
  }

  async disconnect() {
    try {
      const response = await this.wallet.disconnect();
      return response;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async switchNetwork(chainIdHex: Chain) {
    try {
      await this.wallet.switchNetwork(chainIdHex);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  private _getChainKind(chainIdHex: Chain) {
    const chainData = SUPPORTED_CHAINS[chainIdHex];
    return chainData.kind;
  }
}
