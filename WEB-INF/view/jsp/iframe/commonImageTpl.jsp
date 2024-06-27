<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>模板图片</title>

<style>
  #common_image_container .layui-card-header .layui-form-checked[lay-skin="primary"] i {
    top: 18px;
    left: 10px;
  }
  #common_image_container .layui-card-header .layui-form-checkbox[lay-skin="primary"] i {
    top: 18px;
    left: 10px;
  }
  #common_image_container .layui-form-checkbox span {
    font-size: 12px;
    padding: 0 2px;
  }
  #common_image_container .common_image_container_grid_old {
    display: grid;
    grid-template-columns: repeat(auto-fill, 15.6%);
    gap: 0 10px;
  }
  #common_image_container .common_image_container_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 15.6%);
    gap: 0 10px;
  }
  #common_image_container .common_image_container_grid .common_image_container_grid_checkboxes{
    border: 1px dashed #aaa;
    padding: 2px;
    position: relative;
  }
  #common_image_container .common_image_container_grid .common_image_container_grid_checkboxItem {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px 2px;
  }
  #common_image_container .selfImgIcon {
    color: red;
    width: 10px;
    display: block;
    font-size: 12px;
    margin-left: 2px;
  }
  #common_image_container .choose-part {
    position: relative;
  }
  #common_image_container .title-part {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    color: #333;
    font-size: 16px;
    padding: 5px 0;
    background-color: #f4f0f0;
  }
  #common_image_container .showMore {
    font-size: 14px;
  }
  #common_image_container .serial-number{
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #5FB878;
    color: #fff;
    position: absolute;
    right: 5px;
    bottom: 10px;
    text-align: center;
    line-height: 18px;
    display: none;
  }
</style>

<div id="common_image_container"></div>
<!-- 模板图片 -->
<script type="text/html" id="common_image_tpl">
  {{# if(d.length){ }}
  <div class="layui-card layui-form">
    <div class="layui-tab">
      <ul class="layui-tab-title">
        {{# layui.each(d,function(elemIndex,elem){ }}
        <li class="{{elemIndex === 0 ? 'layui-this' : ''}}">{{elem.prodPSku}}</li>
        {{# }) }}
      </ul>
      <div class="layui-tab-content">
        {{# layui.each(d,function(elemIndex,elem){ }}
        <div class="layui-tab-item {{elemIndex === 0 ? 'layui-show' : ''}}">
      {{# if(d.platCode == 'aliexpress'){ }}
          <div class="layui-card-header disflex">
            <span>供应商原图</span>
            <input type="checkbox" name="isSupplierOrigiImg" lay-skin="primary" disabled {{elem.isSupplierOrigiImg ? 'checked':''}}>
          </div>
      {{# } }}
          <div >
            <div class="title-part">主图</div>
            <div style="margin-top: 15px;" class="common_image_container_grid">
              {{# layui.each(elem.mainImgs,function(index,item){ }}

              <div class="common_image_container_grid_checkboxes image-item">
                <div class="common_image_container_grid_checkboxItem">
                  <!-- <div><input type="checkbox" name="checkbox4" lay-skin="primary" title="清晰图" disabled {{item.isClear ? 'checked' : '' }} /></div> -->
                  <div><input type="checkbox" name="checkbox5" lay-skin="primary" title="非供图" disabled {{item.isNotSupplier ? 'checked' : '' }} /></div>
                  <div><input type="checkbox" name="checkbox6" lay-skin="primary" title="白底图" disabled {{item.isWhite ? 'checked' : '' }} /></div>
                </div>
                <div class="mt05 disflex">
                  <img src="{{tplIVP+item.name}}!size=120x120" alt="" style="width: 120px;height:120px" class="common_image_container-chooseTplImg" />
                  {{# if(item.isSelfImg){ }}
                    <div class="choose-part">
                      <div class="selfImgIcon">自拍图</div>
                      <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                    </div>
                  {{# }else{ }}
                  <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                  {{# } }}
                </div>
                <div class="serial-number">0</div>
              </div>
              {{# }) }}
            </div>
          </div>
          <div>
            <div class="title-part">辅图</div>
            <div class="common_image_container_grid">
              {{# layui.each(elem.assiImgs,function(index,item){ }}
              <div style="margin-top: 15px;" class="image-item">
                <div class="common_image_container_grid_checkboxes">
                  <div class="common_image_container_grid_checkboxItem">
                    <div><input type="checkbox" name="checkbox3" lay-skin="primary" title="必选图" disabled {{item.isMust ? 'checked' : '' }} /></div>
                    <!-- <div><input type="checkbox" name="checkbox4" lay-skin="primary" title="清晰图" disabled {{item.isClear ? 'checked' : '' }} /></div> -->
                    <div><input type="checkbox" name="checkbox5" lay-skin="primary" title="非供图" disabled {{item.isNotSupplier ? 'checked' : '' }} /></div>
                    <div><input type="checkbox" name="checkbox6" lay-skin="primary" title="白底图" disabled {{item.isWhite ? 'checked' : '' }} /></div>
                    <div><input type="checkbox" name="checkbox7" lay-skin="primary" title="尺寸图" disabled {{item.ifSize ? 'checked' : '' }} /></div>
                  </div>
                  <div class="mt05 {{item.isSelfImg? 'disflex' : ''}}">
                    <img src="{{tplIVP+item.name}}!size=120x120" alt="" style="width: 120px;height:120px" class="common_image_container-chooseTplImg" />
                    {{# if(item.isSelfImg){ }}
                    <div class="choose-part">
                      <div class="selfImgIcon">自拍图</div>
                      <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                    </div>
                    {{# }else{ }}
                    <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                    {{# } }}
                  </div>
                  <div class="serial-number">0</div>
                </div>
              </div>
              {{# }) }}
            </div>
          </div>
          <div>
            <div class="title-part">
              <div>其他自拍图</div>
              {{# if(elem.otherSelfiesImages.length > 12){ }}
                <div class="showMore ztt-a">展示更多</div>
              {{# } }}
            </div>
            <div class="common_image_container_grid_old">
              {{# layui.each(elem.otherSelfiesImages,function(index,item){ }}
              <div style="margin-top: 15px;" class="{{index>12? 'moreThanPart image-item':'image-item'}}">
                <div><input type="checkbox" name="checkbox3" lay-skin="primary" title="必选图" disabled {{item.isMust ? 'checked' : '' }} /></div>
                <div class="mt05 {{item.isSelfImg? 'disflex' : ''}}">
                  <img src="{{tplIVP+item.name}}!size=120x120" alt="" style="width: 120px;height:120px" class="common_image_container-chooseTplImg" />
                  {{# if(item.isSelfImg){ }}
                  <div class="choose-part">
                    <div class="selfImgIcon">自拍图</div>
                    <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                  </div>
                  {{# }else{ }}
                  <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                  {{# } }}
                </div>
                <div class="serial-number">0</div>
              </div>
              {{# }) }}
            </div>
          </div>
          <div>
            <div class="title-part">产品变种图</div>
            <div class="common_image_container_grid">
              {{# layui.each(elem.productVariationImages,function(index,item){ }}
              <div style="margin-top: 15px;" class="image-item">
                <div class="common_image_container_grid_checkboxes">
                  <div class="common_image_container_grid_checkboxItem">
                    <div><input type="checkbox" name="checkbox5" lay-skin="primary" title="非供图" disabled {{item.isNotSupplier ? 'checked' : '' }} /></div>
                    <div><input type="checkbox" name="checkbox6" lay-skin="primary" title="白底图" disabled {{item.isWhite ? 'checked' : '' }} /></div>
                  </div>
               
                  <div class="mt05 {{item.isSelfImg? 'disflex' : ''}}">
                    <img src="{{tplIVP+item.name}}!size=120x120" alt="" style="width: 120px;height:120px" class="common_image_container-chooseTplImg" />
                    {{# if(item.isSelfImg){ }}
                    <div class="choose-part">
                      <div class="selfImgIcon">自拍图</div>
                      <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                    </div>
                    {{# }else{ }}
                    <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                    {{# } }}
                  </div>

                  <div class="serial-number">0</div>
                </div>
              </div>
              {{# }) }}
            </div>
          </div>
          <div>
            <div class="title-part">NAS亚马逊图</div>
            <div class="common_image_container_grid_old">
              {{# layui.each(elem.nasAmazonImages,function(index,item){ }}
              <div style="margin-top: 15px;" class="image-item">
                <div><input type="checkbox" name="checkbox3" lay-skin="primary" title="必选图" disabled {{item.isMust ? 'checked' : '' }} /></div>
                <div class="mt05 {{item.isSelfImg? 'disflex' : ''}}">
                  <img src="{{tplIVP+item.name}}!size=120x120" alt="" style="width: 120px;height:120px" class="common_image_container-chooseTplImg" />
                  {{# if(item.isSelfImg){ }}
                  <div class="choose-part">
                    <div class="selfImgIcon">自拍图</div>
                    <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                  </div>
                  {{# }else{ }}
                  <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />
                  {{# } }}
                </div>
                <div class="serial-number">0</div>
              </div>
              {{# }) }}
            </div>
          </div>
        </div>
        {{# }) }}
      </div>
    </div>
  </div>
  {{# }else{ }}
  <div class="taCenter mt30">暂无数据</div>
  {{# } }}
</script>
