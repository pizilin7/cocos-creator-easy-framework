/**
 * @description 玩家数据管理
 */
import { NetworkMgr } from '../network/networkMgr';

export class Message {
	////////////////////////////
	// 类成员
	///////////////////////////
	////////////////////////////
	// 接口
	///////////////////////////
	/**
	 * @description 登录
	 * @param {Object} data
	 * @param {Function} cb
	 */
	public static reqLogin(data: any, cb: Function) {
		let sendData: any = {};
		if (data.openid) {
			sendData.openid = data.openid;
			sendData.name = data.nickname;
		}
		NetworkMgr.xhrPost('http.reqGetUser', sendData, cb);
	}

	/**
	 * @description 微信登录协议
	 * @param {Object} loginData
	 * @param {Function} callback
	 */
	public static reqWxLogin(loginData: any, callback: Function) {
		let data = {
			wccode: loginData.wccode,
			wcencrypted: loginData.wcencrypted,
			wciv: loginData.wciv,
			shareid: loginData.shareid
		};
		NetworkMgr.xhrPost('http.reqWxLogin', data, callback);
	}
}

