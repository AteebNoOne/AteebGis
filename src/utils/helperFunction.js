export const excerpt = (str, length) => {
  if (str && typeof str === 'string') {
    let stringLength = str.length;
    if (stringLength > length) {
      str = str.substring(0, length) + ' ... ';
    }
  }
  return str;
};
