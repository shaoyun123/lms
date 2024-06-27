<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>SKU验货</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form">
                            <div class="layui-form-item">
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">sku</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" placeholder='这里输入SKU,按下回车查询图片' id="sc_inputSku">
                                        <button class="layui-btn layui-btn-sm" type="button" style="position: absolute;right:0;top:0"
                                            id="compare_sunSku">子SKU对比
                                        </button>
                                    </div>
                                    <input type="hidden" class="layui-input" id="sc_pid">
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">sku</label>
                                    <div class="layui-input-block">
                                        <input type="text" type="text" class="layui-input" id="sc_res_sku">
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">商品名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" type="text" class="layui-input" id="sc_res_title">
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">开发</label>
                                    <div class="layui-input-block">
                                        <input type="text" type="text" class="layui-input" id="sc_res_owner">
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">独立包装</label>
                                    <div class="layui-input-block">
                                        <input type="text" type="text" class="layui-input" id="isAlonePack">
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">包装备注</label>
                                    <div class="layui-input-block">
                                        <input type="text" type="text" class="layui-input" id="noAlonePackDesc">
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">产品区分方式</label>
                                    <div class="layui-input-block">
                                        <input type="text" type="text" class="layui-input" id="productDiffMethod">
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">区分方式备注</label>
                                    <div class="layui-input-block">
                                        <input type="text" type="text" class="layui-input" id="productDiffMethodNote">
                                    </div>
                                </div>
                                <div class="layui-col-lg12 layui-col-md12">
                                    <label class="layui-form-label">图片</label>
                                    <div class="layui-input-block">
                                        <ul id="sc_res_mainImg">
                                            
                                        </ul>
                                    </div>
                                </div>
                            </div>
                    </form>
                </div>
            </div> 
        </div>
    </div>
</div>

<script type="text/html" id="sc_sunSku_layer">
        <div>
            <ul id="sc_res_skuImgs">
               
            </ul>
        </div>
</script>



<script>
    var tplIVP='${tplIVP}';
    layui.use(['admin', 'form', 'table'], function () {
        document.getElementById('sc_inputSku').focus();
        var $ = layui.$,
            element = layui.element,
            admin = layui.admin,
            layer = layui.layer,
            table = layui.table,
            form = layui.form;
        //子sku对比
        $('#compare_sunSku').click(function () {
            layer.open({
                type: 1,
                title: '子SKU比对',
                content: $('#sc_sunSku_layer').html(),
                area: ['70%', '100%'],
                success: function () {
                    if($("#sc_pid").val().trim()==''){
                        return;
                    }
                    $("#sc_res_skuImgs").html("");
                    $.ajax({
                        type: "post",
                        url: ctx + "/prodTpl/subSkuCheck.html",
                        dataType: "json",
                        data: {'sSku': $("#sc_res_sku").val()},
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                if(typeof(returnData.data)== undefined || returnData.data == ""){
                                    return;
                                }
                                var imgs = returnData.data;
                                var imgStr = "";
                                for(var i in imgs){
                                    imgStr += "<li style='width: 300px;height: 334px;float:left;margin: 5px'><div>"+imgs[i].sSku+"</div><img width='300px' height='300px' src='"+tplIVP+imgs[i].image+ "!size=300x300" + "' class='b1'></li>";
                                }
                                $("#sc_res_skuImgs").html(imgStr);
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    })
                }
            })

        })
        $('#sc_inputSku').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                event.preventDefault();// 阻止事件的默认行为   防止刷新
                $("#sc_res_sku").html("");
                $("#sc_res_title").html("");
                $("#sc_res_owner").html("");
                $("#sc_res_mainImg").html("");
                $("#isAlonePack").html("");
                $("#noAlonePackDesc").html("");
                $("#sc_pid").val("");
                if ($('#sc_inputSku').val().trim() == '') {
                    layer.msg("请录入子SKU");
                }
                $.ajax({
                    type: "post",
                    url: ctx + "/prodTpl/skuCheck.html",
                    dataType: "json",
                    data: {'sku': $('#sc_inputSku').val().trim()},
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            if(typeof(returnData.data)== undefined || returnData.data == ""){
                                return;
                            }
                            var prod = returnData.data;
                            $("#sc_res_sku").val($('#sc_inputSku').val());
                            $("#sc_res_title").val(prod.cnTitle);
                            $("#sc_res_owner").val(prod.bizzOwner);
                            $("#isAlonePack").val((prod.isAlonePack == true ? "是" : "否"));
                            $("#noAlonePackDesc").val((prod.noAlonePackDesc ? prod.noAlonePackDesc: ''));
                            $("#productDiffMethod").val((prod.productDiffMethod));
                            $("#productDiffMethodNote").val((prod.productDiffMethodNote));
                            $("#sc_pid").val(prod.id);
                            var imgs = prod.mainImages;
                            var imgStr = "";
                            for(var i in imgs){
                                imgStr += "<li style='width: 300px;height: 300px;border: 1px solid skyblue;float:left;margin:5px'><img width='300px' height='300px' src='"+tplIVP+imgs[i].name+ "!size=300x300"+ "'></div></li>";
                            }
                            // console.log(imgStr);
                            $("#sc_res_mainImg").html(imgStr);
                        } else {
                            layer.msg(returnData.msg);
                        }
                        $('#sc_inputSku').val('')
                    }
                })
            }
        });
    });
</script>
