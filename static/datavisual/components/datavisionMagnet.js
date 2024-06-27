var datavisionMagnetTemplate = `
  <div class="datavisionMagnet">
                    <el-table
                    :data="colorConfigData"
                    border
                    style="width: 100%">
                        <!--<el-table-column
                            type="index"
                            label="区间"
                            width="100"
                            align="center">
                        </el-table-column>-->
                        <el-table-column
                        prop="startValue"
                        label="配置信息"
                        width="180"
                        align="center">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="颜色"
                            width="60"
                            align="center">
                            <template slot-scope="scope">
                                <div style="width:20px;height:20px" :style='{background: scope.row.color }'></div>
                            </template>
                        </el-table-column>
                    </el-table>
  </div>
`
var datavisionMagnet = {
    template: datavisionMagnetTemplate,
    computed: {
      colorConfigData () {
        return this.$store.state.colorConfigData
      }
    }
}