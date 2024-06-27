<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
    <title>币种&汇率</title>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">

                        <form action="" class="layui-form" id="exchangeRateSearchForm">
                            <div class="layui-inline w100">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <select name="srcCyName" id="srcCyNamePage" lay-search>
                                    	<option value="">原币种</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline w130">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <select name="suitableType" lay-search>
                                        <option value="">适用类型</option>
                                        <option value="1">订单浮动汇率</option>
                                        <option value="2">商品固定汇率</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="exchangeRateSearch">搜索
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-primary  layui-btn-sm">清空</button>
                                </div>
                            </div>
                            <div style="position:absolute;right:10px;top:10px">
                                <div class="layui-inline">
                                    <div class="layui-input-inline">
                                        <permTag:perm funcCode="exchangerate_add">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="addCurrencyRate">
                                            添加汇率
                                        </button>
                                        </permTag:perm>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-body">
                        <!-- 表格的数据渲染 -->
                        <table class="layui-table" id="currencyRateTable" lay-filter="currencyRateTable"></table>
                        <script type="text/html" id="currencyRateTableBar">
                            {{# if(d.suitableType == 2){ }}
                            <permTag:perm funcCode="exchangerate_edit">
                            <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                            </permTag:perm> {{# } }}
                            <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="new">查询最新</span>
                            <%--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>--%>
                        </script>

                        <script type="text/html" id="isFixedTpl">
                            {{# if(d.isFixed == false){ }} 非固定汇率 {{# } else { }} 固定汇率 {{# } }}
                        </script>

                        <script type="text/html" id="suitableTypeTpl">
                            {{# if(d.suitableType == 1){ }} 订单浮动汇率 {{# } else if (d.suitableType == 2) { }} 商品固定汇率 {{# } }}
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 模态框 -->
    <script type='text/html' id="currencyRateLayer">
        <div class="p20">
            <form class="layui-form" id="addCurrencyRateForm">
                <input type="hidden" name="id">
               		 <%--TODO 动态生成--%>
					<div class="layui-form-item">
                    <label class="layui-form-label">原币种</label>
                    <div class="layui-input-block">
                        <select name="srcCyName" lay-filter="primaryCurrency" id="srcCyName" lay-search>
                    <option value="">请选择</option>
                </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">目标币种</label>
                    <div class="layui-input-block">
                        <select name="tarCyName" lay-filter="primaryCurrency" lay-search>
                    <option value="人民币">人民币</option>
                </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">适用类型</label>
                    <div class="layui-input-block">
                        <select name="suitableType" lay-filter="primaryCurrency" lay-search>
                    <option value="2">商品固定汇率</option>
                </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">汇率</label>
                    <div class="layui-input-block">
                        <input type="text" name="exchRate" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">汇率日期</label>
                    <div class="layui-input-block">
                        <input type="text" name="exchRateDate" id="exchRateDate" lay-verify="date" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <textarea class="layui-textarea" name="remark"></textarea>
                    </div>
                </div>
                <div class="layui-form-item disN">
                    <div class="layui-input-block taRight">
                        <button class="layui-btn" lay-submit="" lay-filter="addExchangeRateInfo" id="addExchangeRateInfo">提交</button>
                        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                    </div>
                </div>
            </form>
        </div>
    </script>
    <!-- 查询最新弹框 -->
    <script type="text/html" id="exchangerate_newRateLayer">
      <div style="padding:20px;">
        <table class="layui-table">
          <tbody>
            <tr>
              <td>最新汇率</td>
              <td class="newRate"></td>
            </tr>
            <tr>
              <td>最新汇率扣除手续费后</td>
              <td class="newRateByDiscount"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </script>

    <script type="text/javascript" src="${ctx}/static/js/configuration/other/exchangerate.js"></script>