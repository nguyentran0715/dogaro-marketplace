export interface IBaseWalletAdapter {
  name: string
  connect(): Promise<any>;
  disconnect(): Promise<any>;
}

export abstract class BaseWalletAdapter implements IBaseWalletAdapter {
  abstract name:string;
  abstract connect(): Promise<any>;
  abstract disconnect(): Promise<any>;
}
