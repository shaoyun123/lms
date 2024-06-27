<template>
  <div
    :index="sessionListData.id"
    @mouseenter="mouseEnter(index)"
    @mouseleave="mouseLeave"
    @click="toChat(sessionListData, index)"
  >
    <el-col :span="5">
      <img :src="sessionListData.headUrl" width="50" />
    </el-col>
    <el-col :span="19">
      <el-row>
        <el-col :span="18" style="font-weight: bold">{{
          sessionListData.title
        }}</el-col>
        <el-col :span="2" style="text-align: right">
          <el-badge
            :value="
              sessionListData.unreadCount <= 0
                ? ''
                : sessionListData.unreadCount
            "
            :max="99"
          ></el-badge>
        </el-col>
        <el-col :span="4" style="text-align: right">{{
          util.formatDate.format(
            new Date(sessionListData.lastMessageTime),
            'MM-dd'
          )
        }}</el-col>
      </el-row>
      <el-row>
        <span style="color: #bbb">{{ sessionListData.summary }}</span
        ><br />
        <span v-if="sessionListData.tags">
          <el-tag type="danger" size="mini">{{ sessionListData.tags }}</el-tag>
        </span>
      </el-row>
    </el-col>
  </div>
</template>

<script>
  export default {
    props: {
      sessionListData: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {};
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
      // 鼠标移入
      mouseEnter(index) {
        this.enterVal = index;
        this.active = {
          'background-color': '#ecf5ff',
          cursor: 'pointer'
        };
      },
      // 鼠标移出
      mouseLeave() {
        this.enterVal = '';
        this.active = '';
      }
    }
  };
</script>

<style scoped></style>
