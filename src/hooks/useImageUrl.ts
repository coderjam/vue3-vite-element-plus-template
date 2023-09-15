// 获取图片地址
export function getImagePath(url: string): string {
  return new URL(`/src/assets/${url}`, import.meta.url).href;
}
