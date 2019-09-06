class facebook {
	////////////////////////////
	// 类成员
	///////////////////////////
	public static readonly _instance: facebook = new facebook();
	/** 奖励视频广告id */
	private _rewardedVideoAdUnitId = '';
	/** 插屏广告id */
	private _interstitialAdUnitId = '';
	/** 视频广告实例 */
	private rewardedVideoAd = null;
	/** 插屏广告实例 */
	private interstitialAd = null;
	/** 支持的API */
	private _supportedAPIs = [];

	/**
	 * @description 进入游戏调用
	 */
	public onLoad(adver) {
		this.getSupportedAPIs();
		this.createRewardedVideoAd(adver);
		// this.createRewardedVideoAd(this.rewardId);
	}
	/**
	 * @description 登录获取玩家信息
	 * @param callback
	 */
	public onLogin(callback) {
		let player = {
			/** 玩家的唯一标识ID */
			id: FBInstant.player.getID(),
			/** 昵称 */
			name: FBInstant.player.getName(),
			/** 头像URL */
			photo: FBInstant.player.getPhoto(),
			/** 当前游戏来源的唯一id */
			contextID: FBInstant.context.getID(),
			/** 游戏类型 */
			contextType: FBInstant.context.getType(),
			/** 地区 */
			locale: FBInstant.getLocale(),
			/** 平台 */
			platform: FBInstant.getPlatform(),
			/** SDK 版本号 */
			sdkVersion: FBInstant.getSDKVersion()
		};
		console.log('登录信息:' + player);
		if (callback) {
			callback(player);
		}
	}

	/**
	 * @description 分享(分享图片放在本地),官网建议分享的时候开启菊花
	 * @param callback
	 * @param data
	 */
	public shareAppMessage(callback, data) {
		if (!this.isSupportedAPI('shareAsync')) {
			console.log('不支持shareAsyncAPI');
			return;
		}
		gl.showJuHua();
		let url = gl.language[gl.Country].SHARE_PICURL;
		console.log(url);
		let path = cc.url.raw(url);
		if (cc.loader.md5Pipe) {
			path = cc.loader.md5Pipe.transformURL(path);
		}
		console.log(path);
		this.convertImgToBase64(path, (base64Img) => {
			let sharePayload = {};
			sharePayload.image = base64Img;
			sharePayload.intent = 'REQUEST';
			sharePayload.text = 'Shooting game with spastic arms, aiming is your greatest challenge';
			sharePayload.data = data || {};
			FBInstant.shareAsync(
				sharePayload
			).then(() => {
				gl.closeJuHua();
				if (callback) {
					callback(true);
				}
			}).catch((error) => {
				gl.closeJuHua();
				if (callback) {
					callback(false);
				}
				console.log('shareAsync error', error);
			});
		});
	}

	/**
	 * @description 邀请好友
	 * @param type 助力类型 (1-皮肤 2-枪械)
	 * @param callback
	 */
	public inviteFriend(type, callback) {
		const data = {
			// 玩家的openid
			shareid: gl.userinfo.getFacebookid(),
			sharetype: type
		};

		this.shareAppMessage(callback, data);
	}

	/**
	 * @description 创建激励视频
	 * @param placementID
	 */
	public createRewardedVideoAd(placementID) {
		if (!this.isSupportedAd()) {
			console.log('该平台不支持创建视频');
			return;
		}
		if (this.rewardedVideoAd) {
			console.log('视频已经存在，不用重复创建');
			return;
		}
		console.log('=====================>广告id:', placementID);
		FBInstant.getRewardedVideoAsync(
			placementID // Your Ad Placement Id
		).then((interstitial) => {
			// Load the Ad asynchronously
			this.rewardedVideoAd = interstitial;
			return this.rewardedVideoAd.loadAsync();
		}).then(() => {
			console.log('创建激励视频成功');
		}).catch((error) => {
			console.log('创建激励视频失败： ', error);
		});
	}

	/**
	 * @description 播放奖励视频
	 * @param callback 成功为ture, 失败为false
	 * @returns {number}
	 */
	public showRewardVideoAd(callback) {
		if (!this.rewardedVideoAd) {
			console.log('奖励视频为空，无法播放');
			// 在h5平台上测试，没有视频广告
			// callback(true);
			return 0;
		}
		this.rewardedVideoAd.showAsync()
			.then(() => {
				// Perform post-ad success operation
				if (callback) {
					callback(true);
				}
				console.log('奖励视频播放成功');
			})
			.catch((error) => {
				if (callback) {
					callback(false);
				}
				console.log('奖励视频播放失败', error);
			});
	}

	/**
	 * @description 返回与游戏启动的入口点相关的数据对象；改接口可以获取分享的数据
	 * @returns {*|Object}
	 */
	public getEntryPointData() {
		return FBInstant.getEntryPointData();
	}
	/**
	 * @description 获取支持API序列，（手机端和网页端支持的API不一定相同）
	 */
	public getSupportedAPIs() {
		this.supportedAPIs = FBInstant.getSupportedAPIs();
	}

	/**
	 * @description 检查当前平台是否支持该API
	 * @param funcName
	 * @returns {*}
	 */
	public isSupportedAPI(funcName) {
		return this.supportedAPIs.indexOf(funcName) !== -1;
	}

	/**
	 * @description 是否支持视频广告
	 * @returns {*}
	 */
	public isSupportedAd() {
		return this.isSupportedAPI('getRewardedVideoAsync');
	}

	/**
	 * 使用 Facebook 的分析功能来分析应用。
	 * Log an app event with FB Analytics
	 * @param eventName 要分析的事件名称
	 * @param valueToSum 可选，FB分析可以计算它。
	 * @param parameters 可选，它可以包含多达25个 key-value，以记录事件。key 必须是2-40个字符，只能包含'_', '-', ' '和字母数字的字符。 Value 必须少于100个字符。
	 */
	public logEvent(eventName, valueToSum, parameters) {
		if (!this.isSupportedAPI('logEvent')) {
			console.log('不支持logEvent');
			return;
		}
		FBInstant.logEvent(eventName, valueToSum, parameters);
	}

	/**
	 * 传入图片路径，返回base64图片格式
	 * @param {string} url      地址
	 * @param {object} callback 回调
	 * @param {string} outputFormat 识别类型
	 */
	public convertImgToBase64(url, callback, outputFormat) {
		let canvas = document.createElement('CANVAS');
		let  ctx = canvas.getContext('2d');
		let  img = new Image;
		img.crossOrigin = 'Anonymous';
		img.src = url;
		img.onload = function () {
			canvas.height = img.height;
			canvas.width = img.width;
			ctx.drawImage(img, 0, 0);
			let dataURL = canvas.toDataURL(outputFormat || 'image/png');
			callback.call(this, dataURL);
			canvas = null;
		};
	}
	/**
	 * @description 把当前玩家数据储存到云空间里
	 * @param data key-value 对象（level: 5,zombiesSlain: 27,）
	 */
	public setStatsAsync(data) {
		FBInstant.player
			.setStatsAsync(data)
			.then(() => {
				console.log('data is set');
			})
			.catch((error) => {
				console.log(error);
			});
	}

	/**
	 * @description 创建插屏广告
	 */
	public createInterstitialAd() {
		if (!this.supportedAPIs('getInterstitialAdAsync')) {
			console.log('该平台不支持创建插屏广告');
			return;
		}
		if (this.interstitialAd) {
			console.log('插屏广告实例已存在');
			return;
		}
		FBInstant.getInterstitialAdAsync(
			this._interstitialAdUnitId
		).then((interstitial) => {
			this.interstitialAd = interstitial;
			return interstitial.loadAsync();
		}).catch((error) => {
			console.log(error);
		});
	}
	/**
	 * @description 显示插屏广告
	 * @param callback
	 */
	public showInterstitialAd(callback) {
		if (!this.interstitialAd) {
			console.log('插屏广告不存在');
			return;
		}
		this.interstitialAd.showAsync().then(() => {
			if (callback) {
				callback(true);
			}
		}).catch((error) => {
			if (callback) {
				callback(false);
			}
			console.log(error);
		});
	}
}
export const Facebook = facebook._instance;
