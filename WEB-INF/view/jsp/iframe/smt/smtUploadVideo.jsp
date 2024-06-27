<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt上传视频</title>
<!-- <link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" /> -->
<link rel="stylesheet" href="${ctx}/static/font_iconfont/iconfont.css" media="all" />
<style>
  .smtUploadVideo {
    height: 100%;
  }
  .smtUploadVideo .smtUploadVideo-content {
    height: calc(100% - 60px);
    overflow: hidden;
  }
  .smtUploadVideo #smtUploadVideo_form {
    overflow-y: scroll;
    height: 100%;
  }
  .smtUploadVideo .layui-card-header {
    display: flex;
  }
  .smtUploadVideo .layui-card-header .smtUploadVideo-fail {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .smtUploadVideo .video-content {
    display: flex;
    flex-wrap: wrap;
  }
  .smtUploadVideo .video-content-info {
    width: 220px;
    height: 170px;
    display: flex;
    align-items: center;
  }
  .smtUploadVideo .video-content-empty {
    text-align: center;
    padding-top: 40px;
  }
  .smtUploadVideo-btns {
    display: flex;
    padding: 10px;
    border-top: 1px solid #e9e9e9;
    width: 100%;
    justify-content: flex-end;
    box-sizing: border-box;
  }
  .smtUploadVideo-btns button {
    margin-left: 20px !important;
    width: 60px;
  }
</style>
<div id="LAY-smtUploadVideo" v-cloak class="smtUploadVideo">
  <div style="height: 100%">
    <div v-if="itemIdList.length" style="height: 100%">
      <div class="smtUploadVideo-content">
        <form class="layui-form" id="smtUploadVideo_form">
          <div v-for="item in itemIdList" class="layui-card" :key="item.itemId">
            <div class="layui-card-header">
              <div>item_id:{{ item.itemId }}</div>
              <div v-if="item.failReason" class="ml20 smtUploadVideo-fail" :lay-tips="item.failReason">
                <span class="layui-bg-gray hp-badge ml5">败</span>
              </div>
            </div>
            <div class="layui-card-body">
              <div class="video-content">
                <div class="video-content-info" data-prodssku="videoItem.sku" v-for="videoItem in item.videos" :key="videoItem.sku">
                  <div class="ml10">
                    <input
                      type="radio"
                      :name="item.name"
                      :checked="videoItem.isOriginalProductSku"
                      :value="videoItem.location"
                    />
                  </div>
                  <div>
                    <div class="taCenter">{{ videoItem.sku }}</div>
                    <div
                      class="common_play_video"
                      :data-video="videoItem.location"
                      style="position: absolute; background-color: rgba(0, 0, 0, 0.1); width: 150px; height: 150px; cursor: pointer"
                    >
                      <i class="layui-icon layui-icon-play" style="font-size: 40px; position: relative; left: 55px; top: 70px; color: #000"></i>
                    </div>
                    <div style="border: 1px solid #e6e6e6; width: 150px">
                      <img :src="videoItem.picture" :alt="videoItem.videoname" width="150" height="150" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="smtUploadVideo-btns">
        <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" @click="handleUpload">上传</button>
        <button class="layui-btn layui-btn-sm layui-btn-primary ml20" type="button" @click="handleCancel">取消</button>
      </div>
    </div>
    <div v-else>
      <div class="video-content-empty">暂无数据</div>
    </div>
  </div>
</div>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtUploadVideo.js"></script>
