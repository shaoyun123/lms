<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<!-- 富文本样式 -->
		<link rel="stylesheet" href="${ctx}/static/simditor/simditor.css">
		<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
		<title>smt修改标题和描述</title>
		<style>
			.smtModifyTitleDesc_find {
				display: flex;
				justify-content: center;
				padding: 20px 400px;
			}

			.smtModifyTitleDesc_find span {
				line-height: 30px;
			}

			.smtModifyTitleDesc_find input {
				flex: 5;
				margin-left: 10px;
				margin-right: 30px;
			}

			.smtModifyTitleDesc_find button {
				flex: 2;
				margin-right: 20px;
			}

			.smtModifyTitleDesc-dropdown-content {
				display: none;
				position: absolute;
				z-index: 99;
				background-color: #f9f9f9;
				width: 120px;
				border: 1px solid #ebeef5;
				border-radius: 4px;
				box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
				padding: 12px 0;
				transform: translateX(-10px);
			}

			.smtModifyTitleDesc-dropdown-content div:hover {
				background-color: #f1f1f1;
				color: #009688;
			}

			.smtModifyTitleDesc-dropdown:hover .smtModifyTitleDesc-dropdown-content{
				display: block;
				z-index: 99;
			}

			.smtModifyTitleDesc-dropdown-content div {
				padding: 0 16px;
				line-height: 38px;
				font-size: 13px;

			}

			.smtModifyTitleDesc-rowFlexClass {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				border: 1px solid #eee;
				align-items: center;
				font-size: 16px;
			}

			.smtModifyTitleDesc-rowFlexLeft {
				width: 120px;
				text-align: center;
				height: 80px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				padding: 20px 0;
			}

			.smtModifyTitleDesc-rowflexline {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				font-size: 12px;
			}

			.smtModifyTitleDesc-rowFlexClass {
				height: 120px;
			}

			.smtModifyTitleDesc-rowFlexClassText {
				height: 240px;
			}

			.smtModifyTitleDesc-rowFlexClass .smtModifyTitleDesc-textFlexCloumn {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
			}

			.smtModifyTitleDesc-rowFlexClass .smtModifyTitleDesc-textClass {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				overflow: hidden;
				font-size: 14px;
				color: #333;
				line-height: 26px;
				white-space: pre-wrap;
			}

			.smtModifyTitleDesc-rowFlexClass_line_content {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
			}

			.shopinfo-smtDesc {
				font-size: 20px;
				margin: 0 50px;
			}

			.smtModifyTitleDesc-PHinfo,
			.smtModifyTitleDesc-PCinfo {
				position: relative;
				margin: 50px 0 10px;
			}

			.disNsmtDesc {
				display: none !important;
			}

			#smtModifyTitleDesc_sibmit {
				position: absolute;
				right: 20px;
				top: 20px;
			}
			.smtModifyTitleDesc_tplimg_grid{
				display: grid;
        grid-template-columns: repeat(auto-fill, 16.6%);
			}

			/* 富文本高度 */
			#smtModifyTitleDesc_PCdesc .w-e-text-container {
				height: 80vh !important;
			}
		</style>
		<div class="smtModifyTitleDesc_content">
			<div class="smtModifyTitleDesc_find layui-col-lg12 layui-col-md12">
				<span class="">字符</span>
				<input type="text" class="layui-input" id="smtModifyTitleDesc_origin" />
				<span>替换为：</span>
				<input type="text" class="layui-input" id="smtModifyTitleDesc_current" />
				<button class="layui-btn layui-btn-sm layui-btn-normal"
					id="smtModifyTitleDesc_repTitle">替换（仅标题）</button>
				<button class="layui-btn layui-btn-sm layui-btn-normal" id="smtModifyTitleDesc_repTitleDesc"
					lay-verify="required">替换（标题+描述）</button>
			</div>



			<div class="smtModifyTitleDesc_title layui-col-lg12 layui-col-md12"
				style="display: flex; justify-content: center">
				<div class="layui-col-lg11 layui-col-md11" style="margin: 0 auto">
					<form action="" class="layui-from">
						<div class="layui-form-item">
							<label class="layui-form-label">标题:</label>
							<div class="layui-input-block ">
								<input type="text" class="layui-input ifFocusInput" data-prodpid="" id="" name="shopTiele_Desc" value="" oninput="smtModifyTitleDesc_titleNumNote(this)"
									lay-verify="required" />
								<div id="smtModifyTitleDesc_title_numLimit"></div>
							</div>
						</div>
					</form>

				</div>
			</div>
			<div class="smtModifyTitleDesc_content layui-col-lg12 layui-col-md12">
				<div class="smtModifyTitleDesc-PHinfo" style="position: relative">
					<div class="shopinfo-smtDesc">商品详情-手机版</div>
					<div style="position: absolute; right: 20px; top: 0">
						<button class="layui-btn layui-btn-sm"
							onclick="smtModifyTitleDesc_wirelessToPc()">生成PC描述</button>
						<button style="opacity: 1"
							class="layui-btn layui-btn-primary smtModifyTitleDesc-dropdown layui-btn-sm"
							id="smtModifyTitleDesc_checkDetails">
							<span> 添加模块</span>
							<div class="smtModifyTitleDesc-dropdown-content">
								<div onclick="smtModifyTitleDesc_addText()">文本模块</div>
								<div onclick="smtModifyTitleDesc_addImg()">图片模块</div>
							</div>
						</button>
						<button class="layui-btn layui-btn-sm" onclick="smtModifyTitleDesc_preview()">预览效果</button>
					</div>
				</div>

				<div class="layui-card">
					<div class="layui-card-body uploadImgUL ui-sortable" id="smtModifyTitleDesc_modules_phone">
						<!-- 描述内容 -->

					</div>
				</div>
				<div class="smtModifyTitleDesc-PCinfo" style="position: relative">
					<div class="shopinfo-smtDesc">商品详情-电脑版</div>
				</div>
				<div class="layui-card">
					<div class="layui-card-body mb20">
						<div id="smtModifyTitleDesc_PCdesc"></div>
					</div>
				</div>

			</div>

			<button class="layui-btn layui-btn-normal" id="smtModifyTitleDesc_sibmit"
				onclick="smtModifyTitleDesc_sibmit()">提交修改</button>


		</div>

		<!-- 文本编辑框 -->
		<script type="text/html" id="smtModifyTitleDesc_text_modal">
    <div class="layui-card">
        <div class="layui-card-body">
            <form action="" id="smtModifyTitleDesc_text_form">
                <div class="smtModifyTitleDesc-desc-label">标题（非必填）</div>
                <div><input type="text" class="layui-input" name="title" autocomplete="off" maxlength="218"></div>
                <div class="smtModifyTitleDesc-desc-label">文本内容（非必填）</div>
                <textarea name="content" class="layui-textarea smtModifyTitleDesc-desc-textarea" ></textarea>
            </form>
        </div>
    </div>
</script>

		<!-- 添加图片通过url -->
		<script type="text/html" id="smtModifyTitleDesc_imgUrl_modal">
    <div class="layui-card">
        <div class="layui-card-body">
            <form action="" class="layui-form mb20" id="smtModifyTitleDesc_img_form">
                {{# layui.each(d,function(index){ }}
                    <div class="layui-form-item mr10 mb20">
                        <div class="layui-form-label">链接{{index+1}}</div>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="imgUrl{{index+1}}" onblur="smtModifyTitleDesc_isImgurl(this)">
                        </div>
                    </div>
                {{# }) }}
            </form>
            <div class="taCenter fRed">输入图片路径后需要点击输入框空白处</div>
        </div>
    </div>
</script>

		<!-- 图片超链接 -->
		<script type="text/html" id="smtModifyTitleDesc_targetURL">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form mb20">
                <div class="layui-form-item">
                    <input type="text" class="layui-input" id="smtModifyTitleDesc_targetURL_input" 
                        name="targetURL" placeholder="请输入该图片跳转URL"
                        onblur="smtModifyTitleDesc_isurl(this)"
                    >
                </div>
           </form>
           <div class="taCenter fRed">输入图片路径后需要点击输入框空白处</div>
        </div>
    </div>
</script>


		<!-- 富文本 -->
		<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>

		<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
		<script src="${ctx}/static/jquery-ui.min.js"></script>

		<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifyTitleDesc.js"></script>