export class SymbolTable {
  hash: { [key: string]: number };

  constructor() {
    this.hash = {};
  }

  getAddress(symbol: string): number {
    return this.hash[symbol];
  }

  addEntry(symbol: string, address: number): void {
    this.hash[symbol] = address;
  }

  contains(symbol: string): boolean {
    return symbol in this.hash;
  }
}
