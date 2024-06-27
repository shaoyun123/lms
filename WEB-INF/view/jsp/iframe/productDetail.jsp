<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <title>产品详情</title>

    <!-- css样式 -->
    <style lang="en">
        #LAY-iframe-productDetail .layui-table img{
            max-width: 150px;
        }
        #LAY-iframe-productDetail .layui-timeline-item {
            padding-bottom: 6px
        }

        #LAY-iframe-productDetail .wishImgInfo ul li {
            float: left;
            margin: 0 10px 10px 0
        }

        #LAY-iframe-productDetail .layui-card {
            border: 1px solid #eee
        }

        #LAY-iframe-productDetail .layui-card-header {
            background-color: #eee
        }
        #LAY-iframe-productDetail #wishTimeLineTree {
            position: fixed;
            z-index: 1000;
            margin-left:1000px;
            margin-top: -60px;
        }
        #LAY-iframe-productDetail #wishTimeLineTree li {
            padding:6px 15px;
        }
        #LAY-iframe-productDetail #wishTimeLineTree a,
        #LAY-iframe-productDetail #wishTimeLineTree i{
             color: #1e9fff; 
        }
        #LAY-iframe-productDetail .uniteWidth {
            width: 1100px;
        }
        #LAY-iframe-productDetail .selfImgIcon {
            color: red;
            width: 10px;
            display: inline-block;;
            font-size: 12px;
            padding-top: 40px;
        }
    </style>

    <%-- 引入js --%>
    <script src="${ctx}/static/tagsinput/tagsinput.js"></script>

    <!-- html内容 -->
    <div class="layui-fluid" id="LAY-iframe-productDetail">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12" id="productDetail_content">

            </div>
        </div>
    </div>

    <!-- 模板渲染 -->
    <script type="text/html" id="productDetail_tpl">
        <div class="layui-tab layui-tab-card">
            <ul class="layui-tab-title">
                <li class="layui-this">详情</li>
                <li>操作日志</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <div  id="wishTimeLineTree">
                        <ul>
                            <li data-id="productDetail_point1">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">基本信息</a>
                            </li>
                            <li data-id="productDetail_point2">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">主图</a>
                            </li>
                            <li data-id="productDetail_point3">
                            <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">辅图</a>    
                            </li>
                            <li data-id="productDetail_point4">
                                <i class="layui-icon layui-icon-tree"></i>
                                    <a href="javascript:;">视频</a>    
                            </li>
                            <li data-id="productDetail_point5">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">产品变种</a>
                            </li>
                        </ul>
                    </div>
                    <fieldset class="layui-elem-field layui-field-title site-demo-button" id="productDetail_point1">
                        <legend style="font-size:14px">基本信息</legend>
                    </fieldset>
                    <form action="" class="layui-form uniteWidth unEditProdTplForm">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90"><span class="red">*</span>商品父SKU</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input" name="pSku" value="{{ pSku }}" readonly>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90"><span class="red">*</span>开发专员</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input" value="{{ bizzOwner }}" readonly>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">责任人</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input" value="{{ responsor}}" readonly>
                                </div>
                            </div>
                            {{ if joomSensProd != undefined }}
                            <div class="layui-inline">
                                <label class="layui-form-label w90">Joom敏感货</label>
                                <div class="layui-input-inline">
                                    <select name="supportCateIds" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" 
                                       xm-select="joomSensitive" readonly>
                                        {{ each joomSensProd.split(',') jmv }}
                                            {{ if jmv != '' }}
                                            <option value="{{ jmv }}" selected disabled>{{jmv}}</option>
                                            {{ /if }}
                                        {{ /each}}
                                    </select>
                                </div>
                            </div>
                            {{ /if }}
                            <div class="layui-inline">
                                <label class="layui-form-label w90">供应商原图</label>
                                <div class="layui-input-inline">
                                    <input type="checkbox" {{ isSupplierOrigiImg ? 'checked' : '' }} lay-skin="primary" readonly>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">自拍图状态</label>
                                <div class="layui-input-inline">
                                    {{ if selfImgStatus == 0 }}
                                        <input type="text" class="layui-input" value="无自拍图" readonly>
                                    {{ /if }}
                                    {{ if selfImgStatus == 1 }}
                                        <input type="text" class="layui-input" value="有自拍图" readonly>
                                    {{ /if }}
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <!-- <label class="layui-form-label w90">类目</label>
                                <div class="layui-input-inline" style="width:858px">
                                    <input type="text" class="layui-input" value="{{ cateName }}" readonly>
                                </div> -->
                                <!-- {{ if showOaNewCate === 'true' }} -->
                                    
                                <!-- {{ else }} -->
                                    <label class="layui-form-label w90">类目</label>
                                    <div class="layui-input-inline" style="width:858px">
                                        <input type="text" class="layui-input" value="{{ cateName }}" readonly>
                                    </div>
                                <!-- {{ /if }} -->
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">新类目</label>
                                <div class="layui-input-inline" style="width:858px">
                                    <input type="text" class="layui-input" value="{{ prodPInfoCateOaDTO.cateTreeName }}" readonly>
                                </div> 
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">中文名称</label>
                                <div class="layui-input-inline" style="width:858px">
                                    <input type="text" class="layui-input" value="{{ cnTitle }}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">英文标题</label>
                                <div class="layui-input-inline" style="width:858px">
                                    <input type="text" class="layui-input" value="{{ enTitle }}" readonly>
                                </div>
                            </div>
                        </div>
<%--                        // 如果有新版关键词参数，则展示新版关键词编辑页面。否则展示旧版的--%>
                        {{ if assistInfo&&assistInfo.keywordCore }}
                        <div class="layui-form-item newKeyWordElem">
                            <label class="layui-form-label w90">关键词</label>
                            <div class="layui-input-block">
                                <span class="layui-badge layui-bg-blue ml10 mr10">数量:<i>{{assistInfo.keywordCore.split("|").length + assistInfo.keywordProdAttr.split("|").length + assistInfo.keywordFit.split("|").length + assistInfo.keywordExtra.split("|").length}}</i></span>
                                <div class="layui-col-md12 layui-col-lg12">
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="keywordContain" name="keywordCore">
                                            <div class="keywordTitle mb10">
                                                <span style="color: red">*</span>核心关键词
                                            </div>
                                            <div>
                                                <textarea class="layui-textarea keywordInp" style="height: 250px;">{{ assistInfo.keywordCore.replaceAll("|","\n") }}</textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="keywordContain" name="keywordProdAttr">
                                            <div class="keywordTitle mb10">
                                                <span style="color: red">*</span>产品属性词(材质/尺寸/颜色/形状/属性等)
                                            </div>
                                            <div>
                                                <textarea class="layui-textarea keywordInp" style="height: 250px;">{{ assistInfo.keywordProdAttr.replaceAll("|","\n") }}</textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="keywordContain" name="keywordFit">
                                            <div class="keywordTitle mb10">
                                                <span style="color: red">*</span>适用场景/范围/人群/用途
                                            </div>
                                            <div>
                                                <textarea class="layui-textarea keywordInp" style="height: 250px;">{{ assistInfo.keywordFit.replaceAll("|","\n") }}</textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="keywordContain" name="keywordExtra">
                                            <div class="keywordTitle mb10">
                                                <span style="color: red">*</span>补充词
                                            </div>
                                            <div>
                                                <textarea class="layui-textarea keywordInp" style="height: 250px;">{{ assistInfo.keywordExtra.replaceAll("|","\n") }}</textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item newKeyWordElem">
                            <div class="layui-col-md9 layui-col-lg9">
                                <label class="layui-form-label">特殊数量</label>
                                <div class="layui-input-block">
                                    <input type="text" name="specNumNew" placeholder="特殊的起卖量，如:5pairs、3pcs，不支持多个" class="layui-input" value="{{assistInfo.specNumNew}}">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item newKeyWordElem">
                            <div class="layui-col-md9 layui-col-lg9">
                                <label class="layui-form-label">适用机型</label>
                                <div class="layui-input-block">
                                    <input type="text" name="fitModel" class="layui-input" value="{{assistInfo.fitModel}}">
                                </div>
                            </div>
                        </div>
                        {{ else }}
                        <div class="oldKeyWordElem">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">适用对象1</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input" value="{{ appObject.split('|')[0] || '' }}" readonly>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">适用对象2</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input" value="{{ appObject.split('|')[1] || '' }}" readonly>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">适用对象3</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input" value="{{ appObject.split('|')[2] || '' }}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">特殊数量1</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input"  value="{{ specNum.split('|')[0] || '' }}" readonly>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">特殊数量2</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input"  value="{{ specNum.split('|')[1] || '' }}" readonly>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">特殊数量3</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input"  value="{{ specNum.split('|')[2] || '' }}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">关键词
                                <br/>
                                <span class="layui-badge layui-bg-blue">数量<i class="keywordCount">0</i></span>
                                </label>
                                <div class="layui-input-inline" style="width:280px">
                                    <textarea class="layui-textarea keywordGather" style="height:195px">{{ keyword }}</textarea>
                                </div>
                            </div>
                        </div>
                        </div>
                        {{  /if}}
<%--                        <div class="layui-form-item">--%>
<%--                            <div class="layui-inline">--%>
<%--                                <label class="layui-form-label w90">--%>
<%--                                      wish tags<br/>--%>
<%--                                      <span class="layui-badge layui-bg-blue">数量<i class="wishTagsCount">0</i></span>--%>
<%--                                </label>--%>
<%--                                <div class="layui-input-inline" style="width:858px">--%>
<%--                                    <div class="tagsinput-primary form-group">--%>
<%--                                        <input name="tagsinput" class="tagsinput" value="{{ tag }}">--%>
<%--                                    </div>--%>
<%--                                </div>--%>
<%--                            </div>--%>
<%--                        </div>--%>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">商品描述<br/>
                                    <span class="layui-badge layui-bg-blue copyTwoTextareaVal" style="cursor:pointer">一键复制</span>
                                </label>
                                <div class="layui-input-inline" style="width:858px">
                                    <textarea class="layui-textarea" name="prodDesc">{{ prodDesc }}</textarea>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">&nbsp;</label>
                                <div class="layui-input-inline" style="width:858px">
                                    <div>固定顺序描述,如使用步骤,可以为空</div>
                                    <textarea class="layui-textarea" name="fixDesc">{{ fixDesc }}</textarea>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">繁中标题</label>
                                <div class="layui-input-inline" style="width:858px">
                                    <input type="text" class="layui-input" value="{{ tradTitle }}">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">繁中描述
                                </label>
                                <div class="layui-input-inline" style="width:858px">
                                <textarea class="layui-textarea">{{ tradDesc }}</textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                    <fieldset class="layui-elem-field layui-field-title site-demo-button" id="productDetail_point2">
                        <legend style="font-size:14px">
                            主图
                            {{ if mainImages.length }}
                            <button class="layui-btn layui-btn-sm ml10" onclick="productDetail_copyAllImg('main')">复制主图URL</button>
                            {{  /if}}
                        </legend>
                    </fieldset>
                    <div style="overflow:hidden" class="wishImgInfo uniteWidth">
                        <ul class="productDetail-copyMainImg">
                            {{ each mainImages imgVal }}
                            <li>
                                <div style="border:1px solid #e6e6e6;width:170px">
                                {{ if imgVal.isWhite}}
                                <input type="checkbox" checked id="{{ imgVal.id }}">
                                {{ else }}
                                <input type="checkbox" id="{{ imgVal.id }}">
                                {{ /if }}
                                <label for="{{ imgVal.id }}">白底图</label>
                                <!-- {{ if imgVal.isClear}}
                                <input type="checkbox" checked id="{{ imgVal.id }}">
                                {{ else }}
                                <input type="checkbox" id="{{ imgVal.id }}">
                                {{ /if }}
                                <label for="{{ imgVal.id }}">清晰图</label> -->
                                {{ if imgVal.isNotSupplier}}
                                <input type="checkbox" checked id="{{ imgVal.id }}" name="isNotSupplier">
                                {{ else }}
                                <input type="checkbox" id="{{ imgVal.id }}" name="isNotSupplier">
                                {{ /if }}
                                <label for="{{ imgVal.id }}">非供图</label>
                                </div>
                                <div style="border:1px solid #e6e6e6;width:170px" class="imgContent">
                                    <!-- <div class="disflex"> -->
                                        <img src="${tplIVP}{{ imgVal.name }}!size=150x150" alt="{{ imgVal.prodPId }}" width='150' height='150' class="img_show_hide" />
                                        {{ if imgVal.isSelfImg}}
                                            <div class="selfImgIcon ml5">自拍图</div>
                                        {{ /if }}
                                    <!-- </div> -->
                                    <div style="justify-content: space-between;display:flex;">
                                        <span style="color:#1e9fff;cursor:pointer;" onclick="productDetail_copyImgUrl(this)">
                                        复制
                                        </span>
                                        <span style="color:#1e9fff;cursor:pointer;" onclick="productDetail_downloadImg(this)" data-name="{{ imgVal.name }}">下载</span>
                                    </div>
                                </div>
                            </li>
                            {{ /each }}
                        </ul>
                    </div>
                    <fieldset class="layui-elem-field layui-field-title site-demo-button" id="productDetail_point3">
                        <legend style="font-size:14px">
                            辅图
                            {{ if assistImgs.length }}
                                <button class="layui-btn layui-btn-sm ml10" onclick="productDetail_copyAllImg('assist')">复制辅图URL</button>
                            {{  /if}}
                        </legend>
                    </fieldset>
                    <div style="overflow:hidden"  class="wishImgInfo uniteWidth">
                        <ul class="productDetail-copyAssistImg">
                            {{ each assistImgs img2Val }}
                            <li>
                                <div style="border:1px solid #e6e6e6;width:170px">
                                    {{ if img2Val.isMust }}
                                    <input type="checkbox" checked id="{{ img2Val.id }}">
                                    {{ else }}
                                    <input type="checkbox" id="{{ img2Val.id }}">
                                    {{ /if}}
                                    <label for="{{ img2Val.id }}">必选图</label>
                                    <!-- {{ if img2Val.isClear }}
                                    <input type="checkbox" checked id="{{ img2Val.id }}">
                                    {{ else }}
                                    <input type="checkbox" id="{{ img2Val.id }}">
                                    {{ /if}}
                                    <label for="{{ img2Val.id }}">清晰图</label> -->
                                    {{ if img2Val.ifSize }}
                                    <input type="checkbox" checked id="{{ img2Val.id }}" name="isSize">
                                    {{ else }}
                                    <input type="checkbox" id="{{ img2Val.id }}" name="isSize">
                                    {{ /if}}
                                    <label for="{{ img2Val.id }}">尺寸图</label> 
                                </div>
                                <div style="border:1px solid #e6e6e6;width:170px">
                                    {{ if img2Val.isNotSupplier }}
                                    <input type="checkbox" checked id="{{ img2Val.id }}" name="isNotSupplier">
                                    {{ else }}
                                    <input type="checkbox" id="{{ img2Val.id }}" name="isNotSupplier">
                                    {{ /if}}
                                    <label for="{{ img2Val.id }}">非供图</label>
                                    {{ if img2Val.isWhite }}
                                    <input type="checkbox" checked id="{{ img2Val.id }}" name="isAmazon">
                                    {{ else }}
                                    <input type="checkbox" id="{{ img2Val.id }}" name="isAmazon">
                                    {{ /if}}
                                    <label for="{{ img2Val.id }}">亚马逊图</label>
                                </div>
                                <div style="border:1px solid #e6e6e6;width:170px" class="imgContent">
                                    <!-- <div class="disflex"> -->
                                        <img src="${tplIVP}{{ img2Val.name }}!size=150x150" alt="{{ img2Val.prodPId }}" width='150' height='150' class="img_show_hide" />
                                        {{ if img2Val.isSelfImg}}
                                            <div class="selfImgIcon ml5">自拍图</div>
                                        {{ /if }}
                                    <!-- </div> -->
                                    <div style="justify-content: space-between;display:flex;">
                                        <span style="color:#1e9fff;cursor:pointer;" onclick="productDetail_copyImgUrl(this)">
                                            复制
                                        </span>
                                        <span style="color:#1e9fff;cursor:pointer;" onclick="productDetail_downloadImg(this)" data-name="{{ img2Val.name }}">下载</span>
                                    </div>
                                </div>
                            </li>
                            {{ /each }}
                        </ul>
                    </div>
                    <fieldset class="layui-elem-field layui-field-title site-demo-button" id="productDetail_point4">
                        <legend style="font-size:14px">
                            视频
                            {{ if video.length }}
                            <button class="layui-btn layui-btn-sm ml10" onclick="productDetail_copyAllVideo()">复制视频URL</button>
                            {{  /if}}
                        </legend>
                    </fieldset>
                    <div style="overflow:hidden"  class="wishImgInfo uniteWidth">
                        <ul class="productDetail-copyVideo">
                            {{ each video videoItem }}
                            <li>
                                <div class="common_play_video" data-video="{{videoItem.location}}" style="position:absolute;background-color:rgba(0,0,0,0.1);width:150px;height:150px;cursor:pointer;">
                                    <i class="layui-icon layui-icon-play" style="font-size:40px;position:relative;left:55px;top:70px;color:#000;"></i>
                                </div>
                                <div style="border:1px solid #e6e6e6;width:150px">
                                    <img src="{{videoItem.picture }}!size=150x150" alt="{{ videoItem.videoname }}" data-video="{{videoItem.location}}" width='150' height='150'  />
                                </div>
                            </li>
                            {{ /each }}
                        </ul>
                    </div>
                    <fieldset class="layui-elem-field layui-field-title site-demo-button" id="productDetail_point5">
                        <legend style="font-size:14px">产品变种</legend>
                    </fieldset>
                    <div style="overflow:hidden" class="uniteWidth">
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>尺寸</th>
                                    <th>颜色</th>
                                    <th>款式</th>
                                    <th>重量(g)</th>
                                    <th>成本(¥)</th>
                                    <th>刊登警示(¥)</th>
                                    <th>在售</th>
                                    <th>有货</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{ each varients value}}
                                <tr>
                                    <td>{{ value.sSku }}<input type="hidden" name="prodSId" value="{{value.prodSId}}"></td>
                                    <td>{{ value.size }}</td>
                                    <td>{{ value.color}}</td>
                                    <td>{{ value.style}}</td>
                                    <td>{{ value.weight }}<input type="hidden" name="weight" value="{{value.weight}}"></td>
                                    <td><span class="canClickEl" onclick="tpl_listReferPrice({{value.id}},this)">{{ value.cost }}</span><input type="hidden" name="priced" value="{{value.priced}}"></td>
                                    <td>{{ value.listingWarnPrice}}</td>
                                    <td><div class="layui-form"><input type="checkbox" lay-skin="primary" {{ value.isSale ? 'checked' : '' }}  
                                       disabled></div></td>
                                    <td><div class="layui-form"><input type="checkbox" lay-skin="primary" {{ value.isOutOfStock ? '' :  'checked' }} disabled></div></td>
                                </tr>
                                <tr>
                                    <td colspan="9">
                                        {{include 'imgTemplate' value}}
                                    </td>
                                </tr>
                                {{ /each }}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div style="overflow:hidden">
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>操作人</th>
                                    <th>内容</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{ each detailLog v }}
                                <tr>
                                    <td>{{v.operTime| dateFormat 'yyyy-MM-dd hh:mm:ss'}}</td>
                                    <td>{{ v.operator }}</td>
                                    <td>{{ v.operDesc }}</td>
                                </tr>
                                {{ /each }}
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    </script>

    <script type="text/html" id="imgTemplate">
        <ul>
            {{ each varientImgs }}
                <li>
                    <div style="border:1px solid #e6e6e6;width:150px" class="imgContent">
                        <img src="${tplIVP}{{ $value.name }}!size=150x150" width='150' height='150' onerror="layui.admin.img_noFind()" class="img_show_hide" />
                        <div style="justify-content: space-between;display:flex;">
                            <span style="color:#1e9fff;cursor:pointer;" onclick="productDetail_copyImgUrl(this)" data-name="{{  $value.name }}">复制</span>
                            <span style="color:#1e9fff;cursor:pointer;" onclick="productDetail_downloadImg(this)" data-name="{{  $value.name }}">下载</span>
                        </div>
                    </div>
                </li>           
            {{ /each }}
        </ul>
    </script>

    <!-- js代码 -->
    <script>
        function renderProduct(id,pSku, options){
           layui.use(['admin','form','element','formSelects'],function(){
                var admin = layui.admin;
                form = layui.form,
                element = layui.element,
                formSelects = layui.formSelects;
                var obj = {}; //定义一个空对象 来接收需要存放的数据
                Promise.all([
                    commonReturnPromise({
                        type: "post",
                        url: ctx + "/prodTpl/getTplDetail.html",
                        params: { id: id, pSku: pSku },
                    }),
                    commonReturnPromise({
                        url: "/lms/aliexpressVideo/queryAliexpressVideoInfo",
                        type: "post",
                        contentType: "application/json",
                        params: JSON.stringify({ prodPIds: [id] }),
                    }),
                    ]).then(res => {
                    if (typeof res[0] === "string" && res[0].indexOf("不存在") > -1) {
                        layer.msg(res[0] || "商品详情不存在", { icon: 2 })
                        return true
                    }

                    var renderDetail = { showOaNewCate: options.showOaNewCate, ...res[0] }
                    id = renderDetail.id
                    for (var name in renderDetail) {
                        obj[name] = renderDetail[name]
                    }
                    obj.video = []
                    if(Array.isArray(res[1]) && res[1][0]){
                        obj.video =res[1][0].videos
                    }
                    admin.req({
                        //渲染日志
                        type: "post",
                        url: ctx + "/prodTpl/getTplOperLog.html",
                        dataType: "json",
                        data: { pid: id },
                        success: function (data) {
                            var detailLog = data.data
                            obj.detailLog = detailLog
                            var html = template("productDetail_tpl", obj)
                            $("#productDetail_content").html(html)
                            form.render("checkbox")
                            formSelects.render("joomSensitive")
                            anchorLocation()
                            // $(".tagsinput").tagsinput()
                            //wishtags数量统计
                            // var count1 = $(".tagsinput").val().split(",").length
                            // $(".wishTagsCount").text(count1)
                            //关键词数量统计
                            var count2 = $(".keywordGather").val()?.split("\n").length
                            $(".keywordCount").text(count2)
                        },
                    }) //渲染日志结束
                })     
            })
           
        }

        // template函数
        template.defaults.imports.dateFormat = function(datetime, fmt) {
                if (datetime) {
                    datetime = datetime.toString();
                    if (parseInt(datetime) == datetime) {
                        if (datetime.length == 10) {
                            datetime = parseInt(datetime) * 1000;
                        } else if (datetime.length == 13) {
                            datetime = parseInt(datetime);
                        }
                    }
                    datetime = new Date(datetime);
                    var o = {
                        "M+": datetime.getMonth() + 1, //月份
                        "d+": datetime.getDate(), //日
                        "h+": datetime.getHours(), //小时
                        "m+": datetime.getMinutes(), //分
                        "s+": datetime.getSeconds(), //秒
                        "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
                        "S": datetime.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                } else {
                    return "";
                }
        };
        
        //下载图片
        function productDetail_downloadImg(obj){
            var filedname = $(obj).attr('data-name');
            // var img = $(obj).parent().prev()[0];
            var img = $(obj).parent().parent('.imgContent').children('img');
            downLoadImg(img,filedname);
        }
        //复制图片地址
        function productDetail_copyImgUrl(obj){
            // var img = $(obj).parent().prev()[0];
            var img = $(obj).parent().parent('.imgContent').children('img');
            copyUrlOfImg(img);
        }

        // 只复制非供图以外的其他图片的URL
        function productDetail_copyAllImg(type){
            const typeClass = {
                main:'.productDetail-copyMainImg',
                assist: '.productDetail-copyAssistImg'
            }

            let imgArr  = []
            $(typeClass[type]).find('li').each(function(){
                let isNotSupplier = $(this).find('input[name=isNotSupplier]').prop('checked')
                if(!isNotSupplier){
                    let url = $(this).find('img').prop('src')
                    if (url.indexOf('!size=') > 0) {
                        url = url.substring(0, url.indexOf('!size='))
                    }
                    if (url) {
                        imgArr.push(url)
                    }
                }
            })
            if(imgArr.length){
                let imgStr = imgArr.join('\n')
                copyTxtToClipboard(imgStr,'textarea')
            }else{
                layui.layer.msg('暂无非供图以外的图片可复制')
            }     
        }

        // 一键复制视频URL
        function productDetail_copyAllVideo(){
            let videoUrlArr  = []
            $('.productDetail-copyVideo').find('li').each(function(){
                let url  =$(this).find('img').data('video')
                if (url) {
                    videoUrlArr.push(url)
                }
            })
            if(videoUrlArr.length){
                let videoUrlStr = videoUrlArr.join('\n')
                copyTxtToClipboard(videoUrlStr,'textarea')
            }
        }
        // 锚点定位函数
        function anchorLocation() {
            function AnchorPoint(id) {
                this.id = id;
            }
            $.extend(AnchorPoint.prototype, {
                init: function () {
                    this.bindEvents();
                },
                bindEvents: function () {
                    var btn = $('li[data-id="'+ this.id +'"]');
                    btn.on('click', $.proxy(this.handleClick, this));
                },
                handleClick: function () {
                    document.getElementById(this.id).scrollIntoView();
                }
            });
            $.each([1,2,3,4],function(i,v){
                new AnchorPoint('productDetail_point'+v).init();
            })
        }
        $('body').on('click','.copyTwoTextareaVal',function(){
                    var prodDescVal = $('textarea[name="prodDesc"]').val(),
                         fixDescVal = $('textarea[name="fixDesc"]').val();
                    var creatTextarea = document.createElement("textarea");
                    creatTextarea.value = prodDescVal +'\n' +fixDescVal;
                    document.body.appendChild(creatTextarea);
                    creatTextarea.select();
                    try {
                            var successful = document.execCommand('copy');
                            var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
                            layer.msg(msg);
                        } catch (err) {
                            layer.msg('该浏览器不支持点击复制到剪贴板');
                    }   
                    document.body.removeChild(creatTextarea);
                })
    </script>