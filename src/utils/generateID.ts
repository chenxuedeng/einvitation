let pageId = 0
let eleId = 0
// 主要用于 Vue 的 diff 算法，为每个元素创建一个独一无二的 ID
export function generatePageId() {
  return pageId++
}

export function generateEleId() {
  return eleId++
}
