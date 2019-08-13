import { AudioMgr } from '../audioMgr/audioMgr';
import { Toutiao } from './toutiao/toutiao';
import { Wechat } from './wechat/wechat';

export enum CHANNELTYPE {
	/** 开发模式 */
	DEVELOP = 0,
	/** android平台 */
	ANDROID = 1,
	/** IOS平台 */
	IOS = 2,
	/** 微信小游戏 */
	WECHAT = 3,
	/** 今日头条小游戏 */
	TOUTIAO = 4,
	/** hago小游戏 */
	HAGO = 5,
	/** facebook小游戏 */
	FACEBOOK = 6
}

class channelMgr {
	////////////////////////////
	// 类成员
	///////////////////////////
	public static readonly _instance = new channelMgr();
	/** 微信分享回调函数 */
	private wxShareListener: Function = null;
	private wxShareBeginTime = 0;
	private _wxShareWaiteTime = 0;
	private _channel = null;
	private _userInfoButtonData = {
		width: null,
		height: null,
		x: null,
		y: null,
		url: null
	};
	/** 分享图片的地址 */
	private _sharePictureAddress = [];
	/** 分享用语 */
	private _shareWord = [];
	////////////////////////////
	// get、set访问器
	///////////////////////////
	public set channel(num: any) {
		this._channel = num;
	}

	public set shareWord(word: Array<string>) {
		this._shareWord = word;
	}

	public set sharePictureAddress(add: Array<string>) {
		this._sharePictureAddress = add;
	}

	public set userInfoButtonData(data: any) {
		this._userInfoButtonData = data;
	}

	public set wxShareWaiteTime(time: number) {
		this._wxShareWaiteTime = time;
	}
	////////////////////////////
	// 登录模块
	///////////////////////////
	/**
	 * @description 统一登录接口
	 */
	public login() {
		if (this.isDevelop()) {
			return this.developLogin();
		} else if (this.isWechatGame()) {
			return Wechat.wetchatLogin();
		} else if (this.isTouTiao()) {
			return Toutiao.toutiaoLogin();
		}
	}

	/**
	 * @description 获取缓存opendid和nickname
	 */
	private getDevelopLoginData() {
		// 没有给一个随机的默认数值，如果内网测试的多，可能会重复
		let _openid = cc.sys.localStorage.getItem('uid:') || Math.floor(Math.random() * 1000000);
		let _nickname = cc.sys.localStorage.getItem('nickname:') || `test_${_openid}`;
		return {openid: _openid, nickname: _nickname};
	}

	/**
	 * @description 开发模式登录接口
	 */
	private developLogin() {
		let data = this.getDevelopLoginData();
		return new Promise((resolve, reject) => {
			resolve(data);
		});
	}

	////////////////////////////
	// 分享
	///////////////////////////
	/**
	 * @description 分享，提供3s机制
	 * @param param
	 * @param callback callback(bool)中bool为true则是分享3s成功，bool为false则是分享失败
	 */
	public shareAppMessage(param: any, callback?: Function) {
		let title = param.title || this._shareWord[Math.floor(Math.random() * this._shareWord.length)];
		let imageUrl = param.imageUrl || this._sharePictureAddress[Math.floor(Math.random() * this._sharePictureAddress.length)];
		let query = param.query;
		if (this.isWechatGame()) {
			this.shareOfWechat(title, imageUrl, query, callback);
		} else if (this.isTouTiao()) {
			this.shareOfToutiao(title, imageUrl, query, callback);
		} else if (this.isDevelop()) {
			this.shareOfDevelop(callback);
		}
	}

	/**
	 * @description 微信分享
	 * @param title
	 * @param imageUrl
	 * @param query
	 * @param callback
	 */
	private shareOfWechat(title: string, imageUrl: string, query: any, callback: Function) {
		this.wxShareBeginTime = Date.now();
		Wechat.shareAppMessage(title, imageUrl, query);
		this.wxShareListener = callback;
	}
	/**
	 * @description 处理微信分享后，切到前后的回调事件
	 */
	private dealWXShareLinstener() {
		if (!this.wxShareListener) {
			return;
		}
		let wxShareEndTime = Date.now();
		let isShare = wxShareEndTime - this.wxShareBeginTime >= this._wxShareWaiteTime;
		this.wxShareListener(isShare);
		this.wxShareListener = null;
		this.wxShareBeginTime = 0;
	}

	/**
	 * @description 头条分享
	 * @param title 转发标题，不传则默认使用当前小游戏的名称。
	 * @param imageUrl 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径，显示图片长宽比推荐 5:4
	 * @param query 查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 tt.getLaunchOptionSync() 或 tt.onShow() 获取启动参数中的 query
	 * @param callback
	 */
	private shareOfToutiao(title: string, imageUrl: string, query: any, callback: Function) {
		let isShare: boolean;
		Toutiao.shareAppMessage(title, imageUrl, query)
			.then(() => {
				isShare = true;
				callback(isShare);
			})
			.catch(() => {
				isShare = false;
				callback(isShare);
			});
	}

	/**
	 * @description 开发平台下，默认分享
	 * @param callback
	 */
	private shareOfDevelop(callback: Function) {
		let isShare = true;
		callback(isShare);
	}
	////////////////////////////
	// banner广告
	///////////////////////////
	/**
	 * @description 显示banner广告
	 * @param height banner显示的高度（banner广告默认是居中显示），默认高度为0
	 */
	public showBannerAd() {
		if (this.isWechatGame()) {
			Wechat.showBannerAd();
		} else if (this.isTouTiao()) {
			Toutiao.showBannerAd();
		}
	}

	/**
	 * @description 隐藏banner广告
	 */
	public hideBannerAd() {
		if (this.isWechatGame()) {
			Wechat.hideBannerAd();
		} else if (this.isTouTiao()) {
			Toutiao.hideBannerAd();
		}
	}

	////////////////////////////
	// 奖励广告
	///////////////////////////
	public showRewardVideoAd() {
		AudioMgr.pause();
		if (this.isWechatGame()) {
			return Wechat.showRewardVideoAd();
		} else if (this.isTouTiao()) {

		} else {
			return this.showRewardVideoAdOfDevelp();
		}
	}

	private showRewardVideoAdOfDevelp() {
		return new Promise((resolve, reject) => {
			AudioMgr.resume();
			let isComplete = true;
			resolve(isComplete);
		});
	}
	////////////////////////////
	// 插屏广告
	///////////////////////////
	/**
	 * @description 显示插屏广告
	 */
	public showInterstitialAd() {
		if (this.isWechatGame()) {
			Wechat.showInterstitialAd();
		}
	}

	////////////////////////////
	// 游戏圈(微信)
	///////////////////////////
	/**
	 * @description 创建微信游戏圈
	 */
	public createWXGameClubButton() {
		if (this.isWechatGame()) {
			Wechat.createGameClubButton();
		}
	}

	/**
	 * @description 显示微信游戏圈
	 */
	public showWXGameClub() {
		if (this.isWechatGame()) {
			Wechat.showGameClub();
		}
	}

	/**
	 * @description 隐藏微信游戏圈
	 */
	public hideWXGameClub() {
		if (this.isWechatGame()) {
			Wechat.hideGameClub();
		}
	}
	////////////////////////////
	// 录制视频（头条系）
	///////////////////////////
	public recordScreenStart(_duration: number, callback?: Function) {
		if (this.isTouTiao()) {
			Toutiao.recordScreenStart(_duration, callback);
		}
	}

	/**
	 * @description 暂停录屏
	 */
	public recordScreenPause(callback?: Function) {
		if (this.isTouTiao()) {
			Toutiao.recordScreenPause(callback);
		}
	}

	public recordScreenResume(callback?: Function) {
		if (this.isTouTiao()) {
			Toutiao.recordScreenResume(callback);
		}
	}

	public recordScreenStop(callback?: Function) {
		if (this.isTouTiao()) {
			Toutiao.recordScreenStop(callback);
		}
	}
	////////////////////////////
	// 其他能力
	///////////////////////////
	/**
	 * @description 微信切换前后台回调处理
	 */
	public switchShowAndHide() {
		// 切到前台
		Wechat.onShow(() => {
			this.dealWXShareLinstener();

		});
		// 切到后台
		Wechat.onHide(() => {

		});
	}

	/**
	 * @description 打开另一个小程序
	 * @param _appId
	 * @param _path
	 */
	public navigateToMiniProgram(_appId: string, _path: string) {
		if (this.isWechatGame()) {
			return Wechat.navigateToMiniProgram(_appId, _path);
		}
	}
	////////////////////////////
	// 通用
	///////////////////////////
	public isWechatGame() {
		return this._channel === CHANNELTYPE.WECHAT && cc.sys.platform === cc.sys.WECHAT_GAME;
	}

	public isTouTiao() {
		return this._channel === CHANNELTYPE.TOUTIAO && window.tt;
	}

	public isFaceBookGame() {
		return this._channel === CHANNELTYPE.FACEBOOK && cc.sys.platform === cc.sys.FB_PLAYABLE_ADS;
	}

	public isHagoGame() {
		return this._channel = CHANNELTYPE.HAGO;
	}

	public isAndroid() {
		return this._channel = CHANNELTYPE.ANDROID && cc.sys.os === cc.sys.OS_ANDROID;
	}

	public isIOS() {
		return this._channel === CHANNELTYPE.IOS && cc.sys.os === cc.sys.OS_IOS;
	}

	public isDevelop() {
		return this._channel === CHANNELTYPE.DEVELOP;
	}
}

export const ChannelMgr = channelMgr._instance;
