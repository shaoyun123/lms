<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>发货拦截规则</title>
<style>
    .dis_flex_wrap{
        display: flex;
        flex-wrap: wrap;
    }
    .dis_flex_around{
        display: flex;
        justify-content:space-around;
    }
    .w_30{
        width: 30%;
    }
</style>

<div class="layui-fluid" id="LAY-lackShippingRule">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <div style="color: black;font-size: 16px;">规则说明：</div>
                    <div style="color: black;font-size: 16px;">1. 该规则针对实际配货数量小于订单所需商品数量的情况制定，订单在配货和投篮时都会引用</div>
                    <div style="color: black;font-size: 16px;">2. 条件1、2、3、4满足其一就会拦截不发；但满足前4个拦截条件的订单，且符合不处理条件时，则继续发货，不做拦截</div>
                    <div style="color: black;font-size: 16px;">3. 如果不配置或关闭配置，视为实际配货数量 = 订单商品数量时才配货和发货，缺1个商品都不配货和发货</div>
                    <table class="layui-table" id="lackShippingRule_table"  lay-filter="lackShippingRule_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
</script>



<script type="text/html" id="lackShippingRule_status">
    <div class="layui-form layui-form-item">
      <input type="checkbox" name="status" lay-skin="switch" data-id="{{d.id}}" {{d.status?'checked':''}} lay-filter="lackShippingRule_changestatus" lay-text="启用|停用">
    </div>
</script>

<script type="text/html" id="lackShippingRule_unhandleCondition_tpl">
  <div class="lackShippingRule_unhandleCondition" data-id="{{d.id}}" data-prodquantity="{{d.prodQuantity}}" data-platquantity="{{d.platQuantity}}">
    {{# if(d.prodQuantity!==undefined && d.prodQuantity!==''){ }}
      <div>商品数量>:{{d.prodQuantity}}</div>
    {{# } }}
    {{# if(d.platQuantity!==undefined && d.platQuantity!==''){ }}
    <div>平台数量>:{{d.platQuantity}}</div>
    {{# } }}
  </div>
</script>

<script type="text/html" id="lackShippingRule_unhandleCondition_layer">
  <div class="layui-card">
    <div class="layui-card-body">
      <table class="layui-table" id="lackShippingRule_unhandleCondition_table"  lay-filter="lackShippingRule_unhandleCondition_table"></table>
      <div style="color: #605b5b;font-size: 16px;" class="mt20">注：只要有一个满足就处理</div>
    </div>
  </div>
</script>



<script>
layui.use(['form', 'table', 'layer', 'element'], function() {
  var form = layui.form,
      table = layui.table,
      layer = layui.layer;
  var lackShippingRule = {
    init: function () {
      this.rendermarkDeliveryRule()
    },
    rendermarkDeliveryRule: function (conditionEnum) {
      var _this = this
      table.render({
        elem: "#lackShippingRule_table",
        url: ctx + "/orderRuleLackShipping/query.html",
        cols: [
          [
            { title: "平台", field: "platCode" },
            { title: "条件1：可发成本占比≤", field: "shippableCostProportion", edit: "text" },
            { title: "条件2：可发数量占比≤", field: "shippableNumProportion", edit: "text" },
            { title: "条件3：剩余天数≤", field: "remainingDays", edit: "text" },
            { title: "条件4：物流方式集", field: "logisCollectionName", edit: "text" },
            { title: "不处理条件", field: "unhandleCondition", templet: "#lackShippingRule_unhandleCondition_tpl"},
            { title: "修改人", field: "modifier" },
            { title: "修改时间", field: "modifyTime", templet: d => Format(d.modifyTime, "yyyy-MM-dd hh:mm") },
            { title: "备注", field: "remark", edit: "text" },
            { title: "操作", field: "status", templet: "#lackShippingRule_status" },
          ],
        ],
        page: false,
        limit: 50000,
        id: "lackShippingRule_table",
        done: function (res) {
          $('.lackShippingRule_unhandleCondition').each(function(){
            tdDom = $(this).parents('td')
            const height = parseInt(tdDom.css('height'))
            $(this).css('min-height',height-10 +'px')
          })
          form.render()
          _this.updatelackShippingRule()
          _this.changeStatus()
          _this.unhandleCondition(res.data||[])
        },
      })
    },
    //  更新
    updatelackShippingRule: function () {
      const _this = this
      table.on("edit(lackShippingRule_table)", function (obj) {
        const {value,data,field} = obj
        let params = {
            id: data.id,
            shippableCostProportion: data.shippableCostProportion,
            shippableNumProportion: data.shippableNumProportion,
            remainingDays: data.remainingDays,
            logisCollectionName: data.logisCollectionName,
            prodQuantity: data.prodQuantity,
            platQuantity: data.platQuantity,
            remark: data.remark
        }
        _this.fetchUpdatelackShippingRule(params)
      })
    },
    fetchUpdatelackShippingRule:function(params,callback){
      const _this = this
      updatelackShippingRuleApi(params)
        .then(res=>{
          layer.msg(res||'操作成功',{icon:1})
          if(callback){
            callback()
          }
        }).catch(err=>{
          layer.msg(err||'操作失败',{icon:2})
        }).finally(()=>{
          _this.rendermarkDeliveryRule()
        })
    },
    // 更新规则状态
    changeStatus: function () {
      const _this = this
      form.on("switch(lackShippingRule_changestatus)", function (data) {
        let id = $(data.elem).data("id")
        let { checked } = data.elem
        updatelackShippingRuleApi({ status: checked, id })
          .then(res => {
            layer.msg("操作成功", { icon: 1 })
            // 获取登录名
          const modifier = $('#lmsUsername').text()
          const curTimestamp = new Date().getTime()
            table.cache.lackShippingRule_table.some((item, index) => {
               // 更新修改人和修改时间 catch

              if (item.id == id) {
                item.status = checked
                item.modifier = modifier
                item.modifyTime = curTimestamp
                return true
              }
            })
             // 更新修改人和修改时间 dom
            let trDom = $(data.elem).parents("tr")
            trDom.find('[data-field="modifier"] div').text(modifier)
            trDom.find('td[data-field=modifyTime] div').text(Format(curTimestamp, "yyyy-MM-dd hh:mm"))
          })
          .catch(err => {
            data.elem.checked = !checked
            layer.msg(err, { icon: 2 })
            form.render()
          })
      })
    },
    // 不处理条件:
    unhandleCondition:function(originalData=[]){
      const _this = this
      $('.lackShippingRule_unhandleCondition').click(function(){
        const id = $(this).data('id')
        const prodQuantity = $(this).data('prodquantity')
        const platQuantity = $(this).data('platquantity')
          layer.open({
          type: 1,
          title: '不处理条件设置',
          btn: ['保存'],
          area: ['500px', '400px'],
          content: $('#lackShippingRule_unhandleCondition_layer').html(),
          success: function (layero, index) {
            table.render({
              elem: "#lackShippingRule_unhandleCondition_table",
              data:[{
                type:'商品数量>',
                value: prodQuantity === 'undefined' ? '':prodQuantity
              },{
                type:'平台数量>',
                value: platQuantity === 'undefined' ? '':platQuantity
              }],
              cols: [
                [
                  { title: "类型", field: "type" },
                  { title: "设置值", field: "value", templet:'<div><input class="layui-input" name="settingValue" value="{{d.value}}"></div>' },
              ]],
              page: false,
              limit: 50000,
              id: "lackShippingRule_unhandleCondition_table",
              done: function (res) {
                form.render()
              },
            })
          },
          yes: function (index, layero) {
            const curData = originalData.filter(item=>item.id == id)[0]
            const _prodQuantity =layero.find('input[name=settingValue]').eq(0).val()
            const _platQuantity =layero.find('input[name=settingValue]').eq(1).val()
            let params={
              id: curData.id,
              shippableCostProportion: curData.shippableCostProportion,
              shippableNumProportion: curData.shippableNumProportion,
              remainingDays: curData.remainingDays,
              logisCollectionName: curData.logisCollectionName,
              remark: curData.remark,
              prodQuantity: _prodQuantity === '' ? '' : _prodQuantity,
              platQuantity: _platQuantity === '' ? '' : _platQuantity,
            }
            _this.fetchUpdatelackShippingRule(params,()=>{
              layer.close(index)
            })
          }
        })
      })
    }
  }

  lackShippingRule.init()

  // 更新规则
  function updatelackShippingRuleApi(params) {
   return commonReturnPromise({
      url:'/lms/orderRuleLackShipping/updateRule.html',
       type:'post',
       contentType: 'application/json',
       params: JSON.stringify(params)
    })
  }
});
</script>