/***
 * @file:
 * @author: caojianping
 * @Date: 2023-03-30 14:58:22
 */

/**
 * 判断是否为字符串
 * @param data 数据
 * @returns 返回判断结果
 */
export function isString(data: any): boolean {
  return Object.prototype.toString.call(data) === '[object String]';
}

/**
 * 日期替换函数，将1970-01-01格式日期替换成1970/01/01格式
 * @param date 日期
 * @returns 返回已替换数据
 */
export function dateReplace(date: string): string {
  if (!date) return '';
  return date.replace(/-/g, '/');
}

/**
 * 是否拥有指定属性
 * @param obj 对象
 * @param key 属性key
 * @returns 返回判断结果
 */
export function hasOwnProperty(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
