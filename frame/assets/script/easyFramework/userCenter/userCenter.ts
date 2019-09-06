/**
 * @description 玩家数据管理
 */
class userCenter {
	////////////////////////////
	// 类成员
	///////////////////////////
	public static readonly _instance = new userCenter();
	/** 玩家id */
	private _id: number;
	/** 玩家唯一标识: 除登录外，每一条协议的head.uid 都是该值 */
	private _openid: string;
	/** 玩家昵称 */
	private _nickname: string;
	/** 头像地址 */
	private _avatar: string;
	////////////////////////////
	//// get、set访问器
	/////////////////////////////
	public get id() {
		return this._id;
	}
	public get openid() {
		return this._openid;
	}

	////////////////////////////
	// 接口
	///////////////////////////
	/**
	 * @description 初始化玩家数据
	 * @param data 服务端登录数据
	 */
	public initUserInfo(data: any) {
		this._id = data.id;
		this._openid = data.openid;
	}
	/**
	 * @description 处理服务http协议返回的头部信息
	 * @param head
	 */
	public dealHead(head: any) {

	}
	////////////////////////////
	// 业务逻辑
	///////////////////////////

}

export const UserCenter = userCenter._instance;
