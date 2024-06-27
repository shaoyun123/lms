<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>以图搜图</title>
<style>
  #findSource_editImg img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>

<div id="findSourceContainer" lay-filter="findSourceContainer"></div>


<script type="text/html" id="index1_findSource_layer">
  <div id="searchIamgeForm" class="mt10">
    <form class="layui-form">
        <div class="layui-form-item">
            <div class="layui-col-md4 layui-col-lg4">
                <label class="layui-form-label">图片链接</label>
                <div class="layui-input-block">
                    <input name="imageUrl" class="layui-input" id="findSource_inputImageEl"></input>
                </div>
            </div>
            <div class="layui-col-md3 layui-col-lg3 ml10">
                <span class="layui-btn layui-btn-sm layui-btn-normal findSourceBtn">查找货源</span>
            </div>
        </div>
        <div class="layui-form-item" style="margin-top: 20px">
            <div class="layui-col-md12 layui-col-lg12">
              <div class="fullImg">
                <div in='innerImage' id="findSource_editImg" style='width:150px;height:150px;' contenteditable="true"></div>
                <img id="cropImg" />
              </div>
            </div>
        </div>
    </form>
    <div id="findSource_imageInfoView" style="margin-left:10px;"></div>
  </div>
</script>

<script src="${ctx}/static/UploadImage.js"></script>



