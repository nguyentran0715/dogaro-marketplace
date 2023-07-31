export interface IAbstractWalletAdapter {
  name: string;
  connect(): Promise<any>;
  disconnect(): Promise<any>;
}

export abstract class AbstractWalletAdapter implements IAbstractWalletAdapter {
  abstract name: string;
  abstract connect(): Promise<any>;
  abstract disconnect(): Promise<any>;
}
