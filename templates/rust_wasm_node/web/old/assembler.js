const vcore = require('./vcore.js')

function encodeRegister (regName) {
  if (regName.charAt(0) !== 'x') {
    throw Error('regName problem')
  }
  const regNameNumber = regName.substring(1)
  return parseInt(regNameNumber, 10)
}

function assembly (sourceCode, core) {
  const lines = sourceCode.split('\n')
  const machineCode = []
  for (const [index, line] of lines.entries()) {
    if (line === '') {
      continue
    } else if (line.charAt(0) === ';') {
      continue
    }
    const splittedLine = line.split(' ')
    const command = splittedLine[0]
    const operands = splittedLine[1]?.split(',')
    if (command === 'addi') {
      // addi rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP_IMM
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b000
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'slti') {
      // slti rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP_IMM
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b010
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'sltiu') {
      // sltiu rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP_IMM
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b011
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'andi') {
      // andi rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP_IMM
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b111
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'ori') {
      // ori rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP_IMM
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b100
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'xori') {
      // xori rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP_IMM
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b100
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'slli') {
      // slli rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP_IMM
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b001
      const encodedRs1 = encodeRegister(operands[1])
      let encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      encodedIimm &= 0b00000001111111111111111111111111
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'srli') {
      // srli rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP_IMM
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b101
      const encodedRs1 = encodeRegister(operands[1])
      let encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      encodedIimm &= 0b00000001111111111111111111111111
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'srai') {
      // srai rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP_IMM
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b101
      const encodedRs1 = encodeRegister(operands[1])
      let encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      encodedIimm &= 0b00000001111111111111111111111111
      encodedIimm |= 0b01000000000000000000000000000000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'lui') {
      // lui rd,uimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.LUI
      const encodedRd = encodeRegister(operands[0])
      const encodedUimm = core.valueToUimm(parseInt(operands[1], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedUimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'auipc') {
      // auipc rd,uimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.AUIPC
      const encodedRd = encodeRegister(operands[0])
      const encodedUimm = core.valueToUimm(parseInt(operands[1], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedUimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'add') {
      // add rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b000
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0000000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'slt') {
      // slt rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b010
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0000000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'sltu') {
      // sltu rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b011
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0000000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'and') {
      // and rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b111
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0000000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'or') {
      // or rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b110
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0000000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'xor') {
      // xor rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b100
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0000000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'sll') {
      // sll rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b001
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0000000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'srl') {
      // srl rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b101
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0000000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'sub') {
      // sub rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b000
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0100000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'sra') {
      // sra rd,rs1,rs2
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.OP
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b101
      const encodedRs1 = encodeRegister(operands[1])
      const encodedRs2 = encodeRegister(operands[2])
      const encodedFunct7 = 0b0100000
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedFunct7 * (2 ** 25)
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'jal') {
      // jal rd,jimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.JAL
      const encodedRd = encodeRegister(operands[0])
      const encodedJimm = core.valueToJimm(parseInt(operands[1], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedJimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'jalr') {
      // jalr rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.JALR
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b000
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'beq') {
      // beq rs1,rs2,bimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.BRANCH
      const encodedFunct3 = 0b000
      const encodedRs1 = encodeRegister(operands[0])
      const encodedRs2 = encodeRegister(operands[1])
      const encodedBimm = core.valueToBimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedBimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'bne') {
      // bne rs1,rs2,bimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.BRANCH
      const encodedFunct3 = 0b001
      const encodedRs1 = encodeRegister(operands[0])
      const encodedRs2 = encodeRegister(operands[1])
      const encodedBimm = core.valueToBimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedBimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'blt') {
      // blt rs1,rs2,bimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.BRANCH
      const encodedFunct3 = 0b100
      const encodedRs1 = encodeRegister(operands[0])
      const encodedRs2 = encodeRegister(operands[1])
      const encodedBimm = core.valueToBimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedBimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'bltu') {
      // bltu rs1,rs2,bimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.BRANCH
      const encodedFunct3 = 0b110
      const encodedRs1 = encodeRegister(operands[0])
      const encodedRs2 = encodeRegister(operands[1])
      const encodedBimm = core.valueToBimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedBimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'bge') {
      // bge rs1,rs2,bimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.BRANCH
      const encodedFunct3 = 0b101
      const encodedRs1 = encodeRegister(operands[0])
      const encodedRs2 = encodeRegister(operands[1])
      const encodedBimm = core.valueToBimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedBimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'bgeu') {
      // bgeu rs1,rs2,bimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.BRANCH
      const encodedFunct3 = 0b111
      const encodedRs1 = encodeRegister(operands[0])
      const encodedRs2 = encodeRegister(operands[1])
      const encodedBimm = core.valueToBimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedBimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'lb') {
      // lb rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.LOAD
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b000
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'lh') {
      // lh rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.LOAD
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b001
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'lw') {
      // lw rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.LOAD
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b010
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'lbu') {
      // lbu rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.LOAD
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b100
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'lhu') {
      // lhu rd,rs1,iimm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.LOAD
      const encodedRd = encodeRegister(operands[0])
      const encodedFunct3 = 0b101
      const encodedRs1 = encodeRegister(operands[1])
      const encodedIimm = core.valueToIimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedRd * (2 ** 7)
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedIimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'sb') {
      // sb rs1,rs2,simm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.STORE
      const encodedFunct3 = 0b000
      const encodedRs1 = encodeRegister(operands[0])
      const encodedRs2 = encodeRegister(operands[1])
      const encodedSimm = core.valueToSimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedSimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'sh') {
      // sh rs1,rs2,simm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.STORE
      const encodedFunct3 = 0b001
      const encodedRs1 = encodeRegister(operands[0])
      const encodedRs2 = encodeRegister(operands[1])
      const encodedSimm = core.valueToSimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedSimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else if (command === 'sw') {
      // sw rs1,rs2,simm
      if (operands === undefined)
        {throw Error('operands === undefined');}
      const encodedOpcode = vcore.Opcode.STORE
      const encodedFunct3 = 0b010
      const encodedRs1 = encodeRegister(operands[0])
      const encodedRs2 = encodeRegister(operands[1])
      const encodedSimm = core.valueToSimm(parseInt(operands[2], 10))
      let instruction = 0
      instruction |= encodedOpcode
      instruction |= encodedFunct3 * (2 ** 12)
      instruction |= encodedRs1 * (2 ** 15)
      instruction |= encodedRs2 * (2 ** 20)
      instruction |= encodedSimm
      machineCode.push(instruction >>> 0)
      machineCode.push(instruction >>> 8)
      machineCode.push(instruction >>> 16)
      machineCode.push(instruction >>> 24)
    } else {
      throw Error(index.toString())
    }
  }
  return new Uint8Array(machineCode)
}

module.exports = {
  assembly
}
