// 获取用户图片路径
export const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href
}