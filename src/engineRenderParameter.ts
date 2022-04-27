//- Color
export interface Color
{
    color?: number,
    opacity?: number
}
export interface ColorWidth extends Color
{
    width?: number
}
export const DefaultColor: Color = {
    color: 0xffffff,
    opacity: 1
}
export const DefaultColorWidth: ColorWidth = {
    width: 1,
    ...DefaultColor
}

//- Drawable
export interface Drawable
{
    stroke?: ColorWidth
    fill?: Color
}
export const DefaultDrawable: Drawable = {
    stroke: DefaultColor,
    fill: DefaultColorWidth
}

//- Shapes
export interface Circle extends Drawable
{
    radius?: number
}
export interface Rectangle extends Drawable
{
    points?: number[][]
}
export const DefaultRectangle: Rectangle = {
    points: [[0, 0], [1, 1]],
    ...DefaultDrawable
}
export const DefaultCircle: Circle = {
    radius: 1,
    ...DefaultDrawable
}

//- Shape Drawing
export interface PointArray extends Drawable
{
    points?: number[][]
}
export const DefaultPointArray: PointArray = {
    points: [],
    ...DefaultDrawable
}