// 主要用于公共接口的的数据获取，适用于没有参数的接口
// 该处适用的接口尽量取自/api/common/index.js 避免重复
import { defineStore } from 'pinia';
import {
  queryOaNewCategoryOrigin,
  queryOaCategoryOrigin,
  getCateTreeOrigin,
  getLogisListApiOrigin,
  getCurrencyEnumApiOrigin,
  getDevTypeListApiOrigin,
  getLeavedUserOrigin,
  getAllUserPermissionListApi
} from '@/api/common';
import { isEmpty } from 'lodash-es';

const useComApiDataStore = defineStore('comApi', {
  state: () => ({
    oaNewCategaryList: '', // oa新类目
    oaCategoryList: [], // oa类目
    mercadoCateTree: [], // 美客多类目
    listlogisattr: [], // 物流属性
    currencyEnum: [], // 币种枚举
    preProdDevTypeEnum: [], // 开发类型
    leavedUserList: [], // 采购员
    allUserPermissionList: [] // 权限中所用用户
  }),
  // getters: {},
  actions: {
    // oa新类目
    async fetchOaNewCategary() {
      try {
        if (isEmpty(this.oaNewCategaryList)) {
          const { data } = await queryOaNewCategoryOrigin();
          this.oaNewCategaryList = data;
        }
        return this.oaNewCategaryList;
      } catch (e) {
        console.error(e);
      }
    },
    // oa类目
    async fetchOaCategary() {
      try {
        if (isEmpty(this.oaCategoryList)) {
          const { data } = await queryOaCategoryOrigin();
          this.oaCategoryList = data;
        }
        return this.oaCategoryList;
      } catch (e) {
        console.error(e);
      }
    },
    // 美客多类目
    async fetchMercadoCateTree() {
      try {
        if (isEmpty(this.mercadoCateTree)) {
          const { data } = await getCateTreeOrigin();
          this.mercadoCateTree = data;
        }
        return this.mercadoCateTree;
      } catch (e) {
        console.error(e);
      }
    },
    // 物流属性
    async fetchListlogisattr() {
      try {
        if (isEmpty(this.listlogisattr)) {
          const { data } = await getLogisListApiOrigin();
          this.listlogisattr = data;
        }
        return this.listlogisattr;
      } catch (e) {
        console.error(e);
      }
    },
    // 币种枚举
    async fetchCurrencyEnum() {
      try {
        if (isEmpty(this.currencyEnum)) {
          const { data } = await getCurrencyEnumApiOrigin();
          this.currencyEnum = data;
        }
        return this.currencyEnum;
      } catch (e) {
        console.error(e);
      }
    },
    // 开发类型
    async fetchPreProdDevTypeEnum() {
      try {
        if (isEmpty(this.preProdDevTypeEnum)) {
          const { data } = await getDevTypeListApiOrigin();
          this.preProdDevTypeEnum = data;
        }
        return this.preProdDevTypeEnum;
      } catch (e) {
        console.error(e);
      }
    },
    // 采购员
    async fetchLeavedUserList() {
      try {
        if (isEmpty(this.leavedUserList)) {
          const { data } = await getLeavedUserOrigin();
          this.leavedUserList = data;
        }
        return this.leavedUserList;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchAllUserPermissionList() {
      try {
        if (isEmpty(this.allUserPermissionList)) {
          const { data } = await getAllUserPermissionListApi();
          this.allUserPermissionList = data;
        }
        return this.allUserPermissionList;
      } catch (e) {
        console.error(e);
      }
    }
  }
});
export default useComApiDataStore;
