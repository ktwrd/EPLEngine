export function enumKeysAsString<TEnum>(theEnum: TEnum): keyof TEnum {
    // eliminate numeric keys
    const keys = Object.keys(theEnum).filter(x => 
    (+x)+"" !== x) as (keyof TEnum)[];
    // return some random key
    return keys[Math.floor(Math.random()*keys.length)]; 
}