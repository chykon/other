var Regs;
(function (Regs) {
  Regs[Regs["x0"] = 0] = "x0";
  Regs[Regs["x1"] = 1] = "x1";
  Regs[Regs["x2"] = 2] = "x2";
  Regs[Regs["x3"] = 3] = "x3";
  Regs[Regs["x4"] = 4] = "x4";
  Regs[Regs["x5"] = 5] = "x5";
  Regs[Regs["x6"] = 6] = "x6";
  Regs[Regs["x7"] = 7] = "x7";
  Regs[Regs["x8"] = 8] = "x8";
  Regs[Regs["x9"] = 9] = "x9";
  Regs[Regs["x10"] = 10] = "x10";
  Regs[Regs["x11"] = 11] = "x11";
  Regs[Regs["x12"] = 12] = "x12";
  Regs[Regs["x13"] = 13] = "x13";
  Regs[Regs["x14"] = 14] = "x14";
  Regs[Regs["x15"] = 15] = "x15";
  Regs[Regs["x16"] = 16] = "x16";
  Regs[Regs["x17"] = 17] = "x17";
  Regs[Regs["x18"] = 18] = "x18";
  Regs[Regs["x19"] = 19] = "x19";
  Regs[Regs["x20"] = 20] = "x20";
  Regs[Regs["x21"] = 21] = "x21";
  Regs[Regs["x22"] = 22] = "x22";
  Regs[Regs["x23"] = 23] = "x23";
  Regs[Regs["x24"] = 24] = "x24";
  Regs[Regs["x25"] = 25] = "x25";
  Regs[Regs["x26"] = 26] = "x26";
  Regs[Regs["x27"] = 27] = "x27";
  Regs[Regs["x28"] = 28] = "x28";
  Regs[Regs["x29"] = 29] = "x29";
  Regs[Regs["x30"] = 30] = "x30";
  Regs[Regs["x31"] = 31] = "x31";
  Regs[Regs["pc"] = 32] = "pc";
  Regs[Regs["ppc"] = 33] = "ppc"; // previous pc
})(Regs || (Regs = {}));

var Opcode;
(function (Opcode) {
  Opcode[Opcode["LOAD"] = 3] = "LOAD";
  Opcode[Opcode["STORE"] = 35] = "STORE";
  Opcode[Opcode["MADD"] = 67] = "MADD";
  Opcode[Opcode["BRANCH"] = 99] = "BRANCH";
  Opcode[Opcode["LOAD_FP"] = 7] = "LOAD_FP";
  Opcode[Opcode["STORE_FP"] = 39] = "STORE_FP";
  Opcode[Opcode["MSUB"] = 71] = "MSUB";
  Opcode[Opcode["JALR"] = 103] = "JALR";
  // custom-0: 0b00_010_11
  // custom-1: 0b01_010_11
  Opcode[Opcode["NMSUB"] = 75] = "NMSUB";
  // reserved: 0b11_010_11
  Opcode[Opcode["MISC_MEM"] = 15] = "MISC_MEM";
  Opcode[Opcode["AMO"] = 47] = "AMO";
  Opcode[Opcode["NMADD"] = 79] = "NMADD";
  Opcode[Opcode["JAL"] = 111] = "JAL";
  Opcode[Opcode["OP_IMM"] = 19] = "OP_IMM";
  Opcode[Opcode["OP"] = 51] = "OP";
  Opcode[Opcode["OP_FP"] = 83] = "OP_FP";
  Opcode[Opcode["SYSTEM"] = 115] = "SYSTEM";
  Opcode[Opcode["AUIPC"] = 23] = "AUIPC";
  Opcode[Opcode["LUI"] = 55] = "LUI";
  // reserved: 0b10_101_11
  // reserved: 0b11_101_11
  Opcode[Opcode["OP_IMM_32"] = 27] = "OP_IMM_32";
  Opcode[Opcode["OP_32"] = 59] = "OP_32";
  // custom-2/rv128: 0b10_110_11
  // custom-3/rv128: 0b11_110_11
  // inst[4:2] = 111 (> 32b)
  // inst[6:5] = 00 (48b)
  // inst[6:5] = 01 (64b)
  // inst[6:5] = 10 (48b)
  // inst[6:5] = 11 (>= 80b)
})(Opcode || (Opcode = {}));

class Vcore {
  mem;
  vnum;
  ialign;
  ialignByte; // IALIGN/8
  ilen;
  ilenByte; // ILEN/8

  constructor(mem, vnum, ialign, ilen) {
    this.mem = mem;
    this.vnum = vnum;
    this.ialign = ialign;
    this.ilen = ilen;
    this.ialignByte = this.ialign / 8;
    this.ilenByte = this.ilen / 8;
  }

  // Register value //
  setRegisterValue(regnum, value, counter = false) {
    if (!counter && ((regnum === Regs.pc) || (regnum === Regs.ppc))) {
      throw Error('set-access to counters');
    }
    else if (regnum === Regs.x0) {
      return;
    }
    const i32arr = new Int32Array(this.mem.buffer);
    const regOffset = this.mem.mrcount * this.vnum;
    i32arr[(i32arr.length - 1) - (regOffset + regnum)] = value;
  }

  getRegisterValue(regnum, counter = false) {
    if (!counter && ((regnum === Regs.pc) || (regnum === Regs.ppc))) {
      throw Error('get-access to counters');
    }
    else if (regnum === Regs.x0) {
      return 0;
    }
    const i32arr = new Int32Array(this.mem.buffer);
    const regOffset = this.mem.mrcount * this.vnum;
    const value = i32arr[(i32arr.length - 1) - (regOffset + regnum)];
    if (value === undefined) {
      throw Error('value === undefined');
    }
    return value;
  }

  // Fetcher //
  fetchInstruction(intermediate) {
    if (intermediate === undefined) {
      intermediate = []
    }
    const pcValue = this.getRegisterValue(Regs.pc, true);
    const ppcValue = this.getRegisterValue(Regs.ppc, true);
    if ((pcValue % 4) !== 0) {
      this.throwInstructionAddressMisalignedException(pcValue, ppcValue);
      return;
    }
    this.setRegisterValue(Regs.ppc, this.getRegisterValue(Regs.pc, true), true);
    const byte1 = (this.mem.getByte(this.getRegisterValue(Regs.pc, true)) * (2 ** 0)) >>> 0;
    this.setRegisterValue(Regs.pc, this.getRegisterValue(Regs.pc, true) + 1, true);
    const byte2 = (this.mem.getByte(this.getRegisterValue(Regs.pc, true)) * (2 ** 8)) >>> 0;
    this.setRegisterValue(Regs.pc, this.getRegisterValue(Regs.pc, true) + 1, true);
    const byte3 = (this.mem.getByte(this.getRegisterValue(Regs.pc, true)) * (2 ** 16)) >>> 0;
    this.setRegisterValue(Regs.pc, this.getRegisterValue(Regs.pc, true) + 1, true);
    const byte4 = (this.mem.getByte(this.getRegisterValue(Regs.pc, true)) * (2 ** 24)) >>> 0;
    this.setRegisterValue(Regs.pc, this.getRegisterValue(Regs.pc, true) + 1, true);
    const instruction = (0 | byte1 | byte2 | byte3 | byte4) >>> 0;
    const opcode = instruction & 0b00000000000000000000000001111111;
    if (opcode === Opcode.OP_IMM) {
      // Integer Register-Immediate Instructions
      const rd = (instruction >>> 7) & 0b11111;
      const rs1 = (instruction >>> 15) & 0b11111;
      const funct3 = (instruction >>> 12) & 0b111;
      if (funct3 === 0b000) {
        // ADDI; NOP (ADDI x0, x0, 0)
        // rd = rs1 = rs1 + imm
        const immValue = this.iimmToValue(instruction) >> 0;
        this.setRegisterValue(rs1, this.getRegisterValue(rs1) + immValue);
        this.setRegisterValue(rd, this.getRegisterValue(rs1));
        intermediate.push('ADDI')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b010) {
        // SLTI
        // if (rs1 < imm) {rd = 1} else {rd = 0}
        const immValue = this.iimmToValue(instruction) >> 0;
        let result = 0;
        if (this.getRegisterValue(rs1) < immValue) {
          result = 1;
        }
        else {
          result = 0;
        }
        this.setRegisterValue(rd, result);
        intermediate.push('SLTI')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b011) {
        // SLTIU
        // if ((rs1>>>0) < (imm>>>0)) {rd = 1} else {rd = 0}
        const immValue = this.iimmToValue(instruction);
        let result = 0;
        if ((this.getRegisterValue(rs1) >>> 0) < (immValue >>> 0)) {
          result = 1;
        }
        else {
          result = 0;
        }
        this.setRegisterValue(rd, result);
        intermediate.push('SLTIU')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b111) {
        // ANDI
        // rd = rs1 AND imm
        const immValue = this.iimmToValue(instruction);
        this.setRegisterValue(rd, this.getRegisterValue(rs1) & immValue);
        intermediate.push('ANDI')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b110) {
        // ORI
        // rd = rs1 OR imm
        const immValue = this.iimmToValue(instruction);
        this.setRegisterValue(rd, this.getRegisterValue(rs1) | immValue);
        intermediate.push('ORI')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b100) {
        // XORI
        // rd = rs1 XOR imm
        const immValue = this.iimmToValue(instruction);
        this.setRegisterValue(rd, this.getRegisterValue(rs1) ^ immValue);
        intermediate.push('XORI')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b001) {
        // SLLI
        // rd = rs1 << (imm & 0b11111)
        const immValue = this.iimmToValue(instruction);
        const shamt = immValue & 0b11111;
        this.setRegisterValue(rd, this.getRegisterValue(rs1) * (2 ** shamt));
        intermediate.push('SLLI')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b101) {
        const immValue = this.iimmToValue(instruction);
        const shamt = immValue & 0b11111;
        const shiftType = immValue & 0b010000000000;
        if (shiftType === 0) {
          // SRLI
          // rd = rs1 >>> shamt
          this.setRegisterValue(rd, this.getRegisterValue(rs1) >>> shamt);
          intermediate.push('SRLI')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(immValue)
        }
        else if (shiftType === 0b010000000000) {
          // SRAI
          // rd = rs1 >> shamt
          this.setRegisterValue(rd, this.getRegisterValue(rs1) >> shamt);
          intermediate.push('SRAI')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(immValue)
        }
        else {
          let instructionBinary = (instruction >>> 0).toString(2);
          instructionBinary = instructionBinary.padStart(this.ilen, '0');
          this.throwIllegalInstructionException(instructionBinary);
        }
      }
      else {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
    }
    else if (opcode === Opcode.LUI) {
      // LUI
      // rd = imm & 0b11111111111111111111000000000000
      const rd = (instruction >>> 7) & 0b11111;
      const immValue = this.uimmToValue(instruction) >> 0;
      this.setRegisterValue(rd, immValue);
      intermediate.push('LUI')
      intermediate.push(rd)
      intermediate.push(immValue)
    }
    else if (opcode === Opcode.AUIPC) {
      // AUIPC
      // rd = imm + ppc
      const rd = (instruction >>> 7) & 0b11111;
      const immValue = this.uimmToValue(instruction) >> 0;
      this.setRegisterValue(rd, (immValue + this.getRegisterValue(Regs.ppc, true)));
      intermediate.push('AUIPC')
      intermediate.push(rd)
      intermediate.push(immValue)
    }
    else if (opcode === Opcode.OP) {
      // Integer Register-Register Operations
      const rd = (instruction >>> 7) & 0b11111;
      const rs1 = (instruction >>> 15) & 0b11111;
      const rs2 = (instruction >>> 20) & 0b11111;
      const funct3 = (instruction >>> 12) & 0b111;
      const funct7 = (instruction >>> 25) & 0b1111111;
      if (funct7 === 0) {
        if (funct3 === 0b000) {
          // ADD
          // rd = rs1 + rs2
          const result = this.getRegisterValue(rs1) + this.getRegisterValue(rs2);
          this.setRegisterValue(rd, result);
          intermediate.push('ADD')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else if (funct3 === 0b010) {
          // SLT
          // rd = 1 if (rs1 < rs2) else 0
          let result = 0;
          if (this.getRegisterValue(rs1) < this.getRegisterValue(rs2)) {
            result = 1;
          }
          else {
            result = 0;
          }
          this.setRegisterValue(rd, result);
          intermediate.push('SLT')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else if (funct3 === 0b011) {
          // SLTU
          // rd = 1 if ((rs1>>>0) < (rs2>>>0)) else 0
          let result = 0;
          if ((this.getRegisterValue(rs1) >>> 0) < (this.getRegisterValue(rs2) >>> 0)) {
            result = 1;
          }
          else {
            result = 0;
          }
          this.setRegisterValue(rd, result);
          intermediate.push('SLTU')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else if (funct3 === 0b111) {
          // AND
          // rd = rs1 & rs2
          const result = this.getRegisterValue(rs1) & this.getRegisterValue(rs2);
          this.setRegisterValue(rd, result);
          intermediate.push('AND')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else if (funct3 === 0b110) {
          // OR
          // rd = rs1 | rs2
          const result = this.getRegisterValue(rs1) | this.getRegisterValue(rs2);
          this.setRegisterValue(rd, result);
          intermediate.push('OR')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else if (funct3 === 0b100) {
          // XOR
          // rd = rs1 ^ rs2
          const result = this.getRegisterValue(rs1) ^ this.getRegisterValue(rs2);
          this.setRegisterValue(rd, result);
          intermediate.push('XOR')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else if (funct3 === 0b001) {
          // SLL
          // rd = rs1 << (rs2 & 0b11111)
          const result = this.getRegisterValue(rs1) * (2 ** (this.getRegisterValue(rs2) & 0b11111));
          this.setRegisterValue(rd, result);
          intermediate.push('SLL')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else if (funct3 === 0b101) {
          // SRL
          // rd = rs1 >>> (rs2 & 0b11111)
          const result = this.getRegisterValue(rs1) >>> (this.getRegisterValue(rs2) & 0b11111);
          this.setRegisterValue(rd, result);
          intermediate.push('SRL')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else {
          let instructionBinary = (instruction >>> 0).toString(2);
          instructionBinary = instructionBinary.padStart(this.ilen, '0');
          this.throwIllegalInstructionException(instructionBinary);
        }
      }
      else if (funct7 === 0b0100000) {
        if (funct3 === 0b000) {
          // SUB
          // rd = rs1 - rs2
          const result = this.getRegisterValue(rs1) - this.getRegisterValue(rs2);
          this.setRegisterValue(rd, result);
          intermediate.push('SUB')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else if (funct3 === 0b101) {
          // SRA
          // rd = rs1 >> (rs2 & 0b11111)
          const result = this.getRegisterValue(rs1) >> (this.getRegisterValue(rs2) & 0b11111);
          this.setRegisterValue(rd, result);
          intermediate.push('SRA')
          intermediate.push(rd)
          intermediate.push(rs1)
          intermediate.push(rs2)
        }
        else {
          let instructionBinary = (instruction >>> 0).toString(2);
          instructionBinary = instructionBinary.padStart(this.ilen, '0');
          this.throwIllegalInstructionException(instructionBinary);
        }
      }
      else {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
    }
    else if (opcode === Opcode.JAL) {
      // Control Transfer Instructions
      // Unconditional Jumps
      // JAL
      // rd = pc
      // pc = ppc + imm
      const rd = (instruction >>> 7) & 0b11111;
      const immValue = this.jimmToValue(instruction) >> 0;
      this.setRegisterValue(rd, this.getRegisterValue(Regs.pc, true));
      this.setRegisterValue(Regs.pc, this.getRegisterValue(Regs.ppc, true) + immValue, true);
      intermediate.push('JAL')
      intermediate.push(rd)
      intermediate.push(immValue)
    }
    else if (opcode === Opcode.JALR) {
      // JALR
      // rd = pc
      // pc = ppc + (0b11111111111111111111111111111110 & (rs1 + imm))
      const rd = (instruction >>> 7) & 0b11111;
      const rs1 = (instruction >>> 15) & 0b11111;
      const funct3 = (instruction >>> 12) & 0b111;
      if (funct3 === 0b000) {
        const immValue = this.iimmToValue(instruction) >> 0;
        let result = this.getRegisterValue(rs1) + immValue;
        result &= 0b11111111111111111111111111111110;
        result += this.getRegisterValue(Regs.ppc, true);
        this.setRegisterValue(rd, this.getRegisterValue(Regs.pc, true));
        this.setRegisterValue(Regs.pc, result, true);
        intermediate.push('JALR')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
    }
    else if (opcode === Opcode.BRANCH) {
      // Conditional Branches
      // branch: pc = ppc + imm
      const rs1 = (instruction >>> 15) & 0b11111;
      const rs2 = (instruction >>> 20) & 0b11111;
      const funct3 = (instruction >>> 12) & 0b111;
      const immValue = this.bimmToValue(instruction) >>> 0;
      if (funct3 === 0b000) {
        // BEQ
        // if (rs1 === rs2) {branch}
        if (this.getRegisterValue(rs1) === this.getRegisterValue(rs2)) {
          const adr = this.getRegisterValue(Regs.ppc, true) + immValue;
          this.setRegisterValue(Regs.pc, adr, true);
        }
        intermediate.push('BEQ')
        intermediate.push(rs1)
        intermediate.push(rs2)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b001) {
        // BNE
        // if (rs1 !== rs2) {branch}
        if (this.getRegisterValue(rs1) !== this.getRegisterValue(rs2)) {
          const adr = this.getRegisterValue(Regs.ppc, true) + immValue;
          this.setRegisterValue(Regs.pc, adr, true);
        }
        intermediate.push('BNE')
        intermediate.push(rs1)
        intermediate.push(rs2)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b100) {
        // BLT
        // if (rs1 < rs2) {branch}
        if (this.getRegisterValue(rs1) < this.getRegisterValue(rs2)) {
          const adr = this.getRegisterValue(Regs.ppc, true) + immValue;
          this.setRegisterValue(Regs.pc, adr, true);
        }
        intermediate.push('BLT')
        intermediate.push(rs1)
        intermediate.push(rs2)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b110) {
        // BLTU
        // if ((rs1>>>0) < (rs2>>>0)) {branch}
        if ((this.getRegisterValue(rs1) >>> 0) < (this.getRegisterValue(rs2) >>> 0)) {
          const adr = this.getRegisterValue(Regs.ppc, true) + immValue;
          this.setRegisterValue(Regs.pc, adr, true);
        }
        intermediate.push('BLTU')
        intermediate.push(rs1)
        intermediate.push(rs2)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b101) {
        // BGE
        // if (rs1 >= rs2) {branch}
        if (this.getRegisterValue(rs1) >= this.getRegisterValue(rs2)) {
          const adr = this.getRegisterValue(Regs.ppc, true) + immValue;
          this.setRegisterValue(Regs.pc, adr, true);
        }
        intermediate.push('BGE')
        intermediate.push(rs1)
        intermediate.push(rs2)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b111) {
        // BGEU
        // if ((rs1>>>0) >= (rs2>>>0)) {branch}
        if ((this.getRegisterValue(rs1) >>> 0) >= (this.getRegisterValue(rs2) >>> 0)) {
          const adr = this.getRegisterValue(Regs.ppc, true) + immValue;
          this.setRegisterValue(Regs.pc, adr, true);
        }
        intermediate.push('BGEU')
        intermediate.push(rs1)
        intermediate.push(rs2)
        intermediate.push(immValue)
      }
      else {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
    }
    else if (opcode === Opcode.LOAD) {
      // Load and Store Instructions
      // adr = rs1 + imm
      const rd = (instruction >>> 7) & 0b11111;
      if (rd === Regs.x0) {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
      const rs1 = (instruction >>> 15) & 0b11111;
      const funct3 = (instruction >>> 12) & 0b111;
      const immValue = this.iimmToValue(instruction) >> 0;
      const adr = this.getRegisterValue(rs1) + immValue;
      if (funct3 === 0b000) {
        // LB
        // rd = signExt(mem[adr])
        const memData = this.mem.getByte(adr);
        this.setRegisterValue(rd, memData);
        intermediate.push('LB')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b001) {
        // LH
        // rd = signExt(mem[adr..adr+1])
        let memData = this.mem.getByte(adr);
        memData |= this.mem.getByte(adr + 1) * (2 ** 8);
        if (((this.mem.getByte(adr + 1) >>> 7) & 0b1) === 0b1) {
          memData |= 0b11111111111111110000000000000000;
        }
        else {
          memData &= 0b00000000000000001111111111111111;
        }
        this.setRegisterValue(rd, memData);
        intermediate.push('LH')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b010) {
        // LW
        // rd = signExt(mem[adr..adr+3])
        let memData = this.mem.getByte(adr);
        memData |= this.mem.getByte(adr + 1) * (2 ** 8);
        memData |= this.mem.getByte(adr + 2) * (2 ** 16);
        memData |= this.mem.getByte(adr + 3) * (2 ** 24);
        this.setRegisterValue(rd, memData);
        intermediate.push('LW')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b100) {
        // LBU
        // rd = zeroExt(mem[adr])
        const memData = (this.mem.getByte(adr) >>> 0);
        this.setRegisterValue(rd, memData);
        intermediate.push('LBU')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b101) {
        // LHU
        // rd = zeroExt(mem[adr..adr+1])
        let memData = (this.mem.getByte(adr)) >>> 0;
        memData |= (this.mem.getByte(adr + 1) * (2 ** 8)) >>> 0;
        memData >>>= 0;
        this.setRegisterValue(rd, memData);
        intermediate.push('LHU')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
    }
    else if (opcode === Opcode.STORE) {
      const rs1 = (instruction >>> 15) & 0b11111;
      const rs2 = (instruction >>> 20) & 0b11111;
      const funct3 = (instruction >>> 12) & 0b111;
      const immValue = this.simmToValue(instruction) >> 0;
      const adr = this.getRegisterValue(rs1) + immValue;
      if (funct3 === 0b000) {
        // SB
        // mem[adr] = rs2[0]
        this.mem.setByte(adr, this.getRegisterValue(rs2));
        intermediate.push('SB')
        intermediate.push(rs1)
        intermediate.push(rs2)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b001) {
        // SH
        // mem[adr..adr+1] = rs2[0..1]
        this.mem.setByte(adr + 0, this.getRegisterValue(rs2));
        this.mem.setByte(adr + 1, this.getRegisterValue(rs2) >> 8);
        intermediate.push('SH')
        intermediate.push(rs1)
        intermediate.push(rs2)
        intermediate.push(immValue)
      }
      else if (funct3 === 0b010) {
        // SW
        // mem[adr..adr+3] = rs2[0..3]
        this.mem.setByte(adr + 0, this.getRegisterValue(rs2));
        this.mem.setByte(adr + 1, this.getRegisterValue(rs2) >> 8);
        this.mem.setByte(adr + 2, this.getRegisterValue(rs2) >> 16);
        this.mem.setByte(adr + 3, this.getRegisterValue(rs2) >> 24);
        intermediate.push('SW')
        intermediate.push(rs1)
        intermediate.push(rs2)
        intermediate.push(immValue)
      }
      else {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
    }
    else if (opcode === Opcode.MISC_MEM) {
      // Memory Ordering Instructions
      const funct3 = (instruction >>> 12) & 0b111;
      if (funct3 === 0b000) {
        // FENCE = NOP
        const rd = (instruction >>> 7) & 0b11111;
        const rs1 = (instruction >>> 15) & 0b11111;
        const immValue = this.iimmToValue(instruction) >> 0;
        intermediate.push('FENCE')
        intermediate.push(rd)
        intermediate.push(rs1)
        intermediate.push(immValue)
      }
      else {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
    }
    else if (opcode === Opcode.SYSTEM) {
      // Environment Call and Breakpoints
      const rd = (instruction >>> 7) & 0b11111;
      const rs1 = (instruction >>> 15) & 0b11111;
      const funct3 = (instruction >>> 12) & 0b111;
      const funct12 = (instruction >>> 20) & 0b111111111111;
      if ((rd !== 0) || (rs1 !== 0) || (funct3 !== 0)) {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
      if (funct12 === 0) {
        // ECALL
        intermediate.push('ECALL')
      }
      else if (funct12 === 1) {
        // EBREAK
        intermediate.push('EBREAK')
      }
      else {
        let instructionBinary = (instruction >>> 0).toString(2);
        instructionBinary = instructionBinary.padStart(this.ilen, '0');
        this.throwIllegalInstructionException(instructionBinary);
      }
    }
    else {
      let instructionBinary = (instruction >>> 0).toString(2);
      instructionBinary = instructionBinary.padStart(this.ilen, '0');
      this.throwIllegalInstructionException(instructionBinary);
    }
    for (let i = 0; i < intermediate.length; ++i) {
      intermediate[i] = intermediate[i].toString()
    }
    console.info(intermediate)
  }

  // Immediates //
  // I-immediate
  valueToIimm(value) {
    const part1 = (value * (2 ** 20)) & 0b00000000000100000000000000000000;
    const part2 = (value * (2 ** 20)) & 0b00000001111000000000000000000000;
    const part3 = (value * (2 ** 20)) & 0b01111110000000000000000000000000;
    const part4 = value & 0b10000000000000000000000000000000;
    const imm = 0 | part1 | part2 | part3 | part4;
    return imm;
  }

  iimmToValue(instruction) {
    const part1 = (instruction >>> 20) & 0b00000000000000000000000000000001;
    const part2 = (instruction >>> 20) & 0b00000000000000000000000000011110;
    const part3 = (instruction >>> 20) & 0b00000000000000000000011111100000;
    let part4 = 0;
    const sign = (instruction & 0b10000000000000000000000000000000) >>> 0;
    if (sign === 0b10000000000000000000000000000000) {
      part4 = 0b11111111111111111111100000000000;
    }
    else {
      part4 = 0b00000000000000000000000000000000;
    }
    const value = 0 | part1 | part2 | part3 | part4;
    return value;
  }

  // S-immediate
  valueToSimm(value) {
    const part1 = (value * (2 ** 7)) & 0b00000000000000000000000010000000;
    const part2 = (value * (2 ** 7)) & 0b00000000000000000000111100000000;
    const part3 = (value * (2 ** (7 + 13))) & 0b01111110000000000000000000000000;
    const part4 = value & 0b10000000000000000000000000000000;
    const imm = 0 | part1 | part2 | part3 | part4;
    return imm;
  }

  simmToValue(instruction) {
    const part1 = (instruction >>> 7) & 0b00000000000000000000000000000001;
    const part2 = (instruction >>> 7) & 0b00000000000000000000000000011110;
    const part3 = (instruction >>> (7 + 13)) & 0b00000000000000000000011111100000;
    let part4 = 0;
    const sign = (instruction & 0b10000000000000000000000000000000) >>> 0;
    if (sign === 0b10000000000000000000000000000000) {
      part4 = 0b11111111111111111111100000000000;
    }
    else {
      part4 = 0b00000000000000000000000000000000;
    }
    const value = 0 | part1 | part2 | part3 | part4;
    return value;
  }

  // B-immediate
  valueToBimm(value) {
    const part1 = 0;
    const part2 = (value * (2 ** 7)) & 0b00000000000000000000111100000000;
    const part3 = (value * (2 ** (7 + 13))) & 0b01111110000000000000000000000000;
    const part4 = (value >>> 4) & 0b00000000000000000000000010000000;
    const part5 = value & 0b10000000000000000000000000000000;
    const imm = 0 | part1 | part2 | part3 | part4 | part5;
    return imm;
  }

  bimmToValue(instruction) {
    const part1 = 0;
    const part2 = (instruction >>> 7) & 0b00000000000000000000000000011110;
    const part3 = (instruction >>> (7 + 13)) & 0b00000000000000000000011111100000;
    const part4 = (instruction * (2 ** 4)) & 0b00000000000000000000100000000000;
    let part5 = 0;
    const sign = (instruction & 0b10000000000000000000000000000000) >>> 0;
    if (sign === 0b10000000000000000000000000000000) {
      part5 = 0b11111111111111111111000000000000;
    }
    else {
      part5 = 0b00000000000000000000000000000000;
    }
    const value = 0 | part1 | part2 | part3 | part4 | part5;
    return value;
  }

  // U-immediate
  valueToUimm(value) {
    const part1 = 0;
    const part2 = value & 0b00000000000011111111000000000000;
    const part3 = value & 0b01111111111100000000000000000000;
    const part4 = value & 0b10000000000000000000000000000000;
    const imm = 0 | part1 | part2 | part3 | part4;
    return imm;
  }

  uimmToValue(instruction) {
    const part1 = 0;
    const part2 = instruction & 0b00000000000011111111000000000000;
    const part3 = instruction & 0b01111111111100000000000000000000;
    let part4 = 0;
    const sign = (instruction & 0b10000000000000000000000000000000) >>> 0;
    if (sign === 0b10000000000000000000000000000000) {
      part4 = 0b10000000000000000000000000000000;
    }
    else {
      part4 = 0b00000000000000000000000000000000;
    }
    const value = 0 | part1 | part2 | part3 | part4;
    return value;
  }

  // J-immediate
  valueToJimm(value) {
    const part1 = 0;
    const part2 = (value * (2 ** 20)) & 0b00000001111000000000000000000000;
    const part3 = (value * (2 ** 20)) & 0b01111110000000000000000000000000;
    const part4 = (value * (2 ** 9)) & 0b00000000000100000000000000000000;
    const part5 = value & 0b00000000000011111111000000000000;
    const part6 = value & 0b10000000000000000000000000000000;
    const imm = 0 | part1 | part2 | part3 | part4 | part5 | part6;
    return imm;
  }

  jimmToValue(instruction) {
    const part1 = 0;
    const part2 = (instruction >>> 20) & 0b00000000000000000000000000011110;
    const part3 = (instruction >>> 20) & 0b00000000000000000000011111100000;
    const part4 = (instruction >>> 9) & 0b00000000000000000000100000000000;
    const part5 = instruction & 0b00000000000011111111000000000000;
    let part6 = 0;
    const sign = (instruction & 0b10000000000000000000000000000000) >>> 0;
    if (sign === 0b10000000000000000000000000000000) {
      part6 = 0b11111111111100000000000000000000;
    }
    else {
      part6 = 0b00000000000000000000000000000000;
    }
    const value = 0 | part1 | part2 | part3 | part4 | part5 | part6;
    return value;
  }

  // Exceptions //
  throwInstructionAddressMisalignedException(pcValue, ppcValue) {
    // fatal trap
    const info = ':pc:' + pcValue.toString() + ':ppc:' + ppcValue.toString();
    throw Error('exception:instruction-address-misaligned' + info);
  }

  throwIllegalInstructionException(instruction) {
    // fatal trap
    throw new Error('exception:illegal-instruction:' + instruction);
  }
}

module.exports = {
  Regs,
  Opcode,
  Vcore
}
