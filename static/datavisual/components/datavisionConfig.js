var datavisionConfigTemplate = `
    <div class="datavisionConfig">
        <el-select v-model="paramconfigVal" placeholder="参数配置" size='small'>
        <el-option
            v-for="item in paramconfigArr"
            :key="item.id"
            :label="item.paramName"
            :value="item.id">
            </el-option>
        </el-select>
        <!--开发时间配置弹框-->
        <el-dialog
        title="参数配置---开发时间"
        :close-on-click-modal="false"
        :visible.sync="WH_DEVELOP_TIME_dialogVisible"
        width="600px">
        <el-table
            :data="developTimeData"
            border
            style="width: 100%">
                <el-table-column
                    type="index"
                    label="区间"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                label="开发时间"
                width="300"
                align="center">
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.startValue"
                            type="date"
                            placeholder="选择日期"
                            size="small">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="颜色"
                    align="center">
                    <template slot-scope="scope">
                       <el-color-picker v-model="scope.row.color"></el-color-picker>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="WH_DEVELOP_TIME_dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click.stop="developTimehandle" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!--日均销量配置弹框-->
        <el-dialog
        title="参数配置---日均销量"
        :close-on-click-modal="false"
        :visible.sync="WH_DAY_AVG_SALES_dialogVisible"
        width="600px">
            <el-table
                :data="dayAvgSaleData"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="区间"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                label="日均销量"
                width="300"
                align="center">
                    <template slot-scope="scope">
                       <el-input-number v-model="scope.row.startValue" size="small" controls-position="right" :min="0"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="颜色"
                    align="center">
                    <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"></el-color-picker>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="WH_DAY_AVG_SALES_dialogVisible=false" size="small">取 消</el-button>
                <el-button type="primary" @click.stop="dayAvgSaleHandle" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!--在售停售配置弹框-->
        <el-dialog
        title="参数配置---商品状态"
        :close-on-click-modal="false"
        :visible.sync="WH_PRODUCT_STATUS_dialogVisible"
        width="600px">
            <el-table
                :data="productStatusData"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="区间"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                label="商品状态"
                width="300"
                align="center">
                    <template slot-scope="scope">
                      <span>
                         {{ scope.row.startValue == '0' ? '停售': '在售' }}
                      </span> 
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="颜色"
                    align="center">
                    <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"></el-color-picker>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="WH_PRODUCT_STATUS_dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click.stop="productStatusHandle" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!--可用库存配置弹框-->
        <el-dialog
        title="参数配置---可用库存"
        :close-on-click-modal="false"
        :visible.sync="WH_AVAIABLE_STOCK_dialogVisible"
        width="600px">
            <el-table
                :data="avaiableStockData"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="区间"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                label="可用库存"
                width="300"
                align="center">
                    <template slot-scope="scope">
                       <el-input-number v-model="scope.row.startValue" size="small" controls-position="right" :min="0"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="颜色"
                    align="center">
                    <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"></el-color-picker>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="WH_AVAIABLE_STOCK_dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click.stop="avaiableStockHandle" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!--库存周转天数配置弹框-->
        <el-dialog
        title="参数配置---库存周转天数"
        :close-on-click-modal="false"
        :visible.sync="WH_INVENTORY_TURNOVER_DAYS_dialogVisible"
        width="600px">
            <el-table
                :data="turnoverDaysData"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="区间"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                label="库存周转天数"
                width="300"
                align="center">
                    <template slot-scope="scope">
                       <el-input-number v-model="scope.row.startValue" size="small" controls-position="right" :min="0"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="颜色"
                    align="center">
                    <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"></el-color-picker>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="WH_INVENTORY_TURNOVER_DAYS_dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click.stop="turnoverDaysHandle" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
`

var datavisionConfig = {
    template: datavisionConfigTemplate,
    data () {
        return {
            paramconfigArr: [ //参数配置项
                {'id': 'WH_DEVELOP_TIME', 'paramName': '开发时间配置'},
                {'id': 'WH_DAY_AVG_SALES', 'paramName': '日均销量配置'},
                {'id': 'WH_PRODUCT_STATUS', 'paramName': '在售停售配置'},
                {'id': 'WH_AVAIABLE_STOCK', 'paramName': '可用库存配置'},
                {'id': 'WH_INVENTORY_TURNOVER_DAYS', 'paramName': '库存周转天数配置'}
            ],
            paramconfigVal: '', //选中的参数配置值
            WH_DEVELOP_TIME_dialogVisible: false, //开发时间配置弹框
            WH_DAY_AVG_SALES_dialogVisible: false, //日均销量弹框
            WH_PRODUCT_STATUS_dialogVisible: false, //在售停售弹框
            WH_AVAIABLE_STOCK_dialogVisible: false, //可用库存弹框
            WH_INVENTORY_TURNOVER_DAYS_dialogVisible: false, //库存周转天数弹框
            developTimeData: [
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'}
            ], //开发时间数组
            dayAvgSaleData: [
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'}
            ], //日均销量数组
            productStatusData: [
                {startValue: '0',color:'#fff'},
                {startValue: '1',color:'#fff'}
            ], //在售停售数组
            avaiableStockData: [
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'}
            ], //可用库存数组
            turnoverDaysData: [
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'},
                {startValue: '',color:'#fff'}
            ] //库存周转天数数组
        }
    },
    methods: {
        validateVal(arr){
            /**
             * obj有2个属性:
             * onoff: 如果是false表示校验失败,true表示校验成功
             * msg: 根据校验的状态传入的不同的值
             */
            var obj = {}
            if(arr[0].startValue ==undefined || arr[0].startValue == null){
                obj.onoff = false
                obj.msg='第一行值不能为空'
            }else{
                obj.onoff = true
                obj.msg=''
                if (!arr[1].startValue){
                    if (arr[2].startValue || arr[3].startValue || arr[4].startValue){
                        obj.onoff = false
                        obj.msg='第二行为空,后面不允许输入'
                    }else {
                        obj.onoff = true
                        obj.msg=''
                    }
                }else if (arr[1].startValue && arr[1].startValue <= arr[0].startValue){
                    obj.onoff = false
                    obj.msg = '第二行值不能小于第一行'
                }else if(arr[1].startValue &&arr[1].startValue > arr[0].startValue){
                    obj.onoff = true
                    obj.msg=''
                    if (!arr[2].startValue){
                        if (arr[3].startValue || arr[4].startValue){
                            obj.onoff = false
                            obj.msg = '第三行值为空,后面不允许输入'
                        }else{
                            obj.onoff = true
                            obj.msg=''
                        }
                    }else if (arr[2].startValue && arr[2].startValue <= arr[1].startValue){
                        obj.onoff = false
                        obj.msg ='第三行值不能小于第二行'
                    }else if (arr[2].startValue && arr[2].startValue > arr[1].startValue){
                        obj.onoff = true
                        obj.msg=''
                        if (!arr[3].startValue){
                            if (arr[4].startValue){
                                obj.onoff = false
                                obj.msg = '第四行值为空,后面不允许输入'
                            }else {
                                obj.onoff = true
                                obj.msg=''
                            }
                        }else if (arr[3].startValue && arr[3].startValue <= arr[2].startValue){
                            obj.onoff = false
                            obj.msg = '第四行值不能小于第三行'
                        }else if (arr[3].startValue && arr[3].startValue > arr[2].startValue){
                            obj.onoff = true
                            obj.msg=''
                            if (arr[4].startValue){
                                if (arr[4].startValue <= arr[3].startValue){
                                    obj.onoff = false
                                    obj.msg = '第五行值不能小于第四行'
                                }else {
                                    obj.onoff = true
                                    obj.msg=''
                                }
                            }
                        }
                    }
                }
            }
            return obj
        },
        stringHandle (str) { //字符串处理函数格式: 2019/1/1
           if (str) {
                var strArr = str.split('/')
                for (var i=0; i<strArr.length; i++) {
                    if (Number(strArr[i]) < 10) {
                        strArr[i] = '0'+strArr[i]
                    }
                }
                var strString = strArr.join('-')
                return strString
           }
        },
        developTimehandle () { //开发时间弹框的确定处理
            for (var i=0; i<this.developTimeData.length; i++) {
                var item = this.developTimeData[i]
                if (item.startValue) {
                    var dateGMT = item.startValue.toString()
                    if (dateGMT.indexOf('GMT') > 0) {
                    var dateArr = new Date(dateGMT).toLocaleDateString()
                        item.startValue = this.stringHandle(dateArr)
                    }
                }
            }
            // console.log(this.developTimeData)
            var judgeData = this.validateVal(this.developTimeData)
            if (!judgeData.onoff){
                this.promptBox(judgeData.msg, 'warning')
                return false
            }
            //发送ajax请求
            this.$http.post('/lms/sysIntervalColorConfig/updateIntervalColorConfig.html',{
                configType: this.paramconfigVal,
                dataArray: JSON.stringify(this.developTimeData)
            },{emulateJSON:true})
            .then((res) => {
                var res = res.data
                if (res.code == "0000") {
                    this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        position: 'top-right',
                        duration: 1500
                    })
                    this.WH_DEVELOP_TIME_dialogVisible = false
                }else {
                    this.$notify({
                        title: '失败',
                        message: res.msg,
                        type: 'error',
                        position: 'top-right',
                        duration: 1500
                    });
                }
            })       
        },
        dayAvgSaleHandle () { //日均销量弹框处理
            // console.log(this.dayAvgSaleData)
            var judgeData = this.validateVal(this.dayAvgSaleData)
            if (!judgeData.onoff){
                this.promptBox(judgeData.msg, 'warning')
                return false
            }
            this.$http.post('/lms/sysIntervalColorConfig/updateIntervalColorConfig.html',{
                configType: 'WH_DAY_AVG_SALES',
                dataArray: JSON.stringify(this.dayAvgSaleData)
            },{emulateJSON:true})
            .then ((res) => {
                var res = res.data
                // console.log(res)
                if (res.code == "0000") {
                    this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        position: 'top-right',
                        duration: 1500
                    })
                    this.WH_DAY_AVG_SALES_dialogVisible = false
                }else {
                    this.$notify({
                        title: '失败',
                        message: res.msg,
                        type: 'error',
                        position: 'top-right',
                        duration: 1500
                    });
                }
            })
        },
        productStatusHandle () { //在售停售弹框处理
            this.$http.post('/lms/sysIntervalColorConfig/updateIntervalColorConfig.html',{
                configType: 'WH_PRODUCT_STATUS',
                dataArray: JSON.stringify(this.productStatusData)
            },{emulateJSON:true})
            .then ((res) => {
                var res = res.data
                console.log(res)
                if (res.code == "0000") {
                    this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        position: 'top-right',
                        duration: 1500
                    })
                    this.WH_PRODUCT_STATUS_dialogVisible = false
                }else {
                    this.$notify({
                        title: '失败',
                        message: res.msg,
                        type: 'error',
                        position: 'top-right',
                        duration: 1500
                    });
                }
            })
        }, 
        avaiableStockHandle () { //可用库存弹框处理
            // console.log(this.avaiableStockData)
            var judgeData = this.validateVal(this.avaiableStockData)
            if (!judgeData.onoff){
                this.promptBox(judgeData.msg, 'warning')
                return false
            }
            this.$http.post('/lms/sysIntervalColorConfig/updateIntervalColorConfig.html',{
                configType: 'WH_AVAIABLE_STOCK',
                dataArray: JSON.stringify(this.avaiableStockData)
            },{emulateJSON:true})
            .then ((res) => {
                var res = res.data
                console.log(res)
                if (res.code == "0000") {
                    this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        position: 'top-right',
                        duration: 1500
                    })
                    this.WH_AVAIABLE_STOCK_dialogVisible = false
                }else {
                    this.$notify({
                        title: '失败',
                        message: res.msg,
                        type: 'error',
                        position: 'top-right',
                        duration: 1500
                    });
                }
            })
        },
        turnoverDaysHandle () { //库存周转天数弹框处理
            // console.log(this.turnoverDaysData)
            var judgeData = this.validateVal(this.turnoverDaysData)
            if (!judgeData.onoff){
                this.promptBox(judgeData.msg, 'warning')
                return false
            }
            this.$http.post('/lms/sysIntervalColorConfig/updateIntervalColorConfig.html',{
                configType: 'WH_INVENTORY_TURNOVER_DAYS',
                dataArray: JSON.stringify(this.turnoverDaysData)
            },{emulateJSON:true})
            .then ((res) => {
                var res = res.data
                // console.log(res)
                if (res.code == "0000") {
                    this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        position: 'top-right',
                        duration: 1500
                    })
                    this.WH_INVENTORY_TURNOVER_DAYS_dialogVisible = false
                }else {
                    this.$notify({
                        title: '失败',
                        message: res.msg,
                        type: 'error',
                        position: 'top-right',
                        duration: 1500
                    });
                }
            })
        },
        allConfigInithandle (val) { //所有配置的初始化
            //发送ajax请求
            this.$http
            .post('/lms/sysIntervalColorConfig/getIntervalColorConfig.html',
            {configType: val},
            {emulateJSON:true})
            .then((res) => {
                var res = res.data
                if (res.code == "0000" && res.data) {
                    var rArray = res.data[0].interval;
                    switch(val) {
                        case "WH_DEVELOP_TIME": //开发时间配置
                            for(var i =0;i<this.developTimeData.length;i++){
                                if(rArray.length>i){
                                    this.developTimeData[i]=rArray[i];
                                }
                            }
                            break;
                        case "WH_DAY_AVG_SALES": //日均销量配置              
                            for(var i =0;i<this.developTimeData.length;i++){
                                if(rArray.length>i){
                                    this.dayAvgSaleData[i]=rArray[i];
                                }
                            }
                            break;
                        case "WH_PRODUCT_STATUS": //在售停售配置                
                            for(var i =0;i<this.developTimeData.length;i++){
                                if(rArray.length>i){
                                    this.productStatusData[i]=rArray[i];
                                }
                            }
                            break;
                        case "WH_AVAIABLE_STOCK": //可用库存配置
                            for(var i =0;i<this.developTimeData.length;i++){
                                if(rArray.length>i){
                                    this.avaiableStockData[i]=rArray[i];
                                }
                            }
                            break;
                        case "WH_INVENTORY_TURNOVER_DAYS": //库存周转天数配置
                            for(var i =0;i<this.developTimeData.length;i++){
                                if(rArray.length>i){
                                    this.turnoverDaysData[i]=rArray[i];
                                }
                            }
                            break;
                    }
                }
            })
        },
        promptBox (msg, type) { //消息提示框,悬浮在页面中间
            this.$message({
              message: msg,
              type: type,
              showClose: true,
              duration: 2000
            })
        }
    },
    watch: {
        paramconfigVal (val) { //入口函数
            switch(val) {
                case "WH_DEVELOP_TIME": //开发时间配置
                    this.WH_DEVELOP_TIME_dialogVisible = true;
                    this.allConfigInithandle("WH_DEVELOP_TIME");
                    break;
                case "WH_DAY_AVG_SALES": //日均销量配置
                    this.WH_DAY_AVG_SALES_dialogVisible = true;
                    this.allConfigInithandle("WH_DAY_AVG_SALES");
                    break;
                case "WH_PRODUCT_STATUS": //在售停售配置
                    this.WH_PRODUCT_STATUS_dialogVisible = true;
                    this.allConfigInithandle("WH_PRODUCT_STATUS");
                    break;
                case "WH_AVAIABLE_STOCK": //可用库存配置
                    this.WH_AVAIABLE_STOCK_dialogVisible = true;
                    this.allConfigInithandle("WH_AVAIABLE_STOCK");
                    break;
                case "WH_INVENTORY_TURNOVER_DAYS": //库存周转天数配置
                    this.WH_INVENTORY_TURNOVER_DAYS_dialogVisible = true;
                    this.allConfigInithandle("WH_INVENTORY_TURNOVER_DAYS");
                    break;
            }
        },
        WH_DEVELOP_TIME_dialogVisible (val) {
            if (val == true) {
                this.paramconfigVal = "WH_DEVELOP_TIME"
            }
            else {
                this.paramconfigVal = ""
            }
        },
        WH_DAY_AVG_SALES_dialogVisible (val) {
            if (val == true) {
                this.paramconfigVal = "WH_DAY_AVG_SALES"
            }
            else {
                this.paramconfigVal = ""
            }
        },
        WH_PRODUCT_STATUS_dialogVisible (val) {
            if (val == true) {
                this.paramconfigVal = "WH_PRODUCT_STATUS"
            }
            else {
                this.paramconfigVal = ""
            }
        },
        WH_AVAIABLE_STOCK_dialogVisible (val) {
            if (val == true) {
                this.paramconfigVal = "WH_AVAIABLE_STOCK"
            }
            else {
                this.paramconfigVal = ""
            }
        },
        WH_INVENTORY_TURNOVER_DAYS_dialogVisible (val) {
            if (val == true) {
                this.paramconfigVal = "WH_INVENTORY_TURNOVER_DAYS"
            }
            else {
                this.paramconfigVal = ""
            }
        }
    }
}