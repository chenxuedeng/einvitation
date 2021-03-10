// 公共样式
export const commonStyle = {
  rotate: 0,
  opacity: 1,
}

export const commonAttr = {
  animations: [],
  events: {},
  groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
  isLock: false, // 是否锁定组件
}

// 编辑器左侧组件列表
const list = [
  {
    component: 'v-text',
    version: 'v1',
    name: 'VText',
    label: '文字',
    icon: 'wenben',
    propValue: '文字',
    style: {
      width: 200,
      height: 22,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
      color: '#000',
    },
  },
  {
    component: 'Picture',
    version: 'v1',
    name: 'Picture',
    label: '图片',
    icon: 'tupian',
    propValue: 'https://res.zhangu365.com/fodder/img/2020/1127/1551/b281a933d0f29aef485fc1e5a2ac488f.png?x-oss-process=image/resize,w_70',
    style: {
      width: 300,
      height: 200,
      borderRadius: '',
    },
  },
]

for (let i = 0, len = list.length; i < len; i++) {
  const item = list[i]
  item.style = { ...commonStyle, ...item.style }
  list[i] = { ...commonAttr, ...item }
}

export default list
