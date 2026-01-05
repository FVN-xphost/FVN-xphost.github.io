import { writable } from "svelte/store"

export const saveData = writable({})
export const boardText = writable('')
export const galleryOpen = writable(false)
export const galleryLock = writable([
    {
        lock: true,
        images: []
    },
    {
        lock: true,
        images: []
    },
    {
        lock: true,
        images: []
    },
    {
        lock: true,
        images: []
    },
    {
        lock: true,
        images: []
    },
    {
        lock: true,
        images: []
    }
])