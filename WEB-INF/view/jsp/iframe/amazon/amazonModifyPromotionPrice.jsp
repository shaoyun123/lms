<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>amazon促销价</title>
<style>
#LAY_adjustPriceProcess .layui-form-label{
   padding: 9px 5px;
}
#LAY_adjustPriceProcess .layui-form-item .layui-col-lg2 layui-col-md2 {
    margin-right: 0; 
}

.dis_flex{
    display: flex;
    justify-content: space-between;
}
.w_100{
    width:100px;
}

#LAY_adjustPriceProcess .layui-form{
    margin: 0 10px;
}
#LAY_adjustPriceProcess .layui-form-checkbox span{
    line-height: inherit;
}

#LAY_adjustPriceProcess .layui-form-checkbox{
    line-height: 30px !important;
}

.numCount {
    border: 1px solid #e8e8e8;
    border-bottom: none;
    display:inline-block;
    padding:0 5px;
    text-align: center;
    line-height: 30px;
}
.mg_10{
    margin:0 10px;
}
#amazon_theShelves_searchForm .layui-form-label,
#applyForm .layui-form-label {
    width: 60px;
}

#amazon_theShelves_searchForm .layui-input-block,
#applyForm .layui-input-block{
    margin-left: 90px;
}
    .left10{
        margin-left:10px;
    }

</style>

<div class="layui-fluid" id="amazonadjustPriceProcess">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md14">
          <div class="layui-card">
                <div class="layui-card-body">
                    <form id="applyForm" class="layui-form layui-clear">
                          <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">当前价格</label>
                              <div class="layui-input-block">
                                  <select name="calculateType">
                                      <option value="1"><b>+</b></option>
                                      <option value="2">-</option>
                                      <option value="3" selected>*</option>
                                      <option value="4">=</option>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-md1 layui-col-lg1">
                              <input type="number" class="layui-input" name="newPriceInput">
                          </div>

                          <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">毛利率(%)</label>
                              <div class="layui-input-block">
                                  <input class="layui-input" type="number" name="grossProfitRate">
                              </div>
                          </div>
                          <div class="layui-col-lg1 layui-col-md1">
                              <button type="button" id="newPriceBtn" class="left10 layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">差价范围</label>
                              <div class="layui-input-block" style="display: flex;align-items: center">
                                  <input type="number" name="minDifPrice" class="layui-input" placeholder="大于">
                                  <input type="number" name="maxDifPrice" class="layui-input" placeholder="小于">
                              </div>
                          </div>
                          <div class="layui-col-md1 layui-col-lg1" style="display: flex;">
                                  <button type="button" id="amazonFilter" class="left10 layui-btn layui-btn-warm layui-btn-sm">筛选</button>
                                  <button type="button" id="amazonRevert" class="layui-btn layui-btn-primary layui-border-orange layui-btn-sm">还原</button>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label" style="width: 80px">促销起止时间</label>
                            <div class="layui-input-block" style="margin-left: 110px">
                              <input type="text" class="layui-input" id="promotion_time" name="time" lay-verify="required" readonly>
                            </div>
                          </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(<span id="tolnum_span_amazon_price"></span>)</div>
                <div class="dis_flex mg_10">
                    <button type="button" id="batchUpadatePrice" class="fr layui-btn layui-btn-normal layui-btn-sm">批量调价</button>
                </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="amazonModifyPromotionPrice" lay-filter="amazonModifyPromotionPrice"></table>
                    <script type="text/html" id="promotionPriceTpl">
                        {{# if(d.promotionPrice==0){ }}
                        <input type="text" id="priceInput" class="layui-input" style="height:28px" value="">
                        {{# }else{ }}
                        <input type="text" id="priceInput" class="layui-input" id="promotionPrice" name="promotionPrice" style="height:28px" value={{ d.promotionPrice || '' }}>
                        {{# } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/amazon/amazonModifyPromotionPrice.js"></script>
<script type="text/html" id="new_price">
    <input type="text" class="layui-input" style="height:28px" name="adjustprice" value="{{d.newPrice||''}}">
</script>
