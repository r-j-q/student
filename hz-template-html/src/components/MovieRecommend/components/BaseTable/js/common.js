const utils = {
  // 节流函数
  throttle(fn, interval) {
    let enterTime = 0;//触发的时间
    let gapTime = interval || 300;//间隔时间，如果interval不传，则默认300ms
    return function () {
      var context = this;
      var backTime = new Date();//第一次函数return即触发的时间
      if (backTime - enterTime > gapTime) {
        fn.call(context, arguments);
        enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
      }
    };
  },

};

/**
 * 合并相同数据，导出合并列所需的方法(只适合el-table)
 * @param {Object} data 表格对象
 * @param [Array] rowspanArray 需要进行合并的列的 key 值
 */
const getRowspanMethod = (data, rowspanArray) => {

  /**
   * 要合并列的数据
   */
  const rowspanNumObject = {};

  //初始化 rowspanNumObject
  rowspanArray.map(item => {
    rowspanNumObject[item] = new Array(data.length).fill(1, 0, 1).fill(0, 1);  // 每一列新建 表格长度 的数组, 初始化为 [1,0,0,0,......]
    rowspanNumObject[`${item}-index`] = 0;  // 每一列中, 连续相同元素 第一次出现的下标 (做记录用)
  });
  //计算相关的合并信息
  for (let i = 1; i < data.length; i++) { // 遍历每一行
    rowspanArray.map(key => {  // 遍历每一行的每一列
      const index = rowspanNumObject[`${key}-index`];  // 记录当前最先出现元素的下标
      if (data[i][key] === data[i - 1][key]) {  // 如果这一列 当前行的元素值 与同一列上一行 相同
        rowspanNumObject[key][index]++; // 这一列 对应数组 记录当前item重复次数的元素(下标对应 该列 元素首次出现的下标) 加1
      } else {  // 如果不相同
        rowspanNumObject[`${key}-index`] = i;  // 重复元素首次出现的下标 更新为 当前行的下标
        rowspanNumObject[key][i] = 1; // 这个元素首次出现, 这一列对应的数组中, 对应当前行的元素 初始化数量为 1
      }

    });
  }
  /**
   *  这个循环最终生成的对象
   *  A  B  C   需要合并的列
   *  1  2  3   3代表这个元素在这一列重复出现 3 次
   *  1  0  0   0代表这个元素此前出现过,应被合并
   *  1  1  0
   */

    //提供合并的方法并导出
  const spanMethod = function ({row, column, rowIndex, columnIndex}) {
      row
      columnIndex
      if (rowspanArray.includes(column['property'])) {  // 如果当前列是需要进行合并的
        const rowspan = rowspanNumObject[column['property']][rowIndex];  // 获取前面生成的数据中对应的数量
        if (rowspan > 0) {
          return {rowspan: rowspan, colspan: 1}  // 记录的值大于0, 说明该元素在这一列中首次出现, 应进行合并, 合并单元格数量为记录的值
        }
        return {rowspan: 0, colspan: 0} // 如果为0, 说明该单元格应被合并, 此返回值将使该单元格 不加载
      }
      return {rowspan: 1, colspan: 1} // 如果不是需要进行合并的列, 原样输出
    };

  return spanMethod;  //返回这个方法
}

export {utils, getRowspanMethod}