export const loadDataFile = async (url: string) => {
  const res = await fetch(url);
  return await res.text(); // text 就是 .asc 文件里的内容
};
