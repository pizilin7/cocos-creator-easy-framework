import Commom from '../../easyFramework/commom';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends Commom {

	// ///////////////////////////
	// ///属性检查器
	// /////////////////////////
	@property(cc.ProgressBar)
	private pbProgress: cc.ProgressBar = null;
	@property(cc.Node)
	private nodeLoginGameBtn: cc.Node = null;
	// ///////////////////////////
	// ///成员变量
	// /////////////////////////

	// ///////////////////////////
	// ///cc.class 生命周期函数
	// /////////////////////////
	private start() {
		Commom.initChannelMgr();
		Commom.initNetWorkMgr();
		// Commom.initConfigMgr()
		this.initProgress();
		if (this.channelMgr.isDevelop()) {
			this.startGameOfDefault();
		} else if (this.channelMgr.isWechatGame()) {
			this.startGameOfWechat();
		} else if (this.channelMgr.isTouTiao()) {
			this.startGameOfToutiao();
		}
	}
	// ///////////////////////////
	// ///业务逻辑(control层)
	// /////////////////////////
	/**
	 * @description 开发者登录
	 */
	private startGameOfDefault() {
		this.runProgress();
	}

	/**
	 * @description 微信登录
	 */
	private startGameOfWechat() {
		let pacakageName = 'textures';
		cc.loader.downloader.loadSubpackage(pacakageName, (error) => {
			if (error) {
				cc.error('分包加载错误');
				return;
			}
			this.runProgress()
				.then(() => {
					this.channelMgr.login()
						.then((loginData: any) => {
							console.log('微信登录成功：', loginData);
							this.message.reqWxLogin(loginData, (data) => {
								this.userCenter.initUserInfo(data);
								cc.director.loadScene('main');
							});
						});
				});
		});
	}

	/**
	 * @description 头条登录 不支持分包
	 */
	private startGameOfToutiao() {
		this.channelMgr.login()
			.then((loginData: any) => {
				this.message.reqTTLogin(loginData, (data: any) => {
					this.userCenter.initUserInfo(data);
					this.runProgress()
						.then(() => {
							cc.director.loadScene('main');
						})
						.catch(() => {
							console.log('登录失败');
						});
				});
			});
	}

	private runProgress() {
		return new Promise((resolve, reject) => {
			let onProgress = (completedCount: number, totalCount: number, item: any) => {
				if (totalCount !== 0) {
					let percent = Number((completedCount / totalCount).toFixed(2));
					// 防止倒退
					if (this.pbProgress.progress < percent) {
						this.pbProgress.progress = percent;
					}
				}
			};

			let onload = (error: Error, asset: cc.SceneAsset) => {
				if (error) {
					cc.error('loading 失败：', error);
					reject();
					return;
				}
				this.pbProgress.node.active = false;
				this.nodeLoginGameBtn.active = true;
				Commom.initAudioMgr()
					.then(() => {
						this.audioMgr.playMusic('beijingyinyue');
					});
				resolve();
			};
			cc.director.preloadScene('main', onProgress, onload);
		});
	}
	// ///////////////////////////
	// ///事件
	// /////////////////////////
	private onClickLoginBtnEvent(event: cc.Event) {
		this.channelMgr.login()
			.then((loginData: any) => {
				this.message.reqLogin(loginData, (data) => {
					this.userCenter.initUserInfo(data);
					cc.director.loadScene('main');
				});
			});
	}
	// ///////////////////////////
	// ///view层
	// /////////////////////////
	private initProgress() {
		this.pbProgress.progress = 0;
		this.nodeLoginGameBtn.active = false;
		this.pbProgress.node.active = true;
	}
}
