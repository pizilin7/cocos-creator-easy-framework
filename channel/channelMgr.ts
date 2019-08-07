import {Wechat} from "./wechat/wechat";
export enum CHANNELTYPE  {
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
	FACEBOOK = 6,
}

class channelMgr {
	////////////////////////////
	// 类成员
	///////////////////////////
	public static readonly _instance = new channelMgr();
	/** 微信分享回调函数 */
	private wxShareListener: Function = null;
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
			return Wechat.wetchatLogin(this._userInfoButtonData);
		} else {
		}
	}
	/**
	 * @description 获取缓存opendid和nickname
	 */
	private getDevelopLoginData() {
		// 没有给一个随机的默认数值，如果内网测试的多，可能会重复
		let _openid = cc.sys.localStorage.getItem(`uid:`) || Math.floor(Math.random() * 1000000);
		let _nickname = cc.sys.localStorage.getItem(`nickname:`) || `test_${_openid}`;
		return {openid: _openid, nickname: _nickname};
	}

	/**
	 * @description 开发模式登录接口
	 */
	private developLogin() {
		let data = this.getDevelopLoginData();
		return new Promise((resolve, reject) => {
			resolve(data);
		})
	}
	////////////////////////////
	// 分享
	///////////////////////////
	/**
	 * @description 分享，提供3s机制
	 * @param param
	 * @param callback callback(bool)中bool为true则是分享3s成功，bool为false则是分享失败
	 */
	public share(param: wx.types.ShareOption, callback?: Function) {
		if (this.isWechatGame()) {
			this.wechatShare(param);
			this.wxShareListener = callback;
		}
	}

	private wechatShare(param: wx.types.ShareOption) {
		let title = param.title || this._shareWord[Math.floor(Math.random() * this._shareWord.length)];
		let imageUrl = param.imageUrl || this._sharePictureAddress[Math.floor(Math.random() * this._sharePictureAddress.length)];
		let query = param.query;
		Wechat.shareAppMessage(title, imageUrl, query);
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

		}
	}

	/**
	 * @description 隐藏banner广告
	 */
	public hideBannerAd() {
		if (this.isWechatGame()) {

		}
	}
	////////////////////////////
	// 奖励广告
	///////////////////////////

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
	// 游戏圈
	///////////////////////////
	/**
	 * @description 创建微信游戏圈
	 * @param pos
	 */
	public createWXGameClubButton(pos: cc.Vec2) {
		if (this.isWechatGame()) {
			Wechat.createGameClubButton(pos);
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
	// 通用
	///////////////////////////
	public isWechatGame() {
		return this._channel === CHANNELTYPE.WECHAT && cc.sys.platform === cc.sys.WECHAT_GAME;
	}

	public isTouTiaoGame() {
		return this._channel === CHANNELTYPE.TOUTIAO;
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
