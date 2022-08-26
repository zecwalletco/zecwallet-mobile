import {getNumberFormatSettings} from 'react-native-localize';

export const NO_CONNECTION: string = 'Could not connect to zcashd';

type ZecAmountSplitType = {
  bigPart: string;
  smallPart: string;
};

export default class Utils {
  static isSapling(addr: string): boolean {
    if (!addr) {
      return false;
    }
    return new RegExp('^z[a-z0-9]{77}$').test(addr) || new RegExp('^ztestsapling[a-z0-9]{76}$').test(addr);
  }

  static isSprout(addr: string): boolean {
    if (!addr) {
      return false;
    }
    return new RegExp('^z[a-zA-Z0-9]{94}$').test(addr);
  }

  static isUnified(addr: string): boolean {
    if (!addr) return false;
    return addr.startsWith('u');
  }

  static isZaddr(addr: string): boolean {
    if (!addr) {
      return false;
    }
    return Utils.isSapling(addr) || Utils.isSprout(addr);
  }

  static isTransparent(addr: string): boolean {
    if (!addr) {
      return false;
    }
    return new RegExp('^t[a-zA-Z0-9]{34}$').test(addr);
  }

  static trimToSmall(addr?: string, numChars?: number): string | undefined {
    const trimSize = numChars || 5;
    if (!addr) {
      return addr;
    }

    return `${addr.slice(0, trimSize)}...${addr.slice(addr.length - trimSize)}`;
  }

  // Convert to max 8 decimal places, and remove trailing zeros
  static maxPrecision(v: number): string {
    return v.toFixed(8);
  }

  static maxPrecisionTrimmed(v: number): string {
    let s = Utils.maxPrecision(v);
    if (!s) {
      return s;
    }

    while (s.indexOf('.') >= 0 && s.substr(s.length - 1, 1) === '0') {
      s = s.substr(0, s.length - 1);
    }

    if (s.substr(s.length - 1) === '.') {
      s = s.substr(0, s.length - 1);
    }

    return s;
  }

  static splitZecAmountIntoBigSmall(zecValue?: number): ZecAmountSplitType {
    if (typeof zecValue === 'undefined') {
      return {bigPart: '--', smallPart: ''};
    }

    let bigPart = Utils.maxPrecision(zecValue);
    let smallPart = '';

    if (bigPart.indexOf('.') >= 0) {
      const decimalPart = bigPart.substr(bigPart.indexOf('.') + 1);
      if (decimalPart.length > 4) {
        smallPart = decimalPart.substr(4);
        bigPart = bigPart.substr(0, bigPart.length - smallPart.length);

        // Pad the small part with trailing 0s
        while (smallPart.length < 4) {
          smallPart += '0';
        }
      }
    }

    // if (smallPart === '0000') {
    //   smallPart = '';
    // }

    return {bigPart, smallPart};
  }

  static splitStringIntoChunks(s: string, numChunks: number): string[] {
    if (!s || numChunks > s.length) {
      return [s];
    }
    if (s.length < 16) {
      return [s];
    }

    const chunkSize = Math.round(s.length / numChunks);
    const chunks = [];
    for (let i = 0; i < numChunks - 1; i++) {
      chunks.push(s.substr(i * chunkSize, chunkSize));
    }
    // Last chunk might contain un-even length
    chunks.push(s.substr((numChunks - 1) * chunkSize));

    return chunks;
  }

  static nextToAddrID: number = 0;

  static getNextToAddrID(): number {
    return Utils.nextToAddrID++;
  }

  static getFallbackDefaultFee(): number {
    return 0.0001;
  }

  static getDonationAddress(testnet: boolean): string {
    if (testnet) {
      return 'ztestsapling1wn6889vznyu42wzmkakl2effhllhpe4azhu696edg2x6me4kfsnmqwpglaxzs7tmqsq7kudemp5';
    } else {
      return 'zs1gv64eu0v2wx7raxqxlmj354y9ycznwaau9kduljzczxztvs4qcl00kn2sjxtejvrxnkucw5xx9u';
    }
  }

  static getDefaultDonationAmount(): number {
    return 0.1;
  }

  static getDefaultDonationMemo(): string {
    return 'Thanks for supporting Zecwallet!';
  }

  static getZecToUsdString(price: number | null, zecValue: number | null): string {
    if (!price || !zecValue) {
      return 'USD --';
    }

    return `USD ${(price * zecValue).toFixed(2)}`;
  }

  static utf16Split(s: string, chunksize: number): string[] {
    const ans = [];

    let current = '';
    let currentLen = 0;
    const a = [...s];
    for (let i = 0; i < a.length; i++) {
      // Each UTF-16 char will take up to 4 bytes when encoded
      const utf8len = a[i].length > 1 ? 4 : 1;

      // Test if adding it will exceed the size
      if (currentLen + utf8len > chunksize) {
        ans.push(current);
        current = '';
        currentLen = 0;
      }

      current += a[i];
      currentLen += utf8len;
    }

    if (currentLen > 0) {
      ans.push(current);
    }

    return ans;
  }

  static parseLocaleFloat(stringNumber: string): number {
    const {decimalSeparator, groupingSeparator} = getNumberFormatSettings();

    return Number(
      stringNumber
        .replace(new RegExp(`\\${groupingSeparator}`, 'g'), '')
        .replace(new RegExp(`\\${decimalSeparator}`), '.'),
    );
  }

  static toLocaleFloat(stringNumber: string): string {
    const {decimalSeparator, groupingSeparator} = getNumberFormatSettings();

    return stringNumber
      .replace(new RegExp(',', 'g'), '_')
      .replace(new RegExp('\\.'), decimalSeparator)
      .replace(new RegExp('_', 'g'), groupingSeparator);
  }

  static getBlockExplorerTxIDURL(txid: string): string {
    return `https://blockchair.com/zcash/transaction/${txid}`;
  }
}
