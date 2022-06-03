export class Disk {
  symbolIds: number[];
  constructor(symbolIds: number[]) {
    this.symbolIds = symbolIds;
  }

  getSymbolIds() {
    return this.symbolIds;
  }

  includes(index: number) {
    return this.symbolIds.includes(index);
  }

  toString() {
    return this.symbolIds.join(" ");
  }
}

const diskArray: Disk[] = [];

const shuffle = (a: any) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

diskArray[0] = new Disk([1, 1, 1, 1, 1, 1, 1, 1, 1]);
diskArray[1] = new Disk([1, 2, 3, 4, 5, 6, 7, 8]);
diskArray[2] = new Disk([1, 9, 10, 11, 12, 13, 14, 15]);
diskArray[3] = new Disk([1, 16, 17, 18, 19, 20, 21, 22]);
diskArray[4] = new Disk([1, 23, 24, 25, 26, 27, 28, 29]);
diskArray[5] = new Disk([1, 30, 31, 32, 33, 34, 35, 36]);
diskArray[6] = new Disk([1, 37, 38, 39, 40, 41, 42, 43]);
diskArray[7] = new Disk([1, 44, 45, 46, 47, 48, 49, 50]);
diskArray[8] = new Disk([1, 51, 52, 53, 54, 55, 56, 57]);
diskArray[9] = new Disk([2, 9, 16, 23, 30, 37, 44, 51]);
diskArray[10] = new Disk([2, 10, 17, 24, 31, 38, 45, 52]);
diskArray[11] = new Disk([2, 11, 18, 25, 32, 39, 46, 53]);
diskArray[12] = new Disk([2, 12, 19, 26, 33, 40, 47, 54]);
diskArray[13] = new Disk([2, 13, 20, 27, 34, 41, 48, 55]);
diskArray[14] = new Disk([2, 14, 21, 28, 35, 42, 49, 56]);
diskArray[15] = new Disk([2, 15, 22, 29, 36, 43, 50, 57]);
diskArray[16] = new Disk([3, 9, 17, 25, 33, 41, 49, 57]);
diskArray[17] = new Disk([3, 10, 18, 26, 34, 42, 50, 51]);
diskArray[18] = new Disk([3, 11, 19, 27, 35, 43, 44, 52]);
diskArray[19] = new Disk([3, 12, 20, 28, 36, 37, 45, 53]);
diskArray[20] = new Disk([3, 13, 21, 29, 30, 38, 46, 54]);
diskArray[21] = new Disk([3, 14, 22, 23, 31, 39, 47, 55]);
diskArray[22] = new Disk([3, 15, 16, 24, 32, 40, 48, 56]);
diskArray[23] = new Disk([4, 9, 18, 27, 36, 38, 47, 56]);
diskArray[24] = new Disk([4, 10, 19, 28, 30, 39, 48, 57]);
diskArray[25] = new Disk([4, 11, 20, 29, 31, 40, 49, 51]);
diskArray[26] = new Disk([4, 12, 21, 23, 32, 41, 50, 52]);
diskArray[27] = new Disk([4, 13, 22, 24, 33, 42, 44, 53]);
diskArray[28] = new Disk([4, 14, 16, 25, 34, 43, 45, 54]);
diskArray[29] = new Disk([4, 15, 17, 26, 35, 37, 46, 55]);
diskArray[30] = new Disk([5, 9, 19, 29, 32, 42, 45, 55]);
diskArray[31] = new Disk([5, 10, 20, 23, 33, 43, 46, 56]);
diskArray[32] = new Disk([5, 11, 21, 24, 34, 37, 47, 57]);
diskArray[33] = new Disk([5, 12, 22, 25, 35, 38, 48, 51]);
diskArray[34] = new Disk([5, 13, 16, 26, 36, 39, 49, 52]);
diskArray[35] = new Disk([5, 14, 17, 27, 30, 40, 50, 53]);
diskArray[36] = new Disk([5, 15, 18, 28, 31, 41, 44, 54]);
diskArray[37] = new Disk([6, 9, 20, 24, 35, 39, 50, 54]);
diskArray[38] = new Disk([6, 10, 21, 25, 36, 40, 44, 55]);
diskArray[39] = new Disk([6, 11, 22, 26, 30, 41, 45, 56]);
diskArray[40] = new Disk([6, 12, 16, 27, 31, 42, 46, 57]);
diskArray[41] = new Disk([6, 13, 17, 28, 32, 43, 47, 51]);
diskArray[42] = new Disk([6, 14, 18, 29, 33, 37, 48, 52]);
diskArray[43] = new Disk([6, 15, 19, 23, 34, 38, 49, 53]);
diskArray[44] = new Disk([7, 9, 21, 26, 31, 43, 48, 53]);
diskArray[45] = new Disk([7, 10, 22, 27, 32, 37, 49, 54]);
diskArray[46] = new Disk([7, 11, 16, 28, 33, 38, 50, 55]);
diskArray[47] = new Disk([7, 12, 17, 29, 34, 39, 44, 56]);
diskArray[48] = new Disk([7, 13, 18, 23, 35, 40, 45, 57]);
diskArray[49] = new Disk([7, 14, 19, 24, 36, 41, 46, 51]);
diskArray[50] = new Disk([7, 15, 20, 25, 30, 42, 47, 52]);
diskArray[51] = new Disk([8, 9, 22, 28, 34, 40, 46, 52]);
diskArray[52] = new Disk([8, 10, 16, 29, 35, 41, 47, 53]);
diskArray[53] = new Disk([8, 11, 17, 23, 36, 42, 48, 54]);
diskArray[54] = new Disk([8, 12, 18, 24, 30, 43, 49, 55]);
diskArray[55] = new Disk([8, 13, 19, 25, 31, 37, 50, 56]);
diskArray[56] = new Disk([8, 14, 20, 26, 32, 38, 44, 57]);
diskArray[57] = new Disk([8, 15, 21, 27, 33, 39, 45, 51]);

diskArray.shift();

export const getDiskArray = () => {
  const diskArrayCopy: Disk[] = diskArray.map(
    (disk) => new Disk(shuffle(disk.getSymbolIds()))
  );

  return shuffle(diskArrayCopy);
};
