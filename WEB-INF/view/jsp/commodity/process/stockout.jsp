<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<title>缺货</title>
<style>
   #LAY-process-stockout .layui-table-cell{
       overflow: visible
   }
</style>
<div class="layui-fluid" id="LAY-process-stockout">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">搜索</div>
                <div class="layui-card-body">
                    <form class="layui-form" action="" lay-filter="component-form-group">
                      <div class="layui-form-item">
                        <div class="layui-inline">
                          <div class="layui-input-inline">
                            <p>采购专员</p>
                            <select name="interest" lay-filter="aihao" lay-search="">
                                <option value=""></option>
                                <option value="0">专员0</option>
                                <option value="1">专员1</option>
                                <option value="2">专员2</option>
                                <option value="3">专员3</option>
                              </select>
                          </div>
                        </div>
                        <div class="layui-inline">
                          <div class="layui-input-inline">
                              <p>开发专员</p>
                            <select name="interest" lay-filter="aihao" lay-search="">
                                 <option value=""></option>
                                 <option value="0">专员0</option>
                                 <option value="1">专员1</option>
                                 <option value="2">专员2</option>
                                 <option value="3">专员3</option>
                              </select>
                          </div>
                        </div>
                            <div class="layui-inline">
                            <div class="layui-input-inline w100">
                                <p>采购处理</p>
                                <select name="interest" lay-filter="aihao" lay-search="">
                                    <option value=""></option>
                                    <option value="0">全部</option>
                                    <option value="1">未处理</option>
                                    <option value="2">1-7天到货</option>
                                    <option value="3">>7天到货</option>
                                    <option value="4">找不到供应商</option>
                                </select>
                            </div>
                            </div>
                          <div class="layui-inline">
                              <div class="layui-input-inline">
                                      <p>开发处理</p>
                                      <select name="interest" lay-filter="aihao" lay-search="">
                                          <option value=""></option>
                                          <option value="0">全部</option>
                                          <option value="1">未处理</option>
                                          <option value="2">1-7天到货</option>
                                          <option value="3">>7天到货,标零</option>
                                          <option value="4">找不到供应商,停售</option>
                                        </select>
                              </div>
                          </div>
                          <div class="layui-inline">
                              <div class="layui-input-inline">
                                      <p>到货处理</p>
                                      <select name="interest" lay-filter="aihao" lay-search="">
                                          <option value=""></option>
                                          <option value="0">全部</option>
                                          <option value="1">n天到货</option>
                                          <option value="2">已到货</option>
                                        </select>
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                                                <div class="layui-inline">
                                                    <div class="layui-input-inline" style="width:70px">
                                                        <p>本人状态</p>
                                                        <select name="interest" lay-filter="aihao" lay-search="">
                                                                <option value="1">缺货</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="layui-inline">
                                                    <div class="layui-input-inline">
                                                            <p>&nbsp;</p>
                                                        <select name="interest" lay-filter="aihao" lay-search="">
                                                            <option value="1">wish状态</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="layui-inline">
                                                        <div class="layui-input-inline">
                                                            <p>&nbsp;</p>
                                                            <select name="interest" lay-filter="aihao" lay-search="">
                                                              <option value="1">ebay状态</option>
                                                            </select>
                                                        </div>
                                                </div>
                                                <div class="layui-inline">
                                                        <div class="layui-input-inline">
                                                            <p>&nbsp;</p>
                                                            <select name="interest" lay-filter="aihao" lay-search="">
                                                                <option value="0">smt状态</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="layui-inline">
                                                            <div class="layui-input-inline">
                                                                <p>&nbsp;</p>
                                                                <select name="interest" lay-filter="aihao" lay-search="">
                                                                    <option value="0">amazon状态</option>
                                                                </select>
                                                            </div>
                                                    </div>
                                                    <div class="layui-inline">
                                                        <div class="layui-input-inline">
                                                            <p>&nbsp;</p>
                                                            <select name="interest" lay-filter="aihao" lay-search="">
                                                                <option value="0">shopee状态</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="layui-inline">
                                                        <div class="layui-input-inline">
                                                            <p>&nbsp;</p>
                                                            <select name="interest" lay-filter="aihao" lay-search="">
                                                                <option value="0">joom状态</option>
                                                            </select>
                                                        </div>
                                                    </div>
                      </div>
                      <div class="layui-form-item">
                            <div class="layui-inline">
                                <div class="layui-input-inline" style="width:70px">
                                    <p>平台状态</p>
                                    <select name="interest" lay-filter="aihao" lay-search="">
                                            <option value="1">缺货</option>
                                    </select>
                                </div>
                            </div>
                             <div class="layui-inline">
                                 <div class="layui-input-inline">
                                         <p>&nbsp;</p>
                                     <select name="interest" lay-filter="aihao" lay-search="">
                                         <option value="1">wish状态</option>
                                     </select>
                                 </div>
                             </div>
                             <div class="layui-inline">
                                     <div class="layui-input-inline">
                                         <p>&nbsp;</p>
                                         <select name="interest" lay-filter="aihao" lay-search="">
                                             <option value="1">ebay状态</option>
                                         </select>
                                     </div>
                             </div>
                              <div class="layui-inline">
                                  <div class="layui-input-inline">
                                      <p>&nbsp;</p>
                                      <select name="interest" lay-filter="aihao" lay-search="">
                                          <option value="0">smt状态</option>
                                      </select>
                                  </div>
                              </div>
                              <div class="layui-inline">
                                      <div class="layui-input-inline">
                                          <p>&nbsp;</p>
                                          <select name="interest" lay-filter="aihao" lay-search="">
                                              <option value="0">amazon状态</option>
                                          </select>
                                      </div>
                              </div>
                              <div class="layui-inline">
                                  <div class="layui-input-inline">
                                      <p>&nbsp;</p>
                                      <select name="interest" lay-filter="aihao" lay-search="">
                                          <option value="0">shopee状态</option>
                                      </select>
                                  </div>
                              </div>
                              <div class="layui-inline">
                                  <div class="layui-input-inline">
                                      <p>&nbsp;</p>
                                      <select name="interest" lay-filter="aihao" lay-search="">
                                          <option value="0">joom状态</option>
                                      </select>
                                  </div>
                              </div>
                      </div>
                      <div class="layui-form-item">
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <p>搜索类型</p>
                                    <select name="" id="" lay-search>
                                            <option value="1">父SKU</option>
                                            <option value="2">子SKU</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                               <div class="layui-input-inline">
                                    <p>搜索内容</p>
                                    <input type="text" class="layui-input">
                               </div>
                            </div>
                            <div class="layui-inline">
                                    <div class="layui-input-inline">
                                         <p>&nbsp;</p>
                                         <button class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                    </div>
                            </div>
                          <div class="layui-inline">
                              <div class="layui-input-inline">
                                  <p>排序方式</p>
                                  <select name="interest" lay-filter="aihao" lay-search="">
                                         <option value="1">SKU↑</option>
                                         <option value="2">sku↓</option>
                                         <option value="3">导入时间↑</option>
                                         <option value="4">导入时间↓</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                    </form>                                          
                </div>
            </div>

            <div class="layui-card"> 
                <div class="layui-card-header">
                    <span>数量(<span class="red" id="prodStockOutNumSp"></span>)</span>
                    <button type="button" class="layui-btn layui-btn-sm" id="uploadStockOutBtn" style="position:absolute;top:8px;right:90px">导入缺货订单</button>
                    <a href="${ctx }/prodStock/stockOutTmpDownload.html">
                        <button type="button" class="layui-btn layui-btn-sm" id="downStockTmpBtn" style="position:absolute;top:8px;right:10px">
                            模板下载
                        </button>
                    </a>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="prodStockOutTable" lay-filter="prodStockOutTable"></table>
                    <script type="text/html" id="purchaseStockOutBar">
                        {{# if(d.purchaseProc != null){ }}
                            {{# if(d.purchaseProc == 0){ }}
                                 <span>未处理</span>
                           {{# }else if(d.purchaseProc == 1){ }}
                                <span>1-7天到货</span>
                            {{# }else if(d.purchaseProc == 2){ }}
                                 <span>>7天到货</span>
                           {{# }else if(d.purchaseProc == 3){ }}
                                  <span> 找不到供应商</span>
                           {{#  } }}
                        {{# } }}
                        <br/>
                        <div class="nav navbar-nav"><li>
                            <button class="layui-btn layui-btn-sm" data-toggle="dropdown">处理
                                <b class="caret"></b>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a href="javascript:void(0);" onclick="purchaseHandleStock( {{d.id}} ,1)"> 1-7天到货</a></li>
                                <li><a href="javascript:void(0);" onclick="purchaseHandleStock( {{d.id}} ,2)"> >7天到货</a></li>
                                <li><a href="javascript:void(0);" onclick="purchaseHandleStock( {{d.id}} ,3)"> 找不到供应商</a></li>
                            </ul>
                        </div>
                    </script>

                    <script type="text/html" id="devStockOutBar">
                        {{# if(d.devProc != null){ }}
                            {{# if(d.devProc == 0){ }}
                          	<span>未处理</span>
                            {{# }else if(d.devProc == 1){ }}
                            <span>>7天到货</span>
                            {{# }else if(d.devProc == 2){ }}
                            <span>>7天到货</span>
                            {{# }else if(d.devProc == 3){ }}
                          	 <span> 找不到供应商</span>
                            {{#  } }}
                        {{# } }}
                        <br/>
                        <div class="nav navbar-nav"><li>
                            <button class="layui-btn layui-btn-sm" data-toggle="dropdown">处理
                                <b class="caret"></b>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a href="javascript:void(0);" onclick="devHandleStock( {{d.id}} ,1)"> 1-7天到货</a></li>
                                <li><a href="javascript:void(0);" onclick="devHandleStock( {{d.id}} ,2)"> >7天到货</a></li>
                                <li><a href="javascript:void(0);" onclick="devHandleStock( {{d.id}} ,3)"> 找不到供应商</a></li>
                            </ul>
                        </div>
                    </script>

                    <script  type="text/html" id="saleSelfStatusBar">
                        {{# if(d.platSumms != null){ }}
                            {{# for(var i = 0; i< d.platSumms.length; i++){ }}
                            {{# var platSumm = d.platSumms[i] }}
                                {{# if(platSumm.persIsOosComp == null){ }}
                                {{# }else if(platSumm.persIsOosComp == true){ }}
                                    <span class="layui-badge">{{ platSumm.platCode }}</span>
                                {{# }else{ }}
                                     <span class="layui-badge layui-bg-gray">{{ platSumm.platCode }}</span>
                                {{# } }}
                            {{# } }}
                        {{# } }}

                    </script>

                    <script  type="text/html" id="platStatusBar">
                        {{# if(d.platSumms != null){ }}
                            {{# for(var i = 0; i< d.platSumms.length; i++){ }}
                            {{# var platSumm = d.platSumms[i] }}
                                {{# if(platSumm.isOosComp == false){ }}
                                <span class="layui-badge layui-bg-gray">{{ platSumm.platCode }}</span>
                                {{# }else{ }}
                                <span class="layui-badge">{{ platSumm.platCode }}</span>
                                {{# } }}
                            {{# } }}
                        {{# } }}
                    </script>

                    <script  type="text/html" id="stockoutTimeBar">
                        <span style="color:#999">缺货: </span>{{ d.createTime  || ''}}<br/>
                        <span style="color:#999">到货: </span>{{ d.arrivalTime ||  '' }}<br/>
                    </script>

                    <script  type="text/html" id="stockOutOperBar">
                        <div class="nav navbar-nav"><li>
                            <button class="layui-btn layui-btn-sm" data-toggle="dropdown">详情
                                <b class="caret"></b>
                            </button>
                            <ul class="dropdown-menu">
                                {{# if(d.platSumms != null){ }}
                                    {{# for(var i = 0; i< d.platSumms.length; i++){ }}
                                    {{# var platSumm = d.platSumms[i] }}
                                         <li><a href="javascript:void(0);" onclick="stockoutDetail( {{d.id}}, {{platSumm.platCode}})">{{ platSumm.platCode }}</a></li>
                                    {{# } }}
                                {{# } }}
                            </ul>
                        </div>
                    </script>

                </div>
            </div>

        </div>

    </div>
</div>

<script type="text/html" id="stockoutSaleLayer">
    <div class="p20">
        <input type="hidden" id="stockIdHiddenInput">
        <input type="hidden" id="stockPlatCodeHiddenInput">
        <div class="layui-form" style="width:300px;display:inline-block;margin-left:20px">
            <select  id="stockOutDetailSel" lay-filter="stockOutDetailSel" lay-search>
                <option value="true" selected="selected">看自己</option>
                <option value="false">看全部</option>
            </select>
        </div>
        <button class="layui-btn" id="stockOutRemarkProcBtn">标记处理</button>
        <button class="layui-btn" id="stockOutBatchZeroBtn">批量标零</button>
        <button class="layui-btn" id="stockOutBatchSaleOffBtn">批量下架</button>
        <table class="layui-table" id="stockoutSaleTable" lay-filter="stockoutSaleTable"></table>

    </div>
</script>

<script  type="text/html" id="oosProcActBar">
    {{# if(d.oosProcAct != null){ }}
    {{# if(d.oosProcAct == 1){ }}
    批量标零
    {{# }else if(d.oosProcAct == 2){ }}
    批量下架
    {{# }else{ }}
    标记处理
    {{# } }}
    {{# } }}
</script>


<script src="${ctx}/static/js/commodity/process/stockout.js"></script>
<script src="${ctx}/static/bootstrap/bootstrap.min.js"></script>
