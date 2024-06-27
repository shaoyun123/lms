/**display通道模块 */
var displayAreaTemplate = `
    <div class="planDisplay">
        <el-dialog
        :title="txt + '通道'"
        :visible.sync="displayShow"
        :fullscreen="true"
        :before-close="displayShowCancel"
        :modal="false"
        style="padding-left:286px;">
        <div v-if="shelvesdata">
            <div style="width:600px">
                <el-row :gutter="4" class="lh32">
                    <el-col :span="4">
                        <el-button type="primary" size="small" @click.stop="modifyRegionHandle('modifyRegionStatus')">
                            修改通道
                        </el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="danger" size="small" @click.stop="deleteRegionHandle">删除通道</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="danger" size="small" @click="deleteShelfName" 
                        v-loading.fullscreen.lock="removeShelfLoading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgbaColor">删除货架</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" size="small" @click="batchSetShelfName">批量命名</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="success" size="small" @click.stop="modifyRegionHandle('newlyAddShelfStatus')">
                        新增货架</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button 
                            type="primary" 
                            size="small"
                            @click="batchShelfVisible=true"
                        >
                            批量新增货架
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <table class="shelfParentTable">
                <tr v-for="(tr,tri) in shelvesdata" :key="tri" style="vertical-align: top;">
                    <td v-for="(item,tdi) in tr" :key="tdi" v-if="item.status">
                        <div :key="item.shelfId"  v-if="item.status" class="shelfParentTableFull">
                            <el-radio v-model="radio" :label="item.shelfId">
                                ({{ item.regionX}}, {{ item.regionY}})
                            </el-radio>
                            <input type="hidden" :id="item.shelfId+'Name'" :value="item.shelfCode">
                            <input type="hidden" :id="item.shelfId+'X'" :value="item.regionX">
                            <input type="hidden" :id="item.shelfId+'Y'" :value="item.regionY">
                            <font size="4"><strong>
                                {{ item.shelfCode|| '货架命名' }}
                            </strong></font>
                            <i class="el-icon-edit" style="color:#66b1ff;cursor: pointer;" @click.stop="EditRegionHandle(item.shelfId, item.shelfCode, item.regionX, item.regionY, item.direction)"></i> 
                        </div>
                    </td>
                    <td v-else>
                        <div class="shelfParentTableEmpty"></div>
                    </td>
                </tr>
            </table>
        </div>
        <div v-else>
            <div style="width: 600px;margin-bottom: 20px">
                <el-row :gutter="4" class="lh32">
                    <el-col :span="4">
                        <el-button type="primary" size="small" @click="modifyRegionHandle('modifyRegionStatus')">
                            修改通道
                        </el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="danger" size="small" @click="deleteRegionHandle">删除通道</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" size="small" @click="batchSetShelfName">批量命名</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button 
                            type="danger" 
                            size="small" 
                            @click="deleteShelfName" 
                            v-loading.fullscreen.lock="removeShelfLoading"
                            element-loading-text="拼命加载中"
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgbaColor"
                        >
                            删除货架
                        </el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="success" size="small" @click="modifyRegionHandle('newlyAddShelfStatus')">
                        新增货架</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button 
                            type="primary" 
                            size="small"
                            @click="batchShelfVisible=true"
                        >
                            批量新增货架
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <font size="4"><strong>此通道下暂时无货架....</strong></font>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="displayShowCancel" size="small">关闭</el-button>
        </span>
      </span>
    </el-dialog>


    <el-dialog
        title="编辑货架"
        :visible.sync="newlyEditShelfVisible"
        :show-close="false"
        width="350px">
        <div>
        <el-row :gutter="8" class="lh32">
            <el-col :span="8">货架名称</el-col>
            <el-col :span="16"><div class="mb10"><el-input size="small" v-model="shelfCodeEdit"></el-input></div></el-col>
            <el-col :span="8">货架坐标</el-col>
            <el-col :span="6"><div class="mb10"><el-input size="small"  v-model="regionXEdit"></el-input></div></el-col>
            <el-col :span="2">横</el-col>
            <el-col :span="6"><div class="mb10"><el-input size="small" v-model="regionYEdit"></el-input></div></el-col>
            <el-col :span="2">竖</el-col>
            <el-col :span="8">库位排序</el-col>
            <el-col :span="16">
                <el-switch
                v-model="cellRuleEdit"
                class="cellRuleSwitch"
                active-color="#13ce66"
                inactive-color="#409eff"
                active-text="从左到右"
                inactive-text="从右到左">
                </el-switch>
            </el-col>
        </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="newlyEditShelfVisible=false">取 消</el-button>
            <el-button type="primary" size="small"
            v-loading.fullscreen.lock="shelfLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgbaColor"
            @click.stop="saveEditShelfHandle">确 定</el-button>
        </span>
    </el-dialog>


    <el-dialog
        title="批量新增货架"
        :visible.sync="batchShelfVisible"
        :show-close="false"
        width="350px"
    >
        <div>
            <el-row :gutter="8" class="lh32">
                <el-col :span="8">货架规格</el-col>
                <el-col :span="6">
                    <div class="mb10"><el-input size="small"  v-model="batchAddShelvesRow"></el-input></div>
                </el-col>
                <el-col :span="2">排</el-col>
                <el-col :span="6">
                    <div class="mb10"><el-input size="small" v-model="batchAddShelvesCol"></el-input></div>
                </el-col>
                <el-col :span="2">列</el-col>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="batchShelfVisible=false">取 消</el-button>
            <el-button type="primary" size="small"
            v-loading.fullscreen.lock="shelfLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgbaColor"
            @click.stop="batchAddShelfName">确 定</el-button>
        </span>
    </el-dialog>
</div>
`

var displayArea = {
    template: displayAreaTemplate,
    data () {
        return {
            loading: false,
            dialogVisible: false,
            enterLoading: false, //回车loading
            originLocationCode: '', //编辑前的库位值
            locationCodeArr: [], //库位数组(不重复)
            newlyEditShelfVisible: false,
            shelfLoading: false, //货架loading
            cellRuleEdit: true,
            shelfIdEdit: '', //编辑货架Id
            shelfCodeEdit: '', //编辑货架名称
            regionXEdit: '', //编辑货架X坐标
            regionYEdit: '', //编辑货架Y坐标
            radio: '',
            removeShelfLoading: false, //删除货架loading
            batchShelfVisible: false,
            batchAddShelvesRow: 0, //批量新增行
            batchAddShelvesCol: 0 //批量新增列
        }
    },
    computed: {
        displayShow () { //决定该通道是否显示
            return this.$store.state.displayShow
        },
        shelvesdata () { //获取到货架数据
            return this.$store.state.shelvesData
        },
        txt () { //获取到通道文本
            return this.$store.state.regionTxt
        },
        warehouseId () { //获取到仓库id
            return  this.$store.state.warehouseId
        },
        floorId () { //获取到楼层id
            return this.$store.state.floorId
        },
        regionId () { //获取到通道的id
            return  this.$store.state.regionId 
        },
        shelfId () { //获取到新增货架的id
            return this.$store.state.shelfId
        }
    },
    methods: {
        //编辑货架弹框渲染
        EditRegionHandle(shelfIdEdit,shelfCode,regionX,regionY,direction){
            this.newlyEditShelfVisible = true
            this.shelfCodeEdit = shelfCode
            this.regionXEdit = regionX
            this.regionYEdit = regionY
            this.shelfIdEdit = shelfIdEdit
            this.cellRuleEdit = direction == 2 ? false : true
        },
        //编辑货架保存
        saveEditShelfHandle(){
            var regionXEdit = this.regionXEdit;//横坐标
            var regionYEdit = this.regionYEdit;//纵坐标
            var shelfCodeEdit = this.shelfCodeEdit;//货架名称
            var shelfIdEdit = this.shelfIdEdit;//货架id
            var refName= shelfIdEdit + 'Name'; //ref-货架名称
            var refX= shelfIdEdit + 'X'; //ref-X
            var refY= shelfIdEdit + 'Y'; //ref-Y
            var regionId = this.regionId;//区域id
            var cellRuleEdit = this.cellRuleEdit; //库位排序
            if (!shelfCodeEdit || !regionXEdit || !regionYEdit) {
                this.promptBox('通道名称和坐标不能为空!','warning');
                return false;
            }
            if (regionXEdit == 0 || regionYEdit==0) {
                this.promptBox('坐标必须从1开始!','warning');
                return false;
            }
            var dataArray = [{
                id : shelfIdEdit, 
                shelfCode : shelfCodeEdit, 
                regionId : regionId, 
                regionX : regionXEdit,
                regionY : regionYEdit, 
                direction : cellRuleEdit ? 1: 2
            }]
            this.vueAjax('/lms/warehouseShelf/updateBatchWarehouseShelf.html', { //首先修改货架
                dataArray: JSON.stringify(dataArray)
              },(res) => {
                var res = res.data
                if (res.code == '0000') { //表示修改货架成功
                    this.newlyEditShelfVisible = false
                    this.$store.commit('changeDisplayAreaStatus', true) //显示displayArea
                    this.getShelvesData() //重新渲染displayArea
                    this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        duration: 2000
                    })
                    document.getElementById(refName).value= shelfCodeEdit;
                    document.getElementById(refX).value= regionXEdit;
                    document.getElementById(refY).value= regionYEdit;
                    this.regionXEdit = '';
                    this.regionYEdit = '';
                    this.shelfCodeEdit = '';
                    this.cellRuleEdit = '';
                    this.shelfIdEdit = '';
                }else {
                    this.promptNotice('失败', res.msg, 'error')
                }
            })       
        },
        //批量点击功能
        batchSetShelfName(){
            var radio = this.radio;
            if(!radio){
                this.promptBox('请先选择起始货架!','warning');
                return false;
            }
            var refName = radio +'Name';
            var refX = radio +'X';
            var refY = radio +'Y';
            var shelfName = document.getElementById(refName).value;
            var shelfX = document.getElementById(refX).value;
            var shelfY = document.getElementById(refY).value;
            if(!shelfName){
                this.promptBox('请先给选择货架命名!','warning');
                return false;
            }
            var shelfLastTwo = shelfName.substr(-2);
            if(shelfLastTwo !='01'){
                this.promptBox('批量命名的起始货架名必须以01结尾,例A01R01','warning');
                return false;
            }
            var shelfTpl = shelfName.substr(0,4);//货架名模板
            var transFormArr = this.shelvesdata.flat() || [];
            var shelvesdata = this.shelvesdata || [];//货架二维数组this.shelvesdata.flat();
            //最多三行,判断行数
            var originalArr = [];
            //判断二维数组的长度,1代表一行,2代表两行,3代表三行
            if(shelvesdata.length==1){
                var oneDimensionalArr = shelvesdata[0];
                var maxY = oneDimensionalArr.length;
                var count = 1;//命名递增参数
                //shelfX===1,只有一行
                if(shelfY==1){
                    var lieArr = [];
                    for(var i=0; i<oneDimensionalArr.length; i++){
                        var item = oneDimensionalArr[i];
                        var obj = {};
                        obj.regionX =1;
                        obj.regionY = (i+1);
                        if(item.shelfId){
                            obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                            count++;
                            lieArr.push(obj);
                        }
                    }
                    originalArr.push(lieArr);
                }else if(shelfY ==maxY){
                    var lieArr = [];
                    for(var i=maxY; i>0; i--){
                        var item = oneDimensionalArr[i-1];
                        var obj = {};
                        obj.regionX =1;
                        obj.regionY = i;
                        if(item.shelfId){
                            obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                            count++;
                            lieArr.push(obj);
                        }
                    }
                    originalArr.push(lieArr);
                }else{
                    this.promptBox('批量命名必须从每排的首尾开始','warning');
                    return false;
                }
            }else if(shelvesdata.length==2){
                var twoDimensionalArrX01 = shelvesdata[0];//第一行数据
                var twoDimensionalArrX02 = shelvesdata[1];//第二行数据
                var twoLength = twoDimensionalArrX02.length;
                var oneLength = twoDimensionalArrX01.length;
                var maxY01 = Math.max(...twoDimensionalArrX01.map(item => item.regionY || 1));//第一行最大坐标
                var maxY02 = Math.max(...twoDimensionalArrX02.map(item => item.regionY || 1));//第二行最大坐标
                var count = 1;//命名递增参数
                if(shelfX==1 && shelfY==1){
                    for(var i=1;i<3;i++){
                        var lieArr = [];
                        if(i==1){
                            for(let j=0; j<oneLength;j++){
                                var item = twoDimensionalArrX01[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else{
                            for(let j=twoLength; j>0;j--){
                                var item = twoDimensionalArrX02[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }
                        originalArr.push(lieArr);
                    }
                }else if(shelfX==1 && shelfY==maxY01){
                    for(var i=1;i<3;i++){
                        var lieArr = [];
                        if(i==1){
                            for(let j=oneLength; j>0;j--){
                                var item = twoDimensionalArrX01[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else{
                            for(let j=0; j<twoLength;j++){
                                var item = twoDimensionalArrX02[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }
                        originalArr.push(lieArr);
                    }
                }else if(shelfX==2 && shelfY==1){
                    for(var i=2;i>0;i--){
                        var lieArr = [];
                        if(i==2){
                            for(let j=0; j<twoLength;j++){
                                var item = twoDimensionalArrX02[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else{
                            for(let j=oneLength; j>0;j--){
                                var item = twoDimensionalArrX01[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }
                        originalArr.push(lieArr);
                    }
                }else if(shelfX==2 && shelfY==maxY02){
                    for(var i=2;i>0;i--){
                        var lieArr = [];
                        if(i==2){
                            for(let j=twoLength; j>0;j--){
                                var item = twoDimensionalArrX02[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else{
                            for(let j=0; j<oneLength;j++){
                                var item = twoDimensionalArrX01[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }
                        originalArr.push(lieArr);
                    }
                }else{
                    this.promptBox('批量命名必须从每排的首尾开始','warning');
                    return false;
                }
            }else if(shelvesdata.length==3){
                var twoDimensionalArrX01 = shelvesdata[0];//第一行数据
                var twoDimensionalArrX02 = shelvesdata[1];//第二行数据
                var twoDimensionalArrX03 = shelvesdata[2];//第三行数据
                var threeLength = twoDimensionalArrX03.length;
                var twoLength = twoDimensionalArrX02.length;
                var oneLength = twoDimensionalArrX01.length;
                var maxY01 = Math.max(...twoDimensionalArrX01.map(item => item.regionY || 1));//第一行最大坐标
                var maxY03 = Math.max(...twoDimensionalArrX03.map(item => item.regionY || 1));//第三行最大坐标
                var count = 1;//命名递增参数
                if(shelfX==1 && shelfY==1){
                    for(var i=1;i<4;i++){
                        var lieArr = [];
                        if(i==1){
                            for(let j=0; j<oneLength;j++){
                                var item = twoDimensionalArrX01[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else if(i==2){
                            for(let j=twoLength; j>0;j--){
                                var item = twoDimensionalArrX02[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else{
                            for(let j=0; j<threeLength;j++){
                                var item = twoDimensionalArrX03[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }
                        originalArr.push(lieArr);
                    }
                }else if(shelfX==1 && shelfY==maxY01){
                    for(var i=1;i<4;i++){
                        var lieArr = [];
                        if(i==1){
                            for(let j=oneLength; j>0;j--){
                                var item = twoDimensionalArrX01[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else if(i==2){
                            for(let j=0; j<twoLength;j++){
                                var item = twoDimensionalArrX02[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else{
                            for(let j=threeLength; j>0;j--){
                                var item = twoDimensionalArrX03[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }
                        originalArr.push(lieArr);
                    }
                }else if(shelfX==3 && shelfY==1){
                    for(var i=3;i>0;i--){
                        var lieArr = [];
                        if(i==1){
                            for(let j=0; j<oneLength;j++){
                                var item = twoDimensionalArrX01[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else if(i==2){
                            for(let j=twoLength; j>0;j--){
                                var item = twoDimensionalArrX02[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else{
                            for(let j=0; j<threeLength;j++){
                                var item = twoDimensionalArrX03[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }
                        originalArr.push(lieArr);
                    }
                }else if(shelfX==3 && shelfY==maxY03){
                    for(var i=3;i>0;i--){
                        var lieArr = [];
                        if(i==1){
                            for(let j=oneLength; j>0;j--){
                                var item = twoDimensionalArrX01[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else if(i==2){
                            for(let j=0; j<twoLength;j++){
                                var item = twoDimensionalArrX02[j];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j+1;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }else{
                            for(let j=threeLength; j>0;j--){
                                var item = twoDimensionalArrX03[j-1];
                                var obj = {};
                                obj.regionX = i;
                                obj.regionY = j;
                                if(item.shelfId){
                                    obj.shelfCode = (count<10) ? (shelfTpl+'0'+count): (shelfTpl+count);
                                    count++;
                                    lieArr.push(obj);
                                }
                            }
                        }
                        originalArr.push(lieArr);
                    }
                }else{
                    this.promptBox('批量命名必须从每排的首尾开始','warning');
                    return false;
                }
            }
            //提交前数据处理
            var submitArr = [];
            var emptyArr = []; //批量清空用
            var newOriginalArr = originalArr.flat();
            for(var n=0; n<transFormArr.length; n++){
               var item = transFormArr[n];
               var itemObj = {
                  id: item.shelfId,
                  shelfCode: item.shelfCode || '',
                  regionId: item.regionId,
                  regionX: item.regionX,
                  regionY: item.regionY,
                  direction: item.direction || 1
               };
               for(var m=0; m < newOriginalArr.length; m++){
                  var itemM = newOriginalArr[m];
                  if((item.regionX == itemM.regionX) &&(item.regionY == itemM.regionY)){
                       submitArr.push(Object.assign(itemObj, itemM));
                  }
                }
            };
            for(var n=0; n<transFormArr.length; n++){
               var item = transFormArr[n];
               var itemObj = {
                  id: item.shelfId,
                  shelfCode: item.shelfCode || '',
                  regionId: item.regionId,
                  regionX: item.regionX,
                  regionY: item.regionY,
                  direction: item.direction || 1
               };
               for(var m=0; m < newOriginalArr.length; m++){
                  var itemM = newOriginalArr[m];
                  if((item.regionX == itemM.regionX) &&(item.regionY == itemM.regionY)){
                        emptyArr.push(Object.assign(itemObj, itemM, {shelfCode: ''}));
                  }
                }
            };
            this.vueAjax('/lms/warehouseShelf/updateBatchWarehouseShelf.html', { //批量修改货架前置空
                dataArray: JSON.stringify(emptyArr)
            },(res) => {
                var res = res.data
                if (res.code == '0000') { //表示修改货架成功
                    this.vueAjax('/lms/warehouseShelf/updateBatchWarehouseShelf.html', { //批量修改货架
                        dataArray: JSON.stringify(submitArr)
                    },(response) => {
                        var response = response.data
                        if (response.code == '0000') { //表示修改货架成功
                               this.newlyEditShelfVisible = false
                               this.$store.commit('changeDisplayAreaStatus', true) //显示displayArea
                               this.getShelvesData() //重新渲染displayArea
                               this.$notify({
                                  title: '成功',
                                  message: response.msg,
                                  type: 'success',
                                  duration: 2000
                                });
                         }else {
                            this.promptNotice('失败', response.msg, 'error');
                         }
                     }); 
                 }else {
                    this.promptNotice('失败', res.msg, 'error');
                 }
             }); 
        },
        //批量新增货架
        batchAddShelfName(){
            var warehouseId = this.warehouseId;//仓库id
            var regionId = this.regionId; //通道id
            var batchAddShelvesRow = this.batchAddShelvesRow; //批量-排数
            var batchAddShelvesCol = this.batchAddShelvesCol; //批量-列数
            var shelfData = this.shelvesdata || []; //货架数据
            if(shelfData.length){
                this.$message({
                    message: '该通道下已有货架,不允许批量新增!',
                    type: 'error',
                    showClose: true,
                    duration: 3000
                })
                return false
            }
            if(batchAddShelvesRow > 3) {
                this.$message({
                    message: '只允许输入1,2,3排!',
                    type: 'error',
                    showClose: true,
                    duration: 3000
                })
                return false
            };
            if (!warehouseId || !regionId || !this.floorId) {
                this.$message({
                    message: '必须选择仓库/楼层/通道!',
                    type: 'warning',
                    showClose: true,
                    duration: 2000
                })
                return false
            };
            
            if (!batchAddShelvesRow || !batchAddShelvesCol) {
                this.$message({
                    message: '请输入有效的排和列!',
                    type: 'warning',
                    showClose: true,
                    duration: 2000
                })
                return false
            };
            //循环生成批量数据
            var dataArray = [] //定义一个空数组用来存放批量的数据
            if (batchAddShelvesRow && batchAddShelvesCol) {
                for(var i =0; i<batchAddShelvesRow; i++) {
                    for (var j=0; j<batchAddShelvesCol; j++) {
                        var data = {
                            "warehouseId": warehouseId,
                            "regionId": regionId,
                            "regionX" : i+1,
                            "regionY" : j+1
                        }
                        dataArray.push(data)
                    }
                }
            };
            this.shelfLoading = true;
            this.$http.post('/lms/warehouseShelf/addBatchWarehouseShelf.html',{
                dataArray:JSON.stringify(dataArray)
            },{emulateJSON:true})
            .then(res => {
                var res = res.data;
                if (res.code == "0000") {
                    this.shelfLoading = false //隐藏loading
                    this.$store.commit('changeDisplayAreaStatus', true) //显示displayArea
                    this.$store.commit('getRegionId', regionId)//传递通道id
                    this.getShelvesData() //刷新displayArea视图
                    this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        duration: 2000
                    });
                    this.batchShelfVisible = false
                    this.batchAddShelvesRow = ''
                    this.batchAddShelvesCol = ''
                }else {
                    this.shelfLoading = false //隐藏loading
                    this.$notify({
                        title: '失败',
                        message: res.msg,
                        type: 'error',
                        duration: 2000
                    })
                }
            })
        },
        //删除货架
        deleteShelfName(){
            var radio = this.radio;
            if(!radio){
                this.promptBox('请先选择要删除的货架!','warning');
                return false;
            }
            var refName = radio +'Name';
            var shelfName = document.getElementById(refName).value;//货架名称
            if (!this.warehouseId || !shelfName || !this.regionId) {
                this.$message({
                    message: '仓库/货架编码/通道都不能为空!',
                    type: 'warning',
                    showClose: true,
                    duration: 2000
                })
                return false
            }
            this.removeShelfLoading = true //显示loading
            this.$http.post('/lms/warehouseShelf/delBatchWarehouseShelfByCode.html',{
                warehouseId: this.warehouseId,
                regionId: this.regionId,
                dataArray: JSON.stringify([shelfName])
            },{emulateJSON:true})
            .then((res) => {
                var res = res.data
                // console.log('-----------下面是删除货架返回的数据-----------')
                // console.log(res)
                if (res.code =="0000") {
                    this.removeShelfLoading = false //隐藏loading
                    //刷新右侧货架视图
                    this.getShelvesData() //重新渲染displayArea
                    this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        duration: 2000
                    });
                }else {
                    this.removeShelfLoading = false //隐藏loading
                    this.$notify({
                        title: '失败',
                        message: '删除货架失败',
                        type: 'error',
                        duration: 2000
                    })
                }
            })   
        },
        getShelvesData () { //根据通道id获取到货架数据
            this.$http.post('/lms/warehouseRegion/getWarehouseRegionShelfByRegionId.html',{
                regionId: this.regionId
            },{emulateJSON:true})
            .then((res) => {
                var res = res.data
                // console.log('-----------下面是根据通道id返回的数据-----------')
                if (res.code == "0000"){
                   this.$store.commit('getShelvesData', res.data)
                //    this.$store.commit('getRegionTxt', txt)
                }
            })
        },
        tableHandle (val,row,col,celldata,name) {
            var data = this.celldataHandle(celldata) //处理后的库位数据
            var tables = this.$refs.shelftable
            if (tables) {
                tables.forEach(function(item){
                    if (item.dataset.table != val) {
                        item.classList.remove('currentSelTable')
                    }else {
                        item.classList.add('currentSelTable')
                    }
                })
            }
            this.$store.commit('getshelfId', val) //给货架的id赋值
            this.$store.commit('getshelfRow', row) //给货架的行赋值
            this.$store.commit('getshelfCol', col) //给货架的列赋值
            this.$store.commit('getCellData', data) //设置库位数据
            this.$store.commit('getShelfCode', name) //给货架名赋值
        },
        celldataHandle (data) { //库位数据处理
            if(data){
                var arr = []
                for (var i=0;i<data.length;i++){
                    var rowData = data[i]
                    for (var j=0; j<rowData.length;j++){
                        var colData = rowData[j]
                        arr.push({'shelfId': colData.shelfId, 'locationCode': colData.locationCode})
                    }
                }
                return arr
            }
        },
        displayShowCancel () { //关闭display模块
            this.$store.commit('changeDisplayAreaStatus', false)
        },
        switchState (id,content) { //双击编辑库位号
            //双击变成编辑状态前就移除类名
            document.querySelector('#lc'+id).parentElement.classList.remove('LocationCodeTd')
            this.locationCodeArr = [] //清空存储的库位id
            this.originLocationCode = content
            this.publicGetLocationId(id) //切换库位状态
        },
        getLocationCode(item) { //获取被选中的库位
            var dom = document.querySelector('#lc'+item.locationId)
            if(dom.firstElementChild.innerText != '已禁用'){
                if(item.status){
                    this.locationCodeArr.push(item.locationId)
                    dom.parentElement.classList.add('LocationCodeTd')
                    this.$set(item,'status',false)
                }else{
                    var index = this.locationCodeArr.indexOf(item.locationId)
                    this.locationCodeArr.splice(index,1)
                    dom.parentElement.classList.remove('LocationCodeTd')
                    this.$set(item,'status',true)
                }
            }
            this.keydown46Handle()
        },
        restoreHandle (id) { //库位还原
            var originLocationCode = this.originLocationCode
            this.shelvesdata.forEach(function(shelvesTr){
                shelvesTr.forEach(function(shelvesTd){
                    if (shelvesTd.locationDtoArray) {
                        shelvesTd.locationDtoArray.forEach(function(locationDtoArrayTr){
                            locationDtoArrayTr.forEach(function(locationDtoArrayTd){
                                 if (id == locationDtoArrayTd.locationId) {
                                    // _this.$set(locationDtoArrayTd, 'locationCode', originLocationCode)
                                    locationDtoArrayTd.locationCode = originLocationCode
                                    locationDtoArrayTd.inputStatus = !locationDtoArrayTd.inputStatus
                                    return false
                                 }
                            })
                        })
                    }
                })
            })
        },
        modifyHandle (id,content) { //提交修改的库位号
            this.enterLoading = true
            var data = [{
                "id": id,
                "locationCode": content
            }]
            this.vueAjax('/lms/warehouseProdLocation/updateBatchWarehouseLocation.html',{
                dataArray: JSON.stringify(data)
            }, (res) => {
                var res = res.data
                if (res.code == "0000"){
                    this.promptNotice('成功', res.msg, 'success')
                    this.enterLoading = false
                    this.publicGetLocationId(id) //切换库位状态
                }else {
                    this.promptNotice('失败', res.msg, 'error')
                }
            })
            // console.log(id,content)
        },
        modifyRegionHandle (val) { //修改值显示不同的弹框
            switch(val){
                case 'modifyRegionStatus': //修改通道
                  this.$store.commit('modifyRegionStatus', true);
                  break;
                case 'newlyAddShelfStatus': //新增货架
                  this.$store.commit('newlyAddShelfStatus', true);
                  break;
            }
        },
        deleteRegionHandle () { //删除通道逻辑处理
            var dataArray = [this.regionId]
            this.$confirm('删除通道会删除通道内的所有货架和库位,确定要删除吗？').then(() => {
                this.vueAjax('/lms/warehouseRegion/delBatchWarehouseRegion.html',{dataArray: JSON.stringify(dataArray)},(res)=>{
                    var res = res.data
                    if (res.code == "0000") {
                        this.promptNotice('成功', res.msg, 'success')
                        this.reRenderRegion()
                    }else {
                        this.promptNotice('失败', res.msg, 'error')
                    }
                })
            })
        },
        reRenderRegion () { //重新渲染通道
            this.vueAjax('/lms/warehouseRegion/getWarehouseFloorRegion.html',{
              warehouseId: this.warehouseId,
              floorId: this.floorId
            },(res)=>{
              var res = res.data
              if (res.code == '0000'){
                var regionDatas = regionCoordinateHandle(res.data)
                this.$store.commit('changeSortStatus', true)
                this.$store.commit('changeDisplayAreaStatus', false)
                this.$store.commit('getRegionData', regionDatas)
              }
            })
        },
        reRenderShelf () { //重新渲染货架
            var regionId = this.regionId
            this.vueAjax(
                '/lms/warehouseRegion/getWarehouseRegionShelfByRegionId.html',
                {regionId: regionId}, 
                (res) => {
                    var res = res.data
                    if (res.code == "0000"){
                        console.log(res.data)
                        this.$store.commit('getShelvesData', res.data);
                        this.$store.commit('changeDisplayAreaStatus', true);
                    }        
                }
            )
        },
        publicGetLocationId (id) { //公共的切换库位状态的方法
            this.shelvesdata.forEach(function(shelvesTr){
                shelvesTr.forEach(function(shelvesTd){
                    if (shelvesTd.locationDtoArray) {
                        shelvesTd.locationDtoArray.forEach(function(locationDtoArrayTr){
                            locationDtoArrayTr.forEach(function(locationDtoArrayTd){
                                 if (id == locationDtoArrayTd.locationId) {
                                    locationDtoArrayTd.inputStatus = !locationDtoArrayTd.inputStatus
                                    return false
                                 }
                            })
                        })
                    }
                })
            })
        },
        vueAjax (url, params, fn) { //vue-resource简单处理
            this.$http.post(url,params,{emulateJSON:true})
                .then(fn)
        },
        promptNotice (title, msg, type) { //通知提示框,悬浮在页面右侧
            this.$notify({
              title: title,
              message: msg,
              type: type,
              duration: 2000
            })
        },
        promptBox (msg, type) { //消息提示框,悬浮在页面中间
            this.$message({
              message: msg,
              type: type,
              showClose: true,
              duration: 2000
            })
        },
        removeShelfId () { //每一次对货架操作以后,清空选中和货架id
            var tables = this.$refs.shelftable,
            _this = this
            if (tables) {
                tables.forEach(function(item){
                    item.classList.remove('currentSelTable')
                    _this.$store.commit('getshelfId', '') //给货架的id赋值
                })
            }
        },
        keydown46Handle () { //监听del键盘事件
            var _this = this
            document.onkeydown = function(e) {
                if (e.keyCode == 46) {
                    var loadingInstance = ELEMENT.Loading.service({ fullscreen: true,background: 'rgba(130,130,130,0.9)',text: '拼命加载中...',spinner: 'el-icon-loading'})
                    _this.vueAjax('/lms/warehouseProdLocation/delBatchProdWarehouseLocation.html',
                    {dataArray: JSON.stringify(_this.locationCodeArr)}, 
                    (res) => {
                           var res = res.data
                           if (res.code == '0000'){
                               _this.promptNotice('成功', res.msg, 'success')
                               _this.reRenderShelf() //重新渲染货架视图
                               _this.locationCodeArr =[] //清空this.locationCodeArr
                               loadingInstance.close()
                           }else {
                                _this.promptNotice('失败', res.msg, 'error')
                                loadingInstance.close()
                           }
                    })

                }
            }
        }
    },
    updated () {
        this.removeShelfId()
    },
    // created () {
    //     this.keydown46Handle()
    // },
    watch: {
        displayShow (val) {
           if (val == false) {
            this.$store.commit('getshelfId', '') //给货架的id赋值
            var tables = this.$refs.shelftable
            if (tables) {
                tables.forEach(function(item){
                    item.classList.remove('currentSelTable')
                })
            }
           }
        }
    }
}