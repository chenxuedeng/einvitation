// 编辑器自定义事件
const events = {
  redirect(url:string) {
    if (url) {
      window.location.href = url
    }
  },

  alert(msg:string) {
    if (msg) {
      alert(msg)
    }
  },
}

const mixins = {
  methods: events,
}

const eventList = [
  {
    key: 'redirect',
    label: '跳转事件',
    event: events.redirect,
    param: '',
  },
  {
    key: 'alert',
    label: 'alert 事件',
    event: events.alert,
    param: '',
  },
]

export {
  mixins,
  events,
  eventList,
}