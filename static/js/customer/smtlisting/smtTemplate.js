// ;(function($,layui,window,document,undefined){
//最小计量单位
// 营销图1 market1_images  1:1  白底图  传给平台imageType:2
// 营销图2 market2_images  3:4  场景图  传给平台imageType:1
const subTemplate_PRODUCT_UNIT_LIST = [
    { code: '100000000', name: '袋 (bag/bags)' },
    { code: '100000001', name: '桶 (barrel/barrels)' },
    { code: '100000002', name: '蒲式耳 (bushel/bushels)' },
    { code: '100078580', name: '箱 (carton)' },
    { code: '100078581', name: '厘米 (centimeter)' },
    { code: '100000003', name: '立方米 (cubic meter)' },
    { code: '100000004', name: '打 (dozen)' },
    { code: '100078584', name: '英尺 (feet)' },
    { code: '100000005', name: '加仑 (gallon)' },
    { code: '100000006', name: '克 (gram)' },
    { code: '100078587', name: '英寸 (inch)' },
    { code: '100000007', name: '千克 (kilogram)' },
    { code: '100078589', name: '千升 (kiloliter)' },
    { code: '100000008', name: '千米 (kilometer)' },
    { code: '100078559', name: '升 (liter/liters)' },
    { code: '100000009', name: '英吨 (long ton)' },
    { code: '100000010', name: '米 (meter)' },
    { code: '100000011', name: '公吨 (metric ton)' },
    { code: '100078560', name: '毫克 (milligram)' },
    { code: '100078596', name: '毫升 (milliliter)' },
    { code: '100078597', name: '毫米 (millimeter)' },
    { code: '100000012', name: '盎司 (ounce)' },
    { code: '100000014', name: '包 (pack/packs)' },
    { code: '100000013', name: '双 (pair)' },
    { code: '100000015', name: '件/个 (piece/pieces)' },
    { code: '100000016', name: '磅 (pound)' },
    { code: '100078603', name: '夸脱 (quart)' },
    { code: '100000017', name: '套 (set/sets)' },
    { code: '100000018', name: '美吨 (short ton)' },
    { code: '100078606', name: '平方英尺 (square feet)' },
    { code: '100078607', name: '平方英寸 (square inch)' },
    { code: '100000019', name: '平方米 (square meter)' },
    { code: '100078609', name: '平方码 (square yard)' },
    { code: '100000020', name: '吨 (ton)' },
    { code: '100078558', name: '码 (yard/yards)' },
]
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'laypage', 'laydate', 'upload', 'layCascader'], function () {
    var form = layui.form,
        admin = layui.admin,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        laypage = layui.laypage,
        upload = layui.upload,
        layCascader = layui.layCascader,
        table = layui.table;

    form.render()

        // 物流属性
        commonReturnPromise({
            url: `/lms/sys/listlogisattr.html`,
            type: 'post',
        }).then(function(result){
            logisAttrs = result
        }).catch(function(err){
            layer.msg(err, {icon:2});
        })

    // 表格列数据
    var cols = {
        //基础模板表头
        smttemplate_smtfoundationTempTable: [
            [
            {
                title: '缩略图',
                templet: '<div><img class="img_show_hide lazy b1" width="61" height="61" data-original="{{ d.pImg }}!size=60x60" data-onerror="layui.admin.img_noFind()"</div>',
                width: 80
            }, {
                title: '商品',
                templet: '#smttemplete_aep_cnTitleTpl'
            }, {
                title: '父SKU',
                templet: function (d) {
                    let spanDom = "";
                    let logisAttrList = d.logisAttrList == undefined?[]:d.logisAttrList.split(",");
                        logisAttrs.forEach(item=>{
                            if ($.inArray(item.name, logisAttrList) >= 0) {
                                spanDom += "<span class='layui-bg-red hp-badge ml5'>" + item.alias + "</span>";
                            }
                        })
                    return "<div style='color:#999;'>" + (d.aliexpressTemplateId == undefined ? "未新建模板" : "已新建模板") + "</div><div>" + d.pSku + "</div>" + "<div style='color:#999;'>" + d.prodAttrList + "</div><div>" + spanDom + "</div>";
                },
                width: 140
            }, {
                width: 300,
                title: "<table border='0' class='layui-table' width='100%'><tr><th width='30%'>subSKU</th><th width='15%'>重量(g)</th><th width='15%'>成本</th><th width='10%'>在售</th></tr></table>",
                templet: "#smttemplete_aep_producttpl"
            }, {
                title: '刊登状态',
                width: 130,
                templet: '#smttemplete_aep_storeNumTpl'
            }, {
                title: '销量',
                templet: '#smttemplete_aep_salesNumTpl'
            }, {
                title: '开发备注',
                templet: '<div><pre class="aep-devNote">{{d.devNote}}</pre></div>',
                width: 140
            }, {
                title: '销售备注',
                templet: '<div><pre>{{d.saleNote ||""}}</pre><i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" lay-event="aep_saleNote"></i></div>',
                width: 90
            }, {
                title: '侵权状态',
                templet: '#smttemplete_aep_tortTpl',
                width: 200
            }, {
                title: '时间',
                templet: '#smttemplete_aep_timeTpl',
                width: 150
            }, {
                title: '操作',
                templet: '#smtTemplatefundationTempOption'
            }
            ]
        ],
        //速卖通模板表头
        smttemplate_smtTempTable: [
            [{
                type: 'checkbox'
            }, {
                title: '缩略图',
                templet: '<div><img class="img_show_hide lazy b1" width="61" height="61" data-original="{{ d.pImg }}!size=60x60" data-onerror="layui.admin.img_noFind()"</div>',
                width: 80
            }, {
                title: '商品',
                templet: '#smttemplete_aep_cnTitleTpl'
            }, {
                field: 'smtCategoryName', title: 'SMT类目'
            }, {
                title: '父SKU',
                templet: function (d) {
                    let spanDom = "";
                    let logisAttrList = d.logisAttrList == undefined?[]:d.logisAttrList.split(",");
                    logisAttrs.forEach(item=>{
                        if ($.inArray(item.name, logisAttrList) >= 0) {
                            spanDom += "<span class='layui-bg-red hp-badge ml5'>" + item.alias + "</span>";
                        }
                    })
                    return "<div style='color:#999;'>" + (d.aliexpressTemplateId == undefined ? "未新建模板" : "已新建模板") + "</div><div>" + d.pSku + "</div>" + "<div style='color:#999;'>" + d.prodAttrList + "</div><div>" + spanDom + "</div>";
                },
                width: 140
            }, {
                width: 300,
                title: "<table border='0' class='layui-table' width='100%'><tr><th width='30%'>subSKU</th><th width='15%'>重量(g)</th><th width='15%'>成本</th><th width='10%'>在售</th></tr></table>",
                templet: "#smttemplete_aep_producttpl"
            }, {
                title: '刊登状态',
                width: 130,
                templet: '#smttemplete_aep_storeNumTpl'
            }, {
                title: '销量',
                templet: '#smttemplete_aep_salesNumTpl'
            }, {
                title: '开发备注',
                templet: '<div><pre class="aep-devNote">{{d.devNote}}</pre></div>',
                width: 140
            }, {
                title: '销售备注',
                templet: '<div><pre>{{d.saleNote}}</pre><i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" lay-event="aep_saleNote"></i></div>',
                width: 90
            }, {
                title: '侵权状态',
                templet: '#smttemplete_aep_tortTpl',
                width: 200
            }, {
                title: '时间',
                templet: '#smttemplete_aep_timeTpl',
                width: 150
            }, {
                title: '操作',
                templet: '#smtTempOption'
            }]
        ]
    }
    let skuAttr;

    let app = new Vue({
        el: '#smttemplate',
        data: {
            // 查询条件数据formData
            formData: {
                cateName: "", // 产品类目
                cateId: "",
                bizzOwnerIds: [], // 开发专员
                isSaleList: "",
                prodAttrList: "",
                searchSKUType: "pSku",
                searchSKUValue: "",
                searchType: "cnTitle",
                searchValue: "",
                logisticsType: 1,
                logisAttrs: [],
                timeType: "auditTime",
                time: "",
                smtCategoryId: "",
                smtCatename: "",
                complete: "",
                selfImgStatusList:undefined,
                isProhibit: false,
                haveTpl: "",
                minWeight: "",
                maxWeight: "",
                minCost: "",
                maxCost: "",
                orderByType: 3,
                tortPlat: 5,
                devTypes: [],
                imgStatus: "1,2",
                startTime: "",
                endTime: "",
                tplCreatorId: "",
                aliexpressTpl: false, // 基础模板页签false，速卖通模板页签true
                page: 1,
                limit: 50,
                cnTitle: '',
                enTitle: '',
                pSku: '',
                sSku: '',
                pSkuExact: '',
                sSkuExact: ''
            },
            smtTemplateName: null,
            smtTemplateCate: null, // smt类目
            // tab显示的总条数
            count: {smttemplate_smtfoundationTempTable: 0, smttemplate_smtTempTable: 0},
            // 当前默认显示的模板
            currentIndex: 'smttemplate_smtfoundationTempTable',
            businessOwnerData: null, //开发专员
            siteData: null, //站点
            devTypeData: null, //开发类型
            platForm: null, //禁售平台
            forbiddenSite: null, //禁售站点
            productLabel: null, //商品标签
            logisAttrs: null, //物流属性
            creatorData: null, //创建人
            aliexpressTemplateAttrs: [],  // 选择smt商品属性后，返回的数据字段
            aliexpressTemplateSkuEditDtos: [],  // 选择smt商品属性后，返回的数据字段
            addTableData: {},  // 新增一大行
            smtLayerSkuChildData: [],  // sku子table的所有数据
            returnData: {
                attr: [],
                skuAttr: [],
                smtCategoryId: 0,
                imageAttrId: '',
                skuAttrIds: '',
                prodPId: '',
                haveColor: false,
                haveSize: false,
                haveStyle: false,
            }
        },
        created() {
            var _this = this
            this.getBinessOwners('businessOwnerData')//获取开发专员
            this.getBinessOwners('creatorData')
            this.getDevType()//获取开发类型列表
            this.getPlat()//获取禁售平台
            this.getProductLabel()//获取商品标签列表
        },
        computed: {
            aliexpressTplWatch(){
                return this.formData.aliexpressTpl
            }
        },
        watch: {
            aliexpressTplWatch(newValue, oldValue) {
                if (newValue) {
                    Promise.resolve().then(()=>{
                        formSelects.render('selfImgStatusList')
                    })
                }
            }
        },
        mounted() {
            form.render()
            formSelects.render('tortPlat')
            formSelects.render('imgStatus')
            formSelects.render('isSaleList')
            // this.getTableData('')
            this.tableOperate('smttemplate_smtfoundationTempTable')
            this.tableOperate('smttemplate_smtTempTable')
            this.listenAll()
            this.renderDate()
            this.getlogisAttr()
            this.renderPageSort('pageSort')



            this.smtTemplateName = layCascader({
                elem: "#smtTemplate_name",
                clearable: true,
                filterable: true,
                collapseTags: true,
                showAllLevels: false,
                options: [],
                props: {
                    multiple: true,
                    children: "childOrgList",
                    label: "name",
                    value: "id"
                },
            })
            this.smttemp_newcate = layCascader({
                elem: "#smttemp_newcate",
                clearable: true,
                filterable: true,
                collapseTags: true,
                placeholder: '请选择',
                // options: JSON.parse(res),
                props: {
                    multiple: true,
                    label: "title",
                    value: "value",
                    children: 'data'
                }
            });

            let orgTree,userList;
            let _this = this;
            commonReturnPromise({
                url: "/lms/sys/getPersonAndOrg?platCode=aliexpress&roleType=1",
            }).then((res)=>{
                res.orgTree.push({
                    id: -99,
                    name: "暂无"
                });
                orgTree = res.orgTree;
                userList = res.userList;
                handleUserData(orgTree)
                _this.smtTemplateName.setOptions(orgTree)
            })
            commonReturnPromise({
                url: ctx + "/prodCateOa/get/cate/tree",
            }).then((res)=>{
                _this.smttemp_newcate_data = JSON.parse(res)
                _this.smttemp_newcate.setOptions(_this.smttemp_newcate_data);
            })

            // 处理成树结构数据
            function handleUserData(item){
                for(let i=0,iLen=item.length; i<iLen; i++){
                    if(item[i].childOrgList && item[i].childOrgList.length != 0){
                        handleUserData(item[i].childOrgList)
                    }else{
                        item[i]['childOrgList'] = userList?.filter(j => {
                            j.name = j.user_name
                            return j.org_name == item[i].name
                        })||[];
                    }
                }
            }
        },
        methods: {
            handleData(res){
                let _this = this;
                res.forEach(item => {
                    item['label'] = `${item.cnName}(${item.enName})`
                    if(item.children && item.children.length != 0){
                        _this.handleData(item.children)
                    }
                })
                return res;
            },
            // 补充必填项
            smtTemp_supplyReqBtn(){
                var _this = this, filterRes = [];
                var index = layer.open({
                    type: 1,
                    title: '补充必填项',
                    area: ['80%','90%'],
                    btn: ['保存','关闭'],
                    content: $('#smtTemp_supplyReq').html(),
                    success: function(layero,index){
                        var data = table.checkStatus('smttemplate_smtTempTable').data
                        if(data.length != 0){
                            layero.find(".cateSearchCon").hide()
                            var smtCategoryDetailId = data.map(function(item){
                                return item.smtCategoryDetailId
                            })
                            let categoryIdStr = Array.from(new Set(smtCategoryDetailId)).join()
                            let templateIdStr =  data.map(function(item){
                                return item.aliexpressTemplateId
                            }).join()

                            renderCate(`?categoryIdStr=${categoryIdStr}&templateIdStr=${templateIdStr}`)
                            return;
                        }
                        _this.smtTemplateCate = layCascader({
                            elem: "#smtTemplate_cate",
                            clearable: true,
                            filterable: true,
                            collapseTags: true,
                            showAllLevels: false,
                            options: [],
                            props: {
                                multiple: true,
                                children: "children",
                                value: "categoryId"
                            },
                        })
                        // 获取smt类目的数据
                        commonReturnPromise({
                            url: "/lms/aliexpress/template/getNotCompleteCategory",
                            type: 'GET'
                        }).then(function(result){
                            _this.smtTemplateCate.setOptions(_this.handleData(result))
                        })
                        // 根据类目搜索
                        layero.find("#smtTemplate_cate_search").click(() => {
                            let node = _this.smtTemplateCate.getCheckedNodes();
                            let cateIds = node.map(item => item.value).join();
                            renderCate(`?categoryIdStr=${cateIds}`)

                        })
                        function renderCate(params){
                            commonReturnPromise({
                                url: `/lms/aliexpress/template/queryRequiredAttributeByCategoryIdList${params}`,
                                type: 'GET'
                            }).then(function(result){
                                filterRes = result.filter(item => item.attributeSmtDtoList && item.attributeSmtDtoList.length != 0);
                                let html = '';
                                filterRes.forEach((i,index) => {
                                    let attr = i.attributeSmtDtoList;
                                    // attr的数据是前面是必填项，后面是非必填项排序的
                                    html += `<div class="layui-col-md11 mt20 mb20" style="margin-left: 30px;">类目${index+1}：${i.categoryName}</div>`
                                    attr.forEach(function (item) {
                                        let type = item.attributeShowTypeValue,redStar = '',dom = '',otherInput=[];

                                        let listboxTpl = `<div class="layui-col-lg8 mt05">
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block">
                        <select name=":attrName" class=":class" attrId=":attrId" attr=":attr" lay-filter=":class">:optionList</select>                        
                        </div></div>:otherInput`
                                        let listboxSecondTpl = `<div class="layui-col-lg8 mt05">
                        <label class="layui-form-label :secondRedStar">:secondAttrName</label>
                        <div class="layui-input-block">
                        <select name=":secondAttrName" class=":secondClass" attrId=":secondAttrId" attr=":secondAttr" lay-filter=":secondClass">:optionSecondList</select>                        
                        </div></div>`
                                        let checkboxTpl = `<div class="layui-col-lg10 mt05">
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block checkboxGridLayer">
                        :checkboxList
                        </div></div>:otherInput`
                                        let inputlTpl =`<div class="layui-col-lg8 mt05">
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block">
                        :inputList
                        </div></div>`
                                        let intervalTpl = `<div class="layui-col-lg8 mt05">
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block dis_flex_start">
                        <input class="layui-input :class1" attrId=":attrId" indexFlag="1" attr=":attr">
                        <input class="layui-input :class2" attrId=":attrId" indexFlag="2" attr=":attr" style="margin-left: 4px;">
                        </div></div>`
                                        // 其他other
                                        let otherHtml = `<div class="layui-col-lg8 mt05 smtTemplateOther" style="display: none">  
                        <div class="layui-input-block">
                        <input class="layui-input" placeholder="当选择其他选项时，需要填此项">
                        </div></div>`

                                        if (type == "list_box") {
                                            dom += listboxTpl
                                            var optionList = '<option value="">请选择</option>';
                                            if(item.categoryAttributeValuesSmtList != undefined){
                                                item.categoryAttributeValuesSmtList.forEach(function (attrVal) {
                                                    // 如果产地，中国，默认选中
                                                    optionList += `<option value="${attrVal.categoryAttributeValueId}" ${attrVal.categoryAttributeValueId == '9441741844' ? "selected" : ''} >${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                                                    // 如果产地，中国，需要加二级属性
                                                    if(attrVal.categoryAttributeValueId == '9441741844' && attrVal.msgCategoryAttributeSmt &&attrVal.msgCategoryAttributeSmt.categoryAttributeValuesSmts &&attrVal.msgCategoryAttributeSmt.categoryAttributeValuesSmts.length ){
                                                        let optionSecondList = '<option value="">请选择</option>';
                                                        attrVal.msgCategoryAttributeSmt.categoryAttributeValuesSmtList.forEach(function (seacondAttrVal) {
                                                            optionSecondList += `<option value="${seacondAttrVal.categoryAttributeValueId}">${seacondAttrVal.valueNameZn}(${seacondAttrVal.valueNameEn})</option>`;
                                                        })
                                                        listboxSecondTpl = listboxSecondTpl.replace(":optionSecondList", optionSecondList)
                                                        listboxSecondTpl = listboxSecondTpl.replace(":secondRedStar", attrVal.msgCategoryAttributeSmt.required ? 'redStar':'');
                                                        listboxSecondTpl = listboxSecondTpl.replace(/:secondAttrName/g, `${attrVal.msgCategoryAttributeSmt.attributeNameZn}(${attrVal.msgCategoryAttributeSmt.attributeNameEn})`);
                                                        listboxSecondTpl = listboxSecondTpl.replace(/:secondClass/g, `${attrVal.msgCategoryAttributeSmt.required}${attrVal.msgCategoryAttributeSmt.attributeId}`);
                                                        listboxSecondTpl = listboxSecondTpl.replace(/:secondAttrId/g, attrVal.msgCategoryAttributeSmt.attributeId);
                                                        listboxSecondTpl = listboxSecondTpl.replace(/:secondAttr/g, attrVal.msgCategoryAttributeSmt.attributeNameZn);
                                                        dom += listboxSecondTpl
                                                    }
                                                });
                                                otherInput = item.categoryAttributeValuesSmtList.filter(item => item.valueNameEn == "Other")
                                            }
                                            dom = dom.replace(":optionList", optionList);
                                        } else if (type == "check_box") {
                                            dom += checkboxTpl
                                            let checkboxList = ''
                                            if(item.categoryAttributeValuesSmtList != undefined){
                                                item.categoryAttributeValuesSmtList.forEach(function (attrVal) {
                                                    checkboxList += `<span class="layui-col-md6"><input lay-skin="primary" name="checkBoxAttrName:class" type="checkbox" title="${attrVal.valueNameZn}(${attrVal.valueNameEn})" value="${attrVal.categoryAttributeValueId}" attr=":attr" lay-filter="checkBoxAttrName:class"></span>`;
                                                });
                                                otherInput = item.categoryAttributeValuesSmtList.filter(item => item.valueNameEn == "Other")
                                            }
                                            dom = dom.replace(":checkboxList", checkboxList);
                                        }else if (type == "input") {
                                            dom += inputlTpl
                                            let inputList = ''
                                            if (item.categoryAttributeValuesSmtList !== undefined) {
                                                inputList += `<input type="text" class="layui-input :class" name=":attrName" list=":class" attrId=":attrId" attr=":attr"><datalist id=":class"><option value="">请选择</option>`;
                                                item.categoryAttributeValuesSmtList.forEach(function (attrVal) {
                                                    inputList += `<option value="${attrVal.categoryAttributeValueId}">${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                                                });
                                                inputList += `</datalist>`
                                            } else {
                                                inputList += `<input class="layui-input :class" value="" attrId=":attrId" attr=":attr">`;
                                            }
                                            dom = dom.replace(":inputList", inputList);
                                        }else if (type == "interval") {
                                            dom += intervalTpl
                                        }
                                        redStar += "redStar"

                                        // 有other选项时，显示下面的input框
                                        dom = dom.replace(":otherInput", otherInput.length == 0?'':otherHtml);
                                        dom = dom.replace(":redStar", redStar);
                                        dom = dom.replace(/:attrName/g, `${item.attributeNameZn}(${item.attributeNameEn})`);
                                        dom = dom.replace(/:class/g, `${i.categoryId}${item.attributeId}`);
                                        dom = dom.replace(/:attrId/g, item.attributeId);
                                        dom = dom.replace(/:attr/g, item.attributeNameZn);

                                        html += dom;

                                        _this.listenSMTAttrOnSelect(`${i.categoryId}${item.attributeId}`)
                                        _this.listenSMTAttrOnCheckbox(`checkBoxAttrName${item.attributeId}`)
                                    })

                                })

                                $("#smtTemp_supplyReq_con").html(html)  // 分类属性
                                form.render(null, 'smtTemp_supplyReq_form')
                            })
                        }
                    },
                    yes: function (layeroIndex, layero) {
                        let isReq = true;
                        // 过滤后有值的数据
                        filterRes.forEach((item,index) => {
                            let attr = item.attributeSmtDtoList;
                            let AttrArr = [];
                            for (let i = 0; i < attr.length; i++) {
                                let attrName = item.categoryId + attr[i].attributeId.toString(),
                                    selectText = layero.find("." + attrName + " :selected").text(),
                                    selectNextInput = layero.find("." + attrName + " :selected").parents(".layui-col-lg8").next().find("input");

                                let type = attr[i].attributeShowTypeValue;
                                if (type === "list_box") {
                                    if (selectText.includes('Other')) {
                                        if (selectNextInput.val() == '')
                                            selectNextInput.addClass("layui-form-danger").focus()
                                        AttrArr.push({
                                            "attrId": $("." + attrName).attr("attrId"),
                                            "attrValueId": $("." + attrName + " :selected").val(),
                                            "attrValue": selectNextInput.val()
                                        })

                                        if (selectNextInput.val() == '') {
                                            isReq = false;
                                        }
                                    } else {
                                        let curAttr = {
                                            "attrId": $("." + attrName).attr("attrId"),
                                            "attr": $("." + attrName).attr("attr"),
                                            "attrValueId": $("." + attrName + " :selected").val(),
                                            "attrValue": selectText == "请选择" ? "" : selectText
                                        }

                                        if ($("." + attrName + " :selected").val() == '') {
                                            isReq = false;
                                        }
                                        // 如果是产地（国家或地区）选中中国大陆，存在二级属性
                                        if (curAttr.attrValueId == '9441741844') {
                                            let provinceText = layero.find(`select[attrid=266081643] :selected`).text()
                                            let provinceClass = layero.find(`select[attrid=266081643]`).attr('class') || ''
                                            curAttr.provinceAttributeInfo = {
                                                "attrId": '266081643',
                                                "attr": layero.find(`select[attrid=266081643]`).attr("attr"),
                                                "attrValueId": layero.find(`select[attrid=266081643] :selected`).val(),
                                                "attrValue": provinceText == "请选择" ? "" : provinceText
                                            }
                                            if (provinceClass.includes('true') && curAttr.provinceAttributeInfo.attrValueId == '') {
                                                isReq = false;
                                            }
                                        }
                                        AttrArr.push(curAttr)
                                    }
                                } else if (type === "check_box") {
                                    $("input[name=checkBoxAttrName" + attrName + "]:checked").each(function () {
                                        if (attr[i].attributeId != '' && ($(this).attr("title").includes('Other'))) {
                                            if ($(this).parents(".layui-col-lg12").next().find("input").val() == '')
                                                $(this).parents(".layui-col-lg12").next().find("input").addClass("layui-form-danger").focus()
                                            AttrArr.push({
                                                "attrId": attr[i].attributeId,
                                                "attrValueId": $(this).val(),
                                                "attrValue": $(this).parents(".layui-col-lg12").next().find("input").val()
                                            })
                                            if ($(this).parents(".layui-col-lg12").next().find("input").val() == '') {
                                                isReq = false;
                                            }
                                        } else if (attr[i].attributeId != '') {
                                            AttrArr.push({
                                                "attrId": attr[i].attributeId,
                                                "attr": $(this).attr("attr"),
                                                "attrValueId": $(this).val(),
                                                "attrValue": $(this).attr("title")
                                            })
                                            if ($(this).val() == '') {
                                                isReq = false;
                                            }
                                        }
                                    })
                                } else if (type === "input") {
                                    AttrArr.push({
                                        "attrId": $("." + attrName).attr("attrId"),
                                        "attr": $("." + attrName).attr("attr"),
                                        "attrValue": $("." + attrName).val()
                                    })
                                    if ($("." + attrName).val() == '') {
                                        isReq = false;
                                    }
                                } else if (type === "interval") {
                                    AttrArr.push({
                                        "attrId": $("." + attrName + "1").attr("attrId"),
                                        "attr": $("." + attrName + "1").attr("attr"),
                                        "attrValue": $("." + attrName + "1").val()
                                    })
                                    AttrArr.push({
                                        "attrId": $("." + attrName + "2").attr("attrId"),
                                        "attr": $("." + attrName + "2").attr("attr"),
                                        "attrValue": $("." + attrName + "2").val()
                                    })
                                    if ($("." + attrName + "1").val() == '' || $("." + attrName + "2").val() == '') {
                                        isReq = false;
                                    }
                                }
                            }
                            item['aliexpressTemplateAttrs'] = AttrArr;
                        })

                        if(isReq == false){
                            layer.msg("存在未填写的分类属性，请检查。", {icon: 2})
                            return false;
                        }
                        var data = table.checkStatus('smttemplate_smtTempTable').data
                        if(data.length != 0){
                            var aliexpressTemplateIds = data.map(function(item){
                                return item.aliexpressTemplateId
                            })
                            filterRes.forEach(item => {
                                item['templateIdList'] = aliexpressTemplateIds
                            })
                            // filterRes['templateIdList'] = aliexpressTemplateIds
                        }
                        commonReturnPromise({
                            url: "/lms/aliexpress/template/updateAppointCategoryAttributeValue",
                            type: 'POST',
                            contentType: 'application/json',
                            params:JSON.stringify(filterRes)
                        }).then(function(result){
                            layer.close(layeroIndex);
                            layer.alert("操作成功", {icon: 1})
                        })
                    }
                });
            },
            searchSubmit(index) { //提交搜索
                var _this = this
                var time = $('#smtTemplateTime').val()
                _this.formData.time = time
                _this.formData.startTime = ""
                _this.formData.endTime = ""
                if (time) {
                    _this.formData.startTime = time.split(' - ')[0] + ' 00:00:00'
                    _this.formData.endTime = time.split(' - ')[1] + ' 23:59:59'
                }
                _this.formData.bizzOwnerIds = formSelects.value('bizzOwnerIds', 'val')
                _this.formData.logisAttrs = formSelects.value('logisAttrs', 'val')
                _this.formData.devTypes = formSelects.value('devTypes', 'val')
                _this.formData.imgStatus = formSelects.value('imgStatus', 'val').join(',')
                _this.formData.isSaleList = formSelects.value('isSaleList', 'val').join(',')
                _this.formData.tortPlat = formSelects.value('tortPlat', 'val').join(',')
                // 切换页签
                if(index && index != _this.currentIndex){
                    if(index == 'smttemplate_smtTempTable'){
                        _this.formData.complete = true;
                    }else{
                        _this.formData.complete = '';
                    }
                }
                _this.getTableData(index || _this.currentIndex)
            },
            listenAll() { //监听所有下拉框，为下拉框查询条件赋值
                var _this = this
                for (var i in _this.formData) {
                    _this.listenOnSelect(i)
                }
            },
            listenOnSelect(id) { //监听下拉框
                var _this = this
                form.on('select(' + id + ')', function (data) {
                    _this.formData[id] = data.value
                });
            },
            listenSMTAttrOnSelect(id) { //监听分类属性下拉框
                form.on('select(' + id + ')', function (data) {
                    if($(data.elem).find("option:selected").text().includes('Other')){
                        // OTHER下面的输入框显示
                        $(data.elem).parents(".layui-col-lg8").next(".smtTemplateOther").css("display","block").find("input").val("");
                    }else{
                        $(data.elem).parents(".layui-col-lg8").next().is(".smtTemplateOther")?$(data.elem).parents(".layui-col-lg8").next(".smtTemplateOther").css("display","none"):'';
                    }
                    // 产地（国家或地区）(Origin) 如果选择了中国大陆
                    let formItemDom = $(data.othis[0]).parents(".layui-col-lg8")[0]
                    if($(formItemDom).find('select').attr('attrid')=='219'){
                    let proviceDom =  $('#layernewsmt select[attrid=266081643]').parents(".layui-col-lg8")[0]
                        if(data.value=='9441741844'){
                            $(proviceDom).show()
                        }else{
                            $(proviceDom).hide()
                        }
                    }
                });
            },
            listenSMTAttrOnCheckbox(id) { //监听分类属性checkbox
                form.on('checkbox(' + id + ')', function (data) {
                    if(data.value == 4&&data.elem.checked){
                        // OTHER下面的输入框显示
                        $(data.elem).parents(".layui-col-lg12").next(".smtTemplateOther").css("display","block").find("input").val("");
                    }else if(data.value == 4&&!data.elem.checked){
                        $(data.elem).parents(".layui-col-lg12").next().is(".smtTemplateOther")?$(data.elem).parents(".layui-col-lg12").next(".smtTemplateOther").css("display","none"):'';
                    }
                });
            },
            getTableData(index) { //获取表格数据
                let _this = this;
                let formData = _this.formData;
                _this.currentIndex = index
                if (index === "smttemplate_smtfoundationTempTable") { // 基礎模板
                    formData.aliexpressTpl = false;
                }
                else if (index === "smttemplate_smtTempTable") { // 速賣通模板
                    formData.aliexpressTpl = true;
                    _this.formData.selfImgStatusList = formSelects.value('smttpl_selfImgStatusList', 'val').join() || undefined
                }

                formData[formData.searchType] = formData.searchValue
                formData[formData.searchSKUType] = formData.searchSKUValue

                formData.bizzOwnerIds?formData.bizzOwnerIds = formData.bizzOwnerIds.join():''
                formData.devTypes?formData.devTypes = formData.devTypes.join():''
                formData.logisAttrs?formData.logisAttrs = formData.logisAttrs.join():''

                formData.searchSKUValue = formData.searchSKUValue.replace(/，/g, ",")

                var node = _this.smtTemplateName.getCheckedNodes();
                let sales = node.map(item => item.value),salesObj = {};
                if(sales.includes(-99)){
                    salesObj = {
                        noSales: false,
                        saleIds: sales.filter(item => item != -99).join(",")
                    }
                }else{
                    salesObj = {
                        saleIds: sales.join(",")
                    }
                }

                var node = _this.smttemp_newcate.getCheckedNodes();
                let oaCateIdListStr = node.map(item => item.value).join()

                // 列表查询方法
                _this.initAjax('/aliexpress/template/listprod.html', 'post', {...formData, ...salesObj,oaCateIdListStr}, function (returnData) {
                    _this.count[_this.currentIndex] = returnData.count
                    const renderData = (returnData.data || []).map(item=>({...item,aliexpressTpl:formData.aliexpressTpl}))
                    _this.tablerender(renderData, cols[index], index)
                    _this.renderPageSort('pageSort')
                }, 'application/x-www-form-urlencoded')
            },
            getProductLabel() { //获取商品标签列表
                var _this = this
                _this.initAjax('/sys/listdict.html', 'post', {headCode: "prod_tag"}, function (returnData) {
                    _this.productLabel = returnData.data
                    setTimeout(function () {
                        form.render();
                    }, 0)
                }, 'application/x-www-form-urlencoded')
            },
            getBinessOwners(type, func) { //获取开发专员列表
                var _this = this
                var obj = {businessOwnerData: '开发专员', creatorData: 'smt专员'}
                _this.initAjax('/sys/listuserbyrole.html', 'post', {role: obj[type]}, function (returnData) {
                    _this[type] = returnData.data
                    setTimeout(function () {
                        formSelects.render('bizzOwnerIds');
                    }, 0)
                }, 'application/x-www-form-urlencoded')
            },
            getPlat() { //获取禁售平台
                var _this = this
                _this.initAjax('/enum/getSalesPlatEnum.html', 'post', {}, function (returnData) {
                    _this.platForm = returnData.data
                    setTimeout(function () {
                        form.render();
                    }, 0)
                })
            },
            getDevType() { //获取开发类型列表
                var _this = this
                _this.initAjax('/enum/getPreProdDevTypeEnum.html', 'post', {}, function (returnData) {
                    _this.devTypeData = returnData.data
                    setTimeout(function () {
                        formSelects.render('devTypes');
                    }, 0)
                })
            },
            getlogisAttr() { // 获取物流属性
                var _this = this
                _this.initAjax('/enum/getLogisAttrEnum.html', 'post', {}, function (returnData) {
                    _this.logisAttrs = returnData.data
                    setTimeout(function () {
                        formSelects.render('logisAttrs');
                    }, 0)
                })
            },
            clearCate() {  // 删除产品类目
                var _this = this
                _this.formData.cateId = ""
                _this.formData.cateName = ""
            },
            clearSMTCate() { // 删除smt类目
                var _this = this
                _this.formData.smtCategoryId = ""
                _this.formData.smtCatename = ""
            },
            reset() { // 清空搜索表单
                var _this = this
                _this.formData = {
                    cateName: "",
                    cateId: "",
                    bizzOwnerIds: [],
                    isSaleList: "",
                    prodAttrList: "",
                    searchSKUType: "pSku",
                    searchSKUValue: "",
                    searchType: "cnTitle",
                    searchValue: "",
                    logisticsType: 1,
                    logisAttrs: [],
                    timeType: "auditTime",
                    time: "",
                    smtCategoryId: "",
                    smtCatename: "",
                    complete: "",
                    isProhibit: false,
                    haveTpl: "",
                    minWeight: "",
                    maxWeight: "",
                    minCost: "",
                    maxCost: "",
                    orderByType: 3,
                    tortPlat: 5,
                    devTypes: [],
                    imgStatus: "1,2",
                    startTime: "",
                    endTime: "",
                    tplCreatorId: "",
                    aliexpressTpl: false,
                    cnTitle: '',
                    enTitle: '',
                    pSku: '',
                    sSku: '',
                    pSkuExact: '',
                    sSkuExact: ''
                }
                $("#smttemplateForm")[0].reset();
                _this.smtTemplateName.setValue(null)
                _this.smttemp_newcate.setValue(null)
                // 图片状态
                formSelects.value('smtTemplateImgStatus', [1,2])
            },
            chooseCate(id, inputId, divId, cateUrl, cateSearchUrl, func) { //查询类目
                var _this = this
                admin.itemCat_select(id, inputId, divId, cateUrl, cateSearchUrl,
                    function (callback, conf) {
                        if (func) {
                            func(callback, conf)
                        } else {
                            _this.formData.cateId = callback.cateid
                            _this.formData.cateName = conf
                        }
                    })
            },
            // 创建Smt分类
            chooseSMTCate() {
                var _this = this
                cateUrl = "/smtPublishModelProduct/getSmtCateList.html";
                cateSearchUrl = "/smtPublishModelProduct/getSmtCateList.html";
                _this.chooseCate('smt_online_button_id', 'smt_online_SMTbutton_hidden', 'smt_online_SMTbutton_div', cateUrl, cateSearchUrl, function (callback, conf) {
                    _this.formData.smtCategoryId = callback.cateid
                    _this.formData.smtCatename = conf
                })
            },
            // 根据STM分类，动态显示内容
            // 参数：smtCategoryId（速卖通分类id），numberFlag（一个标识，取值0和1 ，0代表打开模板详情时带出的数据，1代表手动选择了smt分类，需要清空sku信息表的数据和分类属性和自定义属性）
            handleSMTCate(smtCategoryId, numberFlag, pSku) {
                loading.show();
                var _this = this
                // 获取SMT分类属性接口，smtCategoryId：速卖通分类id
                _this.initAjax('/aliexpress/template/listcateattr.html', 'get', {
                    smtCategoryId: smtCategoryId,
                    prodPSku: pSku,
                }, function (returnData) {
                    if (returnData.code == "0000") {
                        // 7788 【SMT模板/刊登】将已有数据中类目属性为”中国省份“的值设置为”浙江“
                        if(returnData.data.bestAttrs && returnData.data.bestAttrs.length != 0){
                            let zhejiangId = returnData.data.bestAttrs.filter(item => item.attrValueId == '100015203')
                            if(zhejiangId.length == 0){
                                returnData.data.bestAttrs.push({
                                    attr: "CN",
                                    attrId: 266081643,
                                    attrValue: "Zhejiang",
                                    attrValueId: 100015203
                                })
                            }
                        }else{
                            returnData.data.bestAttrs = [{
                                attr: "CN",
                                attrId: 266081643,
                                attrValue: "Zhejiang",
                                attrValueId: 100015203
                            }]
                        }
                        _this.handleSMTCateSmtTemplateCateData(returnData.data, numberFlag)
                        // numberFlag == 1 手动选择了smt分类
                        if (numberFlag == 1) {
                            // sku信息子表隐藏
                            $("#skuToTable").hide();
                            // sku信息子表数据清空
                            window.sessionStorage.setItem("smtLayerSkuChildData", '')
                            // 分类属性and自定义属性置空
                            _this.aliexpressTemplateAttrs = [];
                            // 清空自定义属性
                            $("#SMTsalePropAttrList").html('')
                        }
                    } else {
                        layer.msg(data.msg || 'error')
                    }
                }, 'application/x-www-form-urlencoded')
            },
            // 新建模板时，根据SMT类目，获取分类属性和SKU信息
            handleSMTCateSmtTemplateCateData(data, numberFlag) {  // 选择速卖通分类属性后返回的数据
                let _this = this;
                let skuAttrIdsArr = [];
                // for (var i in data) {
                //     if (i === "attr") {  // 分类属性
                //         _this.returnData.attr = data[i]
                //     } else if (i === "skuAttr") {  // SKU信息表
                //         _this.returnData.skuAttr = data[i]
                //     }
                // }
                _this.returnData.attr = data["attr"] // 分类属性
                _this.returnData.skuAttr = data["skuAttr"] // SKU信息表

                if (numberFlag == 1) {
                    // sku信息表数据置空
                    _this.returnData.skuAttrIds = '0,0,0' // sku信息表的应用数据
                    _this.returnData.imageAttrId = '' // sku信息表的设置图片属性值
                }
                if (_this.returnData.skuAttrIds) {
                    skuAttrIdsArr = _this.returnData.skuAttrIds.split(",")  // 应用数
                }
                // 没有attr时，要把分类属性置空
                data.hasOwnProperty("attr") == false? _this.returnData.attr = []:'';
                _this.attrFunc() // 处理layer的分类属性模板

                // 没有skuattr时，要把sku信息表清空
                if (!("skuAttr" in data)) {
                    _this.returnData.skuAttr = []
                    skuAttrIdsArr = []
                    _this.returnData.imageAttrId = ''
                }
                _this.skuAttrFunc(skuAttrIdsArr, _this.returnData.imageAttrId)// 处理layer的SKU信息表模板

                if (numberFlag == '1') {
                    data.bestAttrs ? _this.aliexpressTemplateAttrsFunc(data.bestAttrs) : ''
                } else {
                    // 模板数据回显
                    // 分类属性和自定义属性数据回显
                    (_this.aliexpressTemplateAttrs && _this.aliexpressTemplateAttrs.length !== 0) ? _this.aliexpressTemplateAttrsFunc(_this.aliexpressTemplateAttrs) : ''
                }
                // 点击生成SKU
                _this.renderSkuTable(_this.aliexpressTemplateSkuEditDtos, 0);
            },
            // 处理layer的分类属性
            attrFunc() {
                let attr = this.returnData.attr,_this = this;
                // 设置个标识，第一次遇到非必填项的时候，加上“更多选填属性”字样
                // attr的数据是前面是必填项，后面是非必填项排序的
                let Flag = 0, html = '';

                attr.forEach(function (item, index) {
                    let type = item.attributeShowTypeValue,redStar = '',dom = '',otherInput=[];

                    let listboxTpl = `<div class="layui-col-lg8">
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block">
                        <select name=":attrName" class=":class" attrId=":attrId" attr=":attr" lay-filter=":class">:optionList</select>                        
                        </div></div>:otherInput`
                    let listboxSecondTpl = `<div class="layui-col-lg8">
                        <label class="layui-form-label :secondRedStar">:secondAttrName</label>
                        <div class="layui-input-block">
                        <select name=":secondAttrName" class=":secondClass" attrId=":secondAttrId" attr=":secondAttr" lay-filter=":secondClass">:optionSecondList</select>                        
                        </div></div>`
                    let checkboxTpl = `<div class="layui-col-lg12">
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block checkboxGrid">
                        :checkboxList
                        </div></div>:otherInput`
                    let inputlTpl =`<div class="layui-col-lg8">
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block">
                        :inputList
                        </div></div>`
                    let intervalTpl = `<div class="layui-col-lg8">
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block dis_flex_start">
                        <input class="layui-input :class1" attrId=":attrId" indexFlag="1" attr=":attr">
                        <input class="layui-input :class2" attrId=":attrId" indexFlag="2" attr=":attr" style="margin-left: 4px;">
                        </div></div>`
                    // 其他other
                    let otherHtml = `<div class="layui-col-lg8 smtTemplateOther" style="display: none">  
                        <div class="layui-input-block">
                        <input class="layui-input" placeholder="当选择其他选项时，需要填此项">
                        </div></div>`

                    if (item.required == false && Flag == 0) {  // 第一次出现非必填属性，塞个按钮
                        Flag = 1;
                        dom += `<div class="layui-col-lg8 layui-col-md8 mb10 mt10"><a id="smtTemplate_to_toggle" style="color: #00BFFF;cursor: pointer">更多选填属性</a></div>`;
                    }

                    if (type == "list_box") {
                        dom += listboxTpl
                        var optionList = '<option value="">请选择</option>';
                        if(item.categoryAttributeValuesSmts != undefined){
                            item.categoryAttributeValuesSmts.forEach(function (attrVal) {
                                // 如果产地，中国，默认选中
                                optionList += `<option value="${attrVal.categoryAttributeValueId}" ${attrVal.categoryAttributeValueId == '9441741844' ? "selected" : ''} >${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                                // 如果产地，中国，需要加二级属性
                                if(attrVal.categoryAttributeValueId == '9441741844' && attrVal.msgCategoryAttributeSmt &&attrVal.msgCategoryAttributeSmt.categoryAttributeValuesSmts &&attrVal.msgCategoryAttributeSmt.categoryAttributeValuesSmts.length ){
                                    let optionSecondList = '<option value="">请选择</option>';
                                    attrVal.msgCategoryAttributeSmt.categoryAttributeValuesSmts.forEach(function (seacondAttrVal) {
                                        optionSecondList += `<option value="${seacondAttrVal.categoryAttributeValueId}">${seacondAttrVal.valueNameZn}(${seacondAttrVal.valueNameEn})</option>`;
                                    })
                                    listboxSecondTpl = listboxSecondTpl.replace(":optionSecondList", optionSecondList)
                                    listboxSecondTpl = listboxSecondTpl.replace(":secondRedStar", attrVal.msgCategoryAttributeSmt.required ? 'redStar':'');
                                    listboxSecondTpl = listboxSecondTpl.replace(/:secondAttrName/g, `${attrVal.msgCategoryAttributeSmt.attributeNameZn}(${attrVal.msgCategoryAttributeSmt.attributeNameEn})`);
                                    listboxSecondTpl = listboxSecondTpl.replace(/:secondClass/g, `${attrVal.msgCategoryAttributeSmt.required}${attrVal.msgCategoryAttributeSmt.attributeId}`);
                                    listboxSecondTpl = listboxSecondTpl.replace(/:secondAttrId/g, attrVal.msgCategoryAttributeSmt.attributeId);
                                    listboxSecondTpl = listboxSecondTpl.replace(/:secondAttr/g, attrVal.msgCategoryAttributeSmt.attributeNameZn);
                                    dom += listboxSecondTpl
                                }
                            });
                            otherInput = item.categoryAttributeValuesSmts.filter(item => item.valueNameEn == "Other")
                        }
                        dom = dom.replace(":optionList", optionList);
                    } else if (type == "check_box") {
                        dom += checkboxTpl
                        let checkboxList = ''
                        if(item.categoryAttributeValuesSmts != undefined){
                            item.categoryAttributeValuesSmts.forEach(function (attrVal) {
                                checkboxList += `<span class=""><input lay-skin="primary" name="checkBoxAttrName:attrId" type="checkbox" title="${attrVal.valueNameZn}(${attrVal.valueNameEn})" value="${attrVal.categoryAttributeValueId}" attr=":attr" lay-filter="checkBoxAttrName:attrId"></span>`;
                            });
                            otherInput = item.categoryAttributeValuesSmts.filter(item => item.valueNameEn == "Other")
                        }
                        dom = dom.replace(":checkboxList", checkboxList);
                    }else if (type == "input") {
                        dom += inputlTpl
                        let inputList = ''
                        if (item.categoryAttributeValuesSmts !== undefined) {
                            inputList += `<input type="text" class="layui-input :class" name=":attrName" list=":class" attrId=":attrId" attr=":attr"><datalist id=":class"><option value="">请选择</option>`;
                            item.categoryAttributeValuesSmts.forEach(function (attrVal) {
                                inputList += `<option value="${attrVal.categoryAttributeValueId}">${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                            });
                            inputList += `</datalist>`
                        } else {
                            inputList += `<input class="layui-input :class" value="" attrId=":attrId" attr=":attr">`;
                        }
                        dom = dom.replace(":inputList", inputList);
                    }else if (type == "interval") {
                        dom += intervalTpl
                    }

                    if(item.required){
                        redStar += "redStar"
                    }

                    // 有other选项时，显示下面的input框
                    dom = dom.replace(":otherInput", otherInput.length == 0?'':otherHtml);
                    dom = dom.replace(":redStar", redStar);
                    dom = dom.replace(/:attrName/g, `${item.attributeNameZn}(${item.attributeNameEn})`);
                    dom = dom.replace(/:class/g, `${item.required}${item.attributeId}`);
                    dom = dom.replace(/:attrId/g, item.attributeId);
                    dom = dom.replace(/:attr/g, item.attributeNameZn);

                    html += dom;

                    _this.listenSMTAttrOnSelect(`${item.required}${item.attributeId}`)
                    _this.listenSMTAttrOnCheckbox(`checkBoxAttrName${item.attributeId}`)
                })
                $("#SMTnormalAttrList").html(html)  // 分类属性
            },
            // 处理layer的自定义属性
            aliexpressTemplateAttrsFunc(aliexpressTemplateAttrs) {
                aliexpressTemplateAttrs.forEach(function (item, index) {
                    if (item.attrId == undefined) { // 自定义属性数据回显，因为自定义属性没有attrId
                        let strs = `<div class="layui-col-lg12 layui-col-md12 smtAddAttrListContain"><div class="layui-input-block dis_flex_start"><input class="layui-input" value="${item.attr || ''}" placeholder="字数不超过70个"><input class="layui-input" value="${item.attrValue || ''}" placeholder="字数不超过70个" style="margin-left: 4px;"><a class="layui-btn layui-btn-xs layui-btn-danger SMTsalePropAttrListDelBtn" style="margin: 5px;">删除</a></div></div>`;
                        $("#SMTsalePropAttrList").append(strs);
                    } else {
                        // 分类属性数据回显
                        let inputLen = $(`#SMTnormalAttrList input[attrid=${item.attrId}]`)
                        let selectLen = $(`#SMTnormalAttrList select[attrid=${item.attrId}]`)
                        let checkboxLen = $(`#layernewsmt input[name=checkBoxAttrName${item.attrId}]`)

                        if (inputLen.length != 0) {
                            setTimeout(function () {
                                let indexNumber = index;
                                inputLen.each(function () {
                                    $(this).val(item.attrValue);
                                })
                            }, 100)
                        }
                        if (selectLen.length != 0) {
                            if(item.attrValueId == 4){  // other
                                selectLen.val(item.attrValueId)
                                $(`#SMTnormalAttrList select[attrid=${item.attrId}]`).parents(".layui-col-lg8").next().css("display","block")
                                $(`#SMTnormalAttrList select[attrid=${item.attrId}]`).parents(".layui-col-lg8").next().find("input").val(item.attrValue)
                            }else{
                                selectLen.val(item.attrValueId)
                            }
                            // 地区
                            if(item.attrId =='219'){
                                if(item.provinceAttributeInfo){
                                    $(`#SMTnormalAttrList select[attrid=${item.provinceAttributeInfo.attrId}]`).val(item.provinceAttributeInfo.attrValueId)
                                }
                                $(`#SMTnormalAttrList select[attrid=266081643]`).val(100015203)
                                // else{
                                //     // 没选中中国大陆，省份隐藏
                                //     $(`#SMTnormalAttrList select[attrid=266081643]`).parents(".layui-col-lg8").hide()
                                // }
                            }
                        }
                        if (checkboxLen.length != 0) {
                            checkboxLen.each(function () {
                                if (item.attrValueId == $(this).val() && item.attrValueId == 4) {  // other
                                    $(this).prop("checked", true);
                                    $(this).parents(".layui-col-lg12").next().css("display","block")
                                    $(this).parents(".layui-col-lg12").next().find("input").val(item.attrValue)
                                }else if (item.attrValueId == $(this).val()) {
                                    $(this).prop("checked", true);
                                }
                            })
                        }

                        // 区间
                        if (index >= 1)
                            if (aliexpressTemplateAttrs[index].attr == aliexpressTemplateAttrs[index - 1].attr) {
                                setTimeout(() => {
                                    let newIndex = index - 1;
                                    $(`#SMTnormalAttrList input[attrid=${item.attrId}]`).parent().find("input").eq(0).val(aliexpressTemplateAttrs[index - 1].attrValue)
                                    $(`#SMTnormalAttrList input[attrid=${item.attrId}]`).parent().find("input").eq(1).val(aliexpressTemplateAttrs[index].attrValue)
                                }, 200)
                            }
                    }
                })
                form.render();
            },
            // 处理layer的SKU信息表
            // skuAttrIdsArr:
            skuAttrFunc(skuAttrIdsArr, imageAttrId) {
                let skuAttr =this.returnData.skuAttr,html = '';
                // 没有数据直接隐藏表格
                if (skuAttr.length === 0) {
                    $("#skuParentTable").html('')
                    return false;
                }
                let skuTableType = ['color', 'size', 'style'];
                skuTableType.forEach(function (item, index) {
                    let str = `<tr>
                                <td><input type="checkbox" name="skuTableCheckbox" title="应用" value=":index" lay-skin="primary" lay-filter="skuTableCheckbox" :checked></td>
                                <td>:skuTableTypeIndex</td><td><select lay-filter="skuTableSelect" id="skuTableSelect">:option</select></td>
                                <td class="customizedPicText">:radioCheckedText</td>
                             <td class="customizedPicRadio"><input type="radio" name=":skuTableRadio" lay-filter=":skuTableRadio" :radioChecked></td>
                         </tr>
                `
                    str = str.replace(":index", index).replace(":checked", (skuAttrIdsArr[index] == 0 || skuAttrIdsArr[index] == undefined)?'':"checked").replace(":skuTableTypeIndex", item);
                    let option = '';
                    skuAttr.forEach(function (attrVal) {
                        option += `<option bool="${attrVal.customizedPic}" value="${attrVal.attributeId}" textToName="${attrVal.attributeNameZn}(${attrVal.attributeNameEn})" ${skuAttrIdsArr[index] == attrVal.attributeId ?"selected":''}>${attrVal.attributeNameZn}(${attrVal.attributeNameEn})${attrVal.required == true?"(必填)":''}</option>`
                    });
                    str = str.replace(":option", option);
                    // 默认根据下拉框数据的第一个option是否设置允许设置图片
                    // 1. 选择  映射平台属性名 后，联动 是否可设置图片属性
                    if ((skuAttrIdsArr[index]!==undefined) && skuAttrIdsArr[index] == imageAttrId) {
                        str = str.replace(":radioCheckedText", "允许设置图片").replace(":radioChecked", "checked").replace(":skuTableRadio", "skuTableRadio");
                    } else {
                        str = str.replace(":radioCheckedText", skuAttr[0].customizedPic == true ?"允许设置图片":"不允许设置图片").replace(":radioChecked", skuAttr[0].customizedPic == true ?"":"disabled").replace(":skuTableRadio", skuAttr[0].customizedPic == true ?"skuTableRadio":"");
                    }
                    html += str;
                })
                $("#skuParentTable").html(html) // sku 信息表

                this.returnData.haveSize ? '' : $("#skuParentTable tr:nth-child(2)").css("background-color", "#ddd");
                this.returnData.haveStyle ? '' : $("#skuParentTable tr:nth-child(3)").css("background-color", "#ddd");
                this.returnData.haveColor ? '' : $("#skuParentTable tr:nth-child(1)").css("background-color", "#ddd");
            },
            // 处理sku信息表中选中的应用数和设置图片属性的数据
            getSkuTableCheckedData() {
                // 获取选中的checkbox和radio行的 “映射平台属性名”列的下拉值，同时获取下拉框的内容，用于展示sku子table的表头
                let obj = {
                    checkbox_arr_val: [],
                    checkbox_arr_text: []
                };
                $('input[name="skuTableCheckbox"]').each(function () {
                    if ($(this).prop('checked')) {
                        obj.checkbox_arr_val.push($(this).parents("tr").find("#skuTableSelect option:selected").val());
                        obj.checkbox_arr_text.push($(this).parents("tr").find("#skuTableSelect option:selected").attr("textToName"));
                    } else {
                        obj.checkbox_arr_val.push(0);
                    }
                });

                obj.checkbox_value = obj.checkbox_arr_val.toString();
                obj.radio_value = $('#skuParentTable input[type="radio"]:checked').parents("tr").find("#skuTableSelect option:selected").val();
                obj.radio_text = $('#skuParentTable input[type="radio"]:checked').parents("tr").find("#skuTableSelect option:selected").attr("textToName");
                obj.radio_checkbox = $('#skuParentTable input[type="radio"]:checked').parents("tr").find(".layui-form-checkbox").hasClass("layui-form-checked");

                return obj
            },
            // 渲染sku信息子table的表头，numberFlag（有两个值0和1,0代表直接打开模板，1代表手动选择了smt分类属性）
            renderSkuTable(smtLayerSkuChildData, numberFlag) {
                let _this = this;
                let {checkbox_arr_val, checkbox_arr_text, checkbox_value, radio_value, radio_text, radio_checkbox} = {..._this.getSkuTableCheckedData()}

                // 设置图片属性时， 如果第一列（也就是否应用），如果没有勾选应用，则忽略“设置图片属性”这一行，取消选中的“设置图片属性”
                radio_value !== undefined && checkbox_arr_val.indexOf(radio_value) === -1 ? $('#skuParentTable input[type="radio"]:checked').removeAttr('checked') : ''
                // radio_checkbox == true表示图片属性被选中并应用
                radio_checkbox ? '' : radio_value = radio_text = ''

                let prodPId = $("input[name=prodPId]").val(),  // 基础模板id
                    attrIds = checkbox_value || '0,0,0', // 应用数，永远是三个值
                    imgAttrId = radio_value;  // 设置图片的数据，如果没有选，就是空
                if (numberFlag == 0) {
                    _this.addTableData = _this.deepCopy(smtLayerSkuChildData[0]);
                    _this.smtLayerSkuChildData = _this.deepCopy(smtLayerSkuChildData);
                    smtLayertablePlug(smtLayerSkuChildData)
                } else if (numberFlag == 1) {
                    // 获取生成sku的信息
                    commonReturnPromise({
                        url: "/lms/aliexpress/template/regensku.html?prodPId=" + prodPId + "&attrIds=" + attrIds + "&imgAttrId=" + (imgAttrId == undefined ? '' : imgAttrId) + "&smtCategoryId=" + $("input[name=smtCategoryId]").val(),
                        type: 'post'
                    }).then(function(result){
                        if (result.length == 0) {
                            layer.alert("没有子商品", {icon: 2})
                        } else {
                            smtLayerSkuChildData = result;
                            _this.addTableData = _this.deepCopy(result[0]);
                            _this.smtLayerSkuChildData = _this.deepCopy(smtLayerSkuChildData);
                            smtLayertablePlug(smtLayerSkuChildData)
                        }
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                }

                // 根据sku信息表中选中的数据，生成子table的表头
                let html = '<tr>';
                // 加了个查重的，
                let unique_checkbox_arr_text = _this.unique(checkbox_arr_text)
                if (imgAttrId != "") {  // 获取设置图片的属性
                    unique_checkbox_arr_text.forEach(function (data) {
                        if (data == radio_text) {
                            html += '<th>' + data + '</th>';
                        }
                    });
                }

                html += '<th>SKU（颜色，尺寸，款式）</th>'
                unique_checkbox_arr_text = unique_checkbox_arr_text.filter(item => item != radio_text)
                unique_checkbox_arr_text.forEach(function (data,index) {
                    html += `<th>${data}<a class="layui-btn layui-btn-xs ml20" attrInfo="attrInfo${index+1}" id="smtTemplateOneClickCopy">一键复制</a></th>`;
                });
                html += '<th></th></tr>'

                $("#smtLayertable_thead").html(html)
            },
            unique(array) {
                return Array.from(new Set(array));
            },
            renderDate() { //渲染日期
                laydate.render({
                    elem: '#smtTemplateTime',
                    type: 'date',
                    range: true
                });
            },
            tablerender(data, cols, id, func) { //初始化表格渲染
                var _this = this
                var tableIns = table.render({
                    elem: "#" + id,
                    data: data,
                    id: id,
                    limit: 20000,
                    cols: cols,
                    done: function (res) {
                        imageLazyload();
                        form.render();
                    }
                });
                if (func) {
                    func(tableIns)
                }
            },
            tableOperate(id) { //表格操作
                var _this = this
                table.on('tool(' + id + ')', function (obj) {
                    var data = obj.data;
                    var layEvent = obj.event;
                    var tr = obj.tr;
                    if (layEvent === 'newTemplates') {  // 新建模板
                        _this.newTemplate(data, '1')
                    } else if (layEvent === 'modifySmt') {  // 模板详情
                        _this.newTemplate(data, '2')
                    } else if (layEvent === 'deleteSmt') {
                        layer.confirm('你确定要删除模板吗？', {
                            btn: ['确定', '取消'], //按钮
                            icon: 7
                        }, function () {
                            commonReturnPromise({
                                url: `/lms/aliexpress/template/deltemplate.html?id=${data.aliexpressTemplateId}`,
                                type: 'get',
                            }).then(function(result){
                                layer.msg(result||"删除成功", {icon: 1})
                                _this.searchSubmit()
                            }).catch(function(err){
                                layer.msg(err, {icon:2});
                            })
                        }, function () {
                            layer.msg('已取消');
                        });
                    }else if (layEvent === "aep_saleNote") {
                        //销售备注
                        var _saleNote = data.saleNote ? data.saleNote : "";
                        _this.smtTem_saleNote(data.id, _saleNote, tr)
                    }
                });
            },
            smtTem_saleNote(id = "", saleNote, trDom) {
                var _this = this
                layer.open({
                    type: 1,
                    title: '修改销售备注',
                    area: ["500px", "300px"],
                    btn: ["保存", "取消"],
                    id: Date.now(),
                    content: '<div style="padding:20px"><textarea class="layui-textarea">' + saleNote + '</textarea></div>',
                    yes: function (index, layero) {
                        var saleNoteNew = $(layero).find("textarea").val();
                        layui.admin.load.show()
                        commonReturnPromise({
                            url: "/lms/aliexpresslisting/updatesalenote.html",
                            type: 'post',
                            params: {
                                prodPId: id,
                                saleNote: saleNoteNew
                            }
                        }).then(function(result){
                            layui.admin.load.hide()
                            layer.close(index);
                            trDom.find('td[data-field=saleNote] pre').html(saleNoteNew)
                            _this.searchSubmit()
                            layer.msg(result || "销售备注修改成功", { icon: 1 });
                        }).catch(function(err){
                            layui.admin.load.hide()
                            layer.msg(err, {icon:2});
                        })
                    }
                });
            },
            renderPageSort(id) {
                var _this = this
                laypage.render({
                    elem: id, //注意，这里的 test1 是 ID，不用加 # 号
                    count: _this.count[_this.currentIndex], //数据总数，从服务端得到
                    limit: 50,
                    limits: [50, 100, 200],
                    curr: _this.formData.page,
                    layout: ['prev', 'page', 'next', 'count', 'limit'],
                    jump: function (obj, first) {
                        _this.formData.page = obj.curr
                        _this.formData.limit = obj.limit
                        //首次不执行
                        if (!first) {
                            _this.searchSubmit()
                        }
                    }
                });
            },
            isRepeat(arr) {
                var hash = {};
                for (var i in arr) {
                    if (hash[arr[i]]) {
                        return true;
                    }
                    hash[arr[i]] = true;
                }
                return false;
            },
            newTemplate(data, type) { //新建模板弹框（data是当前操作行的数据）
                var _this = this;
                let pSku = data.pSku
                let layerindex = layer.open({
                    type: 1,
                    title: type === '1' ? '新建速卖通模板' : '模板详情',
                    content: $("#smtTemplate_newSmtTemp").html(),
                    maxmin: true,
                    area: ['100%', '100%'],
                    btn: ['确定', '取消'],
                    success: function (index, layero) {
                        loading.show()
                        window.sessionStorage.setItem("smtLayerSkuChildData", '')
                        type === '1' ? "" : $("input[name=id]").val(data.aliexpressTemplateId) // 速卖通模板id
                        $("#layernewsmt input[name=prodPId]").val(data.id)// 基础模板id
                        let sSkuList = data.prodTempVarietyDtos?.map(item => item.sSku)
                        $("#layernewsmt input[name=sSkus]").val(sSkuList.join(","))
                        //  1、创建模板 传prodPId，
                        //  2、编辑模板 传id， 速卖通模板id
                        let smtTemplate_id = type === '1' ? {"prodPId": data.id,sSkus: sSkuList.join(",")} : {"id": data.aliexpressTemplateId}
                        if(type == '1'){
                            commonRenderSelect('smtTemplate_productUnit', subTemplate_PRODUCT_UNIT_LIST, { name: 'name', code: 'code', selected: '100000015' })
                            $(".prodDescAndFixDesc").show()
                        } else {
                            $(".prodDescAndFixDesc").hide();;
                        }
                        _this.initAjax('/aliexpress/template/gettemplate.html', 'get', smtTemplate_id, function (returnData) { //获取编辑模板的数据
                            commonRenderSelect('smtTemplate_productUnit', subTemplate_PRODUCT_UNIT_LIST, { name: 'name', code: 'code', selected: returnData.data.productUnit?returnData.data.productUnit:'100000015' })
                            if (returnData.code !== "0000") {
                                layer.msg(returnData.msg || 'error')
                                return false
                            }
                            let data = returnData.data;
                            if(data.aliexpressTemplateAttrs && data.aliexpressTemplateAttrs.length != 0){
                                let flag = false;
                                for(let i=0,len=data.aliexpressTemplateAttrs.length;i<len;i++){
                                    if(data.aliexpressTemplateAttrs[i].attrId == 219){
                                        data.aliexpressTemplateAttrs[i] = {
                                            attr: "产地（国家或地区）",
                                            attrId: 219,
                                            attrValue: "中国大陆(Origin)(Mainland China)",
                                            attrValueId: 9441741844,
                                            provinceAttributeInfo:{
                                                attr: "CN",
                                                attrId: 266081643,
                                                attrValue: "Zhejiang",
                                                attrValueId: 100015203
                                            }
                                        }
                                        flag = true;
                                        // return;
                                    }
                                }
                                if(flag == false){
                                    data.aliexpressTemplateAttrs.push({
                                            attr: "产地（国家或地区）",
                                            attrId: 219,
                                            attrValue: "中国大陆(Origin)(Mainland China)",
                                            attrValueId: 9441741844,
                                            provinceAttributeInfo:{
                                                attr: "CN",
                                                attrId: 266081643,
                                                attrValue: "Zhejiang",
                                                attrValueId: 100015203
                                            }
                                        })
                                }
                            }else{
                                data.aliexpressTemplateAttrs = [{
                                    attr: "产地（国家或地区）",
                                    attrId: 219,
                                    attrValue: "中国大陆(Origin)(Mainland China)",
                                    attrValueId: 9441741844,
                                    provinceAttributeInfo:{
                                        attr: "CN",
                                        attrId: 266081643,
                                        attrValue: "Zhejiang",
                                        attrValueId: 100015203
                                    }
                                }]
                            }
                            _this.aliexpressTemplateAttrs = data.aliexpressTemplateAttrs  //当前模板选择的属性
                            _this.returnData.skuAttrIds = data.skuAttrIds // sku信息表的应用数据
                            _this.returnData.imageAttrId = data.imageAttrId // sku信息表的设置图片属性值
                            _this.returnData.haveColor = returnData.data.haveColor == undefined ? false : returnData.data.haveColor
                            _this.returnData.haveSize = returnData.data.haveSize == undefined ? false : returnData.data.haveSize
                            _this.returnData.haveStyle = returnData.data.haveStyle == undefined ? false : returnData.data.haveStyle

                            // 基本信息顶部第一层的数据
                            for (var i in data) {
                                if (data[i]) {
                                    $('input[name=' + i + ']').val(data[i])
                                    if (i === "keyword" || i === "wishTags") {
                                        $('textarea[name=' + i + ']').val(data[i].replace(/\|/g, ","))
                                    }
                                    if (i === 'smtCategoryId') {  // 如果存在smt分类id
                                        _this.handleSMTCate(data[i], 0, pSku)
                                        $("#smtSkuAll").show();
                                    }
                                    if(i === 'packageType'&&data[i]==true){
                                        $(`#smtTemplatesmfs input[name=packageType]:checkbox`).attr('checked','true');
                                    }
                                    if(i === 'prodDesc' || i === 'fixDesc'){ // 商品描述&&固定描述
                                        $('textarea[name=' + i + ']').val(data[i])
                                    }
                                }
                            }
                            // 显示标题剩余字数
                            smtTemplate_getRemainWord(data.title,$("input[name=title]"))

                            // 图片
                            if (data.mainTplImages.length !== 0) {
                                // let smtmainImages = returnData.data.mainTplImages.split(",")
                                // smtmainImages.map(item => smt_proTpl_showImg(item, $('[data-id=mainImgContains1]'), false))
                                let smtmainImages = data.mainTplImages
                                smtmainImages.map((item, index) => {
                                    smt_proTpl_showImg(item.name, $('[data-id=mainImgContains1]'), false, index, item)
                                })  // 主图
                            }

                            if (data.market1Images) {
                                smt_proTpl_showImg(data.market1Images, $('[data-id=assistImgContains1]'), false)
                            }

                            if (data.market2Images) {
                                // 前端处理下图片3：4
                                proportionImage($('#layernewsmt [data-id=assistImgContains2]').find("img"), data.market2Images);
                                // smt_proTpl_showImg(data.market2Images, $('[data-id=assistImgContains2]'), false)
                            }

                            // 辅图
                            if (data.assistTplImages.length !== 0) {
                                let descImages = data.assistTplImages
                                descImages.map((item, index) => {
                                    smt_proTpl_showImg(item.name, $('[data-id=remarkImgContains1]'), item.isMust, index, item)
                                })
                            }

                            // 供
                            if(data.isSupplierOrigiImg){
                                $(".smtTemplateFontContain").append(`<span class="smtTemplatefont">供</span>`)
                            }
                            // 自
                            if(data.selfImgStatus == 1){
                                $(".smtTemplateFontContain").append(`<span class="smtTemplatefont">自</span>`)
                            }


                            if (returnData.data.aliexpressTemplateSkuEditDtos) {  // sku信息子表的数据
                                _this.aliexpressTemplateSkuEditDtos = returnData.data.aliexpressTemplateSkuEditDtos
                            } else {
                                // 隐藏并且数据清空
                                _this.aliexpressTemplateSkuEditDtos = []
                                $("#skuToTable").hide();
                            }

                        }, 'application/x-www-form-urlencoded')

                        form.render();

                        // 设定本地图片上传功能 -- 主图
                        smt_uploadLocalImg1($('[data-id=mainImgContains1]'))
                        smt_uploadNetImg($('[data-id=mainImgContains1]'))
                        // 设定本地图片上传功能 -- 营销图
                        smt_uploadLocalImg1($('[data-id=assistImgContains1]'), JSON.stringify({
                            'width': 800,
                            'height': 800
                        }))
                        smt_uploadNetImg($('[data-id=assistImgContains1]'))

                        smt_uploadLocalImg1($('[data-id=assistImgContains2]'), JSON.stringify({
                            'width': 750,
                            'height': 1000
                        }))
                        smt_uploadNetImg($('[data-id=assistImgContains2]'))

                        // 设定本地图片上传功能 -- 描述图
                        smt_uploadLocalImg1($('[data-id=remarkImgContains1]'))
                        smt_uploadNetImg($('[data-id=remarkImgContains1]'))

                        $("#chooseCate").click(function () {
                            cateUrl = "/smtPublishModelProduct/getSmtCateList.html";
                            cateSearchUrl = "/smtPublishModelProduct/getSmtCateList.html";
                            _this.chooseCate('smt_online_button_id', 'smt_online_SMTbutton_hidden', 'smt_online_SMTbutton_div', cateUrl, cateSearchUrl, function (callback, conf) {
                                $("input[name=smtCategoryName]").val(conf)
                                $("input[name=smtCategoryId]").val(callback.cateid)

                                loading.show();
                                // sku信息
                                _this.handleSMTCate(callback.cateid, 1, pSku)
                            })
                        })
                    },
                    yes: _this.debounce(function (index, layero) {
                        var formdata = serializeObject($('#layernewsmt'));
                        if (formdata.title.length >128) {
                            layer.alert("标题超出128个字符,请修改标题", {icon: 2})
                            return false;
                        }
                        // 图片数据
                        let mainImagesArr = [], descImagesArr = [];
                        $("div[data-id='mainImgContains1'] img[class=imgHide]").each(function (i) {
                            if ($(this).attr('src') !== '/lms/static/img/kong.png') {
                                mainImagesArr.push({
                                    'name': $(this).attr('src').split("!")[0],
                                    'isMust': false
                                })
                            }
                        });
                        formdata.mainTplImages = mainImagesArr;


                        $("div[data-id='assistImgContains1'] img").attr('src') != '/lms/static/img/kong.png' ? (formdata.market1Images = ($("div[data-id='assistImgContains1'] img").attr('src').split("!")[0] == "undefined" ? "" : $("div[data-id='assistImgContains1'] img").attr('src').split("!")[0])) : formdata.market1Images = ''
                        $("div[data-id='assistImgContains2'] img").attr('src') != '/lms/static/img/kong.png' ? (formdata.market2Images = ($("div[data-id='assistImgContains2'] img").attr('src').split("!")[0] == "undefined" ? "" : $("div[data-id='assistImgContains2'] img").attr('src').split("!")[0])) : formdata.market2Images = ''

                        $("div[data-id='remarkImgContains1'] img[class=imgHide]").each(function (i) {
                            if ($(this).attr('src') !== '/lms/static/img/kong.png') {
                                descImagesArr.push({
                                    'name': $(this).attr('src').split("!")[0],
                                    'isMust': $(this).parents(".ImgDivOut").find(".layui-form-checkbox").hasClass("layui-form-checked")
                                })
                            }
                        });

                        formdata.assistTplImages = descImagesArr;

                        if (formdata.mainTplImages.length === 0 || formdata.assistTplImages.length === 0) {
                            layer.alert("请把图片信息上传完整", {icon: 2})
                            return false;
                        }

                        // sku信息
                        // checkbox_arr_val:sku信息表的应用数据（array）
                        // checkbox_value:sku信息表的应用数据（string）
                        // radio_value:sku信息表的设置图片属性值
                        let {checkbox_arr_val, checkbox_arr_text, checkbox_value, radio_value, radio_text} = {..._this.getSkuTableCheckedData()}

                        formdata.imageAttrId = radio_value || '';//模板选中的图片属性id
                        formdata.skuAttrIds = checkbox_value;//分别为color、size、style绑定的速卖通平台属性id. 一定是三个值，如果只选择了color、size 传1,2,0

                        let AttrArr = []
                        let attr = _this.returnData.attr;

                        // attr循环
                        for (let i = 0; i < attr.length; i++) {
                            let selectVal = $("#SMTnormalAttrList ." + attr[i].required + attr[i].attributeId + " :selected").val(),
                                inputVal = $("#SMTnormalAttrList input[attrid=" + attr[i].attributeId + "]").val(),
                                checkboxDom = $("#SMTnormalAttrList input[name=checkBoxAttrName" + attr[i].attributeId + "][type=checkbox]").val(),
                                checkboxVal = $("#SMTnormalAttrList input[name=checkBoxAttrName" + attr[i].attributeId + "][type=checkbox]:checked").val(),
                                attrName = attr[i].required + attr[i].attributeId.toString(),
                                selectText = $("#SMTnormalAttrList ." + attrName + " :selected").text(),
                                selectNextInput = $("#SMTnormalAttrList ." + attrName + " :selected").parents(".layui-col-lg8").next().find("input");
                            
                            // 先验证必填项
                            if (attr[i].required == true && (selectVal == '' || inputVal == '' || (checkboxDom != undefined && checkboxVal == undefined))) {
                                layer.msg("请把必填项填写完整", {icon: 2})
                                return false;
                            }

                            let type = attr[i].attributeShowTypeValue;
                            if (type === "list_box") {
                                if(selectText.includes('Other')){
                                    if(selectNextInput.val() == '')
                                        selectNextInput.addClass("layui-form-danger").focus()
                                    AttrArr.push({
                                        "attrId": $("." + attrName).attr("attrId"),
                                        "attrValueId": $("." + attrName + " :selected").val(),
                                        "attrValue": selectNextInput.val()
                                    })
                                }else{
                                    let curAttr = {
                                        "attrId": $("." + attrName).attr("attrId"),
                                        "attr": $("." + attrName).attr("attr"),
                                        "attrValueId": $("." + attrName + " :selected").val(),
                                        "attrValue": selectText == "请选择" ? "" : selectText
                                    }
                                    // 如果是产地（国家或地区）选中中国大陆，存在二级属性
                                    if(curAttr.attrValueId == '9441741844'){
                                        let provinceText = $(`#SMTnormalAttrList select[attrid=266081643] :selected`).text()
                                        let provinceClass = $(`#SMTnormalAttrList select[attrid=266081643]`).attr('class') || ''
                                        curAttr.provinceAttributeInfo={
                                            "attrId": '266081643',
                                            "attr": $(`#SMTnormalAttrList select[attrid=266081643]`).attr("attr"),
                                            "attrValueId":$(`#SMTnormalAttrList select[attrid=266081643] :selected`).val(),
                                            "attrValue": provinceText == "请选择" ? "" : provinceText
                                        }
                                        if(provinceClass.includes('true') && curAttr.provinceAttributeInfo.attrValueId =='' ){
                                            layer.msg("请把必填项填写完整", {icon: 2})
                                            return false;
                                        }
                                    }
                                    AttrArr.push(curAttr)
                                }
                            } else if (type === "check_box") {
                                $("input[name=checkBoxAttrName" + attr[i].attributeId + "]:checked").each(function () {
                                    if (attr[i].attributeId != '' && ($(this).attr("title").includes('Other'))) {
                                        if($(this).parents(".layui-col-lg12").next().find("input").val() == '')
                                            $(this).parents(".layui-col-lg12").next().find("input").addClass("layui-form-danger").focus()
                                        AttrArr.push({
                                            "attrId": attr[i].attributeId,
                                            "attrValueId": $(this).val(),
                                            "attrValue": $(this).parents(".layui-col-lg12").next().find("input").val()
                                        })
                                    }else if(attr[i].attributeId != ''){
                                        AttrArr.push({
                                            "attrId": attr[i].attributeId,
                                            "attr": $(this).attr("attr"),
                                            "attrValueId": $(this).val(),
                                            "attrValue": $(this).attr("title")
                                        })
                                    }
                                })
                            } else if (type === "input") {
                                AttrArr.push({
                                    "attrId": $("." + attrName).attr("attrId"),
                                    "attr": $("." + attrName).attr("attr"),
                                    "attrValue": $("." + attrName).val()
                                })

                            } else if (type === "interval") {
                                AttrArr.push({
                                    "attrId": $("." + attrName + "1").attr("attrId"),
                                    "attr": $("." + attrName + "1").attr("attr"),
                                    "attrValue": $("." + attrName + "1").val()
                                })
                                AttrArr.push({
                                    "attrId": $("." + attrName + "2").attr("attrId"),
                                    "attr": $("." + attrName + "2").attr("attr"),
                                    "attrValue": $("." + attrName + "2").val()
                                })
                            }
                        }

                        // other验证必填项
                        let otherIsNullData = AttrArr.filter(item => item.attrValue == ''&&item.attrValueId == 4)||[];
                        // otherIsNullData.map(item => )
                        if(otherIsNullData.length > 0){
                            layer.msg("其它需要填值", {icon: 2})
                            return false;
                        }

                        // 获取自定义属性 key-value
                        let AttrArr_unique = [];
                        let attrNameOverSeventy =false
                        let attrArrValOverSeventy =false
                        $("#SMTsalePropAttrList").find(".smtAddAttrListContain").each(function () {
                            let that = this;
                            AttrArr.push({
                                "attr": $(that).find("input").val(),
                                "attrValue": $(that).find("input:last").val()
                            })
                            $(that).find("input").val().length>70 && (attrNameOverSeventy=true);
                            $(that).find("input:last").val().length>70 && (attrArrValOverSeventy=true);
                            AttrArr_unique.push($(that).find("input").val())
                        })

                        // 数组查重--判断自定义属性的key值是否有重复项
                        if (_this.isRepeat(AttrArr_unique)) {
                            layer.alert("自定义属性的名字不能重复", {icon: 2})
                            return false;
                        }
                        // 自定义属性名称和值都不能超过70个字符
                        if(attrNameOverSeventy){
                            layer.alert("自定义属性名称长度不超过为70个字符", {icon: 2})
                            return false;
                        }

                        if(attrArrValOverSeventy){
                            layer.alert("自定义属性值长度不超过为70个字符", {icon: 2})
                            return false;
                        }


                        formdata.checkBoxAttrName = ''
                        formdata.aliexpressTemplateAttrs = AttrArr

                        // console.log(AttrArr);  // 分类属性的数据

                        let smtLayerSkuChildData = [];
                        window.sessionStorage.getItem("smtLayerSkuChildData") != '' ? smtLayerSkuChildData = _this.deepCopy(JSON.parse(window.sessionStorage.getItem("smtLayerSkuChildData"))) : smtLayerSkuChildData = ''

                        let handleSmtLayerSkuChildData = [];
                        let skuCustomValList = []
                        for (let a = 0; a < smtLayerSkuChildData.length; a++) {
                            for (let b = 0; b < smtLayerSkuChildData[a].skuInfos.length; b++) {
                                let newData = smtLayerSkuChildData[a].skuInfos[b];
                                newData.imgAttrInfo = smtLayerSkuChildData[a].imgAttrInfo;
                                newData.skuImage = smtLayerSkuChildData[a].skuImage;
                                handleSmtLayerSkuChildData.push(newData)

                                _this.handleAttrIdCustomVallist(skuCustomValList,newData)

                                // let reger = new RegExp("[#:=&/$+]", "gm"); // 去掉了特殊字符逗号，可能会有问题...
                                // formdata.smtLayerSkuChildDataInput = formdata.smtLayerSkuChildDataInput.replace(reger, '-')
                                // 这里需要按照格式转换数据！
                                // 换一个属性名
                                if(formdata.smtLayerSkuChildDataInput != undefined && formdata.smtLayerSkuChildDataInput.split(",").some(v => {return v.toString().length>20})){
                                    layer.msg('变种属性值不能超过20个字符', {icon: 5});
                                    return;
                                }
                                newData.prodSSku = newData.sku
                                let attrInfo = Object.keys(newData).filter(item => item.toLocaleLowerCase().includes("attrinfo")) || [];
                                if(attrInfo.length != 0)
                                attrInfo.forEach((item,index) => {
                                    // item   === imgAttrInfo||attrInfo1||attrInfo2||attrInfo3
                                    if(!!newData[item]&&!!newData[item].oaAttr)
                                        _this.handleColorSizeStyleData(newData[item].oaAttr, newData, item)
                                })
                            }
                        }
                        // 校验平台销售属性枚举值和自定义平台销售属性值是否重复(因为)
                        if(skuCustomValList.length!==[...new Set(skuCustomValList)].length){
                            layer.msg('自定义平台销售属性值重复，不允许刊登', {icon: 5});
                            return;
                        }

                        // 生成sku下面那个表的信息
                        formdata.aliexpressTemplateSkuDtos = handleSmtLayerSkuChildData

                        if (formdata.aliexpressTemplateSkuDtos == undefined || formdata.aliexpressTemplateSkuDtos.length == 0) {
                            layer.alert("sku商品信息不能为空", {icon: 2})
                            return false;
                        }

                        // 判断是否有重复的图片
                        var allImages = $('[data-id=mainImgContains1] .uploadImgUL img[class=imgHide],[data-id=remarkImgContains1] .uploadImgUL img[class=imgHide]')

                        if (!checkImgRepeat(allImages)) {
                            layer.msg('主图和辅图中存在重复的图片')
                            return false
                        }

                        formdata.packageType == "true"?formdata.packageType = true:formdata.packageType = ''
                        if(formdata.productUnit == ''||(formdata.packageType == true&&formdata.lotNum == '')){
                            layer.alert("请检查售卖方式必填项", {icon: 2})
                            return false;
                        }

                        if(formdata.packageType == '' && formdata.lotNum != ''){
                            layer.alert("请检查是否要打包销售", {icon: 2})
                            return false;
                        }

                        if(formdata.lotNum!=''&&Number(formdata.lotNum) <= 1){
                            layer.alert("每包数量必须大于1", {icon: 2})
                            return false;
                        }

                        if(!formdata.market1Images || !formdata.market2Images){
                            layer.alert("营销图不能为空", {icon: 2})
                            return false;
                        }

                        _this.initAjax('/aliexpress/template/savetemplate.html', 'post', JSON.stringify(formdata), function (returnData) {
                            if (returnData.code == '0000') {
                                layer.msg("保存成功")
                                layer.close(layerindex);
                            } else {
                                layer.alert(returnData.msg, {icon: 2})
                            }
                        }, 'application/json')
                    }, 1000, 2000)
                    , end: function () {
                        window.sessionStorage.setItem("smtLayerSkuChildData", '')
                    }
                });
            },
            // type:color||size||style
            handleColorSizeStyleData(type, newData, name) {
                newData[`${type}AttrId`] = newData[name].attrId
                let reger = new RegExp("[#:=,&/$+]", "gm");
                newData[`${type}AttrCustomValue`] = newData[name].customValue.replace(reger, '-')
                newData[`${type}AttrValueId`] = newData[name].attrValueId
                return newData
            },
            handleAttrIdCustomVallist(skuCustomValList,skuInfo){ // 将自定义平台销售属性值放入数组中，     
                let imgCustomValue = ' '
                if(skuInfo.imgAttrInfo && (skuInfo.imgAttrInfo.customValue || skuInfo.imgAttrInfo.attrValueId)){
                    imgCustomValue = skuInfo.imgAttrInfo.customValue || skuInfo.imgAttrInfo.attrValueId.toString()
                }         
                let attr1CustomValue =' '
                if(skuInfo.attrInfo1){
                    attr1CustomValue = skuInfo.attrInfo1.customValue || skuInfo.attrInfo1.attrValueId.toString()
                }
                let attr2CustomValue =' '
                if(skuInfo.attrInfo2){
                    attr2CustomValue = skuInfo.attrInfo2.customValue || skuInfo.attrInfo2.attrValueId.toString()
                }
                let attr3CustomValue =' '
                if(skuInfo.attrInfo3){
                    attr3CustomValue = skuInfo.attrInfo3.customValue || skuInfo.attrInfo3.attrValueId.toString()
                }
                skuCustomValList.push(imgCustomValue+attr1CustomValue+attr2CustomValue+attr3CustomValue)
            },
            deepCopy(obj) {
                let _this = this;
                var result = Array.isArray(obj) ? [] : {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                            result[key] = _this.deepCopy(obj[key]);   //递归复制
                        } else {
                            result[key] = obj[key];
                        }
                    }
                }
                return result;
            },
            getArrayfromObj(obj) { //将键值对应的对象转化为name,value字段的数组对象
                var arr = []
                for (var i in obj) {
                    arr.push({attributeName: i, attributeValue: obj[i]})
                }
                return arr
            },
            getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
                for (var i = 0; i < arr.length; i++) {
                    if (value == arr[i][id]) {
                        return i;
                    }
                }
                return -1;
            },
            initAjax(url, method, data, func, contentType) { //初始化ajax请求
                $.ajax({
                    type: method,
                    url: ctx + url, //'http://192.168.0.164:8090/lms'
                    dataType: 'json',
                    async: true,
                    data: data,
                    contentType: contentType || 'application/json',
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (returnData) {
                        loading.hide()
                        if (returnData.code == "0000") {
                            func(returnData)
                        } else {
                            layer.msg(returnData.msg, {icon: 2});
                        }
                    },
                    error: function (returnData) {
                        loading.hide();
                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", {icon: 7});
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                })
            },
            // 节流
            debounce(fn, delay, mustRunDelay) {
                var timer = null;
                var t_start;
                return function () {
                    var context = this;
                    var args = arguments;
                    var t_curr = +new Date();
                    clearTimeout(timer);
                    if (!t_start) {
                        t_start = t_curr;
                        fn.apply(context, args);
                    }
                    if (t_curr - t_start >= mustRunDelay) {
                        fn.apply(context, args);
                        t_start = t_curr
                    }
                }
            }
        },
    })

    //table禁售设置
    form.on('checkbox(aep_prohibit)', function (data) {
        var requestData = {
            prodPId: data.value,
            platCode: "aliexpress",
            ifFixedInable: data.elem.checked
        }
        var msg = data.elem.checked ? "禁售成功" : "取消禁售成功"
        commonReturnPromise({
            url: `/lms/prohibit/editOrAddProdProhibitMapping.html`,
            type: 'post',
            contentType: 'application/json',
            params:JSON.stringify(requestData)
        }).then(function(result){
            layer.msg(result||"禁售成功", {icon: 1});
        }).catch(function(err){
             layer.msg(err||"禁售失败", {icon: 5});
             data.elem.checked = !data.elem.checked;
             form.render("checkbox");
        })
    });

    // 批量删除图片
    $(document).on("click", ".smtTemplateDeleteAll", function () {
        let _that = $(this);
        layer.confirm('你确定要删除全部吗？', {
            btn: ['确定', '取消'], //按钮
            icon: 7
        }, function () {
            _that.parent().last().find(".uploadImgUL").empty();
            layer.msg('已删除', {icon: 1});
        }, function () {
            layer.msg('已取消');
        });
    })

    //绑定修改标题显示剩余字符数量
    function smtTemplate_getRemainWord(title, dom){
        var lastNum = 128 - title.length;
        dom.next('b').text(lastNum);
        if (lastNum >= 0) {
            dom.next('b').css("color", "green");
        } else {
            dom.next('b').css("color", "red");
        }
    }
    $("body").on('input', '#layernewsmt input[name=title]', function () {
        var title = $(this).val();
        smtTemplate_getRemainWord(title,$(this))
    });

    //   addTableData sku子table新增的一整行的数据
    //   smtLayerSkuChildData sku子table整个表格的数据
    let addTableData = app.addTableData, smtLayerSkuChildData = app.smtLayerSkuChildData;

    // 添加自定义属性
    $(document).on("click", "#smtAddAttrList", function () {
        //先清除一次事件
        $('#smtAddAttrList').off('click');
        let str = `<div class="layui-col-lg12 layui-col-md12 smtAddAttrListContain"><div class="layui-input-block dis_flex_start"><input class="layui-input smttemplate_limitInputOfSize" placeholder="字数不超过70个"><input class="layui-input" style="margin-left: 4px;" placeholder="字数不超过70个">
                    <a class="layui-btn layui-btn-xs layui-btn-danger SMTsalePropAttrListDelBtn" style="margin: 5px;">删除</a></div></div>`;
        $("#SMTsalePropAttrList").append(str);
    })

    $(document).on("keyup", ".smttemplate_limitInputOfSize", function () {
        var value = $(this).val()
        if (value.length > 20) {
            $(this).val(value.substring(0, 20))
        }
    })

    // 删除全部
    $(document).on("click", "#SMTsalePropAttrListDelAllBtn", function () {
        $("#SMTsalePropAttrList").html('');
    })

    // 更多选填属性显示隐藏
    $(document).on("click", "#smtTemplate_to_toggle", function () {
        $("#smtTemplate_to_toggle").parent().nextAll("div").toggle();
    })

    // 生成SKU
    $(document).on("click", "#smtLayerRenderTable", function () {
        app.renderSkuTable('', 1);
    })

    $(document).on("click", "#smtTemplateRandom", function () {
        commonReturnPromise({
            url: `/lms/aliexpress/template/regentitle.html`,
            type: 'get',
            params:{
                prodPId: $("input[name=prodPId]").val()
            }
        }).then(function(result){
            $("input[name=title]").val(result)
            smtTemplate_getRemainWord(result,$("input[name=title]"))
        }).catch(function(err){
            layer.msg(err, {icon:2});
        })
    })

    // attrInfo（attrInfo1/attrInfo2/attrInfo3）
    // returnindex/skuInfosIndex/ number（1/2/3）:填充class的，没什么实际意义
    // skuInfo_attrInfo_attrValueId:当前下拉框所有选中项的值，为了实现下拉排他，即选中的下拉值后面不能再次选择
    function handle_smtLayertablePlug_data(attrInfo, returnindex, skuInfosIndex, number, skuInfo_attrInfo_attrValueId) {
        let skuAttr = app.returnData.skuAttr

        let radio_value = $('#skuParentTable input[type="radio"]:checked').parents("tr").find("#skuTableSelect option:selected").val(); // 图片属性id
        let str = `<td>`;
        skuAttr.forEach(function (item, index) {
            if (attrInfo.attrId == item.attributeId && radio_value !== item.attributeId) {
                str += `<div class="dis_flex_center"><select lay-filter="${number}Select${returnindex}Select${skuInfosIndex}"><option value="">请选择</option>`;
                listen_select_filter_name(`${number}Select${returnindex}Select${skuInfosIndex}`)
                item.categoryAttributeValuesSmts.forEach(function (attrVal) {
                    attrInfo.attrValueId == attrVal.categoryAttributeValueId ? str += `<option value="${attrVal.categoryAttributeValueId}" selected>${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>` : str += `<option value="${attrVal.categoryAttributeValueId}" ${skuInfo_attrInfo_attrValueId.map(Number).indexOf(attrVal.categoryAttributeValueId) == -1 ? "" : "disabled"}>${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                });
                str += `</select>`;
                if (item.customizedName) {
                    str += `<input class="layui-input ${attrInfo.customValue.length>20?"smtTemplate-input-danger":""}" name="smtLayerSkuChildDataInput" flag="${number}Input${returnindex}Input${skuInfosIndex}" value="${attrInfo.customValue || ''}">`
                }
                str += `</div>`
            }
        })
        str += `</td>`;
        return str;
    }

    // 一键复制
    $(document).on("click","#smtTemplateOneClickCopy",function(){
        // 获取第一大行的所有数据
        let smtLayerSkuChildData = JSON.parse(sessionStorage.getItem("smtLayerSkuChildData")),attrInfo = $(this).attr("attrInfo")
        // 赋值
        let firstSkuInfoLen = smtLayerSkuChildData[0].skuInfos.length;

        smtLayerSkuChildData.forEach((item,index)=>{
            if(item.imgAttrInfo != undefined) // 包含图片属性列
            item.skuInfos.forEach((childItem,childIndex)=>{
                if(childIndex < firstSkuInfoLen){
                    smtLayerSkuChildData[0].skuInfos[childIndex][attrInfo] == undefined?"":childItem[attrInfo] = JSON.parse(JSON.stringify(smtLayerSkuChildData[0].skuInfos[childIndex][attrInfo]))
                }
            })
            else // 没有图片属性列
            item.skuInfos.forEach((childItem,childIndex)=>{
                if(childIndex < firstSkuInfoLen){
                    smtLayerSkuChildData[0].skuInfos[childIndex][attrInfo] == undefined?"":childItem[attrInfo] = JSON.parse(JSON.stringify(smtLayerSkuChildData[0].skuInfos[0][attrInfo]))
                }
            })
        })
        smtLayertablePlug(smtLayerSkuChildData)
    })

    // sku信息子table的tbody
    // customizedName 自定义属性
    function smtLayertablePlug(smtLayerSkuChildData) {
        window.sessionStorage.setItem("smtLayerSkuChildData", JSON.stringify(smtLayerSkuChildData))
        let radio_value = $('#skuParentTable input[type="radio"]:checked').parents("tr").find("#skuTableSelect option:selected").val(); // 图片属性id
        let radio_text = $('#skuParentTable input[type="radio"]:checked').parents("tr").find("#skuTableSelect option:selected").attr("textToName"); // 图片属性id
        // sku信息子table的tbody
        let checkbox_arr_val = [];
        $('input[name="skuTableCheckbox"]:checked').each(function () {
            checkbox_arr_val.push($(this).parents("tr").find("#skuTableSelect option:selected").val());
        });
        let str = ''

        // 图片属性的所有选中的值，为了后面下拉选中过的值不可选
        let img_attrValueId = smtLayerSkuChildData.map(item => (item.imgAttrInfo === undefined ? "" : item.imgAttrInfo.attrValueId))

        smtLayerSkuChildData.forEach(function (item, index) {
            let skuInfo_attrInfo_attrValueId = {};
            skuInfo_attrInfo_attrValueId.attrInfo1 = item.skuInfos.map(childItem => (childItem.attrInfo1 === undefined ? "" : childItem.attrInfo1.attrValueId))
            skuInfo_attrInfo_attrValueId.attrInfo2 = item.skuInfos.map(childItem => (childItem.attrInfo2 === undefined ? "" : childItem.attrInfo2.attrValueId))
            skuInfo_attrInfo_attrValueId.attrInfo3 = item.skuInfos.map(childItem => (childItem.attrInfo3 === undefined ? "" : childItem.attrInfo3.attrValueId))

            let skuInfos = item.skuInfos
            skuInfos.forEach(function (skuInfosItem, skuInfosIndex) {
                //checkbox_arr_val：选中的attributeId === attrId值，根据这个值，匹配到类型，如果是下拉框，匹配下拉框的数据
                let skuAttr = app.returnData.skuAttr
                // 首先判断有没设置图片属性，因为图片属性在第一列
                // imgAttrInfo 即是包含图片属性的数据
                if (skuInfosIndex == 0 && item.imgAttrInfo != undefined) {
                    str += `<tr><td rowspan="${item.skuInfos.length}">
                            <img class="imgCss img_show_hide" src="${item.skuImage}" alt=""><br>
                            <input class="layui-btn layui-btn-xs" readonly value="上传图片" style="position: absolute;margin:20px;" >
                            <input value="上传" style="width:150px;margin:20px;" type="file" class="uploadImgFile" indexi="${index}">
                            <a class="layui-btn layui-btn-danger layui-btn-xs removeSkuImage" indexi="${index}">删除</a>
                            <div class="dis_flex_center"><select lay-filter="0Select${index}Select${skuInfosIndex}"><option value="">请选择</option>`;
                    listen_select_filter_name(`0Select${index}Select${skuInfosIndex}`)
                    for (let k = 0; k < skuAttr.length; k++) {  // 映射平台属性名下拉框的数据
                        if (radio_value == skuAttr[k].attributeId) {
                            skuAttr[k].categoryAttributeValuesSmts.forEach(function (attrVal) {
                                if (item.imgAttrInfo.attrValueId == attrVal.categoryAttributeValueId)
                                    str += `<option value="${attrVal.categoryAttributeValueId}" selected>${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                                else   // 选过的下拉不能再次选择，disabled
                                    str += `<option value="${attrVal.categoryAttributeValueId}" ${img_attrValueId.map(Number).indexOf(attrVal.categoryAttributeValueId) == -1 ? "" : "disabled"}>${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                            });
                            str += `</select>`
                            if (skuAttr[k].customizedName) {
                                str += `<input class="layui-input ${item.imgAttrInfo.customValue.length>20?"smtTemplate-input-danger":""}" name="smtLayerSkuChildDataInput" flag="0Input${index}Input${skuInfosIndex}" value="${item.imgAttrInfo.customValue || ''}">`
                            }
                        }
                    }

                    str += `</div><a indexi="${index}" class="layui-btn layui-btn-xs smtLayerSkuAdd ml20 mt20">添加SKU</a></td>`
                } else {
                    str += `<tr>`
                }
                // 这一列是固定的
                if (skuInfosItem.sku) {
                    str += `<td>${skuInfosItem.sku}</br>${skuInfosItem.color},${skuInfosItem.size},${skuInfosItem.style}</td>`
                } else {
                    str += `<td><input class="layui-input" name="smtLayerSkuChildDataInput" flag="4Input${index}Input${skuInfosIndex}" value="${skuInfosItem.sku || ''}" ></td>`
                }
                // 由于列的个数和数据是用对象名传值的，如果有一列取attrInfo1的数据，如果有两列是attrInfo1，attrInfo2
                let attrInfoArr = Object.keys(skuInfosItem).filter(item => item.includes("attrInfo"));
                // 过滤出 attrInfo1，attrInfo2，attrInfo3
                attrInfoArr.forEach(item => {
                    let itemLastOne = item.charAt(item.length-1);
                    str += handle_smtLayertablePlug_data(skuInfosItem[item], index, skuInfosIndex, itemLastOne, skuInfo_attrInfo_attrValueId[item])
                })
                str += `<td><a class="layui-btn layui-btn-xs layui-btn-danger smtTemplateSkuTableDelete" indexi="${index}" indexj="${skuInfosIndex}">删除</a></td></tr>`
            })
        })
        // 渲染tbody
        $("#smtLayertable").html(str);
        form.render();
        // 整个表格显示
        $("#skuToTable").show();
        $("#smtLayertable_thead").parent().show();
    }

    // 自定义属性 单个删除
    $(document).on("click", ".SMTsalePropAttrListDelBtn", function () {
        $(this).parents(".smtAddAttrListContain").remove();
    })

    function listen_select_filter_name(name) {
        // 监听SKU信息表的所有的select，SKU信息表动任何一项数据，都需要重新生成SKU
        form.on(`select(${name})`, function (data) {
            // form.on('select', function (data) {
            let layFilter = data.elem.attributes[0].value
            let dataSelectedValue = data.value  // 选中的值
            let dataType = layFilter.split("Select")[0],  // 0,1,2,3分别代表，设置图片属性列，info1，info2，info3
                dataIndex1 = layFilter.split("Select")[1],  // 代表需要设置数据的index
                dataIndex2 = layFilter.split("Select")[2];  // 代表需要设置数据的skuInfos的index
            window.sessionStorage.getItem("smtLayerSkuChildData") != '' ? smtLayerSkuChildData = JSON.parse(window.sessionStorage.getItem("smtLayerSkuChildData")) : smtLayerSkuChildData = ''

            let newData = smtLayerSkuChildData[dataIndex1] || '';

            if (!smtLayerSkuChildData)
                return false;
            if (dataType == 0) {
                newData.imgAttrInfo.attrValueId = dataSelectedValue
            } else if (dataType == 1) {
                newData.skuInfos[dataIndex2].attrInfo1.attrValueId = dataSelectedValue
            } else if (dataType == 2) {
                newData.skuInfos[dataIndex2].attrInfo2.attrValueId = dataSelectedValue
            } else if (dataType == 3) {
                newData.skuInfos[dataIndex2].attrInfo3.attrValueId = dataSelectedValue
            }

            smtLayertablePlug(smtLayerSkuChildData)
        });
    }

    // 监听SKU信息表的所有的input，SKU信息表动任何一项数据，都需要重新生成SKU
    $(document).on("blur", "input[name='smtLayerSkuChildDataInput']", function () {

        let dataInputValue = $(this).val(),_this = this  // 选中的值
        let dataType = $(this).attr("flag").split("Input")[0],  // 0,1,2,3,4分别代表，设置图片属性列，info1，info2，info3,sku
            dataIndex1 = $(this).attr("flag").split("Input")[1],  // 代表需要设置数据的index
            dataIndex2 = $(this).attr("flag").split("Input")[2];  // 代表需要设置数据的skuInfos的index

        // 排除sku
        if(dataType != 4){
            let reger = new RegExp("[#:=,&/$+]", "gm");
            dataInputValue = dataInputValue.replace(reger, '-')
            $(_this).val(dataInputValue)

            if(dataInputValue.length > 20){
                $(_this).addClass("smtTemplate-input-danger");
                layer.msg('变种属性值不能超过20个字符', {icon: 5});
            }
        }

        window.sessionStorage.getItem("smtLayerSkuChildData") != '' ? smtLayerSkuChildData = JSON.parse(window.sessionStorage.getItem("smtLayerSkuChildData")) : smtLayerSkuChildData = ''
        let newData = smtLayerSkuChildData[dataIndex1];

        if (!smtLayerSkuChildData)
            return false;
        if (dataType == 0 && newData.imgAttrInfo != undefined) {
            newData.imgAttrInfo.customValue = dataInputValue
        } else if (dataType == 1) {
            newData.skuInfos[dataIndex2].attrInfo1.customValue = dataInputValue
        } else if (dataType == 2) {
            newData.skuInfos[dataIndex2].attrInfo2.customValue = dataInputValue
        } else if (dataType == 3) {
            newData.skuInfos[dataIndex2].attrInfo3.customValue = dataInputValue
        } else if (dataType == 4) {
            newData.skuInfos[dataIndex2].sku = dataInputValue
        }
        smtLayertablePlug(smtLayerSkuChildData)
    })

    // 删除一小行
    $(document).on("click", ".smtTemplateSkuTableDelete", function () {
        window.sessionStorage.getItem("smtLayerSkuChildData") != '' ? smtLayerSkuChildData = JSON.parse(window.sessionStorage.getItem("smtLayerSkuChildData")) : smtLayerSkuChildData = ''
        let indexi = $(this).attr("indexi");
        let indexj = $(this).attr("indexj")
        // 删除数据
        smtLayerSkuChildData[indexi].skuInfos.splice(indexj, 1)
        smtLayertablePlug(smtLayerSkuChildData)
    })

    function handle_smtLayerSkuAdd_data(newData, attrName) {
        newData[attrName].customValue = ''
        newData[attrName].attrValueId = ''
    }

    // 增加一小行
    $(document).on("click", ".smtLayerSkuAdd", function () {
        window.sessionStorage.getItem("smtLayerSkuChildData") != '' ? smtLayerSkuChildData = JSON.parse(window.sessionStorage.getItem("smtLayerSkuChildData")) : smtLayerSkuChildData = ''
        let indexi = $(this).attr("indexi");
        let handleAddTableData = app.deepCopy(app.addTableData);

        let newData = handleAddTableData.skuInfos[0];
        newData.color = ''
        newData.size = ''
        newData.style = ''
        newData.sku = ''
        // 过滤出 attrInfo1，attrInfo2，attrInfo3
        let attrInfoArr = Object.keys(newData).filter(item => item.includes("attrInfo"));
        attrInfoArr.forEach(item => handle_smtLayerSkuAdd_data(newData, item))
        smtLayerSkuChildData[indexi].skuInfos.push(handleAddTableData.skuInfos[0]);
        smtLayertablePlug(smtLayerSkuChildData)
    })

    // 增加一大行，增加商品属性
    $(document).on("click", "#smtLayerIncrease", function () {
        window.sessionStorage.getItem("smtLayerSkuChildData") != '' ? smtLayerSkuChildData = JSON.parse(window.sessionStorage.getItem("smtLayerSkuChildData")) : smtLayerSkuChildData = ''
        let handleAddTableData = app.deepCopy(app.addTableData);
        handleAddTableData.skuInfos = handleAddTableData.skuInfos.filter((item, index) => {
            return index == 0
        })

        if (handleAddTableData.imgAttrInfo) {
            handleAddTableData.imgAttrInfo.customValue = ''
            handleAddTableData.imgAttrInfo.attrValueId = ''
            handleAddTableData.skuImage = ''
        }

        let newData = handleAddTableData.skuInfos[0];
        newData.color = ''
        newData.size = ''
        newData.style = ''
        newData.sku = ''
        // 过滤出 attrInfo1，attrInfo2，attrInfo3
        let attrInfoArr = Object.keys(newData).filter(item => item.includes("attrInfo"));
        attrInfoArr.forEach(item => handle_smtLayerSkuAdd_data(newData, item))

        if (handleAddTableData.imgAttrInfo != undefined) {
            // 有图片属性列
            smtLayerSkuChildData.push(handleAddTableData);
        } else {
            // 没有图片属性列
            smtLayerSkuChildData[0].skuInfos.push(handleAddTableData.skuInfos[0]);
        }
        smtLayertablePlug(smtLayerSkuChildData)
    })

    // 设置图片属性
    $(document).on("change", ".uploadImgFile", function (e) {
        let _this = e.target;
        var files = _this.files;
        if (!files || !files.length) return;
        var file = files[0];
        var formData = new FormData();
        formData.append('file', file);

        $.ajax({
            type: "post",
            url: ctx + "/publish/smt/uploadPic.html",
            data: formData,
            // async: false,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            beforeSend: function () {
                loading.show();
            },
            success: function (data) {
                loading.hide();
                if (data.code == '0000') {
                    // 添加一条要更新数据
                    window.sessionStorage.getItem("smtLayerSkuChildData") != '' ? smtLayerSkuChildData = JSON.parse(window.sessionStorage.getItem("smtLayerSkuChildData")) : smtLayerSkuChildData = ''
                    smtLayerSkuChildData[$(_this).attr("indexi")].skuImage = data.msg
                    smtLayertablePlug(smtLayerSkuChildData)
                } else {
                    layer.msg(data.msg)
                }
            }
        });
    })

    // 删除单个图片
    $(document).on("click", ".removeSkuImage", function (e) {
        window.sessionStorage.getItem("smtLayerSkuChildData") != '' ? smtLayerSkuChildData = JSON.parse(window.sessionStorage.getItem("smtLayerSkuChildData")) : smtLayerSkuChildData = ''
        smtLayerSkuChildData[$(this).attr("indexi")].skuImage = ''
        smtLayertablePlug(smtLayerSkuChildData)
    })


    // 监听SKU信息表中的select下拉框
    // 1. 选择  映射平台属性名 后，联动 是否可设置图片属性
    // 2. 只有 允许设置图片，才可以设置图片属性，图片属性只能设置一个
    form.on('select(skuTableSelect)', function (data) {
        let bool = data.elem[data.elem.selectedIndex].getAttribute('bool');
        if (bool === "true") {
            $(data.elem).parents("tr").find(".customizedPicText").text("允许设置图片")
            $(data.elem).parents("tr").find(".customizedPicRadio").html('<input type="radio" name="skuTableRadio" lay-filter="skuTableRadio">')
        } else {
            $(data.elem).parents("tr").find(".customizedPicText").text("不允许设置图片")
            $(data.elem).parents("tr").find(".customizedPicRadio").html('<input type="radio" disabled >')
        }
        form.render();
        // sku信息任意操作，sku的子table都要重新渲染
        $("#skuToTable").hide();
    });

// 监听SKU信息表中的checkbox
    form.on('checkbox(skuTableCheckbox)', function (data) {
        // 应该将提交的数据中的aliexpressTemplateSkuDtos清空
        $("#skuToTable").hide();
        window.sessionStorage.setItem("smtLayerSkuChildData", '')
    });

// 监听SKU信息表中的radio
    form.on('radio(skuTableRadio)', function (data) {
        // 应该将提交的数据中的aliexpressTemplateSkuDtos清空
        $("#skuToTable").hide();
        window.sessionStorage.setItem("smtLayerSkuChildData", '')
    });

    // 模板图片
    $("body").on("click","#layernewsmt .tempImgBtn",function () {
        const limit = 1,
            existImgs = 0,
            $marketImageDom = $(this).closest(".imgContains"),
            prodPIdsStr = $("#layernewsmt [name=prodPId]").val();
        let prodPIdList = [];
        prodPIdList.push(prodPIdsStr);
// 营销图1 market1_images  1:1  白底图  传给平台imageType:2
// 营销图2 market2_images  3:4  场景图  传给平台imageType:1
        const imageType = $(this).data("imagetype");
        let param = {
            prodPIds: prodPIdList,
        };
        const params = {
            param,
            limit,
            existImgs,
            cb: function (tplUrlList) {
                if (Array.isArray(tplUrlList) && tplUrlList.length) {
                    // 场景图需要转化为3:4比例
                    if (imageType == 1) {
                        proportionImage(
                            $marketImageDom.find("img"),
                            tplUrlList[0]
                        );
                    } else {
                        // $marketImageDom.find("img").prop("src", tplUrlList[0]);
                        const tpl=  imgData_third_template['img']['tpl']
                        // 判断是否是白底图，如果是，则加到营销图的1:1白底图里
                        var div = tpl.replace(/&{url}/g, tplUrlList[0]);
                        $marketImageDom.find(".kongImgDivOut").hide();
                        $marketImageDom.find('.uploadImgUL').html(div)
                    }
                }
            },
        };
        comPickImageTpl(params,'aliexpress');
    });

    function proportionImage($imgDom, url) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let img = new Image();
        img.src = url;
        img.setAttribute("crossOrigin", "Anonymous");
        // 场景图需要裁剪为3:4比例

        img.onload = function (e) {
            const aspectRatio = 3 / 4;
            const imgWidth = img.width;
            const imgHeight = img.height;
            canvas.width = imgWidth;
            canvas.height = imgHeight;

            const canvasAspectRatio = canvas.width / canvas.height;

            let drawWidth = imgWidth;
            let drawHeight = imgHeight;
            let x = 0;
            let y = 0;

            if (imgWidth / imgHeight > aspectRatio) {
                drawWidth = imgHeight * aspectRatio;
                x = (imgWidth - drawWidth) / 2;
            } else {
                drawHeight = imgWidth / aspectRatio;
                y = (imgHeight - drawHeight) / 2;
            }
            canvas.width = drawWidth;
            canvas.height = drawHeight;
            ctx.drawImage(
                img,
                x,
                y,
                drawWidth,
                drawHeight,
                0,
                0,
                canvas.width,
                canvas.height
            );
            // 将 canvas 转换为新的图片文件
            const newImageURL = canvas.toDataURL("image/jpeg");

            // 将图片base64转换为图片链接
            let reg =
                /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
            if (reg.test(newImageURL)) {
                $.ajax({
                    type: "POST",
                    url: "/lms/preProdDev/getBase64Img.html",
                    data: { AreaImgKey: newImageURL },
                    async: false,
                    success: function (res) {
                        // $imgDom.prop("src", res);
                        const tpl=  imgData_third_template['img']['tpl']
                        // 判断是否是白底图，如果是，则加到营销图的1:1白底图里
                        var div = tpl.replace(/&{url}/g, res);
                        $imgDom.parents(".imgContains").find(".kongImgDivOut").hide();
                        $imgDom.parents(".imgContains").find('.uploadImgUL').html(div)
                    },
                    error: function (err) {
                        console.log("err :>> ", err);
                        // layer.alert(err, {icon: 2})
                    },
                });
            } else {
                // $imgDom.prop("src", url);
                const tpl=  imgData_third_template['img']['tpl']
                // 判断是否是白底图，如果是，则加到营销图的1:1白底图里
                var div = tpl.replace(/&{url}/g, url);
                $imgDom.parents(".imgContains").find(".kongImgDivOut").hide();
                $imgDom.parents(".imgContains").find('.uploadImgUL').html(div)
            }
        };
    }

    // // 自动填充白底图
    // $("body").on("click","#layernewsmt .autoFillImgBtn2",function () {
    //     let dom = $(this).closest(".imgContains").find("img")
    //     autoFill(2,dom)
    // })
    //
    // // 自动填充场景图
    // $("body").on("click","#layernewsmt .autoFillImgBtn1",function () {
    //     let dom = $(this).closest(".imgContains").find("img")
    //     autoFill(1,dom)
    // })

    // function autoFill(type,dom) {
    //     const imageFiledObj = {
    //         1: "sceneImageUrl",
    //         2: "whiteImageUrl",
    //     };
    //     let sSkus = $("#layernewsmt input[name=sSkus]").val()
    //     commonReturnPromise({
    //         url: "/lms/batchOperation/getMarketImage",
    //         type: "post",
    //         contentType: "application/json",
    //         params: JSON.stringify(sSkus.split(",")),
    //     }).then((res) => {
    //         if(res[imageFiledObj[type]]) {
    //             if (type == 1) {
    //                 proportionImage(dom, res[imageFiledObj[type]]);
    //             } else {
    //                 const tpl = imgData_third_template['img']['tpl']
    //                 // 判断是否是白底图，如果是，则加到营销图的1:1白底图里
    //                 var div = tpl.replace(/&{url}/g, res[imageFiledObj[type]]);
    //                 dom.parents(".imgContains").find(".kongImgDivOut").hide();
    //                 dom.parents(".imgContains").find('.uploadImgUL').html(div)
    //             }
    //         }
    //     });
    // }
})

// 主图模型结构
var smt_imgData_template = {
    img: {
        head: '',
        tpl: '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle">' +
        '<div class="ImgDivOut">' +
        '<div>' +
        '<input type="hidden" name="mainImg" value="&{url}"/>' +
        '<input type="checkbox" name="smtcheckbox1" lay-skin="primary" title="必选图"/>' +
        // '<input type="checkbox" name="checkbox1" lay-skin="primary" title="必选图" lay-filter="checkboxmain"/>' +
        '</div>' +
        '<div class="ImgDivIn disflex">' +
        '<img src="&{url}!size=150x150" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>' +
        '<img src="&{url}!size=150x150" crossOrigin="anonymous" class="imgHide" title="隐藏，为了判断主图和辅图是否有重复"/>' +
        '<div class="hidden selfImgIcon">自拍图</div>'+
        '</div>' +
        '<div class="imgDivDown">' +
        '<div class="disFCenter">'+
        '<a onclick="copyUrl(this);" href="javascript:void(0);">复制</a>' +
        '<a onclick="delImg(this);" href="javascript:void(0);">移除</a>' +
        '</div>'+
        '<div class="disFCenter">'+
        '<a onclick="setWhiteBgMap(this);" href="javascript:void(0);">设为白底图</a>' +
        '<a onclick="setSceneGraph(this);" href="javascript:void(0);">设为场景图</a>' +
        '</div>'+
        '</div>' +
        '</div>' +
        '</li>',
        foot: '',
    }
};

// 营销图，描述图模型结构
var imgData_second_template = {
    img: {
        head: '',
        tpl: '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle">' +
        '<div class="ImgDivOut">' +
        '<label>' +
        '<input type="hidden" name="mainImg" value="&{url}"/>' +
        '</label>' +
        '<div class="ImgDivIn disflex">' +
        '<img src="&{url}!size=150x150" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>' +
        '<img src="&{url}!size=150x150" crossOrigin="anonymous" class="imgHide" title="隐藏，为了判断主图和辅图是否有重复"/>' +
        '<div class="hidden selfImgIcon">自拍图</div>'+
        '</div>' +
        '<div class="imgDivDown">' +
        '<div class="disFCenter">'+
        '<a onclick="copyUrl(this);" href="javascript:void(0);">复制</a>' +
        '<a onclick="delImg(this);" href="javascript:void(0);">移除</a>' +
        '</div>'+
        '<div class="disFCenter">'+
        '<a onclick="setWhiteBgMap(this);" href="javascript:void(0);">设为白底图</a>' +
        '<a onclick="setSceneGraph(this);" href="javascript:void(0);">设为场景图</a>' +
        '</div>'+
        '</div>' +
        '</div>' +
        '</li>',
        foot: '',
    }
};

// 营销图
const imgData_third_template = {
    img: {
        head: '',
        tpl: '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle">' +
        '<div class="ImgDivOut">' +
        '<label>' +
        '<input type="hidden" name="mainImg" value="&{url}"/>' +
        '</label>' +
        '<div class="ImgDivIn disflex">' +
        '<img src="&{url}!size=150x150" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>' +
        '<img src="&{url}!size=150x150" crossOrigin="anonymous" class="imgHide" title="隐藏，为了判断主图和辅图是否有重复"/>' +
        '<div class="hidden selfImgIcon">自拍图</div>'+
        '</div>' +
        '<div class="imgDivDown">' +
        '<div class="disFCenter">'+
        '<a onclick="copyUrl(this);" href="javascript:void(0);">复制</a>' +
        '<a onclick="delImg(this);" href="javascript:void(0);">移除</a>' +
        '</div>'+
        '</div>' +
        '</div>' +
        '</li>',
        foot: '',
    }
};

function copyUrl(btn) {
    var li = $(btn).closest('li')
    var img = li.find('img')[0]
    copyUrlOfImg(img)
}

// 设为白底图
function setWhiteBgMap(btn){
    const li = $(btn).closest('li')
    const tpl=  imgData_third_template['img']['tpl']
    let url = ''
    if(li.find('img').attr('src')){
       url = li.find('img').attr('src').split('!size')[0]
    }
    // 判断是否是白底图，如果是，则加到营销图的1:1白底图里
    
    var div = tpl.replace(/&{url}/g, url);
    let $uploadImgULDom  = ''
    $('#layernewsmt').find('.imgContains').each(function(){
        if($(this).data('id')==='assistImgContains1'){
            $uploadImgULDom = $(this).find('.uploadImgUL')
            $(this).find(".kongImgDivOut").hide();
        }
    })
    $uploadImgULDom.html(div);
}

// 设为场景图：需要系统抠图，将左右各裁剪125像素后， 放入3:4场景图。
function setSceneGraph(btn){
    const li = $(btn).closest('li')
    const tpl=  imgData_third_template['img']['tpl']
    let url = ''
    if(li.find('img').attr('src')){
       url = li.find('img').attr('src').split('!size')[0]
    }
    let $uploadImgULDom  = ''
    $('#layernewsmt').find('.imgContains').each(function(){
        if($(this).data('id')==='assistImgContains2'){
            $uploadImgULDom = $(this).find('.uploadImgUL')
            $(this).find(".kongImgDivOut").hide();
        }
    })
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
   
    let image = new Image();
    image.src = url
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = function(e) {
        const realWidth = this.width
        const realHeight = this.height
        canvas.width = realWidth-250;
        canvas.height = realHeight;
        // // 在 canvas 上绘制原始图片，并缩放到目标尺寸
        // 将左右各裁剪125像素后， 放入3:4场景图。
        // ctx.fillStyle = '#fff';
        // let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // ctx.putImageData(imageData, 0, 0);

        ctx.drawImage(image, 125, 0, canvas.width, canvas.height,0,0,canvas.width, canvas.height);
        // 将 canvas 转换为新的图片文件
        const newImageURL = canvas.toDataURL('image/jpeg');

        // 将图片base64转换为图片链接
        let reg =
            /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
        if (reg.test(newImageURL)) {
            $.ajax({
                type: "POST",
                url: "/lms/preProdDev/getBase64Img.html",
                data: {"AreaImgKey": newImageURL},
                async: false,
                success: function (res) {
                    const div = tpl.replace(/&{url}/g, res);
                    $uploadImgULDom.html(div);
                }, 
                error: function (err) {
                    console.log('err :>> ', err);
                    // layer.alert(err, {icon: 2})
                }
            })
        }else {
            const div = tpl.replace(/&{url}/g, newImageURL);
            $uploadImgULDom.html(div);
        }
    };
}

// 本地图片上传
// imgContains  图片容器 jQuery对象
function smt_uploadLocalImg1(imgContains, size) {
    var btn = imgContains.find('.uploadLocalImgBtn') // 触发异步上传的按钮
    var maxImg = parseInt(imgContains.attr('data-maxImg')) // 最大图片数
    var minImg = parseInt(imgContains.attr('data-minImg')) // 最小图片数
    var imgObjType = imgContains.attr('data-imgObjType') // 图片展示的dom数据类型
    if (size !== undefined) {
        size = JSON.parse(size)
    }

    btn.Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        formData: size || '',
        fileSizeLimit: 2048, //默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/smt/uploadPic.html",
        onSelect: function (files) {
            var imgTotalNum = imgContains.find('.uploadImgUL li').length
            var n = files.length + imgTotalNum;
            if (n > maxImg) {
                layer.msg("最大支持" + maxImg + "张图片，您还能选择" + (maxImg - imgTotalNum) + "张!");
                return false;
            } else {
                return true;
            }
        },
        onUploadStart: function (file) {
        },
        onUploadSuccess: function (file, data, response) {
            data = $.parseJSON(data);
            if (data != null && data.code == '0000') {
                smt_proTpl_showImg(data.msg, imgContains, false)
            } else {
                layer.msg(data.msg); //这里面的内容不知道写啥,同OA系统
            }
        }
    });
}

// 网络图片下载
// imgContains  图片容器jQuery对象
function smt_uploadNetImg(imgContains) {
    var netUpBtn = imgContains.find('.uploadNetImgBtn') // 网络图片开启按钮
    var maxImg = imgContains.attr('data-maxImg') // 最大图片数
    var minImg = imgContains.attr('data-minImg') // 最小图片数
    var imgObjType = imgContains.attr('data-imgObjType') // 图片展示的dom数据类型
    netUpBtn.click(function () {
        var currentImgs = imgContains.find('.uploadImgUL li') // 原有图片模型
        if (currentImgs.length == maxImg) {
            layer.msg('已达最大上传数量')
            return
        }
        var index = layer.open({
            type: 1,
            title: '主图网络图片',
            area: ['800px', '300px'],
            id: 'mainNetImgSuccess',
            content: '<div class="p20 pl20"><textarea class="layui-textarea" id="netImgUrl" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
            btn: ['确定', '关闭'],
            yes: function () {
                var url = $.trim($("#netImgUrl").val());
                if (url == null || url == "") {
                    layer.msg("图片地址不能为空！", {icon: 5});
                    return false;
                }
                var urlArray = url.split("\n");

                // 去一下空格
                for (var i in urlArray) {
                    urlArray[i] = $.trim(urlArray[i]);

                    var startHttp = new RegExp(
                        '^((https|http|ftp)+://){1}[^\\s]+$'
                    )
                    if (startHttp.test(urlArray[i]) != true) {
                        layer.alert("网址格式不正确！url必须以http或者https开头", {icon: 7})
                        return false;
                    }
                }
                var remainNum = maxImg - currentImgs.length;
                if (urlArray.length + currentImgs.length > maxImg) {
                    remainNum = remainNum < 0 ? 0 : remainNum;
                    layer.msg("最大支持" + maxImg + "张图片,您还能上传" + remainNum + "张!");
                }
                remainNum = urlArray.length > remainNum ? remainNum : urlArray.length;
                for (var i = 0; i < remainNum; i++) {
                    smt_proTpl_showImg(urlArray[i], imgContains, false);
                }
                // $("#netImgUrl").val("");
                layer.close(index);
            }
        })
    });
}

/**
 * 复现图片
 * @param imgObjType    图片模型类型   1、主图模型   2、辅图模型   3、子商品图片模型
 * @param imgContains   图片容器dom对象
 * ifChecked  是否勾选  白底图/必选图
 * obj  图片信息
 */
function smt_proTpl_showImg(url, imgContains, checked1, index, obj={}) {
    var imgObjType = imgContains.attr('data-imgObjType')
    // 将图片展示到容器中
    if (imgContains.selector == "[data-id=remarkImgContains1]") {
        var tpl = smt_imgData_template['img']['tpl']
    } else if(imgContains.selector == "[data-id=mainImgContains1]") {
        var tpl = imgData_second_template['img']['tpl']
    }else{
      var tpl=  imgData_third_template['img']['tpl']
    }
    var div = tpl.replace(/&{url}/g, url);
    imgContains.find('.uploadImgUL').append(div);

    // 设定勾选状态
    if (checked1 && index !== undefined) {
        imgContains.find('[name=smtcheckbox1]')[index].checked = true
    }

    //显示自拍图
    if(obj.isSelfImg){
        $(imgContains.find('.selfImgIcon')[index]).show()
    }

    imgContains.find(".kongImgDivOut").hide();
    // 更新当前上传数量
    imgContains.find(".curImgNum").text(imgContains.find('.uploadImgUL li').length)

    var form = layui.form
    form.render('checkbox')
}

//图片删除
function delImg(obj) {
    var index = layer.confirm('您确认要删除图片？', {
        icon: 3,
        title: '提示',
        success: function (layero, index) {
            this.enterEsc = function (event) {
                if (event.keyCode === 13) {
                    delImgFunc(obj)
                    layer.close(index);
                    return false; //阻止系统默认回车事件
                }
            };
            $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
        },
        end: function () {
            $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
        }
    }, function () {
        delImgFunc(obj, index)
        layer.close(index);
    });
}

function delImgFunc(obj) {
    var imgUL = $(obj).closest('.uploadImgUL')
    var imgContains = $(obj).closest('.imgContains')
    $(obj).closest('li').remove();
    var curImgNum = imgUL.find('li').length
    $("#curImgNum").text(curImgNum);
    if (curImgNum == 0) {
        imgUL.parent().find(".kongImgDivOut").show();
    }
    // 重置图片数量
    imgContains.find(".curImgNum").text(imgUL.find('li').length)
}

// })(jQuery, layui, window, document);