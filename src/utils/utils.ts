export function deepCopy(target:unknown) {
  if (typeof target == 'object') {
    const result = Array.isArray(target)? [] : {}
    for (const key in target) {
      if (typeof target[key] == 'object') {
        result[key] = deepCopy(target[key])
      } else {
        result[key] = target[key]
      }
    }

    return result
  }
    
  return target
}

export function swap(arr: object[], i:number, j:number) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

export function $(selector: string) {
  return document.querySelector(selector)
}