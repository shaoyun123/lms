
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%-- 万邑通数据 --%>
<script type="text/html" id="selection_data">
    <div class="alignLeft canClickEl" onmouseover="selection_showSyncProdInfoDetail(this)" onmouseleave="selection_hideSyncProdInfoDetail(this)">
        <div class="disN selection_syncPordInfoDetailDiv">
            {{JSON.stringify(d.serviceInfoList)}}
        </div>
        {{# for (let i = 0; i < d.serviceInfoList.length; ++i) {}}
        <div>
            <span class="secondary">{{selection_getServiceName(d.serviceInfoList[i].serviceType)}}：</span>
            <span class="{{d.serviceInfoList[i].registerStatus == 2 ? 'layui-green' : 'fGrey'}}">{{selection_getregisterStatusName(d.serviceInfoList[i].registerStatus)}}</span>
        </div>
        {{# } }}
    </div>
</script>

<script>
    function selection_getServiceName(serviceType) {
        switch (serviceType) {
            case 1: return '万邑通'
            case 2: return '谷仓'
            case 3: return '递四方'
        }
    }
    function selection_getregisterStatusName(registerStatus) {
        switch (registerStatus) {
            case 1: return '注册中'
            case 2: return '成功'
            case 3: return '失败'
        }
    }

    function selection_showSyncProdInfoDetail(self) {
        if ($(self).attr('ifShow') === 'true') {
            return
        }
        let json = $(self).find('.selection_syncPordInfoDetailDiv').text()
        let data = JSON.parse(json)
        var tipsIndex = layui.layer.open({
            type: 4,
            shade: 0,
            area: ['1000px', '300px'],
            tips: [1, 'rgba(5,5,5,0.4)'],
            isOutAnim: false,
            content: [$('#selection_showSyncProdInfoPop').html(), self], //数组第二项即吸附元素选择器或者DOM
            success: function () {
                console.log(data)
                layui.table.render({
                    elem: '#selection_showSyncProdInfTable',
                    data:  data,
                    page: false,
                    limit: data.length,
                    id: "selection_showSyncProdInfTable",
                    cols: [
                        [
                            {title: '服务商',templet:"<div>{{selection_getServiceName(d.serviceType)}}</div>", width: 70},
                            {title: '关税', field: 'importRate', width: 70},
                            {title: '附加税', field: 'additionalTaxRate', width: 70},
                            {title: 'VAT', field: 'vatTaxRate', width: 70},
                            {title: '注册状态',templet:"<div>{{selection_getregisterStatusName(d.registerStatus)}}</div>", width: 70},
                            {title: '注册时间',templet:"<div>{{d.registerTime ? Format(d.registerTime,'yyyy-MM-dd hh:mm:ss'): ''}}</div>", width: 100},
                            {title: '允许存储', templet: '<div>{{d.allowSave ? "是" : "否"}}</div>', width: 70},
                            {title: '服务商备注', field: 'serviceRemark'},
                            {title: '注册备注', field: 'registerRemark'},
                        ]
                    ]
                });
            }
        })
        $(self).attr('ifShow','true')
        $(self).attr('popIndex',tipsIndex)
    }

    function selection_hideSyncProdInfoDetail(self) {
        layui.layer.close($(self).attr('popIndex'))
        $(self).attr('ifShow','false')
    }
</script>