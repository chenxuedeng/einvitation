import Layout from '/@/page/index/index.vue'
export default [
  {
    label: '用户管理',
    path: '/user',
    component: Layout,
    redicect: '/userList',
    children: [
      {
        path: '/userList',
        name: 'userList',
        component: () => import('/@/views/user/index.vue'),
      },
    ],
  },
]