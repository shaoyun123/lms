<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<title>lazada仅修改标题</title>
<style>
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .w_100 {
        width: 100px;
    }

    .layui-textarea {
        min-height: 100px;
    }

    .numCount {
        border: 1px solid #e8e8e8;
        border-bottom: none;
        display: inline-block;
        padding: 0 5px;
        text-align: center;
        line-height: 30px;
    }

    .mg_10 {
        margin: 0 10px;
    }

</style>

<div class="layui-fluid" id="LAY_lazadaModifyTitle">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="lazadaModifyTitle_form" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-inline">
                                <label class="layui-form-label">原标题：</label>
                                <div class="layui-input-inline">
                                    <textarea name="old_string" autocomplete="off" class="layui-textarea" placeholder="请输入需替换词，为空将全量调整标题"></textarea>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">修改为：</label>
                                <div class="layui-input-inline">
                                    <textarea name="new_string" autocomplete="off" class="layui-textarea" placeholder="请输入，可用下划线代替原标题在其前后新增，例：_ apple"></textarea>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" lay-submit
                                type="button" lay-filter="lazada_replace">一键应用</button>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">热搜词：</label>
                                <div class="layui-input-inline">
                                <input type="text" name="titleHotWord" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <a lay-tips="按照刊登生成标题规则，将热搜词放置在品牌词之后，重新生成标题" class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0 resetTitle">重新生成标题 </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                    <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(<span
                            id="tolnum_span_lazada_stock"></span>)
                    </div>
                    <div class="dis_flex mg_10">
                        <button type="button" id="modifyStockButtn" class="layui-btn layui-btn-normal layui-btn-sm">
                            批量修改提交
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="lazadaModifyTitleTable" lay-filter="lazadaModifyTitleTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="lazadaMTnew_title">
    <textarea class="layui-textarea ifFocusInput" data-prodpid="{{d.prodPId}}" onkeyup="lazadaOnline_titleNumNote(this)" oninput="lazadaOnline_titleNumNote(this)" onpropertychange="lazadaOnline_titleNumNote(this)" style="height:28px" name="title_js" value="{{d.newTitle || ''}}">{{d.newTitle || ''}}</textarea>
    <!-- <div style="position:absolute;right: 35px;bottom: 0;"><span name="lazadaModifyTitleLen">{{d.newTitle?.length || 0}}</span> / 255</div> -->
</script>
<script>
    let lazadaMT_thSelect = [];
    let lazadaMT_tableData;
    let modifyTitle_thSelect = '',current_index = [];
    //标题字数提示 最多255
    function lazadaOnline_titleNumNote (dom) {
        // var restNum = $(dom).val().length;
        // $(dom).next('div').find("span").html(restNum)
        // if (restNum > 255) {
        //     $(dom).next('div').find("span").css('color', 'red')
        // } else {
        //     $(dom).next('div').find("span").css('color', '#666')
        // }
        // aa($(dom).parents("tr").data("index"),$(dom).val())
    }

    let aa = lms_debounce(function(index,val){
        if(val.length == 0){
            current_index = current_index.filter(item => item != index)
            lazadaMT_tableData[index]['newTitle'] = ''
        }else{
            current_index.push(index)
            lazadaMT_tableData[index]['newTitle'] = val
        }
    },100)

    layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function () {
        let formSelects = layui.formSelects,
            form = layui.form,
            layer = layui.layer,
            table = layui.table,
            $ = layui.$,
            tableIns = {};

        formSelects.on('lazadaMTHeader', function (id,vals,val,isAdd) {
            let selectArr = vals.map(item => item.value)
            if(isAdd){
                selectArr.push(val.value)
            }else{
                selectArr = selectArr.filter(item=> item != val.value)
            }
            let newData = [];
            lazadaMT_thSelect = selectArr;
            selectArr.length == 0 ? newData = lazadaMT_tableData:newData = lazadaMT_tableData.filter(item => selectArr.includes(item.salesSite))
            // 过滤修改后的标题
            if(modifyTitle_thSelect == '1'){ // 修改值为空
                newData = newData.filter(item => !item.newTitle || item.newTitle == "")
            }else if(modifyTitle_thSelect == '2'){ // 存在修改值
                newData = newData.filter(item => item.newTitle && item.newTitle != "")
            }
    tableIns = table.reload('lazadaModifyTitleTable', {data:newData})
        })

    form.on('select(lazadaModifyTitleHeader)', function (data) {
        modifyTitle_thSelect = data.value
        let newData = []
        if(data.value == ''){ // 全部
            newData = lazadaMT_tableData
        }else if(data.value == '1'){ // 修改值为空
            newData = lazadaMT_tableData.filter((item,index) => !item.newTitle || item.newTitle == "")
        }else if(data.value == '2'){ // 存在修改值
            newData = lazadaMT_tableData.filter((item,index) => item.newTitle && item.newTitle != "")
        }
        // 过滤站点
        if(lazadaMT_thSelect.length != 0){
            newData = newData.filter(item => lazadaMT_thSelect.includes(item.salesSite))
        }
    tableIns = table.reload('lazadaModifyTitleTable', {data:newData})
    })

    $(".resetTitle").click(function(){
        //获取表格行对象
        let trObj = $('#lazadaModifyTitleTable').next().find('.layui-table-body tbody').find('tr');
        let arr = new Array();
        for (let i = 0; i < trObj.length; i++) {
            let obj = new Object();
                obj.id = $.trim(trObj.eq(i).find('td[data-field="id"] div').text());//id
                obj.prodPId = $.trim(trObj.eq(i).find('td[data-field="prodPId"] div').text());
                obj.storeAcctId = $.trim(trObj.eq(i).find('td[data-field="storeAcctId"] div').text());
                obj.titleHotWord = $("#lazadaModifyTitle_form [name=titleHotWord]").val();
            let checkState = trObj.eq(i).find('td[data-field="0"]').find('input').is(":checked");
            //只修改选中的
            if (checkState) {
                arr.push(obj)
            }
        }
        if (arr == null || arr.length == 0) {
            layer.msg("请选择需要修改的商品！");
            return;
        }
        commonReturnPromise({
            isLoading: false,
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            url: `${ctx}/onlineProductLazada/genNewTitle`,
            params: JSON.stringify(arr)
        }).then(res => {
            let trObj = $('#lazadaModifyTitleTable').next().find('.layui-table-body tbody').find('tr');
            // 根据id
            for (let i = 0; i < trObj.length; i++) {
                let tdId = $.trim(trObj.eq(i).find('td[data-field="id"] div').text());//id
                if (res[tdId]) {
                    trObj.eq(i).find('textarea[name="title_js"]').val(res[tdId]);
                    getLen(trObj.eq(i).find('textarea[name="title_js"]'),res[tdId].length)
                }
            }
            lazadaMT_tableData.forEach(item => {
                item['newTitle'] = res[item.id]||''
            })
            layer.msg("修改成功")
        })
    })

        //表格渲染结果
        //展示已知数据
        let checkTableData = layui.table.checkStatus("lazada_online_data_table").data;
        if (checkTableData.length > 0) {
            tableReload(checkTableData);
        }

        function tableReload(data) {
            lazadaMT_tableData = data;
            tableIns = table.render({
                elem: "#lazadaModifyTitleTable",
                cols: [[
                    {type: "checkbox"},
                    {field: "id", title: "id"},
                    {field: "storeAcctId", title: "店铺id"},
                    {field: "storeAcctName", title: "店铺", width: 150},
                    {field: "itemId", title: "item_id", width: 120},
                    {field: "salesSite", title: "<span style='display: flex'><span style='width: 70px;'>站点</span><select xm-select='lazadaMTHeader' id='lazadaMTHeader' name='lazadaMTHeader' xm-select-search-type='dl' xm-select-skin='normal'><option value='MY'>MY</option><option value='SG'>SG</option><option value='PH'>PH</option><option value='ID'>ID</option><option value='TH'>TH</option><option value='VN'>VN</option></select></span>", width: 150},
                    {field: "title", title: "原标题", width: 300},
                    {field: "newTitle", title: "<span style='display: flex'><span style='width: 70px;'>修改为</span><select id='lazadaModifyTitleHeader' lay-filter='lazadaModifyTitleHeader'><option value=''>全部</option><option value='1'>修改值为空</option><option value='2'>存在修改值</option></select></span>", templet: '#lazadaMTnew_title', width: 300},
                    {field: "result", title: '操作结果', width: 300},
                    {field: "prodPId", title: ""}
                ]],
                page: false,
                height: 500,
                id: "lazadaModifyTitleTable",
                limit: data.length,
                data: data,
                done: function (res, curr, count) {
                    commonAddEventTitleToggle($('#LAY_lazadaModifyTitle'), 'lazada')
                    $("[data-field='id']").css('display', 'none');
                    $("[data-field='storeAcctId']").css('display', 'none');
                    $("[data-field='prodPId']").css('display', 'none');
                    $("#tolnum_span_lazada_stock").text("共 " + count + " 条");
                    $("#lazadaModifyTitleTable").next().find(".layui-table-header").css('overflow','visible')
                    formSelects.render('lazadaMTHeader')
                    formSelects.value('lazadaMTHeader', lazadaMT_thSelect)
                    $("#lazadaModifyTitleHeader").val(modifyTitle_thSelect)
                    form.render("select")
                }
            });
        }

        //批量修改标题
        $('#modifyStockButtn').click(function () {
            //获取表格行对象
            let trObj = $('#lazadaModifyTitleTable').next().find('.layui-table-body tbody').find('tr');
            let arr = new Array();
            for (let i = 0; i < trObj.length; i++) {
                let obj = new Object();
                obj.id = $.trim(trObj.eq(i).find('td[data-field="id"] div').text());//id
                obj.title = $.trim(trObj.eq(i).find('td[data-field="newTitle"]').find('textarea').val());
                let checkState = trObj.eq(i).find('td[data-field="0"]').find('input').is(":checked");
                //只修改选中的
                if (checkState) {
                    arr.push(obj)
                }
            }
            if (arr == null || arr.length == 0) {
                layer.msg("请选择需要修改的商品！");
                return;
            }
            let newArr = arr.filter(item => item.title == '')
            if (newArr.length > 0) {
                layer.msg("修改后的标题不能为空！");
                return;
            }
            commonReturnPromise({
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                url: `${ctx}/onlineProductLazada/modifyLazadaProductTitle`,
                params: JSON.stringify(arr)
            }).then(res => {
                let trObj = $('#lazadaModifyTitleTable').next().find('.layui-table-body tbody').find('tr');
                // 根据id
                for (let i = 0; i < trObj.length; i++) {
                    let tdId = $.trim(trObj.eq(i).find('td[data-field="id"] div').text());//id
                    if (res[tdId].indexOf("成功") != -1) {
                        trObj.eq(i).find('td[data-field="result"] div').html("<div style='color:green'>" + res[tdId] + "</div>");
                    } else if (res[tdId]) {
                        trObj.eq(i).find('td[data-field="result"] div').html("<div style='color:red'>" + res[tdId] + "</div>");
                    }
                }
            })
        });

        // 替换
        form.on('submit(lazada_replace)', function (data) {
            let checkStatusLen = table.checkStatus('lazadaModifyTitleTable').data.length;
            if (checkStatusLen > 0 && tableIns) {
                let layFilterIndex = 'LAY-table-' + tableIns.config.index;
                let tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                tableContainer.find('.layui-table-body input[name="layTableCheckbox"]:checked').each(function (index) {
                    let tr = $(this).parents('tr');
                    let wh_title = tr.find('[data-field=title] div').text(),newTitle = '';
<%--                        let wh_title = lazadaMT_tableData[index]['title'],newTitle = '';--%>
                    if(!data.field.old_string) {
                        if(data.field.new_string.includes('_')) {
                            newTitle = data.field.new_string.replace('_',wh_title)
                        } else {
                            newTitle = data.field.new_string;
                        }
                        tr.find('textarea[name="title_js"]').val(newTitle)
                    } else {
                        if(wh_title.includes(data.field.old_string)){
                            if(!data.field.new_string){
                                data.field.new_string = ''
                                wh_title = wh_title.split(' ').filter((e) => e !== title.value) .join(' ');
                            }
                            newTitle = wh_title.replaceAll(data.field.old_string,data.field.new_string)
                            tr.find('textarea[name="title_js"]').val(newTitle)
                        }else{
                            newTitle = wh_title
                            tr.find('textarea[name="title_js"]').val(newTitle)
                        }
                    }
<%--                    lazadaOnline_titleNumNote(tr.find('textarea[name="title_js"]'))--%>
                        lazadaMT_tableData[tr.data('index')]['newTitle'] = newTitle
                        getLen(tr.find('textarea[name="title_js"]'),newTitle.length)
                });
            } else {
                layer.msg("请选择需要修改的数据！")
            }
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });

    function getLen(dom,restNum){
        $(dom).next('div').find("span").html(restNum)
        if (restNum > 255) {
            $(dom).next('div').find("span").css('color', 'red')
        } else {
            $(dom).next('div').find("span").css('color', '#666')
        }
    }
</script>
