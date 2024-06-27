<template>
  <div class="wang-editor">
    <div class="editor-container">
      <Toolbar
        :editor="editorRef"
        :default-config="toolbarConfig"
        style="border-bottom: 1px solid #ddd"
      />
      <Editor
        v-model="valueHtml"
        :style="{ height }"
        style="overflow-y: hidden"
        :default-config="editorConfig"
        @on-created="handleCreated"
        @on-change="handleChange"
      />
    </div>
    <!-- 模板图片 -->
    <ChooseTplImage
      v-model="tplImgVisible"
      :params="tempParams"
      :is-batch-update-desc="isBatchUpdateDesc"
      @get-tpl-img="getTplImg"
    />
  </div>
</template>

<script setup>
  import '@wangeditor/editor/dist/css/style.css'; // 引入 css
  import { defineProps, watch, shallowRef, ref, onBeforeUnmount } from 'vue';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { wangEditorUploadFileApi } from '@/api/common/index.js';
  import request from '@/utils/request';
  import { Boot } from '@wangeditor/editor';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  const tplImgVisible = ref(false);

  const props = defineProps({
    detail: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '400px'
    },
    apiUrl: {
      type: String,
      default: ''
    },
    apiParams: {
      type: Object,
      default: () => ({})
    },
    getTplImageParams: {
      type: Object,
      default: () => ({})
    }
  });

  const emits = defineEmits(['change', 'getUrl']);

  let newEditor = null;
  class TplButtonMenu {
    constructor() {
      this.title = '模板图片'; // 自定义菜单标题
      this.iconSvg = TEMPLATESVG; // 可选
      this.tag = 'button';
    }

    // eslint-disable-next-line no-unused-vars
    getValue(editor) {
      return ' hello ';
    }

    // eslint-disable-next-line no-unused-vars
    isActive(editor) {
      return false;
    }

    // eslint-disable-next-line no-unused-vars
    isDisabled(editor) {
      return false;
    }

    // 点击菜单-模板图片时触发的函数
    // eslint-disable-next-line no-unused-vars
    exec(editor, value) {
      newEditor = editor;
      tempParams.value = props.getTplImageParams;
      tplImgVisible.value = true;
    }
  }

  // 模板图片小图标
  const TEMPLATESVG =
    '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>';

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef();
  // 内容 HTML
  const valueHtml = ref('');
  // 编辑相关
  watch(
    () => props.detail,
    (val) => {
      if (val) {
        valueHtml.value = val;
      } else {
        valueHtml.value = '';
      }
    },
    {
      immediate: true
    }
  );

  // 组件销毁时，销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });

  const newKey = 'tempImage' + new Date().getTime();

  const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例
    // 注册菜单
    const tempImageConf = {
      key: newKey, // 定义 menu key 要唯一、不重复
      factory() {
        return new TplButtonMenu();
      }
    };
    Boot.registerMenu(tempImageConf);
  };

  // 本地上传图片
  const handleUpload = (resultFiles, insertImgFn) => {
    // resultFiles 是 input 中选中的文件列表
    // insertImgFn 是获取图片 url 后，插入到编辑器的方法
    const formData = new FormData();
    formData.append('file', resultFiles);
    wangEditorUploadFileApi(formData)
      .then((res) => {
        insertImgFn(res.msg || '');
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const transferFn = (data) => {
    return request({
      url: props.apiUrl,
      method: 'POST',
      data,
      loading: true
    });
  };
  // 往编辑器里插入图片前的方法
  const handleCommonParseImageSrc = async (src) => {
    emits('getUrl', src);
    let transferSrc = '';
    const { code, data } = await transferFn(props.apiParams);
    if (code === '0000') {
      transferSrc = data.imgUrl;
    }
    return transferSrc;
  };

  const toolbarConfig = {
    toolbarKeys: [
      'headerSelect',
      'blockquote',
      '|',
      'bold',
      'underline',
      'italic',
      {
        key: 'group-more-style',
        title: '更多',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
        menuKeys: ['through', 'code', 'sup', 'sub', 'clearStyle']
      },
      'color',
      'bgColor',
      '|',
      'fontSize',
      'fontFamily',
      'lineHeight',
      '|',
      'bulletedList',
      'numberedList',
      'todo',
      {
        key: 'group-justify',
        title: '对齐',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
        menuKeys: [
          'justifyLeft',
          'justifyRight',
          'justifyCenter',
          'justifyJustify'
        ]
      },
      {
        key: 'group-indent',
        title: '缩进',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
        menuKeys: ['indent', 'delIndent']
      },
      '|',
      'emotion',
      'insertLink',
      {
        key: 'group-image',
        title: '图片',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
        menuKeys: ['insertImage', 'uploadImage', newKey]
      },
      {
        key: 'group-video',
        title: '视频',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M981.184 160.096C837.568 139.456 678.848 128 512 128S186.432 139.456 42.816 160.096C15.296 267.808 0 386.848 0 512s15.264 244.16 42.816 351.904C186.464 884.544 345.152 896 512 896s325.568-11.456 469.184-32.096C1008.704 756.192 1024 637.152 1024 512s-15.264-244.16-42.816-351.904zM384 704V320l320 192-320 192z"></path></svg>',
        menuKeys: ['insertVideo', 'uploadVideo']
      },
      'insertTable',
      'codeBlock',
      'divider',
      '|',
      'undo',
      'redo',
      '|',
      'fullScreen'
    ]
  };

  const isBatchUpdateDesc = ref(true);
  const tempParams = ref({});
  const checkedImageUrlList = ref([]);

  // 获取勾选的模板图片（上传到平台）
  const getTplImg = async (imgUrlList) => {
    checkedImageUrlList.value = imgUrlList;
    imgUrlList.forEach(async (url) => {
      const newUrl = await handleCommonParseImageSrc(url);
      newEditor.dangerouslyInsertHtml(`<img src="${newUrl}" alt="">`);
    });
  };
  const editorConfig = {
    placeholder: '',
    MENU_CONF: {
      uploadImage: {
        //上传图片配置
        customUpload: handleUpload
      },
      // 插入图片时 转换url
      insertImage: {
        parseImageSrc: handleCommonParseImageSrc
      }
    }
  };
  // 监听文本框内容修改
  const handleChange = (editor) => {
    emits('change', editor.getHtml());
  };
</script>

<style lang="scss" scoped>
  .editor-container {
    border: 1px solid #ddd;
    .bottom {
      margin-top: 20px;
      text-align: right;
    }
  }
</style>
