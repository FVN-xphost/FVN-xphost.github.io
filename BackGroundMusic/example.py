from musicpy import *
a11 = translate('D, G, D, a:1/8;., E[l:1/4; i:.], G[l:1/8; i:.] | F#, G, F#, G, a:1/16;., n:1, B[l:1/8; i:.], G[l:1/8; i:.], u:1, G[l:1/8; i:.], E[l:1/8; i:.], E[l:1/4; i:.]') * 2

a12 = translate('D, G, D, a:1/8;., E[l:1/4; i:.]')

a1 = a11 * 2 + a12

a20 = translate('D2, G2, D2, a:1/8;.')

a21 = translate('E2[l:.4; i:.] | E2[l:.16; i:.; r:2], E2[l:.8; i:.], n:1, u:1, r:4, E2[l:.16; i:.; r:2], D2[l:.8; i:.; r:3]')

a22 = translate('C2[l:.4; i:.] | C2[l:.16; i:.; r:2], C2[l:.8; i:.], n:1, u:1, r:4, C2[l:.16; i:.; r:2], D2[l:.8; i:.; r:3]')

a23 = translate('D2, G2, D2, a:1/8;., E2[l:.4; i:.]')

a2 = a20 + a21 * 2 + a22 + a21[:-3] + a23

a3 = drum('C;S;K[l:1/4; i:.], H, S, H, K, H, S, H, K, H, S, H, S[r:3], r:4, C;S;K[l:1/4; i:.]').notes

a41 = translate('F#, G, F#, a:1/8;., G[l:1/4; i:.], B4[l:1/8; i:.] | A, B, A, B, a:1/16;., n:1, D5[l:1/8; i:.], B4[l:1/8; i:.], u:1, B[l:1/8;i:.], G[l:1/8; i:.], G[l:1/4; i:.]') * 2

a42 = translate('F#, G, F#, a:1/8;., G[l:1/4; i:.]')

a4 = a41 * 2 + a42

a4.set_volume(80)

result = P([a1, a2, a3, a4], [31, 34, 1, 31], channels=[0, 1, 9, 2], bpm=165, start_times=[0, 0, 3/8, 0])
play(
    result,
    name="example.mid",
    wait=True,
)
