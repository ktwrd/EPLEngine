export enum ESideLocation
{
    NONE,
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}

export const CursorMap: { [key in ESideLocation]?: string; } = Object.fromEntries([
    [ESideLocation.NONE,    'move'],
    [ESideLocation.TOP,     'n-resize'],
    [ESideLocation.BOTTOM,  's-resize'],
    [ESideLocation.LEFT,    'w-resize'],
    [ESideLocation.RIGHT,   'e-resize'],
])
export const ColorMap: { [key in ESideLocation]?: number; } = Object.fromEntries([
    [ESideLocation.NONE,    0xffffff],
    [ESideLocation.TOP,     0xff0000],
    [ESideLocation.BOTTOM,  0xffff00],
    [ESideLocation.LEFT,    0x00ff00],
    [ESideLocation.RIGHT,   0x00ffff],
])