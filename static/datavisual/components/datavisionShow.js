var datavisionShowTemplate = `
    <div class="datavisionShow" v-if="regionAndShelvesdata">
        <table>
            <tr v-for="(regionTr,regionTrIndex) in regionAndShelvesdata" :key="regionTrIndex">
                <td v-for="(regionData,regionTdIndex) in regionTr" :key="regionTdIndex" v-if="regionData.regionCode">
                    <div style="border: 1px solid #ccc">
                        <el-tag>{{ regionData.regionCode }}({{regionData.floorX}}, {{regionData.floorY}})</el-tag>
                        <table v-if="regionData.shelfList">
                            <tr v-for="(shelfTr,shelfTrIndex) in regionData.shelfList" :key="shelfTrIndex">
                                <td v-for="(shelfData,shelfTdIndex) in shelfTr"  :key="shelfTdIndex" v-if="shelfData.status">
                                    <el-card  shadow="never" class="box-card" :key="shelfData.shelfId">
                                        <div slot="header" class="clearfix">
                                            <el-tag type="danger">{{ shelfData.shelfCode }}({{ shelfData.regionX }},{{ shelfData.regionY }} )</el-tag>
                                        </div>
                                        <div class="singleShelves" v-if="shelfData.locationDataList">
                                            <table class="shelfTable" border="0" cellspacing="0" cellpadding="0">
                                                <tr v-for="(hang,i) in shelfData.locationDataList" :key="i">
                                                    <td v-for="(lie,j) in hang" :key="lie.locationId" :style="{background:lie.cr}">
                                                        <span v-if="lie.lc">
                                                            <el-tooltip placement="top-start">
                                                                <div slot="content">
                                                                    sku: {{lie.sku}}<br/>
                                                                库位号: {{lie.lc}}<br/>
                                                                日均销量: {{lie.d1}}<br/>
                                                                可用库存: {{lie.as}}<br/>
                                                                开发时间: {{lie.ct}}<br/>
                                                            库存周转天数: {{lie.s1}}<br/>
                                                                商品状态: {{lie.is}}<br/>
                                                                </div>
                                                                <span>{{lie.v}}</span>
                                                            </el-tooltip>
                                                        </span>
                                                        <span v-else style="color:#ccc;cursor:no-drop!important">
                                                          占
                                                        </span>
                                                    </td> 
                                                </tr>
                                            </table>
                                        </div>
                                        <div class="singleShelves" v-else>
                                            <table class="shelfTable" border="0" cellspacing="0" cellpadding="0">
                                                <tr v-for="hang in shelfData.sepcRowNum" :key="hang">
                                                    <td v-for="lie in shelfData.sepcColumnNum" :key="lie">
                                                        <span class="fs10">无</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </el-card>
                                </td>
                                <td v-else>
                                </td>
                            </tr>
                        <table>
                        <table v-else>
                           <tr>
                              <td>此区域下暂无货架</td>
                           </tr>
                        </table>
                    </div>
                </td>
                <td v-else>
                </td>
            </tr>
        </table>
    </div>
    <div class="datavisionShow" v-else>
       暂无数据...
    </div>
`
var datavisionShow = {
    template: datavisionShowTemplate,
    data () {
        return {
            loading: false
        }
    },
    computed: {
        regionAndShelvesdata () {
            var data = this.$store.state.regionAndShelvesdata
            return  Object.freeze(data)
        },
        timeTransfe (str) {
            return new Date(str).toLocaleDateString()
        }
    }
}