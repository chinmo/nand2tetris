const DEST_TABLE: { [key: string]: string } = {
  "": "000",
  M: "001",
  D: "010",
  MD: "011",
  A: "100",
  AM: "101",
  AD: "110",
  AMD: "111",
};

export function dest(mnemonic: string): string {
  return DEST_TABLE[mnemonic];
}
