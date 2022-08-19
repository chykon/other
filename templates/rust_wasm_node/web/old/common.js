// XLEN - register width
var Xlen;
(function (Xlen) {
  Xlen[Xlen.word = 32] = 'word' // bits
})(Xlen || (Xlen = {}))

// VCOUNT - vcore count
var Vcount;
(function (Vcount) {
  Vcount[Vcount.one = 1] = 'one'
})(Vcount || (Vcount = {}))

// MRCOUNT - max registers count
var Mrcount;
(function (Mrcount) {
  Mrcount[Mrcount.default = 128] = 'default'
})(Mrcount || (Mrcount = {}))

// MEMPOW - powers of 2 for memory length
var Mempow;
(function (Mempow) {
  Mempow[Mempow.min = 16] = 'min'
  Mempow[Mempow.med = 24] = 'med'
  Mempow[Mempow.max = 32] = 'max'
})(Mempow || (Mempow = {}))

// VNUM - vcore number
var Vnum;
(function (Vnum) {
  Vnum[Vnum.zero = 0] = 'zero'
})(Vnum || (Vnum = {}))

// IALIGN - instruction alignment
var Ialign;
(function (Ialign) {
  Ialign[Ialign.word = 32] = 'word'
})(Ialign || (Ialign = {}))

// ILEN - instruction length
var Ilen;
(function (Ilen) {
  Ilen[Ilen.word = 32] = 'word'
})(Ilen || (Ilen = {}))

module.exports = {
  Xlen,
  Vcount,
  Mrcount,
  Mempow,
  Vnum,
  Ialign,
  Ilen
}
