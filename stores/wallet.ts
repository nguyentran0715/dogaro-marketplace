import { create } from 'zustand';

interface WalletState {
  activeAddress: string;
  provider: string;

  // setters
  setActiveAddress: (address: string) => void;
  setProvider: (provider: string) => void;
}

const useWalletStore = create<WalletState>((set) => ({
  activeAddress: '',
  provider: '',

  // setters
  setActiveAddress: (address) => set({activeAddress: address}),
  setProvider: (address) => set({provider: address})
}));


export default useWalletStore;