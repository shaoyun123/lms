<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
  <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <%-- 空格逗号转换 --%>
      <title>换行逗号转换</title>
      <div class="layui-fluid">
        <div class="layui-card">
          <div style="padding: 20px 60px 20px 0;">
            <form class="layui-form" id="transform">
              <div class="layui-form-item">
                <label class="layui-form-label">格式</label>
                <div class="layui-input-block" style="display:flex;align-items: center;">
                  <div>
                    <select name="transformOne">
                      <option value="lineOne" selected>换行</option>
                      <option value="commaOne">逗号</option>
                      <option value="spaceOne">空格</option>
                    </select>
                  </div>
                  <div style="padding: 0 20px;"><a href="javascript:;" id="index1_spaceTransform_btn"
                      style="color:#34a8fe;">转换</a></div>
                  <div>
                    <select name="transformTwo">
                      <option value="commaTwo" selected>逗号</option>
                      <option value="lineTwo">换行</option>
                      <option value="spaceTwo">空格</option>
                      <option value="csqTwo">逗号+单引号</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">原数据</label>
                <div class="layui-input-block">
                  <textarea name="originalTextarea" class="layui-textarea" style="height: 300px;"></textarea>
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">转换数据</label>
                <div class="layui-input-block">
                  <textarea name="transformTextarea" class="layui-textarea" style="height: 300px;"></textarea>
                </div>
              </div>
              <div class="layui-form-item">
                <div class="tool-btn">
                  <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="tranferBtn">转换并复制</button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>

      <style>
        .height30 {
          height: 30px;
          line-height: 30px;
        }
        .tool-btn {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
      </style>

      <script type="text/javascript">
        layui.use(['admin', 'form', 'table', 'laydate', 'upload', 'element', 'layedit', 'formSelects'], function () {
          var $ = layui.$,
            admin = layui.admin,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            upload = layui.upload,
            formSelects = layui.formSelects,
            form = layui.form
          form.render()

          //点击转换
          $('#index1_spaceTransform_btn').on('click', function () {
            var midValue = '';
            //select的值
            var $selOne = $('#transform').find('select[name=transformOne]');
            var $selTwo = $('#transform').find('select[name=transformTwo]');
            var $selOneVal = $selOne.val();
            var $selTwoVal = $selTwo.val();
            if ($selOneVal.indexOf('One') > -1) {
              $selOneVal = $selOneVal.replace('One', 'Two');
            }
            if ($selTwoVal.indexOf('Two') > -1) {
              $selTwoVal = $selTwoVal.replace('Two', 'One');
            }
            midValue = $selOneVal;
            $selOne.val($selTwoVal);
            $selTwo.val(midValue);
            form.render();
          });
        })

        $('#tranferBtn').on('click', function () {
          //select的值
          var $selOne = $('#transform').find('select[name=transformOne]').val();
          var $selTwo = $('#transform').find('select[name=transformTwo]').val();
          //textarea的值
          var $orgin = $('#transform').find('textarea[name=originalTextarea]').val();
          var $trans = $('#transform').find('textarea[name=transformTextarea]');
          //换行转逗号
          if($selOne == 'lineOne' && $selTwo == 'commaTwo'){
              if($orgin.length){
                  var $orginArr = $orgin.split('\n').filter(function(s){
                      return s && s.trim();
                  });
                  $trans.val($orginArr.join(','));
              }else{
                  layer.msg('请输入原始数据');
                  return false;
              }
          }else if($selOne == 'lineOne' && $selTwo == 'spaceTwo'){
              if($orgin.length){
                var $orginArr = $orgin.split('\n').filter(function(s){
                    return s && s.trim();
                });
                  $trans.val($orginArr.join(' '));
              }else{
                  layer.msg('请输入原始数据');
                  return false;
              }
          }else if($selOne == 'lineOne' && $selTwo == 'lineTwo'){
              layer.msg('不能换行转换行');
              return false;
          }else if($selOne == 'lineOne' && $selTwo == 'csqTwo'){
            if($orgin.length){
              var $orginArr = $orgin.split('\n').filter(function(s){
                  return s && s.trim();
              });
              var $orginTostringArr = $orginArr.map(item  => {
                return "'" + item.trim() + "'";
              });
              $trans.val($orginTostringArr.join(','));
            }else{
                layer.msg('请输入原始数据');
                return false;
            }
          }else if($selOne == 'commaOne' && $selTwo == 'lineTwo'){
              if($orgin.length){
                  var $orginArr = $orgin.split(',').filter(function(s){
                      return s && s.trim();
                  });
                  $trans.val($orginArr.join('\n'));
              }else{
                  layer.msg('请输入原始数据');
                  return false;
              }
          }else if($selOne == 'commaOne' && $selTwo == 'spaceTwo'){
            if($orgin.length){
              var $orginArr = $orgin.split(',').filter(function(s){
                  return s && s.trim();
              });
                $trans.val($orginArr.join(' '));
            }else{
                layer.msg('请输入原始数据');
                return false;
            }
          }else if($selOne == 'commaOne' && $selTwo == 'commaTwo'){
              layer.msg('不能逗号转逗号');
              return false;
          }else if($selOne == 'commaOne' && $selTwo == 'csqTwo'){
            // layer.msg('不能逗号转逗号+单引号');
            // return false;
            if($orgin.length){
              var $orginArr = $orgin.split(',').filter(function(s){
                  return s && s.trim();
              });
              var $orginTostringArr = $orginArr.map(item  => {
                return "'" + item.trim() + "'";
              });
              $trans.val($orginTostringArr.join(','));
            }else{
                layer.msg('请输入原始数据');
                return false;
            }
        }else if($selOne == 'spaceOne' && $selTwo == 'commaTwo'){
            if($orgin.length){
              var $orginArr = $orgin.split(' ').filter(function(s){
                  return s && s.trim();
              });
                $trans.val($orginArr.join(','));
            }else{
                layer.msg('请输入原始数据');
                return false;
            }
          }else if($selOne == 'spaceOne' && $selTwo == 'lineTwo'){
            if($orgin.length){
              var $orginArr = $orgin.split(' ').filter(function(s){
                  return s && s.trim();
              });
                $trans.val($orginArr.join('\n'));
            }else{
                layer.msg('请输入原始数据');
                return false;
            }
          }else if($selOne == 'spaceOne' && $selTwo == 'spaceTwo'){
            layer.msg('不能空格转空格');
            return false;
          }else if($selOne == 'spaceOne' && $selTwo == 'csqTwo'){
            layer.msg('不能空格转逗号+单引号');
            return false;
          }
          //复制转换数据按钮
          let txt = $('#transform').find('[name=transformTextarea]').val();
          let oInput = document.createElement('textarea'); //创建一个textarea元素
          oInput.value = txt;
          document.body.appendChild(oInput); //将input添加为body子元素
          oInput.select(); // 选择对象
          document.execCommand("Copy"); // 执行浏览器复制命令
          document.body.removeChild(oInput);//移除DOM元素
          layer.msg('复制成功', { icon: 1 });
          return false;
        })

      </script>