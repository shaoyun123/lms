; (function ($, layui, window, document, undefined) {
    layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'upload', 'laydate', 'laytpl'], function () {
        var admin = layui.admin,
            form = layui.form,
            layer = layui.layer,
            table = layui.table,
            formSelects = layui.formSelects,
            element = layui.element,
            upload = layui.upload,
            laydate = layui.laydate,
            laypage = layui.laypage,
            laytpl = layui.laytpl
        $ = layui.$

        var platformsReplenishName = {
            // 初始化
            init: function () {
                this.initAjax()
                    .then(data =>
                        table.render({
                            elem: '#platforms_replenish_rule_table',
                            data: data,
                            cols: [[
                                { field: 'platCode', title: '平台', },
                                { field: 'expectArrivalTime', title: '预计到货天数（补货:＜/标零:≥）', },
                                { field: 'replenishCondition', title: '在线数量≤多少时补货', },
                                { field: 'replenishCounts', title: '补货数量', },
                                { field: 'remark', title: '备注', },
                                // { field: 'jobHandler', title: 'jobHandler', },
                                { field: 'modifier', title: '修改人', },
                                { field: 'modifyTime', title: '修改时间',templet: '<div>{{Format(new Date(d.modifyTime),"yyyy-MM-dd hh:mm:ss")}}</div>'},
                                { title: '操作', align: 'center', style: "vertical-align: top;", toolbar: '#platforms_replenish_rule_table_toolbar', width: 100 }
                            ]],
                            id: 'platforms_replenish_rule_tableId',
                        })
                    )
                    .catch(err => layer.msg(err, { icon: 2 }))
            },
            // table的toolbar
            tableMonitor: function () {
                var _this = this
                table.on('tool(platforms_replenish_rule_table)', function (obj) {
                    switch (obj.event) {
                        case 'edit':
                            _this.editModal(obj.data)
                            break;
                        default:
                            break;
                    }
                })
            },
            // 编辑弹窗
            editModal: function (obj) {
                var _this = this
                layer.open({
                    title: obj.platCode,
                    type: 1,
                    id: Date.now(),
                    area: ['500px'],
                    btn: ['保存', '关闭'],
                    content: $("#platforms_replenish_rule_edit_modal").html(),
                    success: function (layero) {
                        // commonReturnPromise({
                        //     type: 'post',
                        //     url: ctx + '/platformReplenishRules/getPlatformReplenishRules',
                        //     params: { ruleIds: obj.id }
                        // }).then(data => {
                            var formDoms = $('#platforms_replenish_rule_edit_form')
                            formDoms.find('input[name=expectArrivalTime]').val(obj.expectArrivalTime)
                            formDoms.find('input[name=replenishCondition]').val(obj.replenishCondition)
                            formDoms.find('input[name=replenishCounts]').val(obj.replenishCounts)
                            formDoms.find('textarea[name=remark]').val(obj.remark)
                        // }).catch(err => layer.msg(err, { icon: 2 }))

                    },
                    yes: function (index, layero) {
                        let formObj = serializeObject($("#platforms_replenish_rule_edit_form"))
                        let params = { id: obj.id, ...formObj }
                        // 参数验证及保存
                        let _params = _this.saveParams(params)
                        if (Object.prototype.toString.call(_params) === '[object Object]') {
                            _this.updateAjax(_params, index)
                        } else {
                            layer.msg(_params)
                        }
                        return false
                    }
                })
            },
            // 验证参数
            saveParams: function (params) {
                if (Number(params.replenishCounts) <= Number(params.replenishCondition)) {
                    this.saveVerifyParams('input', 'replenishCounts')
                    return '补货数量不能小于等于“在线数量≤多少时补货”的数量'
                }
                return params
            },
            // 验证标红
            saveVerifyParams: function (domHtml, domName) {
                $('#platforms_replenish_rule_edit_form ' + domHtml + '[name=' + domName + ']').addClass('layui-form-danger').focus();
                setTimeout(function () {
                    $('#platforms_replenish_rule_edit_form ' + domHtml + '[name=' + domName + ']').removeClass('layui-form-danger')
                }, 1500);
            },
            //初始化接口
            initAjax: function () {
                return commonReturnPromise({
                    type: 'get',
                    url: ctx + '/platformReplenishRules/getPlatformReplenishRulesAll',
                })
            },
            // 编辑接口
            updateAjax: function (param, index) {
                var _this = this
                commonReturnPromise({
                    type: 'post',
                    url: ctx + '/platformReplenishRules/updatePlatformReplenishRules',
                    params: param,
                }).then(() => {
                    layer.msg('修改成功', { icon: 1 })
                    layer.close(index)
                    _this.init()
                }).catch(err => layer.msg(err, { icon: 2 }))
            }
        }

        // init
        platformsReplenishName.init()
        // table's tool
        platformsReplenishName.tableMonitor()
    });
})(jQuery, layui, window, document);