// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.
(LOOP)
@8192
D=A
@i
M=D
@color
M=0

@KBD
D=M

@BLACK
D;JNE

(FILL)
@SCREEN
D=A

@line_ptr
M=D

(DRAW_LINE)

@i
D=M

@LOOP
D;JEQ

@color
D=M

@line_ptr
A=M

M=D

@line_ptr
M=M+1

@i
M=M-1

@DRAW_LINE
0;JMP


(BLACK)
@color
M=-1

@FILL
0;JMP
