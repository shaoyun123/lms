import useHotKeys from '@/hooks/useHotKeys';
import sheetEditorStore from '@/store/modules/sheetEditor';
import { storeToRefs } from 'pinia';
import DataOperation from './dataOperations';
import $ from 'jquery';

const store = sheetEditorStore();
const { copiedComponent, curComponent } = storeToRefs(store);

function useHotKeyExtra(command, callback) {
  useHotKeys(command, (event, keyEvent) => {
    const { shortcut } = keyEvent;
    const isCopyKey = ['ctrl+c', 'command+c'].includes(shortcut);
    const isPasteKey = ['ctrl+v', 'command+v'].includes(shortcut);
    // 分页的table不可以复制粘贴
    if (curComponent.value && !isPasteKey) {
      const twoPage = $(curComponent.value.dom).attr('two-page');
      if (!(twoPage === 'true' && isCopyKey)) {
        event.preventDefault();
        callback(event, keyEvent);
      }
    } else if (isPasteKey && copiedComponent.value) {
      const twoPage = $(copiedComponent.value.dom).attr('two-page');
      if (twoPage !== 'true') {
        event.preventDefault();
        callback(event, keyEvent);
      }
    }
  });
}
export function initHotKeys() {
  const operations = DataOperation(curComponent);
  useHotKeyExtra('ctrl+c, command+c', () => {
    operations.copy();
  });
  // useHotKeyExtra('backspace, delete', () => {
  //   operations.delete();
  // });
  useHotKeyExtra('ctrl+v, command+v', () => {
    operations.paste();
  });
  useHotKeyExtra('esc', () => {
    operations.cancel();
  });
  //   useHotKeyExtra('ctrl+z, command+z', () => {
  //     operations.undo();
  //   });
  //   useHotKeyExtra('ctrl+shift+z, command+shift+z', () => {
  //     operations.redo();
  //   });
  useHotKeyExtra('up', () => {
    operations.move('Up', 1);
  });
  useHotKeyExtra('down', () => {
    operations.move('Down', 1);
  });
  useHotKeyExtra('left', () => {
    operations.move('Left', 1);
  });
  useHotKeyExtra('right', () => {
    operations.move('Right', 1);
  });
  useHotKeyExtra('shift+up', () => {
    operations.move('Up', 10);
  });
  useHotKeyExtra('shift+down', () => {
    operations.move('Down', 10);
  });
  useHotKeyExtra('shift+left', () => {
    operations.move('Left', 10);
  });
  useHotKeyExtra('shift+right', () => {
    operations.move('Right', 10);
  });
}
