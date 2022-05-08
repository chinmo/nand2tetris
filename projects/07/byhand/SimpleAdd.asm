@256
D=A
@SP
M=D
// push constant 7
@7
D=A
@SP
A=M
M=D
@SP
AM=M+1 // 257

// push constant 8
@8
D=A
@SP
A=M
M=D
@SP
AM=M+1 // 258

// add
@SP // R0(258)
AM=M-1 // A, SP = 257
D=M // D = RAM[257](=8)
A=A-1 // A = 256
M=M+D // RAM[256] = RAM[256] + 8
