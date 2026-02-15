from musicpy import *

beat = 1 / 8

music = (
    P(
        tracks=[
            C("C", interval=1 / 8, duration=1 / 8),
            chord("E3", 1 / 8, 1 / 8),
            chord("Ax, Gx, Bx", 1 / 8, 1 / 8),
        ],
        instruments=[24, 24, 24],
        bpm=120,
    )
    + P(
        tracks=[chord("E3, E0, E3", 1 / 8, 1 / 8)],
        instruments=[24],
        bpm=120,
    )
    + P(
        tracks=[
            C("Am", interval=1 / 8, duration=1 / 8),
            chord("A0", 1 / 8, 1 / 8),
            chord("E3, E5, E5", 1 / 8, 1 / 8),
        ],
        instruments=[24, 24, 24],
        bpm=120,
    )
)


play(music, name="Chengdu.mid", wait=True)
