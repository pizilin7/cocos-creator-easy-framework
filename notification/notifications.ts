export class notifications {
	public static readonly _instance: notifications = new notifications();
	private _eventMap: any = [];

	/**
	 *@description 事件注册
	 * @param {string} type
	 * @param callback
	 * @param target
	 */
	public on(type: string, callback: Function, target: Object) {
		if (!callback || !type) {
			console.error(`${type}事件注册失败...`);
			return null;
		}
		if (!this._eventMap[type]) {
			this._eventMap[type] = [];
		}
		// 以type为key
		this._eventMap[type].push({callback: callback, target: target});
		console.log("============================>注册事件", type)
	}

	/**
	 *@description 派发事件
	 * @param {string} type
	 * @param parameters
	 */
	public emit(type: string, parameters?: any) {
		let array = this._eventMap[type];
		if (!array) {
			console.error(`派发${type}失败...`);
			return ;
		}
		for (let key in array) {
			if (array.hasOwnProperty(key)) {
				let element = array[key];
				if (element.target) {
					element.callback.call(element.target, parameters);
					console.log("============================>派发事件：" + type + ",parameters:" + parameters);
				}
			}
		}
	}

	/**
	 *@description 注销事件
	 * @param {string} type
	 * @param target
	 */
	public off(type: string, target: Object) {
		let array = this._eventMap[type];
		if (!array) return;
		for (let key in array) {
			if (array.hasOwnProperty(key)) {
				let element = array[key];
				if (element && element.target === target) {
					array[key] = undefined;
					console.log("============================>注销事件：" + type);
				}
			}
		}
	}

	/**
	 * @description 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
	 * @param {string} type
	 * @param {Function} callback
	 * @param {Object} target
	 */
	public once(type: string, callback: Function, target: Object) {
		this.on(type, (parameters) => {
			this.off(type, target);
			callback.call(target, parameters);
		}, target);
	}
}

export const Notifications = notifications._instance;