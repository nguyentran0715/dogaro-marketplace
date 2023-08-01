export enum Chain {
  BNB = '0x38',
  ETH = '0x1',
  // SEI = 'sei'
}

export enum ChainKind {
  EVM = 'evm',
  COSMWASM = 'cosmwasm'
}

type ChainType = {
  name: string;
  symbol: string;
  chainId: number;
  chainIdHex: string;
  kind: ChainKind;
};

export const SUPPORTED_CHAINS: {[key in Chain]: ChainType} = {
  [Chain.BNB]: {
    name: 'BNB Smart Chain',
    symbol: 'bsc',
    chainId: 56,
    chainIdHex: '0x38',
    kind: ChainKind.EVM
  },
  [Chain.ETH]: {
    name: 'Ethereum',
    symbol: 'eth',
    chainId: 1,
    chainIdHex: '0x1',
    kind: ChainKind.EVM
  },
  // [Chain.SEI]: {
  //   name: 'Sei',
  //   symbol: 'SEI',
  //   chainId: 1000,
  //   chainIdHex: 'sei',
  //   kind: ChainKind.COSMWASM
  // },
}