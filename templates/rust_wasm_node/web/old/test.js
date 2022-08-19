const memory = require('./memory.js')
const common = require('./common.js')
const vcore = require('./vcore.js')

class Test {
  // Memory //
  testingMemory () {
    const mem = new memory.Memory(common.Xlen.word, common.Vcount.one, common.Mrcount.default, common.Mempow.med)
    mem.setByte(1, 257)
    mem.setByte(mem.length, 2)
    if (mem.getByte(0) !== 2) {
      throw Error('testing memory 1')
    }
    if (mem.getByte(mem.length + 1) !== 1) {
      throw Error('testing memory 2')
    }
  }

  // Vcore //
  testingVcore () {
    const mem = new memory.Memory(common.Xlen.word, common.Vcount.one, common.Mrcount.default, common.Mempow.med)
    const core = new vcore.Vcore(mem, common.Vnum.zero, common.Ialign.word, common.Ilen.word)
    // PC-register
    try {
      core.fetchInstruction()
    } catch (error) {
      const instruction = ((error.message).split(':')).pop()
      if (instruction !== '00000000000000000000000000000000') {
        console.log(error.message)
        throw Error('testing vcore 1')
      }
    }
    mem.setByte(4, 255)
    mem.setByte(5, 255)
    mem.setByte(6, 255)
    mem.setByte(7, 255)
    try {
      core.fetchInstruction()
    } catch (error) {
      const instruction = ((error.message).split(':')).pop()
      if (instruction !== '11111111111111111111111111111111') {
        throw Error('testing vcore 2')
      }
    }
    mem.setByte(8, 1)
    mem.setByte(9, 3)
    mem.setByte(10, 7)
    mem.setByte(11, 15)
    try {
      core.fetchInstruction()
    } catch (error) {
      const instruction = ((error.message).split(':')).pop()
      if (instruction !== '00001111000001110000001100000001') {
        throw Error('testing vcore 3')
      }
    }
    // ADDI
    let instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x31 * (2 ** 7) // rd
    instruction |= 0b000 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= 64 * (2 ** 20) // I-imm
    mem.setByte(12, instruction)
    mem.setByte(13, instruction >>> 8)
    mem.setByte(14, instruction >>> 16)
    mem.setByte(15, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x31) !== 64) {
      throw Error('testing vcore 4')
    }
    if (core.getRegisterValue(vcore.Regs.x30) !== 64) {
      throw Error('testing vcore 5')
    }
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x31 * (2 ** 7) // rd
    instruction |= 0b000 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= -70 * (2 ** 20) // I-imm
    mem.setByte(16, instruction)
    mem.setByte(17, instruction >>> 8)
    mem.setByte(18, instruction >>> 16)
    mem.setByte(19, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x31) !== -6) {
      throw Error('testing vcore 6')
    }
    if (core.getRegisterValue(vcore.Regs.x30) !== -6) {
      throw Error('testing vcore 7')
    }
    // SLTI
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x20 * (2 ** 7) // rd
    instruction |= 0b010 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x10 * (2 ** 15) // rs1
    instruction |= 64 * (2 ** 20) // I-imm
    mem.setByte(20, instruction)
    mem.setByte(21, instruction >>> 8)
    mem.setByte(22, instruction >>> 16)
    mem.setByte(23, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x20) !== 1) {
      throw Error('testing vcore 8')
    }
    if (core.getRegisterValue(vcore.Regs.x10) !== 0) {
      throw Error('testing vcore 9')
    }
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x20 * (2 ** 7) // rd
    instruction |= 0b010 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x20 * (2 ** 15) // rs1
    instruction |= -1 * (2 ** 20) // I-imm
    mem.setByte(24, instruction)
    mem.setByte(25, instruction >>> 8)
    mem.setByte(26, instruction >>> 16)
    mem.setByte(27, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x20) !== 0) {
      throw Error('testing vcore 10')
    }
    // SLTIU
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x30 * (2 ** 7) // rd
    instruction |= 0b011 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    instruction |= 64 * (2 ** 20) // I-imm
    mem.setByte(28, instruction)
    mem.setByte(29, instruction >>> 8)
    mem.setByte(30, instruction >>> 16)
    mem.setByte(31, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x30) !== 0) {
      throw Error('testing vcore 11')
    }
    // ANDI
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x30 * (2 ** 7) // rd
    instruction |= 0b111 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    instruction |= 6 * (2 ** 20) // I-imm
    mem.setByte(32, instruction)
    mem.setByte(33, instruction >>> 8)
    mem.setByte(34, instruction >>> 16)
    mem.setByte(35, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x30) !== 2) {
      throw Error('testing vcore 12')
    }
    // ORI
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x30 * (2 ** 7) // rd
    instruction |= 0b110 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    instruction |= 6 * (2 ** 20) // I-imm
    mem.setByte(36, instruction)
    mem.setByte(37, instruction >>> 8)
    mem.setByte(38, instruction >>> 16)
    mem.setByte(39, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x30) !== -2) {
      throw Error('testing vcore 13')
    }
    // XORI
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x30 * (2 ** 7) // rd
    instruction |= 0b100 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    instruction |= 6 * (2 ** 20) // I-imm
    mem.setByte(40, instruction)
    mem.setByte(41, instruction >>> 8)
    mem.setByte(42, instruction >>> 16)
    mem.setByte(43, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x30) !== -4) {
      throw Error('testing vcore 14')
    }
    // SLLI
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x30 * (2 ** 7) // rd
    instruction |= 0b001 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    let shamt = 1 * (2 ** 20)
    let upperImm = 0 * (2 ** 25)
    instruction |= shamt | upperImm // I-imm
    mem.setByte(44, instruction)
    mem.setByte(45, instruction >>> 8)
    mem.setByte(46, instruction >>> 16)
    mem.setByte(47, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x30) !== -12) {
      throw Error('testing vcore 15')
    }
    // SRAI
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x30 * (2 ** 7) // rd
    instruction |= 0b101 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    shamt = 1 * (2 ** 20)
    upperImm = 32 * (2 ** 25)
    instruction |= shamt | upperImm // I-imm
    mem.setByte(48, instruction)
    mem.setByte(49, instruction >>> 8)
    mem.setByte(50, instruction >>> 16)
    mem.setByte(51, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x30) !== -3) {
      throw Error('testing vcore 16')
    }
    // SRLI
    instruction = 0 | vcore.Opcode.OP_IMM // opcode
    instruction |= vcore.Regs.x30 * (2 ** 7) // rd
    instruction |= 0b101 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    shamt = 1 * (2 ** 20)
    upperImm = 0 * (2 ** 25)
    instruction |= shamt | upperImm // I-imm
    mem.setByte(52, instruction)
    mem.setByte(53, instruction >>> 8)
    mem.setByte(54, instruction >>> 16)
    mem.setByte(55, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x30) !== 0b01111111111111111111111111111101) {
      throw Error('testing vcore 17')
    }
    // LUI
    instruction = 0 | vcore.Opcode.LUI // opcode
    instruction |= vcore.Regs.x10 * (2 ** 7) // rd
    instruction |= 1 * (2 ** 31) // U-imm
    mem.setByte(56, instruction)
    mem.setByte(57, instruction >>> 8)
    mem.setByte(58, instruction >>> 16)
    mem.setByte(59, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x10) >>> 0) !== 0b10000000000000000000000000000000) {
      throw Error('testing vcore 18')
    }
    // AUIPC
    instruction = 0 | vcore.Opcode.AUIPC // opcode
    instruction |= vcore.Regs.x10 * (2 ** 7) // rd
    instruction |= 1 * (2 ** 31) // U-imm
    mem.setByte(60, instruction)
    mem.setByte(61, instruction >>> 8)
    mem.setByte(62, instruction >>> 16)
    mem.setByte(63, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x10) >>> 0) !== 0b10000000000000000000000000111100) {
      throw Error('testing vcore 19')
    }
    // ADD
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b000 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 0 * (2 ** 25) // funct7
    mem.setByte(64, instruction)
    mem.setByte(65, instruction >>> 8)
    mem.setByte(66, instruction >>> 16)
    mem.setByte(67, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 0b01111111111111111111111111110111) {
      throw Error('testing vcore 20')
    }
    // SLT
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b010 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 0 * (2 ** 25) // funct7
    mem.setByte(68, instruction)
    mem.setByte(69, instruction >>> 8)
    mem.setByte(70, instruction >>> 16)
    mem.setByte(71, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 0) {
      throw Error('testing vcore 21')
    }
    // SLTU
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b011 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 0 * (2 ** 25) // funct7
    mem.setByte(72, instruction)
    mem.setByte(73, instruction >>> 8)
    mem.setByte(74, instruction >>> 16)
    mem.setByte(75, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 1) {
      throw Error('testing vcore 22')
    }
    // AND
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b111 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 0 * (2 ** 25) // funct7
    mem.setByte(76, instruction)
    mem.setByte(77, instruction >>> 8)
    mem.setByte(78, instruction >>> 16)
    mem.setByte(79, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 0b01111111111111111111111111111000) {
      throw Error('testing vcore 23')
    }
    // OR
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b110 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 0 * (2 ** 25) // funct7
    mem.setByte(80, instruction)
    mem.setByte(81, instruction >>> 8)
    mem.setByte(82, instruction >>> 16)
    mem.setByte(83, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 0b11111111111111111111111111111111) {
      throw Error('testing vcore 24')
    }
    // XOR
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b100 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 0 * (2 ** 25) // funct7
    mem.setByte(84, instruction)
    mem.setByte(85, instruction >>> 8)
    mem.setByte(86, instruction >>> 16)
    mem.setByte(87, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 0b10000000000000000000000000000111) {
      throw Error('testing vcore 25')
    }
    // SLL
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b001 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 0 * (2 ** 25) // funct7
    mem.setByte(88, instruction)
    mem.setByte(89, instruction >>> 8)
    mem.setByte(90, instruction >>> 16)
    mem.setByte(91, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 0b11110100000000000000000000000000) {
      throw Error('testing vcore 26')
    }
    // SRL
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b101 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 0 * (2 ** 25) // funct7
    mem.setByte(92, instruction)
    mem.setByte(93, instruction >>> 8)
    mem.setByte(94, instruction >>> 16)
    mem.setByte(95, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 0b00000000000000000000000000011111) {
      throw Error('testing vcore 27')
    }
    // SUB
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b000 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 32 * (2 ** 25) // funct7
    mem.setByte(96, instruction)
    mem.setByte(97, instruction >>> 8)
    mem.setByte(98, instruction >>> 16)
    mem.setByte(99, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 0b10000000000000000000000000000011) {
      throw Error('testing vcore 28')
    }
    // SRA
    instruction = 0 | vcore.Opcode.OP // opcode
    instruction |= vcore.Regs.x9 * (2 ** 7) // rd
    instruction |= 0b101 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x30 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x31 * (2 ** 20) // rs2
    instruction |= 32 * (2 ** 25) // funct7
    mem.setByte(100, instruction)
    mem.setByte(101, instruction >>> 8)
    mem.setByte(102, instruction >>> 16)
    mem.setByte(103, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x9) >>> 0) !== 0b00000000000000000000000000011111) {
      throw Error('testing vcore 29')
    }
    // JAL
    instruction = 0 | vcore.Opcode.JAL // opcode
    instruction |= vcore.Regs.x15 * (2 ** 7) // rd
    instruction |= core.valueToJimm(8) // imm
    mem.setByte(104, instruction)
    mem.setByte(105, instruction >>> 8)
    mem.setByte(106, instruction >>> 16)
    mem.setByte(107, instruction >>> 24)
    mem.setByte(112, 0b11111111)
    mem.setByte(113, 0b11111111)
    mem.setByte(114, 0b11111111)
    mem.setByte(115, 0b11111111)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x15) >>> 0) !== 108) {
      throw Error('testing vcore 30')
    }
    try {
      core.fetchInstruction()
    } catch (error) {
      const instruction = ((error.message).split(':')).pop()
      if (instruction !== '11111111111111111111111111111111') {
        throw Error('testing vcore 31')
      }
    }
    // JALR
    instruction = 0 | vcore.Opcode.JALR // opcode
    instruction |= vcore.Regs.x31 * (2 ** 7) // rd
    instruction |= 0b000 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x0 * (2 ** 15) // rs1
    instruction |= 2 * (2 ** 20) // I-imm
    mem.setByte(116, instruction)
    mem.setByte(117, instruction >>> 8)
    mem.setByte(118, instruction >>> 16)
    mem.setByte(119, instruction >>> 24)
    core.fetchInstruction()
    if (core.getRegisterValue(vcore.Regs.x31) !== 120) {
      throw Error('testing vcore 32')
    }
    try {
      core.fetchInstruction()
    } catch (error) {
      const msg = (error.message).split(':')
      const ppcValue = msg.pop()
      msg.pop()
      const pcValue = msg.pop()
      if ((ppcValue !== '116') || (pcValue !== '118')) {
        throw Error('testing vcore 33')
      }
    }
    core.setRegisterValue(vcore.Regs.pc, 120, true)
    // BEQ
    instruction = 0 | vcore.Opcode.BRANCH // opcode
    instruction |= 0b000 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x0 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x0 * (2 ** 20) // rs2
    instruction |= core.valueToBimm(8) // imm
    mem.setByte(120, instruction)
    mem.setByte(121, instruction >>> 8)
    mem.setByte(122, instruction >>> 16)
    mem.setByte(123, instruction >>> 24)
    core.fetchInstruction()
    let pcValue = core.getRegisterValue(vcore.Regs.pc, true) >>> 0
    let ppcValue = core.getRegisterValue(vcore.Regs.ppc, true) >>> 0
    if ((pcValue !== 128) || (ppcValue !== 120)) {
      throw Error('testing vcore 34')
    }
    // BNE
    instruction = 0 | vcore.Opcode.BRANCH // opcode
    instruction |= 0b001 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x0 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x0 * (2 ** 20) // rs2
    instruction |= core.valueToBimm(8) // imm
    mem.setByte(128, instruction)
    mem.setByte(129, instruction >>> 8)
    mem.setByte(130, instruction >>> 16)
    mem.setByte(131, instruction >>> 24)
    core.fetchInstruction()
    pcValue = core.getRegisterValue(vcore.Regs.pc, true) >>> 0
    ppcValue = core.getRegisterValue(vcore.Regs.ppc, true) >>> 0
    if ((pcValue !== 132) || (ppcValue !== 128)) {
      throw Error('testing vcore 35')
    }
    // BLT
    instruction = 0 | vcore.Opcode.BRANCH // opcode
    instruction |= 0b100 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x0 * (2 ** 20) // rs2
    instruction |= core.valueToBimm(100) // imm
    mem.setByte(132, instruction)
    mem.setByte(133, instruction >>> 8)
    mem.setByte(134, instruction >>> 16)
    mem.setByte(135, instruction >>> 24)
    core.fetchInstruction()
    pcValue = core.getRegisterValue(vcore.Regs.pc, true) >>> 0
    ppcValue = core.getRegisterValue(vcore.Regs.ppc, true) >>> 0
    if ((pcValue !== 136) || (ppcValue !== 132)) {
      throw Error('testing vcore 36')
    }
    core.setRegisterValue(vcore.Regs.x1, -1)
    // BLTU
    instruction = 0 | vcore.Opcode.BRANCH // opcode
    instruction |= 0b110 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x1 * (2 ** 20) // rs2
    instruction |= core.valueToBimm(100) // imm
    mem.setByte(136, instruction)
    mem.setByte(137, instruction >>> 8)
    mem.setByte(138, instruction >>> 16)
    mem.setByte(139, instruction >>> 24)
    core.fetchInstruction()
    pcValue = core.getRegisterValue(vcore.Regs.pc, true) >>> 0
    ppcValue = core.getRegisterValue(vcore.Regs.ppc, true) >>> 0
    if ((pcValue !== 236) || (ppcValue !== 136)) {
      throw Error('testing vcore 37')
    }
    // BGE
    instruction = 0 | vcore.Opcode.BRANCH // opcode
    instruction |= 0b101 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x1 * (2 ** 20) // rs2
    instruction |= core.valueToBimm(8) // imm
    mem.setByte(236, instruction)
    mem.setByte(237, instruction >>> 8)
    mem.setByte(238, instruction >>> 16)
    mem.setByte(239, instruction >>> 24)
    core.fetchInstruction()
    pcValue = core.getRegisterValue(vcore.Regs.pc, true) >>> 0
    ppcValue = core.getRegisterValue(vcore.Regs.ppc, true) >>> 0
    if ((pcValue !== 244) || (ppcValue !== 236)) {
      throw Error('testing vcore 38')
    }
    // BGEU
    instruction = 0 | vcore.Opcode.BRANCH // opcode
    instruction |= 0b111 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    instruction |= vcore.Regs.x1 * (2 ** 20) // rs2
    instruction |= core.valueToBimm(8) // imm
    mem.setByte(244, instruction)
    mem.setByte(245, instruction >>> 8)
    mem.setByte(246, instruction >>> 16)
    mem.setByte(247, instruction >>> 24)
    core.fetchInstruction()
    pcValue = core.getRegisterValue(vcore.Regs.pc, true) >>> 0
    ppcValue = core.getRegisterValue(vcore.Regs.ppc, true) >>> 0
    if ((pcValue !== 248) || (ppcValue !== 244)) {
      throw Error('testing vcore 39')
    }
    // LB
    instruction = 0 | vcore.Opcode.LOAD // opcode
    instruction |= vcore.Regs.x0 * (2 ** 7) // rd
    instruction |= 0b000 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1
    instruction |= core.valueToIimm(1) // I-imm
    mem.setByte(248, instruction)
    mem.setByte(249, instruction >>> 8)
    mem.setByte(250, instruction >>> 16)
    mem.setByte(251, instruction >>> 24)
    try {
      core.fetchInstruction()
    } catch (error) {
      const msg = (error.message).split(':')
      if (msg.pop() !== '00000000000111111000000000000011') {
        throw Error('testing vcore 40')
      }
    }
    instruction = 0 | vcore.Opcode.LOAD // opcode
    instruction |= vcore.Regs.x1 * (2 ** 7) // rd
    instruction |= 0b000 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1 (120)
    instruction |= core.valueToIimm(-3) // I-imm
    mem.setByte(252, instruction)
    mem.setByte(253, instruction >>> 8)
    mem.setByte(254, instruction >>> 16)
    mem.setByte(255, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x1)) !== 0b1111) {
      throw Error('testing vcore 41')
    }
    // LH
    instruction = 0 | vcore.Opcode.LOAD // opcode
    instruction |= vcore.Regs.x1 * (2 ** 7) // rd
    instruction |= 0b001 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1 (120)
    instruction |= core.valueToIimm(-113) // I-imm
    mem.setByte(256, instruction)
    mem.setByte(257, instruction >>> 8)
    mem.setByte(258, instruction >>> 16)
    mem.setByte(259, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x1)) !== 0b111111111) {
      throw Error('testing vcore 42')
    }
    // LW
    instruction = 0 | vcore.Opcode.LOAD // opcode
    instruction |= vcore.Regs.x1 * (2 ** 7) // rd
    instruction |= 0b010 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1 (120)
    instruction |= core.valueToIimm(-113) // I-imm
    mem.setByte(260, instruction)
    mem.setByte(261, instruction >>> 8)
    mem.setByte(262, instruction >>> 16)
    mem.setByte(263, instruction >>> 24)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x1)) !== 0b111000000110000000111111111) {
      throw Error('testing vcore 43')
    }
    // LBU
    instruction = 0 | vcore.Opcode.LOAD // opcode
    instruction |= vcore.Regs.x1 * (2 ** 7) // rd
    instruction |= 0b100 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1 (120)
    instruction |= core.valueToIimm(-113) // I-imm
    mem.setByte(264, instruction)
    mem.setByte(265, instruction >>> 8)
    mem.setByte(266, instruction >>> 16)
    mem.setByte(267, instruction >>> 24)
    mem.setByte(7, -2)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x1)) !== 0b11111110) {
      throw Error('testing vcore 44')
    }
    // LHU
    instruction = 0 | vcore.Opcode.LOAD // opcode
    instruction |= vcore.Regs.x1 * (2 ** 7) // rd
    instruction |= 0b101 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1 (120)
    instruction |= core.valueToIimm(-113) // I-imm
    mem.setByte(268, instruction)
    mem.setByte(269, instruction >>> 8)
    mem.setByte(270, instruction >>> 16)
    mem.setByte(271, instruction >>> 24)
    mem.setByte(8, -2)
    core.fetchInstruction()
    if ((core.getRegisterValue(vcore.Regs.x1)) !== 0b1111111011111110) {
      throw Error('testing vcore 45')
    }
    // SB
    core.setRegisterValue(vcore.Regs.x30, -7)
    instruction = 0 | vcore.Opcode.STORE // opcode
    instruction |= 0b000 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1 (120)
    instruction |= vcore.Regs.x30 * (2 ** 20) // rs2 (-7)
    instruction |= core.valueToSimm(180) // S-imm
    mem.setByte(272, instruction)
    mem.setByte(273, instruction >>> 8)
    mem.setByte(274, instruction >>> 16)
    mem.setByte(275, instruction >>> 24)
    core.fetchInstruction()
    if (mem.getByte(300) !== 0b11111001) {
      throw Error('testing vcore 46')
    }
    // SH
    mem.setByte(300, 0)
    core.setRegisterValue(vcore.Regs.x30, -7)
    instruction = 0 | vcore.Opcode.STORE // opcode
    instruction |= 0b001 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1 (120)
    instruction |= vcore.Regs.x30 * (2 ** 20) // rs2 (-7)
    instruction |= core.valueToSimm(180) // S-imm
    mem.setByte(276, instruction)
    mem.setByte(277, instruction >>> 8)
    mem.setByte(278, instruction >>> 16)
    mem.setByte(279, instruction >>> 24)
    core.fetchInstruction()
    let memVal = mem.getByte(300 + 0)
    memVal |= (mem.getByte(300 + 1)) * (2 ** 8)
    if (memVal !== 0b1111111111111001) {
      throw Error('testing vcore 47')
    }
    // SW
    mem.setByte(300, 0)
    mem.setByte(301, 0)
    core.setRegisterValue(vcore.Regs.x30, -7)
    instruction = 0 | vcore.Opcode.STORE // opcode
    instruction |= 0b010 * (2 ** 12) // funct3
    instruction |= vcore.Regs.x31 * (2 ** 15) // rs1 (120)
    instruction |= vcore.Regs.x30 * (2 ** 20) // rs2 (-7)
    instruction |= core.valueToSimm(180) // S-imm
    mem.setByte(280, instruction)
    mem.setByte(281, instruction >>> 8)
    mem.setByte(282, instruction >>> 16)
    mem.setByte(283, instruction >>> 24)
    core.fetchInstruction()
    memVal = mem.getByte(300 + 0)
    memVal |= (mem.getByte(300 + 1)) * (2 ** 8)
    memVal |= (mem.getByte(300 + 2)) * (2 ** 16)
    memVal |= (mem.getByte(300 + 3)) * (2 ** 24)
    if ((memVal >>> 0) !== 0b11111111111111111111111111111001) {
      throw Error('testing vcore 48')
    }
    // FENCE = NOP
  }

  // All //
  testingAll () {
    console.log('BEGIN TESTING ALL')
    this.testingMemory()
    this.testingVcore()
    console.log('END TESTING ALL')
  }
}

module.exports = {
  Test
}
