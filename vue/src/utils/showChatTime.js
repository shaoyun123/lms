import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

export const formatTimestampInChat = (timestamp) => {
  const now = dayjs();
  const messageTime = dayjs(timestamp);
  const diff = now.diff(messageTime, 'days');
  if (diff < 1) {
    return messageTime.format('HH:mm');
  } else if (diff < 2) {
    return messageTime.format('昨天 HH:mm');
  } else if (diff <= 7) {
    return messageTime.format('dddd HH:mm');
  } else {
    return messageTime.format('YYYY年M月D日 HH:mm');
  }
};
