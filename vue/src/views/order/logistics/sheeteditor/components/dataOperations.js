import sheetEditorStore from '@/store/modules/sheetEditor';
import useEditorDom from '@/hooks/useEditorDom';
import { ElMessage } from 'element-plus';

const { removeActive } = useEditorDom();
// const { removeActive, deleteActive } = useEditorDom();

export const MoveDirectionEnum = ['Up', 'Down', 'Left', 'Right'];
export default function dataOperations(curComponent) {
  const store = sheetEditorStore();
  const { copyComponent, pasteCopiedComponent, setComponent, moveComponent } =
    store;
  return {
    copy: () => {
      if (curComponent.value) {
        copyComponent(curComponent.value.dom);
        ElMessage.success('已拷贝当前组件');
      }
    },
    paste: () => {
      // if (curComponent.value) {
      pasteCopiedComponent();
      ElMessage.success('已黏贴当前组件');
      // }
    },
    // delete: () => {
    //   if (curComponent.value) {
    //     setComponent();
    //     deleteActive();
    //     ElMessage.success('删除当前组件成功');
    //   }
    // },
    cancel: () => {
      if (curComponent.value) {
        setComponent();
        removeActive();
      }
    },
    move: (direction, amount) => {
      if (curComponent.value) {
        moveComponent({ direction, amount });
      }
    }
  };
}

export const operationText = {
  copy: {
    text: '拷贝图层',
    shortcut: '⌘C / Ctrl+C'
  },
  paste: {
    text: '粘贴图层',
    shortcut: '⌘V / Ctrl+V'
  },
  // delete: {
  //   text: '删除图层',
  //   shortcut: 'Backspace / Delete'
  // },
  cancel: {
    text: '取消选中',
    shortcut: 'ESC'
  },
  move: {
    text: '上下左右移动一像素',
    shortcut: '↑ ↓ → ←'
  },
  moveTen: {
    text: '上下左右移动十像素',
    shortcut: 'Shift + ↑ ↓ → ←'
  }
};
