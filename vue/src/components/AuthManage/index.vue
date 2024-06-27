<template>
  <el-dialog
    v-model="isVisible"
    title="查看授权"
    width="80%"
    class="authManage-layer"
    draggable
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="12">
          <h1 class="auth-h1">授权店铺</h1>
          <div>
            <el-select
              v-model="storeValue"
              filterable
              clearable
              multiple
              collapse-tags
              collapse-tags-tooltip
              style="width: 150px"
            >
              <el-option
                v-for="item in availableListUser"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              />
            </el-select>
            <el-button
              type="primary"
              class="addAuth-btn"
              @click="addAuthHandle"
            >
              新增授权
            </el-button>
          </div>
          <div class="auth-title">店铺已授权</div>
          <div>
            <el-table :data="storeTableData" border max-height="500">
              <el-table-column prop="masterTypeStr" label="类别" />
              <el-table-column prop="masterValStr" label="名称" />
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-popconfirm
                    title="确定取消授权吗?"
                    @confirm="cancelAuthHandle(scope.row)"
                  >
                    <template #reference>
                      <el-button type="danger"> 取消授权 </el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="12">
          <h1 class="auth-h1">授权平台</h1>
          <!-- <div>
            <el-select
              v-model="platValue"
              filterable
              clearable
              multiple
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="item in availableListPlat"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-button
              type="primary"
              class="addAuth-btn"
              @click="addAuthPlatHandle"
            >
              新增授权
            </el-button>
          </div> -->
          <div class="auth-title">平台已授权</div>
          <div>
            <el-table :data="platTableData" border max-height="500">
              <el-table-column prop="masterTypeStr" label="类别" />
              <el-table-column prop="masterValStr" label="名称" />
              <!-- <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-popconfirm
                    title="确定取消授权吗?"
                    @confirm="cancelAuthPlatHandle(scope.row)"
                  >
                    <template #reference>
                      <el-button type="danger"> 取消授权 </el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script setup>
  import { toRefs, ref } from 'vue';
  import {
    getAvailableListUserAjax,
    listAuthorizedRoleUserByStoreAcctIdAjax,
    userStoreAcctAuthorizeAjax,
    storeAcctCancelAuthorizationAjax,
    getAvailableListRoleAjax,
    // rolePlatAuthorizeAjax,
    listAuthorizedRoleUserByPlatCodeAjax
    // platCancelAuthorizationAjax
  } from '@/api/common/index';
  import { ElMessage } from 'element-plus';
  const emits = defineEmits(['close', 'update:isVisible']);
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    //接口请求参数
    authInfo: {
      type: Object,
      default: () => {}
    }
  });
  const { isVisible, authInfo } = toRefs(props);
  // 关闭弹窗
  const handleClose = () => {
    emits('close');
  };
  //#region 渲染店铺
  //请求接口获取所有用户
  const storeValue = ref([]);
  const availableListUser = ref([]);
  const getAvailableListUser = async () => {
    const res = await getAvailableListUserAjax();
    availableListUser.value = res.data;
  };
  getAvailableListUser();

  //点击新增授权
  const addAuthHandle = () => {
    let obj = {
      storeAcctId: authInfo.value.id,
      userIds: storeValue.value.join(',')
    };
    //新增完成以后重新获取可用用户列表
    userStoreAcctAuthorizeAjax(obj).then((res) => {
      //清空已选中的用户
      storeValue.value = [];
      //提示新增成功
      ElMessage.success((res && res.msg) || '操作成功');
      getAuthorizedRoleUserByStoreAcctId();
    });
  };
  //获取可用用户列表
  const storeTableData = ref([]);
  const getAuthorizedRoleUserByStoreAcctId = async () => {
    const res = await listAuthorizedRoleUserByStoreAcctIdAjax(
      authInfo.value.id
    );
    storeTableData.value = res.data;
  };
  getAuthorizedRoleUserByStoreAcctId();
  //点击取消授权
  const cancelAuthHandle = (row) => {
    let obj = {
      id: row.id
    };
    storeAcctCancelAuthorizationAjax(obj).then((res) => {
      //提示取消成功
      ElMessage.success((res && res.msg) || '操作成功');
      getAuthorizedRoleUserByStoreAcctId();
    });
  };
  //#endregion

  //#region 渲染平台
  // const platValue = ref([]);
  const availableListPlat = ref([]);
  // //点击新增授权(平台)
  // const addAuthPlatHandle = () => {
  //   let obj = {
  //     platCode: authInfo.value.platCode,
  //     roleIds: platValue.value.join(',')
  //   };
  //   rolePlatAuthorizeAjax(obj).then((res) => {
  //     //清空已选中的值
  //     platValue.value = [];
  //     //提示新增成功
  //     ElMessage.success((res && res.msg) || '操作成功');
  //     //重新获取平台已授权列表
  //     getAuthorizedRoleUserByPlatCode();
  //   });
  // };
  //请求接口获取所有可用平台
  const getAvailableListPlat = async () => {
    const res = await getAvailableListRoleAjax();
    availableListPlat.value = res.data;
  };
  getAvailableListPlat();
  //获取平台已授权列表表格
  const platTableData = ref([]);
  const getAuthorizedRoleUserByPlatCode = async () => {
    const res = await listAuthorizedRoleUserByPlatCodeAjax(
      authInfo.value.platCode
    );
    platTableData.value = res.data;
  };
  getAuthorizedRoleUserByPlatCode();
  // //取消平台授权
  // const cancelAuthPlatHandle = (row) => {
  //   let obj = {
  //     platCode: authInfo.value.platCode,
  //     id: row.id,
  //     masterType: row.masterType
  //   };
  //   platCancelAuthorizationAjax(obj).then((res) => {
  //     //提示取消成功
  //     ElMessage.success((res && res.msg) || '操作成功');
  //     getAuthorizedRoleUserByPlatCode();
  //   });
  // };
</script>

<style lang="scss" scoped>
  .authManage-layer {
    .container {
      width: 100%;
      height: 600px;
      .addAuth-btn {
        margin-left: 10px;
      }
      .auth-title {
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      .auth-h1 {
        font-weight: 900;
        font-size: 20px;
        margin-bottom: 5px;
      }
    }
  }
</style>
