<template>
  <div class="app-container">
    <div class="resource">
      <div class="resource_header">
        <el-button type="primary" @click="addTopResource"
          >添加顶层菜单</el-button
        >
      </div>
      <div class="resource_body">
        <el-container>
          <el-aside width="250px">
            <el-tree
              :data="treeData"
              :highlight-current="true"
              node-key="id"
              :props="dialogData.defaultProps"
              :auto-expand-parent="false"
              :expand-on-click-node="true"
              :default-expanded-keys="defaultExpandedKeys"
              @node-click="checkedNode"
              @node-expand="expandNode"
              @node-collapse="collapseNode"
            />
          </el-aside>
          <el-main>
            <el-table :data="tabledata" border style="width: 100%">
              <el-table-column prop="name" label="名称" align="center" />
              <el-table-column
                prop="menuType"
                label="类型"
                align="center"
                width="100px"
              >
                <template #default="scope">
                  <div>
                    {{ getMenuType(scope.row.menuType) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="uri" label="url" align="center" />
              <el-table-column
                prop="sort"
                label="排序"
                align="center"
                width="100px"
              />
              <el-table-column
                prop="icon"
                label="图标"
                align="center"
                width="100px"
              />
              <el-table-column
                prop="alias"
                label="资源别名"
                align="center"
                width="100px"
              />
              <el-table-column
                prop="tabName"
                label="标签页名称"
                align="center"
                width="100px"
              />
              <el-table-column
                prop="code"
                label="资源code"
                align="center"
                width="100px"
              />
              <el-table-column
                prop="businessCategory"
                label="操作"
                align="center"
              >
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    @click="addChidrenNode(scope.row)"
                    >增加子节点
                  </el-button>
                  <el-button link type="success" @click="editNode(scope.row)">
                    编辑
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    @click="deleteNodesopt(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </div>
    </div>
    <!-- 弹框---添加顶层菜单 -->
    <el-dialog
      v-model="topDialogVisible"
      title="添加顶层菜单"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="topFormRef"
        :model="dialogData.formData"
        label-width="110px"
        :rules="dialogData.rules"
        size="default"
      >
        <el-col :span="24">
          <el-form-item label="资源类型" prop="menuType">
            <el-select
              v-model="dialogData.formData.menuType"
              placeholder="资源类型"
            >
              <el-option
                v-for="item in resourceType"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="资源名称" prop="name">
            <el-input
              v-model="dialogData.formData.name"
              placeholder="资源名称"
            />
          </el-form-item>
          <el-form-item label="资源别名" prop="alias">
            <el-input
              v-model="dialogData.formData.alias"
              type="text"
              placeholder="顶层菜单必填资源别名"
            />
          </el-form-item>
          <el-form-item label="标签页名称" prop="tabName">
            <el-input
              v-model="dialogData.formData.tabName"
              type="text"
              placeholder="标签页名称"
            />
          </el-form-item>
          <el-form-item label="资源code" prop="code">
            <el-input
              v-model="dialogData.formData.code"
              type="text"
              placeholder="按钮权限必填，路径，文件夹或文件名"
            />
          </el-form-item>
          <el-form-item label="url" prop="uri">
            <el-input v-model="dialogData.formData.uri" placeholder="url" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="dialogData.formData.sort" placeholder="排序" />
          </el-form-item>
          <el-form-item label="资源图标" prop="icon">
            <el-input
              v-model="dialogData.formData.icon"
              type="text"
              placeholder="只有顶层菜单需要图标美化"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <el-button @click="topDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDialog()">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="configurestaffresource">
  import { reactive, ref, onMounted } from 'vue';
  import {
    getResourceList,
    getResourceDetail,
    modifyResource,
    deleteResource
  } from '@/api/configure/resource';
  import { ElMessage } from 'element-plus';
  //#region 表单校验
  const menuType = (rule, value, callback) => {
    if (
      (dialogData.formData.menuType === 1 || dialogData.formData.pid === 0) &&
      value === 2
    ) {
      return callback(new Error('顶层菜单资源类型不能为按钮'));
    } else if (value === '') {
      return callback(new Error('请选择资源类型'));
    } else {
      callback();
    }
  };
  const url = (rule, value, callback) => {
    if (dialogData.formData.menuType === 1 && value === '') {
      return callback(new Error('菜单类型资源必填url'));
    } else {
      callback();
    }
  };
  const icon = (rule, value, callback) => {
    if (dialogData.formData.pid === 0 && value === '') {
      return callback(new Error('顶层菜单icon必填'));
    } else {
      callback();
    }
  };
  const alias = (rule, value, callback) => {
    if (dialogData.formData.pid === 0 && value === '') {
      return callback(new Error('顶层菜单别名必填'));
    } else {
      callback();
    }
  };
  const codeV = (rule, value, callback) => {
    console.log('value', value);
    if (dialogData.formData.menuType === 2 && value === '') {
      return callback(new Error('按钮类型的资源code必填'));
    } else {
      callback();
    }
  };
  //#endregion
  //新增弹框默认数据
  const dialogData = reactive({
    Visible: false,
    formData: {
      code: '',
      icon: '',
      menuType: '',
      uri: '',
      sort: '',
      name: '',
      alias: '',
      type: '1'
    },
    defaultProps: {
      children: 'sub',
      label: 'name'
    },
    dialogTitle: '',
    rules: {
      menuType: [{ required: true, trigger: 'blur', validator: menuType }],
      name: [{ required: true, trigger: 'blur', message: '请填写资源名称' }],
      code: [{ required: true, trigger: 'blur', validator: codeV }],
      uri: [{ required: true, trigger: 'blur', validator: url }],
      icon: [{ required: true, trigger: 'blur', validator: icon }],
      alias: [{ required: true, trigger: 'blur', validator: alias }]
    }
  });
  //#region 树形结构
  const treeData = ref(null); //菜单树数据
  const treeRenderHandle = async () => {
    let res = await getResourceList();
    treeData.value = res.data;
  };
  //初始化树形结构
  onMounted(async () => {
    try {
      await treeRenderHandle();
    } catch (err) {
      console.log(err);
    }
  });
  //#endregion

  let tabledata = reactive([]);
  let defaultExpandedKeys = ref([]);
  //表格结构
  const getResourceDetailHandle = async (id) => {
    try {
      tabledata.length = 0; //vue3只能通过这种方式置空
      let res = await getResourceDetail(id);
      tabledata.push(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  //添加顶层菜单
  let topDialogVisible = ref(false);
  const resourceType = [
    { value: 1, name: '菜单' },
    { value: 2, name: '按钮' }
  ];
  const topFormRef = ref();
  const addTopResource = async () => {
    //展开弹框
    topDialogVisible.value = true;
    //原始数据置空
    dialogData.formData = {
      code: '',
      icon: '',
      menuType: '',
      uri: '',
      sort: '',
      name: '',
      alias: '',
      type: '1'
    };
  };
  const modifyResourceHandle = async (data) => {
    try {
      let msg = data.id ? '编辑菜单成功' : '新增菜单成功';
      let res = await modifyResource(data);
      ElMessage({
        message: res.msg || msg,
        type: 'success'
      });
      topDialogVisible.value = false;
      //重新渲染树
      await treeRenderHandle();
      // 保留节点对应的表格信息
      getResourceDetailHandle(data.id);
    } catch (err) {
      console.log(err);
    }
  };
  const confirmDialog = async () => {
    console.log('confirmDialog', dialogData.formData);
    //执行事件
    topFormRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const {
            code,
            name,
            sort,
            id,
            menuType,
            icon,
            pid,
            uri,
            alias,
            tabName
          } = dialogData.formData;
          await modifyResourceHandle({
            code,
            name,
            sort,
            id,
            menuType,
            icon,
            pid,
            uri,
            alias,
            tabName
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  // 树节点被展开
  const expandNode = (data) => {
    let flag = false;
    defaultExpandedKeys.value.some((item) => {
      if (item === data.id) {
        flag = true;
        return true;
      }
    });
    if (!flag) {
      defaultExpandedKeys.value.push(data.id);
    }
  };

  // 树节点被关闭
  const collapseNode = (data) => {
    defaultExpandedKeys.value.some((item, i) => {
      if (item === data.id) {
        defaultExpandedKeys.value.length = i;
      }
    });
  };

  //树节点点击事件
  const checkedNode = (data) => {
    getResourceDetailHandle(data.id);
  };
  //获取类型
  const getMenuType = (type) => {
    let obj = { 1: '菜单', 2: '按钮' };
    return obj[type];
  };
  //增加子节点
  const addChidrenNode = (data) => {
    topDialogVisible.value = true;
    dialogData.formData = {
      pid: data.id,
      code: '',
      icon: '',
      menuType: '',
      uri: '',
      sort: '',
      name: '',
      alias: '',
      type: '1'
    };
  };
  //编辑当前节点
  const editNode = async (data) => {
    data.type = '2';
    topDialogVisible.value = true;
    dialogData.formData = data;
  };
  const deleteNodesopt = async (data) => {
    try {
      let { id } = data;
      await deleteResource(id);
      //删除完成以后,刷新tree,提示删除成功
      ElMessage({
        message: '删除成功',
        type: 'success'
      });
      //重新渲染树
      await treeRenderHandle();
      //表格清空
      tabledata.length = 0;
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style lang="scss" scoped>
  .resource {
    background: #fff;
    height: calc(100vh - 80px);
    padding: 10px;
    box-sizing: border-box;
    .resource_header {
      margin-bottom: 15px;
    }
    :deep(.el-aside) {
      max-height: calc(100vh - 140px);
      overflow-y: auto;
      box-sizing: border-box;
      border: 1px solid #ccc;
      //自定义滚动条,添加动画
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #ccc;
      }
      &::-webkit-scrollbar-track {
        border-radius: 5px;
        background: #fff;
      }
    }
  }
</style>
