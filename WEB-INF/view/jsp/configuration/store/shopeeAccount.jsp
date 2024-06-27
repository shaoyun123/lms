<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>shopee店铺</title>
<style>
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }
    .shopeeStyle {
        display: flex;
        margin-bottom: 20px;
    }

    .shopeeStyle_label {
        width: 90px;
        line-height: 32px;
    }

    .shopeeStyle_block {
        display: flex;
        margin-left: 10px;
    }
    .shopeeStyle_block span{
        margin-top: 7px;
    }
    .disNIm {
        display: none !important;
    }
    #shopeeaccountCard .importPart{
        display: flex;
        flex: 1;
        align-items: center;
    }
    .shopee_acct_set_bacth_storetag .xm-select-parent{
        width: 330px;
    }
    #shopee_acct_LAY-iframe-itemCat .layui-col-md3,
  #shopee_acct_LAY-iframe-itemCat .layui-col-xs3 {
    width: 24%;
    height: 305px;
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 2px 10px;
    border: 1px solid #ccc;
  }

  #shopee_acct_LAY-iframe-itemCat ul li {
    position: relative;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 20px;
  }

  #shopee_acct_LAY-iframe-itemCat .layui-col-xs12 ul li {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #shopee_acct_LAY-iframe-itemCat .layui-col-xs3 ul li i {
    position: absolute;
    top: 4px;
    right: 5px;
  }

  #shopee_acct_LAY-iframe-itemCat ul li:hover {
    background-color: #f4f6f7;
    color: #438eb9;
  }

  #shopee_acct_LAY-iframe-itemCat ul li.cat_active:hover {
    background-color: #6fb3e0;
    color: #fff;
  }

  #shopee_acct_LAY-iframe-itemCat input {
    display: inline-block;
    width: 200px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
  }

  #shopee_acct_LAY-iframe-itemCat input:focus {
    outline: 0;
    box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  }

  #shopee_acct_LAY-iframe-itemCat input:focus,
  #shopee_acct_LAY-iframe-itemCat input:hover {
    border-color: #57a3f3;
  }
  .cat_common {
        padding: 3px;
        margin: 3px auto;
        border: 1px solid #f8f8f8;
        box-sizing: border-box;
        font-weight: 700;
        background-color: #f8faff;
        color: #7C9EB2;
        cursor: pointer;
    }
    
    .cat_active {
        background-color: #6FB3E0;
        color: #fff
    }
    #shopee_acct_set_mallStore_form .layui-form-label{
        width: 100px;
    }
    #shopee_acct_set_mallStore_form .layui-input-block{
        margin-left: 130px;
    }
    #shopee_set_preSale_limit .layui-table-body{
        overflow-x: hidden;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="component-form-group" id="shopeeAcctSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="status" lay-search>
                                        <option value="">全部</option>
                                        <option value="true" selected>启用中</option>
                                        <option value="false">已停用</option>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="display:flex;">
                                    <input type="text" name="storeAcct" placeholder="店铺名称,逗号分割查询多个" class="layui-input">
                                    <select name="acctQueryFlag" lay-search>
                                        <option value="1">精确</option>
                                        <option value="0">模糊</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">发货仓库</label>
                              <div class="layui-input-block sellect-seller">
                                  <select name="shippingWarehouseId" id="shopee_account_shippingWarehouseId">
                                      <option value="">请选择</option>
                                  </select>
                              </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" id="shopee_account_depart_sel" placeholder="部门" lay-search
                                        lay-filter="shopee_account_depart_sel" class="orgs_hp_custom">
                                        <option value="">部门</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block sellect-seller">
                                    <select name="salespersonId" id="shopee_account_salesman_sel" lay-search
                                        lay-filter="shopee_account_salesman_sel" class="users_hp_custom"
                                        data-rolelist="shopee专员">
                                        <option value="">销售员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                    <%--<div class="layui-col-md8 layui-col-lg8">--%>
                                        <label class="layui-form-label">客服</label>
                                        <div class="layui-input-block">
                                            <select name="customServicerId" class="layui-select" lay-search>
                                                <option value="">客服</option>
                                            </select>
                                        </div>
                                    <%--</div>--%>
                                    <%--<div class="layui-col-md4 layui-col-lg4">--%>
                                        <%--<select name="" id="shopeeSyncListingStatus"--%>
                                            <%--lay-filter="shopeeSyncListingStatusFilter">--%>
                                            <%--<option value="">同步listing状态</option>--%>
                                            <%--<option value="0">未同步</option>--%>
                                            <%--<option value="2">同步中</option>--%>
                                            <%--<option value="3">同步成功</option>--%>
                                            <%--<option value="4">同步失败</option>--%>
                                        <%--</select>--%>
                                    <%--</div>--%>
                                </div>
                            </div>
                            <!-- <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">下载订单</label>
                                <div class="layui-input-block">
                                    <select name="orderDownloadStatus" id="orderDownloadStatus" lay-search>
                                        <option value="">请选择</option>
                                        <option value="true">已开启</option>
                                        <option value="false">已关闭</option>
                                    </select>
                                </div>
                            </div> -->
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                        <label class="layui-form-label">可用额度</label>
                                        <div class="layui-input-block dis_flex">
                                            <input class="layui-input" name="listingQuotaRemainMin" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                            <input class="layui-input" name="listingQuotaRemainMax" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                        </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">自动删除</label>
                                <div class="layui-input-block">
                                    <select name="autoDelete" lay-search>
                                        <option value=""></option>
                                        <option value="true">已开启</option>
                                        <option value="false">已关闭</option>
                                    </select>
                                </div>
                            </div>
                            <!-- <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">自动刊登</label>
                                <div class="layui-input-block">
                                    <select name="autoPublish">
                                        <option value=""></option>
                                        <option value="true">已开启</option>
                                        <option value="false">已关闭</option>
                                    </select>
                                </div>
                            </div> -->
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label" style="padding: 9px 0px;width: 95px;">同步Listing状态</label>
                                <div class="layui-input-block">
                                    <select name="syncStatus" lay-search>
                                        <option value=""></option>
                                        <option value="1">初始</option>
                                        <option value="2">同步中</option>
                                        <option value="3">成功</option>
                                        <option value="4">失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                   <input type="text" name="syncDesc" placeholder="同步异常备注" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label" style="padding: 9px 0px;width: 95px;">刊登时间</label>
                                <div class="layui-input-block">
                                    <select name="autoDeleteGreatListingTimes" lay-search>
                                        <option value=""></option>
                                        <option value="30">30天</option>
                                        <option value="50">50天</option>
                                        <option value="60">60天</option>
                                    </select>
                                </div>
                            </div>
                            <!-- <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label" style="padding: 9px 0px;width: 95px;">促销是否设置</label>
                                <div class="layui-input-block">
                                    <select name="ifPromotion">
                                        <option value=""></option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div> -->
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="remark">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">毛利率</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="grossRateMin" type="number" min="0" placeholder="请输入数字" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                    <input class="layui-input" name="grossRateMax" type="number" min="0" placeholder="请输入数字" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">预售</label>
                                <div class="layui-input-block">
                                   <select name="shopeePreOrderConfigStatus" lay-search>
                                    <option value="">请选择</option>
                                    <option value="1">已开启</option>
                                    <option value="0">已取消</option>
                                    <option value="2">已暂停</option>
                                   </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">自动上传视频</label>
                                <div class="layui-input-block">
                                   <select name="autoUploadVideo" lay-search>
                                    <option value="">请选择</option>
                                    <option value="true">已开启</option>
                                    <option value="false">已关闭</option>
                                   </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺标签</label>
                                <div class="layui-input-block">
                                    <select name="storeTagList"
                                        xm-select="shopeeAccount_search_storeTagList"
                                        lay-filter="shopeeAccount_search_storeTagList"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                    ></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">mall店铺</label>
                                <div class="layui-input-block">
                                   <select name="shopIsMall" lay-search>
                                    <option value="">请选择</option>
                                    <option value="true">是</option>
                                    <option value="false">否</option>
                                   </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">GP</label>
                                <div class="layui-input-block">
                                    <select name="merchantNameList"
                                        xm-select="shopeeAccount_search_GP"
                                        lay-filter="shopeeAccount_search_GP"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                    ></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload"
                                    id="shopeeSearch">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="shopeeaccountCard">
                <div class="layui-card-body">
                    <div class="layui-card-header">
                        <div class="dis_flex">
                            <div class="layui-tab" lay-filter="shopee_acct_tab_filter">
                                <ul class="layui-tab-title">
                                    <li class="layui-this" lay-id="1">数量(<span id="shopeeAccount_colLen"></span>)</li>
                                    <!-- <li lay-id="2">7天内到期域名(<span id="shopee_acct_domain_overdue_number"></span>)</li> -->
                                </ul>
                            </div>
                            <div class="layui-form importPart ml10">
                                <permTag:perm funcCode="store_auth_excel_shopeeStore">
                                    <div class="w100">
                                        <select name="downloadType" lay-filter="shopeeAcct_downloadType" lay-search>
                                            <option value="">下载模板</option>
                                            <option value="addStore">新增店铺</option>
                                            <option value="editStore">修改店铺</option>
                                            <option value="authInfo">授权信息</option>
                                            <!-- <option value="oldPresaleTpl">线上预售额度配置</option> -->
                                            <option value="newPresaleTpl">店铺预售规则配置</option>
                                        </select>
                                    </div>
                                    <a class="layui-btn layui-btn-sm layui-btn-danger ml10" href="javascript:;" id="shopeeAccountExportBtn">导入excel</a>
                                </permTag:perm>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline" id="shopee_acct_getStoreToken_view"></div>
                                <div class="layui-input-inline">
                                    <span class="layui-btn layui-btn-sm hidden" id="shopee_importAuthInfo">导入授权信息</span>
                                    <span class="layui-btn layui-btn-sm hidden" id="shopee_importEditStore">修改店铺</span>
                                    <!-- <span class="layui-btn layui-btn-sm hidden" id="shopee_importOldPresaleConfig">线上预售额度配置</span> -->
                                    <span class="layui-btn layui-btn-sm hidden" id="shopee_importNewPresaleConfig">店铺预售规则配置</span>
                                </div>
                                <!-- <permTag:perm funcCode="set_preSale_limit_shopeeStore">
                                    <div class="layui-input-inline">
                                        <button class="layui-btn layui-btn-sm layui-btn-normal"
                                        id="shopee_set_preSale_limit">设置预售上限</button>
                                    </div>
                                </permTag:perm> -->
                                <div class="layui-input-inline">
                                    <button class="layui-btn layui-btn-sm"
                                    id="shopee_getstoreAddrInfo">获取店铺地址</button>
                                </div>
                                <permTag:perm funcCode="chat_auth_shopeeStore">
                                    <div class="layui-input-inline">
                                        <button class="layui-btn layui-btn-sm"
                                        id="shopee_getAuthUrl">chat授权</button>
                                    </div>
                                </permTag:perm>
                                <permTag:perm funcCode="ads_auth_shopeeStore">
                                    <div class="layui-input-inline">
                                        <button class="layui-btn layui-btn-sm"
                                        id="shopee_getAdsAuthUrl">广告账户授权</button>
                                    </div>
                                </permTag:perm>
                                <div class="layui-input-inline">
                                    <button class="layui-btn layui-btn-sm"
                                    id="shopee_syncShopeeListing">同步listing</button>
                                </div>
                                <div class="layui-input-inline w150 layui-form">
                                    <select name="hello" lay-filter="shopeeAcctBatchOper" lay-search>
                                        <option value="" disabled selected>批量操作</option>
                                        <%--<option value="3">修改销售员</option>
                                        <option value="4">修改客服</option>--%>
                                        <option value="3">修改信息</option>
                                        <!-- <permTag:perm funcCode="order_download_shopeeStore">
                                            <option value="5">开启订单下载</option>
                                            <option value="6">关闭订单下载</option>
                                        </permTag:perm> -->
                                        <!-- <option value="7">修改图片域名</option> -->
                                        <option value="11">批量自动删除</option>
                                        <permTag:perm funcCode="item_boost_shopeeStore">
                                            <option value="8">同步boost</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="shopeeBatchEnableAcctStatus">
                                            <option value="9">批量启用店铺</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="shopeeBatchUnableAcctStatus">
                                            <option value="10">批量停用店铺</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="shopeeBatchAddStoreTags">
                                            <option value="12">批量修改店铺标签</option>
                                        </permTag:perm>
                                    </select>
                                </div>
                                <div class="layui-input-inline">
                                    <permTag:perm funcCode="editShopeeAcctBtn">
                                        <button class="layui-btn layui-btn-sm layui-btn-normal" id="addShopeeInfo" type="button">添加shopee账号基本信息</button>
                                        <input type="file" id="addShopeeInfoByImportFile" hidden>
                                    </permTag:perm>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="shopeeTable" lay-filter="shopeeTable"></table>
                    <script type="text/html" id="shopeeAcctStatusTpl">
                        {{# if(d.status == false){ }}
                        <font color="red">已停用</font>
                        {{# } else { }}
                        已启用
                        {{# } }}
                    </script>
                    <!--订单下载状态的开启和关闭-->
                    <!-- <script type="text/html" id="orderDownloadStatusTemplet">
                        <div class="layui-form-item">
                            <permTag:perm funcCode="order_download_shopeeStore">
                                {{# if(d.orderDownloadStatus){ }}
                                <input type="checkbox" lay-skin="switch" lay-text="开启|关闭"
                                    lay-filter="orderDownloadStatus" checked>
                                {{# }else{ }}
                                <input type="checkbox" lay-skin="switch" lay-text="开启|关闭"
                                    lay-filter="orderDownloadStatus">
                                {{# } }}
                                <div style="display: none">{{d.id}}</div>
                            </permTag:perm>
                            <permTag:lacksPerm funcCode="order_download_shopeeStore">
                                {{# if(d.orderDownloadStatus){ }}
                                <input type="checkbox" lay-skin="switch" lay-text="开启|关闭"
                                    lay-filter="orderDownloadStatus" checked disabled>
                                {{# }else{ }}
                                <input type="checkbox" lay-skin="switch" lay-text="开启|关闭"
                                    lay-filter="orderDownloadStatus" disabled>
                                {{# } }}
                            </permTag:lacksPerm>
                        </div>
                    </script> -->
                    <!--处理shopee店铺同步时间-->
                    <!-- <script type="text/html" id="shopeeLastSyncTime">
                        {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
                    </script> -->
                    <!--处理shopee店铺同步状态-->
                    <script type="text/html" id="shopeeSyncStatus">
                        <span style="">
                            {{# if(d.syncStatus == 1){ }}
                            <span class="layui-skyblue">同步中</span>
                            {{# }else if (d.syncStatus == 2) { }}
                            <span class="layui-skyblue">同步中</span>
                            {{# }else if (d.syncStatus == 3) { }}
                            <span class="layui-green">同步成功</span>
                            {{# }else if (d.syncStatus == 4) { }}
                            <span class="layui-gray">同步失败</span>
                            {{# }else { }}
                            <span class="layui-orange">未同步</span>
                            {{# } }}
                        </span>
                        <br>
                        <span>{{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}</span>
                    </script>
                    <!-- 工具条模板,写在script里面 -->
                    <script type="text/html" id="shopeeTableBar">
                        <permTag:perm funcCode="editShopeeAcctBtn">
                            {{# if(d.siteId){ }}
                            <a class="layui-btn layui-btn-xs" lay-event="auth">重新授权</a><br />
                            {{# }else{ }}
                            <a class="layui-btn layui-btn-xs" lay-event="auth">授权</a><br />
                            {{# } }}
                            <a class="layui-btn layui-btn-xs" lay-event="edit"> 编辑 </a><br />
                            <a class="layui-btn layui-btn-xs" lay-event="storeTagList"> 店铺标签 </a><br />
                        </permTag:perm>
                        <a class="layui-btn layui-btn-xs" lay-event="syncShopeeDiscount"> 同步促销 </a><br />
                            <permTag:perm funcCode="shopeeCheckAccessToken">
                              <a class="layui-btn layui-btn-xs" lay-event="checkAccessToken">查看授权</a>
                            </permTag:perm>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- shopee添加基本信息模态框内容 -->
<script type="text/html" id="addShopeeInfoLayer">
    <div style="padding:20px">
        <form action="" class="layui-form layui-form-pane" id="shopeeSalesPlatAccountAddForm">
            <div id="shopeeAcctReuseDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-xs" lay-submit="" lay-filter="reuseShopeeAcct">启用店铺</button>
            </div>
            <div id="shopeeAcctDelDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-danger layui-btn-xs" lay-submit="" lay-filter="delShopeeAcct">
                    停用店铺
                </button>
            </div>

            <input type="hidden" name="platCode" value="shopee">
            <input type="hidden" name="acctBaseId">
            <input type="hidden" name="acctDetailId">

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">店铺名称</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="storeAcct" required lay-verify="required" placeholder="请输入店铺名称"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="salesSite" lay-verify="required" class="layui-select" lay-search>
                            <option value="">选择站点</option>
                            <c:forEach items="${shopeeSites}" var="shopeeSite">
                                <option value="${shopeeSite.getCode()}">${shopeeSite.getName()}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                  <label class="layui-form-label">发货仓库</label>
                  <div class="layui-input-inline" style="width:300px">
                    <select name="shippingWarehouseId" class="layui-select" id="addShopeeInfoLayer_shippingWarehouseId">
                    </select>
                  </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">品牌</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="brand" placeholder="请输入品牌" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">店铺ID</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="siteId" placeholder="请输入店铺ID" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">PartnerID</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="sellerId" placeholder="请输入PartnerID" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">Secret Key</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="secretKey" placeholder="请输入Secret Key" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">销售员</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="salespersonId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">客服</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="customServicerId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">销售主管</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="sellLeaderId" class="layui-select" lay-search>
                            <option></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">税号</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="taxNumber" placeholder="税号"
                        class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">shopee组长</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="leaderId" class="layui-select" lay-search>
                            <option></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">欧盟税号</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="eoriNumber" placeholder="请输入欧盟税号"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea type="text" name="acctBaseRemark" placeholder="请输入备注内容" class="layui-textarea"></textarea>
                </div>
            </div>

            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="addShopeeAcct" id="addShopeeAcct">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/configuration/store/shopeeAccount.js"></script>
<script src="${ctx}/static/layui/layui-xtree.js?v=${ver}"></script>
<script src="${ctx}/static/util/we.js"></script>
<script src="${ctx}/static/UploadImage.js"></script>

<script type="text/html" id="editShopeeSalesPersonLayer">
    <div class="p20">
        <form action="" class="layui-form" id="editShopeeSalesPersonForm">
            <div class="layui-form-item">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="salespersonId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">shopee组长</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="leaderId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">销售主管</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="sellLeaderId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">客服专员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="customServicerId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>


<!-- shopee 鉴权 -->
<script type="text/html" id="shopeeAuthLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="shopeeAuthForm">
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">进入下方链接：登录shopee账号，点击YES同意授权。复制网页地址栏中的shop_id参数</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="authUrl" onclick="var self = this;window.open(self.value)"
                        style="cursor: pointer;color:blueviolet">
                </div>
            </div>
            <%-- <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤二：填入获取的shop_id，点击保存，即可成功授权</label>
                <div class="layui-input-block">
                    <textarea type="text" name="shopId" placeholder="请输入shopId" class="layui-input"></textarea>
                </div>
            </div> --%>
        </form>
    </div>
</script>

<script type="text/html" id="editShopeeDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editShopeeDomainForm">
            <div class="layui-inline-item">
                <label class="layui-form-label">域名</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="domainId" lay-verify="required" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="batchUpdateAcctCurrencyLayer">
    <div class="p20">
        <form action="" class="layui-form " id="batchUpdateAcctCurrencyForm">
            <div class="layui-inline">
                <label class="layui-form-label">币种</label>
                <div class="layui-input-inline" style="width:300px">
                    <select type="text" name="currency" class="layui-select" lay-search>
                        <option value="">请选择</option>
                        <option value="CNY">CNY</option>
                        <option value="USD">USD</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" type="submit" lay-submit="" lay-filter="updateAcctCurrency"
                        id="updateAcctCurrency">确定
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary" id="updateAcctCurrencyReset">取消</button>
                </div>
            </div>
        </form>
    </div>
</script>


<%-- shopee表格-自动刊登展示 --%>
<script type="text/html" id="shopee_autoHandle">
    <div>
        <div>{{d.autoDelete ? '已开启': '已关闭' }}</div>
        <!-- {{# if(d.autoPublishCateIds){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="hasSet">已设置</span>
        {{# }else{ }}
        <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="notSet">未设置</span>
        {{# } }} -->
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="autoDelSet">设置</span>
    </div>
</script>

<!-- shopee表格-mall店铺 -->
<script type="text/html" id="shopeeAcct_mall_store">
    <div>
        {{# if(d.shopIsMall == true ){ }}
        <div>已开启</div>
        {{# } }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="setMallStore">设置</span>
    </div>
</script>

<%-- shopee表格-预售 --%>
<script type="text/html" id="shopeeAcct_presale_tpl">
    <div>
        {{# if(d.shopeePreOrderConfigStatus === 1 ){ }}
        <div>已开启</div>
        {{# }else if(d.shopeePreOrderConfigStatus === 0){ }}
        <div>已取消</div>
        {{# }else if(d.shopeePreOrderConfigStatus === 2){ }}
        <div>已暂停</div>
        {{# } }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="setPreSale">设置</span>
    </div>
</script>

<!-- 自动上传视频 -->
<script type="text/html" id="shopee_autoUploadVideo_td">
    <div>
        <div>{{d.autoUploadVideo ? '已开启': '已关闭' }}</div>
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="autoUploadVideoSet">设置</span>
    </div>
</script>

 <!-- shopee表格-V1授权到期时间  V2授权到期时间--%> -->
<script type="text/html" id="shopeeVersionsAuthExpireTime">
    <div>
        {{# if(d.authExpireTime){ }}
        <div>V1: {{d.authExpireTime}}</div>
        {{# } }}
        {{# if(d.authTime){ }}
        <div>V2: {{d.authTime}}</div>
        {{# } }}
    </div>
</script>

<%-- shopee未/已设置自动刊登弹框 --%>
<script type="text/html" id="shopee_setedLayer">
    <div style="padding:20px;" id="shopee_setedContainer">
    </div>
</script>
<script type="text/html" id="shopee_setedContainerTpl">
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>每日删除</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form">
                <input type="radio" name="autoDelete" value="false" title="关闭" {{d.autoDelete != undefined && !d.autoDelete ? 'checked' : ''}}>
                <input type="radio" name="autoDelete" value="true" title="开启" {{d.autoDelete != undefined && d.autoDelete ? 'checked' : ''}}>
            </div>
            <span>针对未触发侵权或禁售的listing</span>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>每天删除数量</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div style="margin: 0 10px;">
                <input type="number" class="layui-input" max="500" name="autoDeleteNum"
                    value="{{d.autoDeleteNum != undefined ? d.autoDeleteNum : ''}}" oninput="if(value>500)value=500">
            </div>
            <span>(最大500,该数量不包含侵权与禁售)</span>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>刊登时间</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form">
                <input type="radio" name="autoDeleteGreatListingTime" value="15" title="大于15" {{d.autoDeleteGreatListingTime && d.autoDeleteGreatListingTime== 15 ? 'checked' : ''}}>
                <input type="radio" name="autoDeleteGreatListingTime" value="30" title="大于30" {{d.autoDeleteGreatListingTime && d.autoDeleteGreatListingTime== 30 ? 'checked' : ''}}>
                <input type="radio" name="autoDeleteGreatListingTime" value="50" title="大于50" {{d.autoDeleteGreatListingTime && d.autoDeleteGreatListingTime== 50 ? 'checked' : ''}}>
                <input type="radio" name="autoDeleteGreatListingTime" value="60" title="大于60" {{d.autoDeleteGreatListingTime && d.autoDeleteGreatListingTime== 60 ? 'checked' : ''}}>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>销量校验</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div style="display:flex;line-height:32px;width:170px;margin-right:20px;" class="layui-form">
                <select id="autoDeleteSalesType_shopee" name="autoDeleteSalesType" lay-filter="autoDeleteSalesType_shopee_Filter" lay-search>
                    <option value="">请选择</option>
                    <option value="1" {{d.autoDeleteSalesType !=undefined && d.autoDeleteSalesType == 1 ? 'selected' : ''}}>30天销量=0</option>
                    <option value="2" {{d.autoDeleteSalesType !=undefined && d.autoDeleteSalesType == 2 ? 'selected' : ''}}>60天销量=0</option>
                    <option value="3" {{d.autoDeleteSalesType !=undefined && d.autoDeleteSalesType == 3 ? 'selected' : ''}}>90天销量=0</option>
                </select>
            </div>
            <div style="display:flex;line-height:32px;"  class="layui-form">
                <select id="historySalesType_shopee" name="historySalesType" lay-filter="historySalesType_shopee_Filter" lay-search>
                    <option value="">请选择</option>
                    <option value="1" {{d.historySalesType !=undefined && d.historySalesType==1 ? 'selected' : ''}}>历史销量大于0不删除</option>
                    <option value="2" {{d.historySalesType !=undefined && d.historySalesType==2 ? 'selected' : ''}}>历史销量大于0删除</option>
                </select>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>listing浏览量<</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form">
                <input class="layui-input" placeholder="非必填，支持填入正数" name="autoDeleteViewLt"value="{{d.autoDeleteViewLt != undefined ? d.autoDeleteViewLt : ''}}" onkeypress="commonKeyPressInputPositiveInt(event)">
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>listing收藏量<</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form">
                <input class="layui-input" placeholder="非必填，支持填入正数" name="autoDeleteLikeLt"value="{{d.autoDeleteLikeLt != undefined ? d.autoDeleteLikeLt : ''}}" onkeypress="commonKeyPressInputPositiveInt(event)">
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>侵权删除</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form">
                <input type="radio" name="autoDeleteItemByTort" value="1" title="开启" {{d.autoDeleteItemByTort != undefined && d.autoDeleteItemByTort ? 'checked' : ''}}>
                <input type="radio" name="autoDeleteItemByTort" value="0" title="关闭" {{d.autoDeleteItemByTort != undefined && !d.autoDeleteItemByTort ? 'checked' : ''}}>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>销量校验</strong></div>
        </div>
        <div class="layui-form">
            <div class="disflex">
                <select name="autoDeleteItemByTortSalesType" lay-search>
                    {{# if(d.isBatch){ }}
                    <option value="">请选择</option>
                    {{# } }}
                    <option value="7" {{d.autoDeleteItemByTortSalesType !=undefined && d.autoDeleteItemByTortSalesType == 7 ? 'selected' : ''}}>7天销量</option>
                    <option value="30" {{d.autoDeleteItemByTortSalesType !=undefined && d.autoDeleteItemByTortSalesType == 30 ? 'selected' : ''}}>30天销量</option>
                    <option value="60" {{d.autoDeleteItemByTortSalesType !=undefined && d.autoDeleteItemByTortSalesType == 60 ? 'selected' : ''}}>60天销量</option>
                    <option value="90" {{d.autoDeleteItemByTortSalesType !=undefined && d.autoDeleteItemByTortSalesType == 90 ? 'selected' : ''}}>90天销量</option>
                </select>
                <div class="w50 taCenter" style="line-height: 32px;">&le;</div>
                <input class="layui-input" name="autoDeleteItemByTortSalesLte" onblur="shopeeStoreValidateSales(event)" placeholder="仅支持[0,20]内整数" value="{{d.autoDeleteItemByTortSalesLte != undefined ? d.autoDeleteItemByTortSalesLte : ''}}"/>
            </div>
            <div class="mt10">
                <select name="deleteItemByTortIfHistorySalesGtZero" lay-search>
                    {{# if(d.isBatch){ }}
                    <option value="">请选择</option>
                    {{# } }}
                    <option value="false" {{d.deleteItemByTortIfHistorySalesGtZero !=undefined && d.deleteItemByTortIfHistorySalesGtZero == false ? 'selected' : ''}}>历史销量大于0不删除</option>
                    <option value="true" {{d.deleteItemByTortIfHistorySalesGtZero !=undefined && d.deleteItemByTortIfHistorySalesGtZero == true ? 'selected' : ''}}>历史销量大于0删除</option>
                </select>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>禁售删除</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form">
                <input type="radio" name="autoDeleteItemByProhibit" value="1" title="开启" {{d.autoDeleteItemByProhibit != undefined && d.autoDeleteItemByProhibit ? 'checked' : ''}}>
                <input type="radio" name="autoDeleteItemByProhibit" value="0" title="关闭" {{d.autoDeleteItemByProhibit != undefined && !d.autoDeleteItemByProhibit ? 'checked' : ''}}>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>销量校验</strong></div>
        </div>
        <div class="layui-form">
            <div class="disflex">
                <select name="autoDeleteItemByProhibitSalesType" lay-search>
                    {{# if(d.isBatch){ }}
                   <option value="">请选择</option> 
                   {{# } }}
                    <option value="7" {{d.autoDeleteItemByProhibitSalesType !=undefined && d.autoDeleteItemByProhibitSalesType == 7 ? 'selected' : ''}}>7天销量</option>
                    <option value="30" {{d.autoDeleteItemByProhibitSalesType !=undefined && d.autoDeleteItemByProhibitSalesType == 30 ? 'selected' : ''}}>30天销量</option>
                    <option value="60" {{d.autoDeleteItemByProhibitSalesType !=undefined && d.autoDeleteItemByProhibitSalesType == 60 ? 'selected' : ''}}>60天销量</option>
                    <option value="90" {{d.autoDeleteItemByProhibitSalesType !=undefined && d.autoDeleteItemByProhibitSalesType == 90 ? 'selected' : ''}}>90天销量</option>
                </select>
                <div class="w50 taCenter" style="line-height: 32px;">&le;</div>
                <input class="layui-input" name="autoDeleteItemByProhibitSalesLte" onblur="shopeeStoreValidateSales(event)" placeholder="仅支持[0,20]内整数" value="{{d.autoDeleteItemByProhibitSalesLte != undefined ? d.autoDeleteItemByProhibitSalesLte : ''}}"/>
            </div>
            <div class="mt10">
                <select name="deleteItemByProhibitIfHistorySalesGtZero" lay-search>
                    {{# if(d.isBatch){ }}
                    <option value="">请选择</option>
                    {{# } }}
                    <option value="false" {{d.deleteItemByProhibitIfHistorySalesGtZero !=undefined && d.deleteItemByProhibitIfHistorySalesGtZero == false ? 'selected' : ''}}>历史销量大于0不删除</option>
                    <option value="true" {{d.deleteItemByProhibitIfHistorySalesGtZero !=undefined && d.deleteItemByProhibitIfHistorySalesGtZero == true ? 'selected' : ''}}>历史销量大于0删除</option>
                </select>
            </div>
        </div>
    </div>
    <!-- <hr /> -->
    <!-- <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>自动刊登</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form">
                <input type="radio" name="autoPublish" value="true" title="开启" {{d.autoPublish != undefined && d.autoPublish ? 'checked' :''}}>
                <input type="radio" name="autoPublish" value="false" title="关闭"  {{d.autoPublish != undefined && !d.autoPublish ? 'checked' :''}}>
            </div>
            <div style="display:flex;line-height:32px;">
                <span>每天刊登</span>
                <div style="margin: 0 10px;">
                    <input type="number" class="layui-input" max="1000" name="autoPublishNum"
                        value="{{d.autoPublishNum || ''}}" oninput="if(value>1000)value=1000">
                </div>
                <span>listing.(最大1000)</span>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>开始时间</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form" style="width:400px;">
                <input type="number" class="layui-input" name="autoListingTime" value="{{d.autoListingTime==undefined ? '': d.autoListingTime}}" min="0" max="23" oninput="if(value>23)value=23">
            </div>
            <div style="display:flex;line-height:32px;padding-left:5px;">
                <span>时(0-23之间,刊登开始时间)</span>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>刊登间隔</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form" style="width:400px;">
                <input type="number" class="layui-input" name="autoListingIntervalTime" value="{{d.autoListingIntervalTime ==undefined? '': d.autoListingIntervalTime}}" min="1" max="10" oninput="if(value>10)value=10">
            </div>
            <div style="display:flex;line-height:32px;padding-left:5px;">
                <span>分(1-10之间,Listing刊登间隔)</span>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>折扣促销</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form" style="width:400px;">
                <select name="ifPromotion" lay-filter="ifPromotionFilter" lay-search>
                    <option value="">请选择</option>
                    <option value="true" {{d.ifPromotion != undefined && d.ifPromotion ? 'selected' : ''}}>设置</option>
                    <option value="false" {{d.ifPromotion != undefined && !d.ifPromotion ? 'selected' : ''}}>不设置</option>
                </select>
            </div>
            <div style="display:flex;line-height:32px;padding-left:5px;">
                <span>是否设置折扣促销</span>
            </div>
        </div>
    </div>
    <div class="shopeeStyle {{d.ifPromotion ? '': 'disNIm'}}">
        <div class="shopeeStyle_label">
            <div><strong>促销设置</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form" style="width:400px;">
                <select name="ifPromotionIds" lay-filter="ifPromotionIds" lay-search>
                  {{# if(d.promotionIds && d.promotionIds.split(",").length>0){ }}
                    <option value="true">自动设置</option>
                    <option value="false" selected>手动设置</option>
                  {{# }else{ }}
                    <option value="true" selected>自动设置</option>
                    <option value="false">手动设置</option>
                  {{# } }}
                </select>
            </div>
            <div style="display:flex;line-height:32px;padding-left:5px;">
                <span>批量刊登只能自动</span>
            </div>
        </div>
    </div>
    <div class="shopeeStyle ifPromotionIdsIsTrue {{d.ifPromotion ? '': 'disNIm'}}">
        <div class="shopeeStyle_label">
            <div><strong>促销活动</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form" style="width:400px;">
                <select name="promotionIds"
                    xm-select="shopeeAccount_promotionIds"
                    lay-filter="shopeeAccount_promotionIds"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                >
                {{#  layui.each(d.promotionData, function(index, item){ }}
                  {{# if(d.promotionIds){ }}
                    {{# if(d.promotionIds.split(",").includes(String(item.discountId))){ }}
                    <option value="{{item.discountId}}" selected>{{item.discountName}}</option>
                    {{# }else{ }}
                    <option value="{{item.discountId}}">{{item.discountName}}</option>
                    {{# } }}
                  {{# }else{ }}
                  <option value="{{item.discountId}}">{{item.discountName}}</option>
                  {{# } }}
                {{#  }) }}
                </select>
            </div>
            <div style="display:flex;line-height:32px;padding-left:5px;">
                <span>最多只能选5个</span>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>折扣捆绑</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form" style="width:400px;">
                <select name="ifBundleDeal" lay-filter="ifBundleDealFilter" lay-search>
                    <option value="">请选择</option>
                    <option value="true" {{d.ifBundleDeal != undefined && d.ifBundleDeal ? 'selected' : ''}}>设置</option>
                    <option value="false" {{d.ifBundleDeal != undefined && !d.ifBundleDeal ? 'selected' : ''}}>不设置</option>
                </select>
            </div>
            <div style="display:flex;line-height:32px;padding-left:5px;">
                <span>是否设置捆绑销售促销</span>
            </div>
        </div>
    </div>
    <div class="shopeeStyle  {{d.ifBundleDeal ? '': 'disNIm'}}">
        <div class="shopeeStyle_label">
            <div><strong>捆绑设置</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form" style="width:400px;">
                <select name="ifBundleDealIds" lay-filter="ifBundleDealIds" lay-search>
                  {{# if(d.bundleDealIds && d.bundleDealIds.split(",").length>0){ }}
                    <option value="true">自动设置</option>
                    <option value="false" selected>手动设置</option>
                  {{# }else{ }}
                    <option value="true" selected>自动设置</option>
                    <option value="false">手动设置</option>
                  {{# } }}
                </select>
            </div>
            <div style="display:flex;line-height:32px;padding-left:5px;">
                <span>批量刊登只能自动</span>
            </div>
        </div>
    </div>
    <div class="shopeeStyle ifBundleDealIdsIsTrue {{d.ifBundleDeal ? '': 'disNIm'}}">
        <div class="shopeeStyle_label">
            <div><strong>捆绑活动</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form" style="width:400px;">
                <select name="bundleDealIds"
                    xm-select="shopeeAccount_bundleDealIds"
                    lay-filter="shopeeAccount_bundleDealIds"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                >
                {{#  layui.each(d.bundleDealData, function(index, item){ }}
                  {{# if(d.bundleDealIds){ }}
                    {{# if(d.bundleDealIds.split(",").includes(String(item.bundleDealId))){ }}
                    <option value="{{item.bundleDealId}}" selected>{{item.bundleDealName}}</option>
                    {{# }else{ }}
                    <option value="{{item.bundleDealId}}">{{item.bundleDealName}}</option>
                    {{# } }}
                  {{# }else{ }}
                  <option value="{{item.bundleDealId}}">{{item.bundleDealName}}</option>
                  {{# } }}
                {{#  }) }}
                </select>
            </div>
            <div style="display:flex;line-height:32px;padding-left:5px;">
                <span>最多只能选5个</span>
            </div>
        </div>
    </div>
    <div class="shopeeStyle" id="shopee_platform_logisticsIdStr">
        <div class="shopeeStyle_label">
            <div><strong>平台物流</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form" style="width:400px;">
                <select name="logisticsIdStr"
                    xm-select="shopeeAccount_logisticsIdStr"
                    lay-filter="shopeeAccount_logisticsIdStr"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                >
                {{#  layui.each(d.logisticData, function(index, item){ }}
                  {{# if(d.logisticsIds){ }}
                    {{# if(d.logisticsIds.split(",").includes(String(item.logisticsChannelId))){ }}
                    <option value="{{item.logisticsChannelId}}" selected>{{item.logisticsChannelName}} -- {{item.logisticsChannelId}}</option>
                    {{# }else{ }}
                    <option value="{{item.logisticsChannelId}}">{{item.logisticsChannelName}} -- {{item.logisticsChannelId}}</option>
                    {{# } }}
                  {{# }else{ }}
                  <option value="{{item.logisticsChannelId}}">{{item.logisticsChannelName}} -- {{item.logisticsChannelId}}</option>
                  {{# } }}
                {{#  }) }}
                </select>
            </div>
        </div>
    </div>
    <div class="shopeeStyle">
        <div class="shopeeStyle_label">
            <div><strong>刊登分类</strong></div>
        </div>
        <div class="shopeeStyle_block">
            <div class="layui-form">
                <input type="radio" name="cateChange" value="all" title="全部类目" lay-filter="cateChangeFilter" {{d.autoPublishCateIds != undefined && d.autoPublishCateIds == 0 ? 'checked' : ''}}>
                <input type="radio" name="cateChange" value="appoint" title="指定类目" {{d.autoPublishCateIds != undefined ? d.autoPublishCateIds == 0 ? '' : 'checked' :''}} lay-filter="cateChangeFilter">
            </div>
            <div class="{{d.autoPublishCateIds == undefined ||d.autoPublishCateIds == 0 ? 'disN': ''}} shopeeCateTreeIsShow">
                <ul id="shopeeCateTree" class="ztree"></ul>
            </div>
        </div>
    </div> -->
</script>

<!-- 仅测试环境使用  复制亿品token-->
<script type="text/html" id="shopee_acct_getStoreToken_tpl">
    {{# if(d.isTest){ }}
        <span class="layui-btn layui-btn-sm" id="shopee_acct_getStoreToken_btn">复制亿品token</span>
  {{# } }}

</script>

<!-- 导入excel 显示不成功数据-->
<script type="text/html" id="shopee_acct_export_result_tpl">
    <table class="layui-table" id="shopee_acct_export_result"></table>
</script>

<!-- 预售设置 -->
<script type="text/html" id="shopee_acct_set_presale_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form action="" class="layui-form" id="shopee_acct_set_presale_form">
                <div class="layui-form-item">
                    <label class="layui-form-label">预售</label>
                    <div class="layui-input-block">
                        <input type="radio" name="status" value="1" title="开启预售">
                        <input type="radio" name="status" value="0" title="取消预售">
                        <input type="radio" name="status" value="2" title="暂停预售定时任务">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">固定预售Item ID</label>
                    <div class="layui-input-block">
                        <textarea name="itemIdsStr"class="layui-textarea" placeholder="支持填入多个，英文逗号隔开" rows="9"></textarea>
                    </div>
                </div>
                <!-- <div class="layui-form-item">
                    <label class="layui-form-label">第2优先预售条件:</label>
                    <div class="layui-input-block disflex">
                        <div class="disflex">
                            <div style="width: 142px;">
                                <select name="salesType" lay-search>
                                    <option value="">请选择销量</option>
                                    <option value="7">listing7天销量&ge;</option>
                                    <option value="30">listing30天销量&ge;</option>
                                    <option value="60">listing60天销量&ge;</option>
                                    <option value="90">listing90天销量&ge;</option>
                                </select>
                            </div>
                            <div>
                                <input type="text" class="layui-input w150" name="salesDay" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                            </div>
                        </div>
                        <div class="disflex ml20">
                            <div style="width: auto;padding: 4px 5px 0 0;">且到货天数</div>
                            <input type="text" name="secondLeftArrivalDay" class="layui-input w100" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                            <span>-</span>
                            <input type="text" name="secondRightArrivalDay" class="layui-input w100" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">第3优先预售条件:</label>
                    <div class="layui-input-block disflex">
                        <div style="width: auto;padding: 4px 5px 0 0;">基础模板审核通过天数&le;</div>
                        <input type="text" name="auditTimeDayLte" class="layui-input w150" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                        <div style="width: auto;padding: 4px 5px 0 0;" class="inline_block ml20">且到货天数</div>
                        <input type="text" name="thirdLeftArrivalDay" class="layui-input w100" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                        <span>-</span>
                        <input type="text" name="thirdRightArrivalDay" class="layui-input w100" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                    </div>
                </div> -->
            </form>
        </div>
    </div>
</script>

<!-- 自动上传视频设置 -->
<script type="text/html" id="shopee_acct_set_autoUploadVideo_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form action="" class="layui-form" id="shopeeAccount_autoUploadVideo_form">
                <div class="layui-form-item">
                    <label class="layui-form-label">自动上传视频</label>
                    <div class="layui-input-block">
                        <input type="radio" name="autoUploadVideo" value="false" checked title="关闭">
                        <input type="radio" name="autoUploadVideo" value="true" title="开启">
                    </div>
                </div>
                <div class="mb10" style="font-weight: bold">视频上传不处理条件设置：</div>
                <div class="layui-form-item">
                    <label class="layui-form-label labelSel"><select name="salesType" lay-search>
                        <!-- <option value="">请选择销量</option> -->
                        <option value="7">listing7天销量&le;</option>
                        <option value="30">listing30天销量&le;</option>
                        <option value="60">listing60天销量&le;</option>
                        <option value="90">listing90天销量&le;</option>
                    </select></label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="salesNum" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)" onblur="commonBlurInputNotNega(event)">
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label">刊登天数&le;:</label>
                    <div class="layui-input-block">
                        <input type="text" name="listingDayNums" class="layui-input " placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)" onblur="commonBlurInputNotNega(event)">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">浏览量+收藏量&le;:</label>
                    <div class="layui-input-block">
                        <input type="text" name="viewsPlusLikes" class="layui-input " placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)" onblur="commonBlurInputNotNega(event)">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">视频标签:</label>
                    <div class="layui-input-block">
                        <select name="videoTagList"
                            xm-select="shopeeAccount_autoUploadVideo_videoTagList"
                            lay-filter="shopeeAccount_autoUploadVideo_videoTagList"
                            xm-select-search
                            xm-select-search-type="dl"
                            xm-select-skin="normal"
                        ></select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">商品父SKU：</label>
                    <div class="layui-input-block disflex">
                        <textarea name="prodPSkuListStr"class="layui-textarea" placeholder="支持填入多个，英文逗号隔开"></textarea>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<!-- 店铺标签设置 -->
<script type="text/html" id="shopee_acct_set_storetag_tpl">
    <div class="layui-card">
        <div class="layui-card-body layui-form">
            <div id="shopee_acct_set_storetag_form">
                {{# layui.each(d.tagList, function(index, item){ }}
                    <input type="checkbox" name="storeTag" title="{{item.name}}" value="{{item.name}}" lay-skin="primary" {{ item.checked ? "checked" : "" }}>
                {{# }) }}
            </div>
        </div>
    </div>
</script>

<!-- 店铺标签批量设置 -->
<script type="text/html" id="shopee_acct_set_bacth_storetag_tpl">
    <div class="layui-card shopee_acct_set_bacth_storetag">
        <div class="layui-card-body layui-form">
            <div class="layui-form-item">
                <label class="layui-form-label">新增标签</label>
                <div class="layui-input-block disflex">
                   <select name="addStoreTagList"
                        xm-select="shopeeAccount_storetag_addStoreTagList"
                        lay-filter="shopeeAccount_storetag_addStoreTagList"
                        xm-select-search
                        xm-select-search-type="dl"
                        xm-select-skin="normal"
                    ></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">移除标签</label>
                <div class="layui-input-block disflex">
                   <select name="removeStoreTagList"
                        xm-select="shopeeAccount_storetag_removeStoreTagList"
                        lay-filter="shopeeAccount_storetag_removeStoreTagList"
                        xm-select-search
                        xm-select-search-type="dl"
                        xm-select-skin="normal"
                    ></select>
                </div>
            </div>
        </div>
    </div>
</script>

<!-- mall店铺设置 -->
<script type="text/html" id="shopee_acct_set_mallStore_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form action="" class="layui-form" id="shopee_acct_set_mallStore_form">
                <div class="layui-form-item">
                    <label class="layui-form-label">mall店铺</label>
                    <div class="layui-input-block">
                        <input type="radio" name="shopIsMall" value="true" title="开启" lay-filter="shopee_acct_set_mallStore_shopIsMall">
                        <input type="radio" name="shopIsMall" value="false" title="取消" lay-filter="shopee_acct_set_mallStore_shopIsMall">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">mall店铺品牌ID:</label>
                    <div class="layui-input-block disflex">
                        <input type="text" class="layui-input w150" name="brandId" onkeypress="commonKeyPressInputNotNega(event)" onblur="commonBlurInputNotNega(event)">
                        <div class="ml10">!未填写将取店铺品牌ID</div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">mall店铺品牌名:</label>
                    <div class="layui-input-block disflex">
                        <input type="text" class="layui-input w150" name="brandName">
                        <div class="ml10">!未填写将取店铺品牌名</div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div>mall品牌授权CNSC类目ID:
                        <span class="ml10">!未填写时全部类目均使用mall品牌，多个用，隔开</span>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"></label>
                    <div class="layui-input-block disflex">
                        <textarea name="platCateIdListStr" class="layui-textarea" onkeypress="commonKeyPressInputNumComma(event)" onblur="commonBlurInputNumComma(event)"></textarea>
                    </div>
                </div>
                <div class="layui-form-item" style="position: absolute;bottom: -66px;left: 450px;">
                    <div>
                        <input type="checkbox" name="updateItemBrandAndTitle" title="同步修改在线商品mall品牌" lay-skin="primary">
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<script type="text/html" id="shopee_acct_set_sexyImgFilte_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <div class="dis_flex">
                <button class="layui-btn layui-btn-sm layui-btn-normal" id="shopee_acct_set_sexyImgFilter_remove">批量删除</button>
                <button class="layui-btn layui-btn-sm layui-btn-normal" id="shopee_acct_set_sexyImgFilter_add">添加类目</button>
            </div>
            <table class="layui-table" id="shopee_acct_set_sexyImgFilter" lay-filter="shopee_acct_set_sexyImgFilter"></table>
        </div>
    </div>
</script>

<script type="text/html" id="shopee_acct_layer_work_develop_pl">
    <div class="layui-fluid" id="shopee_acct_LAY-iframe-itemCat">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
          <input type="text" id="shopee_acct_itemCat_input" />
          <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
        </div>
      </div>
    </div>
  </script>

  <!-- 设置预售占比 -->
  <script type="text/html" id="shopee_set_preSale_limit_layer">
    <div class="layui-card">
        <div class="layui-card-body">
            <h3>设置预售占比=预售已使用额度数量/（在线listing总数量-当日刊登成功lisitng数量）</h3>
            <div id="shopee_set_preSale_limit">
                <table class="layui-table" id="shopee_set_preSale_limit_table"></table>
            </div>
        </div>
    </div>
  </script>