from musicpy import *

a = (C("Bmaj9", 3) / [2, 3, 4, 1, 5]) % (1 / 8, 1 / 8)
b = (C("Bmaj9", 3) / [2, 3, 4, 1, 5, 2]) % (1 / 8, 1 / 8)
q = a + ~a[1:-1]
q2 = b + ~b[3:-1]
t = (q + q2) * 2
adding = chord(["Bb5", "Ab5", "Gb5", "Ab5"]) % (1 / 2, 1 / 2) * 2
t2 = t & adding
play(
    t2 + (t2 - 3),
    150,
    name="example.mid",
    wait=True,
)
