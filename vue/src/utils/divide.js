// 英文逗号分割
export const commonDivideComma = (e) => {
  e.target.value = e.target.value
    .replaceAll('，', ',')
    .split(',')
    .filter((item) => item.trim() !== '')
    .join();
  e.target.dispatchEvent(new Event('input'));
};

// 英文逗号分割 数字
export const commonDivideCommaNum = (e) => {
  const _list = e.target.value
    .replaceAll('，', ',')
    .split(',')
    .filter((item) => (Number(item) || item == 0) && item !== '');
  e.target.value = Array.from(new Set(_list)).join();
  e.target.dispatchEvent(new Event('input'));
};

// 英文逗号分割 数字
export const commonDivideCommaIntNum = (e) => {
  const _list = e.target.value
    .replaceAll('，', ',')
    .split(',')
    .filter((item) => (Number(item) || item == 0) && item !== '')
    .map((v) => parseInt(v));
  e.target.value = Array.from(new Set(_list)).join();
  e.target.dispatchEvent(new Event('input'));
};
