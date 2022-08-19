class Memory {
  xlen;
  space; // maximum length in bytes, 2^XLEN
  vcount;
  mrcount;
  regres; // reserve for registers, MRCOUNT*XLEN*VCOUNT
  mempow;
  length; // actual length, (2^MEMPOW)-REGRES
  buffer; // memory data

  constructor(xlen, vcount, mrcount, mempow) {
    this.xlen = xlen;
    this.vcount = vcount;
    this.mrcount = mrcount;
    this.mempow = mempow;
    this.space = 2 ** this.xlen;
    this.regres = this.mrcount * this.xlen * this.vcount;
    this.length = (2 ** this.mempow) - this.regres;
    const wasmMemoryPageSize = 65536;
    const pages = Math.ceil(this.length / wasmMemoryPageSize);
    const wasmMemory = new WebAssembly.Memory({ initial: pages, maximum: pages, shared: false });
    this.buffer = wasmMemory.buffer;
  }

  setByte(address, byte) {
    const u8arr = new Uint8Array(this.buffer);
    u8arr[this.computeAddress(address)] = byte;
  }

  getByte(address) {
    const u8arr = new Uint8Array(this.buffer);
    const byte = u8arr[this.computeAddress(address)];
    if (byte === undefined) {
      throw Error('byte === undefined');
    }
    else {
      return byte;
    }
  }

  computeAddress(address) {
    return address % this.length;
  }
}

module.exports = {
  Memory
}
