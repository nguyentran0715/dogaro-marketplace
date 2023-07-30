import { IBaseWalletAdapter } from "./base";

export enum SUPPORTED_WALLETS {
  METAMASK = 'MetaMask',
  COIN98 = 'Coin98',
  FIN = 'Fin'
}

export type WalletAdapter = IBaseWalletAdapter