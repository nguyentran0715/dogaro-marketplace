import { IAbstractWalletAdapter } from "./abstract";

export enum SUPPORTED_WALLETS {
  // METAMASK = 'MetaMask',
  COIN98 = 'coin98',
  FIN = 'fin'
}

export type WalletAdapter = IAbstractWalletAdapter