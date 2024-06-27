/*
 * @Author: ztao
 * @Date: 2023-02-11 16:37:14
 * @LastEditTime: 2023-02-13 10:13:53
 * @Description: 固定的三层目录结构
 * isVue==0 表示非最终子节点,不用关注
 * menuType=1 && isVue==1 表示是vue写的页面
 * menuType=1 && isVue==2 表示是jsp写的页面
 * menuType=1 && isVue==1 表示是vue的按钮权限
 * jsp的按钮权限不用管
 */
export default [
  {
    url: '/mock/menus',
    method: 'get',
    response: () => {
      return {
        code: '0000',
        message: '获取菜单成功',
        data: [
          {
            id: 900027, //当前数据的id
            pid: 0, //父级id,0表示最上级
            name: '配置', //原名
            alias: '配置', //别名,其实也用不到,也不需要
            code: 'configuration', //配置码
            uri: '/configuration', //每一个层级对应的链接
            isVue: 0, //0表示非最终节点
            menuType: 1, //1表示菜单
            sort: 1, //排序,后端返回的顺序
            icon: 'lock', //图标,但是我们用不到,不需要
            // checked: true, //表示有权限?这个是加在什么位置?菜单不需要
            sub: [
              {
                id: 900030,
                pid: 900027,
                name: '人员',
                code: 'staff',
                uri: '/configuration/staff',
                isVue: 0, //0表示非最终节点
                menuType: 1,
                sort: 1,
                sub: [
                  {
                    id: 900123,
                    pid: 900030,
                    name: '测试按钮',
                    code: 'testCode',
                    uri: '',
                    menuType: 2, //2表示按钮
                    isVue: 1,
                    sort: 1
                  },
                  {
                    id: 900125,
                    pid: 900030,
                    name: 'vue资源',
                    code: 'resource',
                    uri: '/configuration/staff/resource',
                    menuType: 1,
                    isVue: 1,
                    sort: 2
                  },
                  {
                    id: 900126,
                    pid: 900030,
                    name: 'lms资源',
                    code: 'resource',
                    uri: '/configuration/staff/resource',
                    menuType: 1,
                    isVue: 2,
                    sort: 3
                  },
                  {
                    id: 900127,
                    pid: 900030,
                    name: '组织用户',
                    code: 'organization',
                    uri: '/configuration/staff/organization',
                    menuType: 1,
                    isVue: 2,
                    sort: 3
                  },
                  {
                    id: 900128,
                    pid: 900030,
                    name: '角色',
                    code: 'role',
                    uri: '/configuration/staff/role',
                    menuType: 1,
                    isVue: 2,
                    sort: 3
                  }
                ]
              },
              {
                id: 900119,
                pid: 900027,
                name: '店铺',
                code: 'store',
                uri: '/configuration/store',
                menuType: 1,
                isVue: 0,
                sort: 2,
                sub: [
                  {
                    id: 900120,
                    pid: 900119,
                    name: 'Mercado店铺',
                    isVue: 1,
                    code: 'mercadoaccount',
                    uri: '/configuration/store/mercadoaccount',
                    menuType: 1,
                    sort: 1
                  },
                  {
                    id: 900121,
                    pid: 900119,
                    name: 'wish店铺',
                    isVue: 2, //jsp页面
                    code: 'wishAccount',
                    uri: '/configuration/store/wishAccount',
                    menuType: 1,
                    sort: 2
                  }
                ]
              },
              {
                id: 900120,
                pid: 900027,
                name: '其他',
                code: 'other',
                uri: '/configuration/other',
                menuType: 1,
                isVue: 0,
                sort: 3,
                sub: [
                  {
                    id: 900140,
                    pid: 900120,
                    name: '币种汇率',
                    isVue: 2, //jsp页面
                    code: 'exchangerate',
                    uri: '/configuration/other/exchangerate',
                    menuType: 1,
                    sort: 1
                  },
                  {
                    id: 900141,
                    pid: 900120,
                    name: '标签字典',
                    isVue: 2, //jsp页面
                    code: 'labeldict',
                    uri: '/configuration/other/labeldict',
                    menuType: 1,
                    sort: 2
                  },
                  {
                    id: 900142,
                    pid: 900120,
                    name: '语音播报',
                    isVue: 2, //jsp页面
                    code: 'voiceSpeech',
                    uri: '/configuration/other/voiceSpeech',
                    menuType: 1,
                    sort: 3
                  },
                  {
                    id: 900143,
                    pid: 900120,
                    name: '定时报表',
                    isVue: 2, //jsp页面
                    code: 'timetask',
                    uri: '/configuration/other/timetask',
                    menuType: 1,
                    sort: 4
                  }
                ]
              }
            ]
          }
        ]
      };
    }
  }
];
