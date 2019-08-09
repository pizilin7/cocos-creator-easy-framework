import {NetworkMgr} from "./network/networkMgr";
import {ConfigFrameWork} from "../config";
import {Http} from "./network/http/http";
import {AudioMgr} from "./audioMgr/audioMgr";
import {ChannelMgr} from "./channel/channelMgr";
import {Wechat} from "./channel/wechat/wechat";
import UserCenter from "../center/usercenter";

 export class ControlFrameWork {
	////////////////////////////
	// 类成员
	///////////////////////////

	////////////////////////////
	// get、set访问器
	///////////////////////////

	////////////////////////////
	// 网络模块
	///////////////////////////
	/**
	 * @description 初始化网络模块
	 */
	public static initNetWorkMgr() {
		NetworkMgr.encryptCode = ConfigFrameWork.EncryptCode;
		NetworkMgr.errorRestartGameCode = ConfigFrameWork.ErrorRestartGameCode;
		NetworkMgr.errorNetCode = ConfigFrameWork.ErrorNetCode;
		NetworkMgr.dealHeadListener = (head) => {UserCenter.getInstance().dealHead(head)};
		Http.httpUrl = ConfigFrameWork.HttpUrl;
	}
	////////////////////////////
	// 渠道模块
	///////////////////////////
	public static initChannelMgr() {
		ChannelMgr.channel = ConfigFrameWork.Channel;
		ChannelMgr.sharePictureAddress = ConfigFrameWork.SharePictureAddress;
		ChannelMgr.shareWord = ConfigFrameWork.ShareWord;
		if (ChannelMgr.isWechatGame()) {
			Wechat.bannerAdUnitId = ConfigFrameWork.BannerAdUnitId;
			Wechat.rewardedVideoAdUnitId = ConfigFrameWork.RewardedVideoAdUnitId;
			Wechat.interstitialAdUnitId = ConfigFrameWork.InterstitialAdUnitId;
			Wechat.userInfoButtonData = ConfigFrameWork.UserInfoButtonData;
			Wechat.bannerSize = ConfigFrameWork.BannerSize;
		}
	}
	////////////////////////////
	// 音频模块
	///////////////////////////
	public static initAudioMgr() {
		AudioMgr.filePath = ConfigFrameWork.AudioFilePath;
		return AudioMgr.loadAudioResoucre();
	}
	////////////////////////////
	// 奖励广告
	///////////////////////////

	////////////////////////////
	// 插屏广告
	///////////////////////////

	////////////////////////////
	// 游戏圈
	///////////////////////////

}

