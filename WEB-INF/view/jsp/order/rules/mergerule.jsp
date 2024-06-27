<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>合单规则</title>

<style>

</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 表格-->
            <div class="layui-card">
                <div style="padding:20px;">
                   <div><strong>基础规则:</strong></div>
                    <div>1. 同一店铺、站点、币种、买家账号、收件人、收货地址1、收货地址2、城市、州/省、国家/地区、邮编、电话、买家指定物流方式都相同，可合单。</div>
                    <div>2. 速卖通的订单，除以上条件满足之外，还要OAID相同才允许合单。</div>
                    <div>3. wish瑞典/EPC的订单、Joom、AE全托管和AE半托管平台所有原始订单都不可合单</div>
                    <div>4. 所有平台的拆分订单都可以合并，最多合并成原始订单</div>
                    <div>5. 一个原始订单无法和另外一个拆分订单合并</div>
                    <br>
                    <div><strong>合单说明:</strong></div>
                    <div>1. 下面订单状态的筛选会影响可合并订单的查询，与是否启用自动合单无关</div>
                    <div>2. 如果是待派单的订单参与合并，则先将订单驳回到待审核之后再合并，驳回时如果已经占用库存的也会释放占用</div>
                    <div>3. 启用了自动合单的平台，订单下载后会自动合单，十五分钟执行一次</div>
                </div>
                <div class="layui-card-body">
                   <table class="layui-table" id="mergerule_table" lay-filter="mergerule_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<%-- 是否启用自动合单(只是展示用) --%>
<script type="text/html" id="mergerule_automerge">
    <div class="layui-form automerge" data-id="{{d.id}}">
      <input type="checkbox" name="automerge" lay-skin="switch" lay-filter="mergerule_automerge_switchFilter" lay-text="开启|关闭" {{d.autoMerge ? 'checked': ''}}>
    </div>
</script>
<!-- 订单状态 -->
<script type="text/html" id="mergerule_orderStatus">
  <div class="layui-form orderStatus" data-id="{{d.id}}">
    <input type="checkbox" lay-filter="mergerule_orderStatusCkFilter" name="unAuditStatus" title="待审核" lay-skin="primary" {{d.unAuditStatus==110 ? 'checked': ''}}>
    <input type="checkbox" lay-filter="mergerule_orderStatusCkFilter" name="unDispatchStatus" title="待派单且未标记发货" lay-skin="primary" {{d.unDispatchStatus==115 ? 'checked': ''}}>
  </div>
</script>

<script src="${ctx}/static/js/order/mergerule.js"></script>