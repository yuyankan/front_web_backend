// apiService.ts

import type { DropdownOptions, ProductData } from './types';

// A simple in-memory cache object
const cache: { [key: string]: DropdownOptions } = {};

// Mock data representing the full dataset from the server
const fullData: ProductData[] = [
  { productline: 'A', reportdate: '2023-01-01', product: 'P1', roll_number: 'R1' },
  { productline: 'A', reportdate: '2023-01-01', product: 'P1', roll_number: 'R2' },
  { productline: 'A', reportdate: '2023-01-02', product: 'P2', roll_number: 'R3' },
  { productline: 'B', reportdate: '2023-01-03', product: 'P3', roll_number: 'R4' },
  { productline: 'B', reportdate: '2023-01-03', product: 'P4', roll_number: 'R5' },
];

/**
 * Fetches distinct values for dropdowns based on query parameters.
 * Uses an in-memory cache to reduce redundant lookups.
 */
export const fetchOptions = async (queryParams: { [key: string]: string }): Promise<DropdownOptions> => {
  const cacheKey = JSON.stringify(queryParams);

  // Check if the result is already in the cache
  if (cache[cacheKey]) {
    console.log('Returning data from cache for:', cacheKey);
    return cache[cacheKey];
  }

  console.log('Making a new API call for:', cacheKey);
  // Simulate network delay
  //await：这个关键字必须在 async 函数中使用。它会让代码暂停执行，直到它等待的 Promise 成功完成 (resolved
  //setTimeout(resolve, 500)：这是一个标准的 JavaScript 函数，用于在指定时间后执行一个动作。
  //resolve 不是一个独立的函数，而是 JavaScript Promise 对象构造函数中的一个参数。你可以把它理解为一个信号或开关。当你调用 resolve() 时，就是在告诉 Promise：“任务成功完成了，这是结果。
  //把这三部分合起来，代码就会创建一个 Promise，这个 Promise 会在 500 毫秒后被标记为成功。而 await 关键字则会让程序等待这半秒钟，然后才继续执行下一行代码
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter the full dataset based on the current selection
  //对于 fullData 数组中的每一项 item，如果它不满足 queryParams 中的任何一个过滤条件，就把它排除掉
  const filteredData = fullData.filter(item => {
    for (const key in queryParams) {
      if (queryParams[key] && item[key] !== queryParams[key]) {
        return false;
      }
    }
    return true;
  });

  // Extract unique values for each dropdown
  //[... ] 是 ES6 新增的展开运算符（spread operator）。它的作用是将一个可迭代对象（比如 Set 或数组）中的所有元素“展开”到一个新的数组中
  const extractedOptions: DropdownOptions = {
    productlines: [...new Set(filteredData.map(item => item.productline))],
    reportdates: [...new Set(filteredData.map(item => item.reportdate))],
    products: [...new Set(filteredData.map(item => item.product))],
    rollNumbers: [...new Set(filteredData.map(item => item.roll_number))],
  };

  // Store the result in the cache before returning
  cache[cacheKey] = extractedOptions;
  return extractedOptions;
};