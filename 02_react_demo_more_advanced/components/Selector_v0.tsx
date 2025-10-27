// ProductSelector.tsx

import React, { useState, useEffect, useCallback } from 'react';
import type { SelectedOptions, DropdownOptions } from '../types';
import { fetchOptions } from '../apiservice';

const ProductSelector: React.FC = () => {
  // State for selected values
  const [selected, setSelected] = useState<SelectedOptions>({
    productline: '',
    reportdate: '',
    product: '',
    rollNumber: '',
  });

  // State for dropdown options
  const [options, setOptions] = useState<DropdownOptions>({
    productlines: [],
    reportdates: [],
    products: [],
    rollNumbers: [],
  });
  
  // State for loading status
  //React 的 Hook 来管理组件状态的常见方式: variant: isLoading , value: false
  //setIsLoading 是控制这个开关的遥控器
  //setIsLoading(true)。这会告诉 React 状态变了，组件需要重新渲染。在重新渲染时，isLoading 的值就变成了 true。
  // useState：这是 React 提供的一个 Hook，用于在函数组件中添加状态（state）。它接收一个初始值，并返回一个包含两个元素的数组
  const [isLoading, setIsLoading] = useState(false);

  // A single function to fetch and set options based on the current selection
  //useCallback 是一个 React Hook，它的主要作用是记忆一个函数，防止该函数在组件每次渲染时都重新创建，从而优化应用的性能
  //后续渲染：React 会检查依赖项数组（在你的代码中是 [fetchAndSetOptions]）。只要它的依赖项（即 selected.productline 等状态）没有变化，useCallback 就会返回完全相同的函数实例。
  //useCallback 在处理作为其他 Hook（如 useEffect）的依赖项的函数时，以及将函数作为 props 传递给子组件时，是进行性能优化的关键工具
  const fetchAndSetOptions = useCallback(async () => {
    setIsLoading(true);

    const queryParams: { [key: string]: string } = {
      productline: selected.productline,
      reportdate: selected.reportdate,
      product: selected.product,
    };

    // Remove empty values to ensure cache keys are consistent
    Object.keys(queryParams).forEach(key => queryParams[key] === '' && delete queryParams[key]);

    const data = await fetchOptions(queryParams);
    //...prev:  它把 prev（旧状态）对象里的所有属性浅拷贝到一个新的对象中
    //在 React 中，你不应该直接修改状态对象。通过 ...prev 拷贝旧状态，我们是在一个新对象上进行操作，这符合 React 不可变数据（Immutable Data）的原则
    //当你调用 setOptions(newStatus) 时，React 发现 prev 和 newStatus 是两个不同的对象（=== false），它就会知道状态已经更新了，从而触发组件的重新渲染
    setOptions(prev => ({
      ...prev,
      productlines: data.productlines,
      reportdates: data.reportdates,
      products: data.products,
      rollNumbers: data.rollNumbers,
    }));
    
    setIsLoading(false);
  }, [selected.productline, selected.reportdate, selected.product]);

  // Use a single useEffect to handle all data fetching
  //React useEffect Hook 用法，用于处理函数组件中的副作用（Side Effects）。它的目的是确保在组件首次加载时，以及当其依赖项发生变化时，都能正确地调用 fetchAndSetOptions 函数来获取数据
  //useEffect 是一个 React Hook，用于在组件渲染完成后执行某些操作
  useEffect(() => {
    fetchAndSetOptions();//第一个参数是一个函数，这里是 () => { fetchAndSetOptions(); }。React 会在组件渲染后执行这个函数
  }, [fetchAndSetOptions]);//useEffect 的第二个参数是一个依赖项数组。这个数组告诉 React，什么时候需要重新运行第一个函数。React 会比较这个数组中每次渲染后的值
  //依赖项是 fetchAndSetOptions 函数。这个函数被 useCallback 包裹，因此它本身只有在它的依赖项（即 selected 状态中的 productline 等）发生变化时才会重新创建


  // Handle changes to any dropdown
  // 处理下拉框变化，不再清空下游选项
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // 仅更新当前选中的值
    setSelected(prev => ({ ...prev, [name]: value }));
  };

  

  return (
    <div>
      <h2>Product Selector</h2>
      {isLoading && <p>Loading options...</p>}
      
      <div>
        <label>Product Line:</label>
        <select name="productline" value={selected.productline} onChange={handleChange} disabled={isLoading}>
          <option value="">Please Select</option>
          {options.productlines.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Report Date:</label>
        <select name="reportdate" value={selected.reportdate} onChange={handleChange} disabled={isLoading || !selected.productline}>
          <option value="">Please Select</option>
          {options.reportdates.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Product:</label>
        <select name="product" value={selected.product} onChange={handleChange} disabled={isLoading || !selected.reportdate}>
          <option value="">Please Select</option>
          {options.products.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Roll Number:</label>
        <select name="rollNumber" value={selected.rollNumber} onChange={handleChange} disabled={isLoading || !selected.product}>
          <option value="">Please Select</option>
          {options.rollNumbers.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      <hr />
      <div>
        <h3>Current Selection:</h3>
        <p>Product Line: {selected.productline}</p>
        <p>Report Date: {selected.reportdate}</p>
        <p>Product: {selected.product}</p>
        <p>Roll Number: {selected.rollNumber}</p>
      </div>
    </div>
  );
};

export default ProductSelector;