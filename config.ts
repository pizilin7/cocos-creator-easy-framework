import {CHANNELTYPE} from "./channel/channelMgr";

export const ConfigFrameWork = {
	// 渠道模块
	/** 渠道类型 */
	Channel: CHANNELTYPE.WECHAT,
	/** 微信登录按钮信息 */
	UserInfoButtonData: {
		width: 386,
		height: 121,
		x: 0.5,
		y: 0.7,
		/** 布置在外网的登录按钮地址 */
		url: 'https://img.088youxi.com/Pic/bpmxw/btn.png'
	},
	/** banner广告id */
	BannerAdUnitId: '',
	/** 奖励视频广告id */
	RewardedVideoAdUnitId: '',
	/** 插屏广告id */
	InterstitialAdUnitId: '',
	/** banner广告的像素大小 */
	BannerSize: {
		width: 600,
		heigth: 172
	},
	/** 分享图片地址 */
	SharePictureAddress: [

	],
	/** 分享图片用语 */
	ShareWord: [

	],
	// 声音模块
	/** 声音资源地址，在resources文件下面 */
	AudioFilePath: 'textures/sound',
	// 网络模块
	/** 服务器地址 */
	HttpUrl: 'https://bpmxw.088youxi.com',
	/** 加密code: 需要和服务端统一 */
	EncryptCode: 'mxwj',
	/** 错误码列表 */
	ErrorNetCode: {
		/** 系统error code */
		0: '成功',
		1: '请求失败',
		500: '500服务器报错',
		99: '账号不存在',
		100: '请求header缺少参数',
		101: 'token不存在',
		102: '账号在其他设备登录',
		103: 'mid不存在',
		104: '非法的mid请求',
		105: '签名错误',
		107: '参数错误',
		120: '请求body缺少参数',
		121: '微信登录失败',
		/** 业务逻辑error code */
	},
	/** 重起游戏的错误码 */
	ErrorRestartGameCode: [102]
};

