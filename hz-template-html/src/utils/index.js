
/**
 * @param {date} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time, fmt) {
	if (!time) return '';
	else {
		const date = new Date(time);
		const o = {
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'H+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds(),
			'q+': Math.floor((date.getMonth() + 3) / 3),
			S: date.getMilliseconds(),
			'week': date.getDay()
		};
		if (fmt == 'week') {
			let weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
			if (o.week == 0) {
				return '星期天'
			}
			return weekArr[o.week - 1]
		}
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(
				RegExp.$1,
				(date.getFullYear() + '').substr(4 - RegExp.$1.length)
			);
		for (const k in o) {
			if (new RegExp('(' + k + ')').test(fmt)) {
				fmt = fmt.replace(
					RegExp.$1,
					RegExp.$1.length === 1 ?
						o[k] :
						('00' + o[k]).substr(('' + o[k]).length)
				);
			}
		}
		return fmt;
	}
}

export function getParams(params) {
	let paramStr = '';
	Object.keys(params)
		.forEach((item) => {
			if (paramStr === '') {
				paramStr = `?${item}=${params[item]}`;

			} else {
				paramStr = `${paramStr}&${item}=${params[item]}`;
			}
		});
	paramStr = paramStr.replaceAll(/["]/g, "")  //去除url格式字符串
	return paramStr;
}

export function getParamsObj(url) {
	var obj = {};
	if (url.indexOf('?') != -1) {
		var temp1 = url.split('?');
		var pram = temp1[1];
		var keyValue = pram.split('&');
		for (var i = 0; i < keyValue.length; i++) {
			var item = keyValue[i].split('=');
			var key = item[0];
			var value = item[1];
			obj[key] = value;
		}
	}
	return obj;
}

export function install(Vue) {
	Vue.prototype._order = order;
	Vue.prototype._deepClone = deepClone;
	// 排序
	function order() {
		/**
		 * @参数1 Array 要进行排序的数组
		 * @参数2 String 进行排序的具体参数属性名(当Array的元素为Object时)
		 * @参数3 String 排序方式: desc 降序
		 * 											 asc  升序
		 *                       lenDesc 根据长度降序
		*/
		let data = arguments[0]  // 获取需要排序的数据
		let isObj = data[0] instanceof Object // 判断item是不是对象
		if (isObj) {  // 如果 item 是对象, 排序
			let property = arguments[1]  // 进行排序的 key
			let type = arguments[2] // 排序方式 asc desc
			//希尔排序法
			let step = Math.floor(data.length / 2);
			do {
				for (let i = step; i < data.length; i++) {
					let temp = data[i];
					let j = i - step;
					// 降序
					if (type == 'desc') {
						for (
							j;
							j >= 0 && Number(data[j][property]) < Number(temp[property]);
							j -= step
						) {
							data[j + step] = data[j];
						}
					}
					// 升序
					else if (type == 'asc') {
						for (
							j;
							j >= 0 && Number(data[j][property]) > Number(temp[property]);
							j -= step
						) {
							data[j + step] = data[j];
						}
					}
					// 属性值长度降序
					else if (type == 'lenDesc') {
						for (
							j;
							j >= 0 && Number(data[j][property].length) < Number(temp[property].length);
							j -= step
						) {
							data[j + step] = data[j];
						}
					}
					data[j + step] = temp;
				}
				step = Math.floor(step / 2);
			} while (step > 0);
			return data
		}

	}
	// 深拷贝
	function // 深拷贝
		deepClone(target, hash = new WeakMap()) { // 额外开辟一个存储空间WeakMap来存储当前对象
		if (target === null) return target // 如果是 null 就不进行拷贝操作
		if (target instanceof Date) return new Date(target) // 处理日期
		if (target instanceof RegExp) return new RegExp(target) // 处理正则
		if (target instanceof HTMLElement) return target // 处理 DOM元素

		if (typeof target !== 'object') return target // 处理原始类型和函数 不需要深拷贝，直接返回

		// 是引用类型的话就要进行深拷贝
		if (hash.get(target)) return hash.get(target) // 当需要拷贝当前对象时，先去存储空间中找，如果有的话直接返回
		const cloneTarget = new target.constructor() // 创建一个新的克隆对象或克隆数组
		hash.set(target, cloneTarget) // 如果存储空间中没有就 以当前要拷贝的内容为键 存进 hash 里

		Reflect.ownKeys(target).forEach(key => { // 引入 Reflect.ownKeys，处理 Symbol 作为键名的情况
			cloneTarget[key] = this.deepClone(target[key], hash) // 递归拷贝每一层
		})
		return cloneTarget // 返回克隆的对象
	}
}