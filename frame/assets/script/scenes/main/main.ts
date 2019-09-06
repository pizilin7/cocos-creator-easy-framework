import Commom from '../../easyFramework/commom';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends Commom {

	// ///////////////////////////
	// ///属性检查器
	// /////////////////////////

	// ///////////////////////////
	// ///成员变量
	// /////////////////////////
	private isShowBanner = false;
	private isShowGameClub = false;
	private videoPath = '';
	// ///////////////////////////
	// ///cc.class 生命周期函数
	// /////////////////////////

	// ///////////////////////////
	// ///业务逻辑(control层)
	// /////////////////////////
	private onClickShareBtnEvent(event: cc.Event) {
		this.channelMgr.shareAppMessage({}, (isShare: boolean) => {
			if (isShare) {
				console.log('分享成功');
			} else {
				console.log('分享失败');
			}
		});
	}

	private onClickWatchTVBtnEvent(event: cc.Event) {
		console.log('1111111111111');
		this.channelMgr.showRewardVideoAd()
			.then((isComplete) => {
				console.log('22222222');
				if (isComplete) {
					console.log('观看视频成功');
				} else {
					console.log('提前关闭视频');
				}
			})
			.catch(() => {
				console.log('播放视频失败');
			});
	}

	private onClickWatchTVBtnEvent1(event: cc.Event) {
		this.channelMgr.showRewardVideoAd()
			.then((isComplete) => {
				if (isComplete) {
					console.log('观看视频成功1111');
				} else {
					console.log('提前关闭视频1111');
				}
			})
			.catch(() => {
				console.log('播放视频失败11111');
			});
	}

	private onClickInterstitialBtnEvent(event: cc.Event) {
		this.channelMgr.showInterstitialAd();
	}

	private onClickBannerBtnEvent(event: cc.Event) {
		if (!this.isShowBanner) {
			this.channelMgr.showBannerAd();
			this.isShowBanner = true;
		} else {
			this.isShowBanner = false;
			this.channelMgr.hideBannerAd();
		}
	}

	private onClickGameClubBtnEvent(event: cc.Event) {
		if (!this.isShowGameClub) {
			this.isShowGameClub = true;
			this.channelMgr.showWXGameClub();
		} else {
			this.isShowGameClub = false;
			this.channelMgr.hideWXGameClub();
		}
	}

	private onClickStarRecordScreen() {
		this.channelMgr.recordScreenStart(120, () => {
			console.log('开始录制视频');
		});
	}

	private onClickEndRecordScreen() {
		this.channelMgr.recordScreenStop((videoPath: string) => {
			console.log('停止录制视频');
			this.videoPath = videoPath;
		});
	}

	private onClickShareVideoRecordScreen() {
		this.channelMgr.shareVideo(this.videoPath, null, '枪神特工', false)
			.then(() => {
				console.log('分享视频成功');
			})
			.catch(() => {
				console.log('分享视频失败');
			});
	}
	// ///////////////////////////
	// ///事件
	// /////////////////////////

	// ///////////////////////////
	// ///view层
	// /////////////////////////
}
