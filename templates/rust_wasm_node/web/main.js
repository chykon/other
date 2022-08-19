/*
import * as memory from './old/memory.js'
import * as common from './old/common.js'
import * as vcore from './old/vcore.js'
import * as assembler from './old/assembler.js'
import * as test from './old/test.js'
import * as rivium from './rust/rivium.js'
import * as vscode from 'vscode'
*/

const memory = require('./old/memory.js')
const common = require('./old/common.js')
const vcore = require('./old/vcore.js')
const assembler = require('./old/assembler.js')
const test = require('./old/test.js')
const rivium = require('./rust/rivium.js')
const vscode = require('vscode')

class Rivium {
  constructor () {
    this.mem = null
    this.core = null
  }

  async init () {
    rivium.set_panic_hook()
    this.mem = new memory.Memory(
      common.Xlen.word,
      common.Vcount.one,
      common.Mrcount.default,
      common.Mempow.min
    )
    this.core = new vcore.Vcore(
      this.mem,
      common.Vnum.zero,
      common.Ialign.word,
      common.Ilen.word
    )
  }

  test () {
    new test.Test().testingAll()
  }

  assemblySourceCode (sourceCode) {
    return assembler.assembly(sourceCode, this.core)
  }

  loadMachineCode (machineCode) {
    for (let i = 0; i < machineCode.length; ++i) {
      this.mem?.setByte(i, machineCode[i])
    }
    return machineCode
  }

  translateIntermediate (arrayCode) {
    return rivium.jsonify_intermediate(arrayCode)
  }

  fetchInstruction () {
    this.core?.fetchInstruction()
  }

  disassembly (byte1, byte2, byte3, byte4) {
    const mem = new memory.Memory(
      common.Xlen.word,
      common.Vcount.one,
      common.Mrcount.default,
      common.Mempow.min
    )
    const core = new vcore.Vcore(
      mem,
      common.Vnum.zero,
      common.Ialign.word,
      common.Ilen.word
    )
    mem.setByte(0, byte1)
    mem.setByte(1, byte2)
    mem.setByte(2, byte3)
    mem.setByte(3, byte4)
    const intermediate = []
    core.fetchInstruction(intermediate)
    return intermediate.pop()
  }

  intermediateToText (string) {
    return rivium.intermediate_to_text(string)
  }

  analyze (string) {
    return rivium.analyze(string)
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  const output = vscode.window.createOutputChannel('rivium')
  /**
   * @type {Rivium}
   */
  let rv

  const init = vscode.commands.registerCommand('rivium.init', async () => {
    rv = new Rivium()
    await rv.init()
    output.appendLine('init')
  })

  const execute = vscode.commands.registerCommand('rivium.execute', () => {
    const editor = vscode.window.activeTextEditor
    const document = editor?.document
    const text = document?.getText()
    const mcode = rv.assemblySourceCode(text)
    for (let i = 0; i < mcode.length; ++i) {
      rv.mem?.setByte(i, mcode[i])
    }
    while (true) {
      try {
        rv.fetchInstruction()
      } catch (e) {
        output.appendLine(e)
        break
      }
    }
    output.appendLine('executed')
  })

  const getMemory = vscode.commands.registerCommand('rivium.getMemory', () => {
    for (let i = 0; i < 2048; ++i) {
      output.appendLine('mem[' + i + ']: ' + rv.mem?.getByte(i))
    }
  })

  const getRegisters = vscode.commands.registerCommand('rivium.getRegisters', () => {
    for (let i = 0; i < 33; ++i) {
      let value
      let str
      if (i === 32) {
        value = rv.core?.getRegisterValue(i, true)
        str = 'reg[pc]: ' + value
      } else {
        value = rv.core?.getRegisterValue(i)
        str = 'reg[x' + i + ']: ' + value
      }
      output.appendLine(str)
    }
  })

  context.subscriptions.push(init, execute, getMemory, getRegisters)
}

module.exports = {
  activate
}
