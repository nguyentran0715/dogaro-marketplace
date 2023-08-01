import { Chain } from "@/utils/constants";
export abstract class AbstractWalletAdapter {
  abstract name: string;
  abstract connect(chainIdHex: Chain): Promise<any>;
  abstract disconnect(): Promise<any>;
}
