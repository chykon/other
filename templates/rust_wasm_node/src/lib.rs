/*
const MEMORY_SIZE: usize = 1024 * 1024 * 512;
const REGISTERS_COUNT: usize = 32 + 1;

const CODE_RANGE_BEGIN: usize = 0;
const CODE_RANGE_END: usize = CODE_RANGE_BEGIN + (1024 * 1024 * 128) - 1;

static mut MEMORY: [u8; MEMORY_SIZE] = [0; MEMORY_SIZE];
static mut REGISTERS: [u32; REGISTERS_COUNT] = [0; REGISTERS_COUNT];
static mut ERROR_MESSAGE: &str = "";

const X0: usize = 0;
const X1: usize = 1;
const X2: usize = 2;
const X3: usize = 3;
const X4: usize = 4;
const X5: usize = 5;
const X6: usize = 6;
const X7: usize = 7;
const X8: usize = 8;
const X9: usize = 9;
const X10: usize = 10;
const X11: usize = 11;
const X12: usize = 12;
const X13: usize = 13;
const X14: usize = 14;
const X15: usize = 15;
const X16: usize = 16;
const X17: usize = 17;
const X18: usize = 18;
const X19: usize = 19;
const X20: usize = 20;
const X21: usize = 21;
const X22: usize = 22;
const X23: usize = 23;
const X24: usize = 24;
const X25: usize = 25;
const X26: usize = 26;
const X27: usize = 27;
const X28: usize = 28;
const X29: usize = 29;
const X30: usize = 30;
const X31: usize = 31;
const PC: usize = 32;

const INST_20: u32    = 0b00000000000100000000000000000000;
const INST_24_21: u32 = 0b00000001111000000000000000000000;
const INST_30_25: u32 = 0b01111110000000000000000000000000;
const INST_31: u32    = 0b10000000000000000000000000000000;
const INST_7: u32     = 0b00000000000000000000000010000000;
const INST_11_8: u32  = 0b00000000000000000000111100000000;
const INST_19_12: u32 = 0b00000000000011111111000000000000;
const INST_30_20: u32 = 0b01111111111100000000000000000000;

const LOAD: u32       = 0b0000011;
const LOAD_FP: u32    = 0b0000111;
const CUSTOM_0: u32   = 0b0001011;
const MISC_MEM: u32   = 0b0001111;
const OP_IMM: u32     = 0b0010011;
const AUIPC: u32      = 0b0010111;
const OP_IMM_32: u32  = 0b0011011;
const STORE: u32      = 0b0100011;
const STORE_FP: u32   = 0b0100111;
const CUSTOM_1: u32   = 0b0101011;
const AMO: u32        = 0b0101111;
const OP: u32         = 0b0110011;
const LUI: u32        = 0b0110111;
const OP_32: u32      = 0b0111011;
const MADD: u32       = 0b1000011;
const MSUB: u32       = 0b1000111;
const NMSUB: u32      = 0b1001011;
const NMADD: u32      = 0b1001111;
const OP_FP: u32      = 0b1010011;
const RESERVED_0: u32 = 0b1010111;
const CUSTOM_2: u32   = 0b1011011;
const BRANCH: u32     = 0b1100011;
const JALR: u32       = 0b1100111;
const RESERVED_1: u32 = 0b1101011;
const JAL: u32        = 0b1101111;
const SYSTEM: u32     = 0b1110011;
const RESERVED_2: u32 = 0b1110111;
const CUSTOM_3: u32   = 0b1111011;
const BEQ: u32        = 0b000;
const BNE: u32        = 0b001;
const BLT: u32        = 0b100;
const BGE: u32        = 0b101;
const BLTU: u32       = 0b110;
const BGEU: u32       = 0b111;
const LB: u32         = 0b000;
const LH: u32         = 0b001;
const LW: u32         = 0b010;
const LBU: u32        = 0b100;
const LHU: u32        = 0b101;
const SB: u32         = 0b000;
const SH: u32         = 0b001;
const SW: u32         = 0b010;
const ADDI: u32       = 0b000;
const SLTI: u32       = 0b010;
const SLTIU: u32      = 0b011;
const XORI: u32       = 0b100;
const ORI: u32        = 0b110;
const ANDI: u32       = 0b111;
const SLLI: u32       = 0b0000000001;
const SRLI: u32       = 0b0000000101;
const SRAI: u32       = 0b0100000101;
const ADD: u32        = 0b0100000000;
const SUB: u32        = 0b0000000000;
const SLL: u32        = 0b0000000001;
const SLT: u32        = 0b0000000010;
const SLTU: u32       = 0b0000000011;
const XOR: u32        = 0b0000000100;
const SRL: u32        = 0b0000000101;
const SRA: u32        = 0b0100000101;
const OR: u32         = 0b0000000110;
const AND: u32        = 0b0000000111;
const FENCE: u32      = 0b000;
const ECALL: u32      = 0b0000000000000000000000000;
const EBREAK: u32     = 0b0000000000010000000000000;
*/

// # # #
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn set_panic_hook() {
  std::panic::set_hook(Box::new(console_error_panic_hook::hook))
}
// # # #

#[wasm_bindgen::prelude::wasm_bindgen]
pub fn jsonify_intermediate(string: &str) -> String {
  let mut map = serde_json::Map::new();
  let data: serde_json::Value = serde_json::from_str(string).unwrap();
  let array = data.as_array().unwrap();
  for (i, element) in array.iter().enumerate() {
    let mut strings: Vec<String> = Vec::new();
    let element_array = element.as_array().unwrap();
    for elem in element_array {
      let elem_str = elem.as_str().unwrap().to_lowercase();
      strings.push(elem_str);
    }
    map.insert(i.to_string(), serde_json::json!(strings));
  }
  serde_json::to_string(&map).unwrap()
}

#[wasm_bindgen::prelude::wasm_bindgen]
pub fn intermediate_to_text(string: &str) -> String {
  let data: serde_json::Value = serde_json::from_str(string).unwrap();
  let array = data.as_object().unwrap();
  let mut output_string = String::new();
  for element in array {
    let element_array = element.1.as_array().unwrap();
    let elem = &element_array[0];
    let elem_str = elem.as_str().unwrap();
    if element_array.len() == 1 {
      output_string.push_str(elem_str);
      output_string.push('\n');
      continue;
    } else if element_array.len() == 3 {
      let elem_str_2 = element_array[1].as_str().unwrap();
      let elem_str_3 = element_array[2].as_str().unwrap();
      let mut str_2 = String::new();
      str_2.push_str(" x");
      str_2.push_str(elem_str_2);
      str_2.push_str(", ");
      let mut str_3 = String::new();
      str_3.push_str(elem_str_3);
      output_string.push_str(elem_str);
      output_string.push_str(&str_2);
      output_string.push_str(&str_3);
      output_string.push('\n');
      continue;
    }
    match elem_str {
      "add" | "sub" | "sll" | "slt" | "sltu" | "xor" | "srl" | "sra" | "or" | "and" => {
        let elem_str_2 = element_array[1].as_str().unwrap();
        let elem_str_3 = element_array[2].as_str().unwrap();
        let elem_str_4 = element_array[3].as_str().unwrap();
        let mut str_2 = String::new();
        str_2.push_str(" x");
        str_2.push_str(elem_str_2);
        str_2.push_str(", ");
        let mut str_3 = String::new();
        str_3.push('x');
        str_3.push_str(elem_str_3);
        str_3.push_str(", ");
        let mut str_4 = String::new();
        str_4.push('x');
        str_4.push_str(elem_str_4);
        str_4.push_str(", ");
        output_string.push_str(elem_str);
        output_string.push_str(&str_2);
        output_string.push_str(&str_3);
        output_string.push_str(&str_4);
      }
      _ => {
        let elem_str_2 = element_array[1].as_str().unwrap();
        let elem_str_3 = element_array[2].as_str().unwrap();
        let elem_str_4 = element_array[3].as_str().unwrap();
        let mut str_2 = String::new();
        str_2.push_str(" x");
        str_2.push_str(elem_str_2);
        str_2.push_str(", ");
        let mut str_3 = String::new();
        str_3.push('x');
        str_3.push_str(elem_str_3);
        str_3.push_str(", ");
        let mut str_4 = String::new();
        str_4.push_str(elem_str_4);
        output_string.push_str(elem_str);
        output_string.push_str(&str_2);
        output_string.push_str(&str_3);
        output_string.push_str(&str_4);
      }
    }
    output_string.push('\n');
  }
  output_string
}

#[wasm_bindgen::prelude::wasm_bindgen]
pub fn analyze(string: &str) -> bool {
  let data: serde_json::Value = serde_json::from_str(string).unwrap();
  let obj = data.as_object().unwrap();
  let arr = obj.get("0").unwrap().as_array().unwrap();
  let mut result = true;
  match arr[0].as_str().unwrap() {
    "lui" | "auipc" => {
      let imm = arr[2].as_str().unwrap().parse::<i64>().unwrap();
      if (imm  & 0b111111111111) != 0b000000000000 {
        result = false;
      }
    }
    "jal" => {
      let imm = arr[2].as_str().unwrap().parse::<i64>().unwrap();
      if (imm  & 0b11111111111000000000000000000001) != 0b00000000000000000000000000000000 {
        result = false;
      }
    }
    "jalr" | "lb" | "lh" | "lw" | "lbu" | "lhu" | "sb" | "sh" | "sw" | "addi" | "slti" |
    "sltiu" | "xori" | "ori" | "andi" => {
      let imm = arr[3].as_str().unwrap().parse::<i64>().unwrap();
      if (imm  & 0b11111111111111111111000000000000) != 0b00000000000000000000000000000000 {
        result = false;
      }
    }
    "beq" | "bne" | "blt" | "bge" | "bltu" | "bgeu" => {
      let imm = arr[3].as_str().unwrap().parse::<i64>().unwrap();
      if (imm  & 0b11111111111111111110000000000001) != 0b00000000000000000000000000000000 {
        result = false;
      }
    }
    "slli" | "srli" => {
      let imm = arr[3].as_str().unwrap().parse::<i64>().unwrap();
      if (imm  & 0b11111111111000000000000000000001) != 0b00000000000000000000000000000000 {
        result = false;
      }
    }
    "srai" => {
      let imm = arr[3].as_str().unwrap().parse::<i64>().unwrap();
      if (imm  & 0b11111111111000000000000000000001) != 0b01000000000000000000000000000000 {
        result = false;
      }
    }
    _ => {}
  }
  result
}

/*
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn load_machine_code(byte: u8, address: usize) -> bool {
  if address > CODE_RANGE_END {
    false
  } else {
    unsafe {
      MEMORY[address] = byte
    }
    true
  }
}


#[wasm_bindgen::prelude::wasm_bindgen]
pub fn set_to_register(register: usize, value: u32) {
  if register == X0 {
    unsafe {
      REGISTERS[register] = 0
    }
  } else {
    unsafe {
      REGISTERS[register] = value
    }
  }
}

#[wasm_bindgen::prelude::wasm_bindgen]
pub fn get_from_register(register: usize) -> u32 {
  if register == X0 {
    unsafe {
      REGISTERS[register] = 0;
      REGISTERS[register]
    }
  } else {
    unsafe {
      REGISTERS[register]
    }
  }
}

fn create_instruction(byte_1: u8, byte_2: u8, byte_3: u8, byte_4: u8) -> u32 {
  let mut instruction = 0;
  instruction |= byte_1 as u32;
  instruction |= (byte_2 as u32) << 8;
  instruction |= (byte_3 as u32) << 16;
  instruction |= (byte_4 as u32) << 24;
  instruction
}

fn iimm_to_value(instruction: u32) -> u32 {
  let val_1 = (instruction & INST_20) >> 20;
  let val_2 = (instruction & INST_24_21) >> 21;
  let val_3 = (instruction & INST_30_25) >> 25;
  let val_4 = (instruction & INST_31) >> 31;
  (val_4 << 31) | (val_3 << 5) | (val_2 << 1) | val_1
}

fn value_to_iimm(value: u32) -> u32 {
  let imm_1 = (value & INST_20) >> 20;
  let imm_2 = (value & INST_24_21) >> 21;
  let imm_3 = (value & INST_30_25) >> 25;
  let imm_4 = (value & INST_31) >> 31;
  (imm_4 << 31) | (imm_3 << 5) | (imm_2 << 1) | imm_1
}

// simm
// bimm
// uimm
// jimm

fn get_opcode(instruction: u32) -> u32 {
  instruction & 0b1111111
}

fn get_rd(instruction: u32) -> u32 {
  (instruction >> 7) & 0b11111
}

fn get_funct3(instruction: u32) -> u32 {
  (instruction >> 12) & 0b111
}

fn get_rs1(instruction: u32) -> u32 {
  (instruction >> 15) & 0b11111
}

// Disassembler
fn decode_instruction(instruction: u32) -> serde_json::Value {
  if (instruction & 0b11) != 0b11 {
    return serde_json::json!("DASM:DECODE_0B11_END")
  } else if (instruction & 0b11100) == 0b11100 {
    return serde_json::json!("DASM:DECODE_0B11100_END")
  }
  let mut operation = "";
  let mut operand_1 = "";
  let mut operand_2 = "";
  let mut operand_3 = "";
  let mut opcode = get_opcode(instruction);
  if opcode == OP_IMM {
    let rd = get_rd(instruction);
    let funct3 = get_funct3(instruction);
    let rs1 = get_rs1(instruction);
    let iimm = iimm_to_value(instruction);
    match funct3 {
      ADDI => operation = "ADDI",
      _ => return serde_json::json!("DASM:DECODE_0B11100_END") // a
    };
  }
  serde_json::json!({
    operation: [
      operand_1,
      operand_2,
      operand_3
    ]
  })
}

// Emulator
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn execute_instruction() -> bool {
  unsafe {
    ERROR_MESSAGE = "";
  }
  // Fetch
  let current_pc = get_from_register(PC) as usize;
  if (current_pc + 3) > CODE_RANGE_END {
    unsafe {
      ERROR_MESSAGE = "VM:CODE_RANGE_END";
    }
    return false
  }
  let instruction_byte_1;
  let instruction_byte_2;
  let instruction_byte_3;
  let instruction_byte_4;
  unsafe {
    instruction_byte_1 = MEMORY[current_pc];
    instruction_byte_2 = MEMORY[current_pc + 1];
    instruction_byte_3 = MEMORY[current_pc + 2];
    instruction_byte_4 = MEMORY[current_pc + 3];
  }
  let instruction = create_instruction(
    instruction_byte_1,
    instruction_byte_2,
    instruction_byte_3,
    instruction_byte_4
  );
  let next_pc = (current_pc as u32) + 4;

  // Decode
  /*
  if (instruction & 0b11) != 0b11 {
    unsafe {
      ERROR_MESSAGE = "VM:DECODE_0B11_END";
    }
    return false
  } else if (instruction & 0b11100) == 0b11100 {
    unsafe {
      ERROR_MESSAGE = "VM:DECODE_0B11100_END";
    }
    return false
  }
  */
  // move to dis ams //????

  // fail -> error

  // execute
  // debug signal -> do
  // check pc-register increment if branch

  // ...

  set_to_register(PC, next_pc);
  true
}
*/
