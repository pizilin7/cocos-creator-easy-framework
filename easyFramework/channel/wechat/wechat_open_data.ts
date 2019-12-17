/**
 * @description 微信开放数据（OpenDataContext),以下接口只能在微信开放数据域下使用
 */
export default class Wechat {
	/**
	 * @description 监听主域发送的消息
	 */
	public static onMessage() {
		return new Promise((resolve, reject) => {
			wx.onMessage((data: any) => {
				resolve(data);
			});
		});
	}
	/**
	 * @description 在无须用户授权的情况下，批量获取用户信息，仅支持获取自己和好友的用户信息。该接口只在开放数据域下可用
	 * @param openIdList 要获取信息的用户的 openId 数组，如果要获取当前用户信息，则将数组中的一个元素设为 'selfOpenId'
	 * @param lang 显示用户信息的语言
	 */
	public static getUserInfo(openIdList, lang?) {
		return new Promise((resolve, reject) => {
			wx.getUserInfo({
				openIdList: openIdList || [],
				lang: lang || 'en',
				success: (res) => {
					resolve(res);
				},
				fail: () => {
					reject();
				},
				complete: () => {

				}
			});
		});
	}

	/**
	 * @description 获取当前用户托管数据当中对应 key 的数据
	 * @param key
	 */
	public static getUserCloudStorage(key: Array<string>) {
		return new Promise((resolve, reject) => {
			wx.getUserCloudStorage({
				keyList: key || [],
				// KVDataList: 用户托管的 KV 数据列表
				success: (res: { KVDataList: ReadonlyArray<KVData> }) => {
					resolve(res);
				},
				fail: () => {
					reject();
				},
				complete: () => {
				}
			});
		});
	}

	// 托管数据的限制
	// 每个openid所标识的微信用户在每个游戏上托管的数据不能超过128个key-value对。
	// 上报的key-value列表当中每一项的key+value长度都不能超过1K(1024)字节。
	// 上报的key-value列表当中每一个key长度都不能超过128字节。
	/**
	 * @description 对用户托管数据进行写数据操作。允许同时写多组 KV 数据。
	 * @param _KVDataList 要修改的 KV 数据列表
	 */
	public static setUserCloudStorage(_KVDataList: Array<KVData>) {
		return new Promise((resolve, reject) => {
			wx.setUserCloudStorage({
				KVDataList: _KVDataList,
				success: () => {
					resolve();
				},
				fail: () => {
					reject();
				},
				complete: () => {

				}
			});
		});
	}

	/**
	 * @description 删除用户托管数据当中对应 key 的数据
	 * @param _keyList
	 */
	public static removeUserCloudStorage(_keyList: Array<string>) {
		return new Promise((resolve, reject) => {
			wx.removeUserCloudStorage({
				keyList: _keyList,
				success: () => {

				},
				fail: () => {

				},
				complete: () => {

				}
			});
		});
	}

	/**
	 * @description 拉取当前用户所有同玩好友的托管数据。该接口只可在开放数据域下使用
	 * @param _keyList 要拉取的 key 列表
	 */
	public static getFriendCloudStorage(_keyList: Array<string>) {
		return new Promise((resolve, reject) => {
			wx.getFriendCloudStorage({
				keyList: _keyList,
				// 同玩好友的托管数据
				success: (res: { data: ReadonlyArray<UserGameData> }) => {
					resolve(res);
				},
				fail: () => {
					reject();
				},
				complete: () => {
				}
			});
		});
	}

	/**
	 * @description 获取群同玩成员的游戏数据。小游戏通过群分享卡片打开的情况下才可以调用。该接口只可在开放数据域下使用
	 * @param _shareTicket 群分享对应的 shareTicket
	 * @param _keyList 要拉取的 key 列表
	 */
	public static getGroupCloudStorage(_shareTicket: string, _keyList: Array<string>) {
		return new Promise((resolve, reject) => {
			wx.getGroupCloudStorage({
				shareTicket: _shareTicket,
				keyList: _keyList,
				// 群同玩成员的托管数据
				success: (res: { data: ReadonlyArray<UserGameData> }) => {
					resolve(res);
				},
				fail: () => {
					reject();
				},
				complete: () => {
				}
			});
		});
	}

	/**
	 * @description 获取主域和开放数据域共享的 sharedCanvas。只有开放数据域能调用
	 */
	public static getSharedCanvas() {
		return wx.getSharedCanvas();
	}
}

