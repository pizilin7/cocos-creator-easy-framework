import { AudioMgr } from './audioMgr/audioMgr';
import { ChannelMgr } from './channel/channelMgr';
import { Wechat } from './channel/wechat/wechat';
import { ConfigFrameWork } from './config';
import { ConfigTableMgr } from './configTable/configTableMgr';
import { Http } from './network/http/http';
import { NetworkMgr } from './network/networkMgr';
import { Notifications } from './notification/notifications';
import {UserCenter} from "./userCenter/userCenter";
import {Message} from "./message/message";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Commom extends cc.Component {
	// ///////////////////////////
	// ///成员变量
	// /////////////////////////

	////////////////////////////
	// get、set访问器
	///////////////////////////
	public get channelMgr() {
		return ChannelMgr;
	}

	public get notifications() {
		return Notifications;
	}

	public get audioMgr() {
		return AudioMgr;
	}

	public get configTable() {
		return ConfigTableMgr;
	}

	public get userCenter() {
		return UserCenter;
	}

	public get message() {
		return Message;
	}
	// ///////////////////////////
	// ///cc.class 生命周期函数
	// /////////////////////////

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
		NetworkMgr.dealHeadListener = (head) => {UserCenter.dealHead(head); };
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
	// JSON配表管理
	///////////////////////////
	public static initConfigMgr(pathName: string) {
		ConfigTableMgr.loadConfigTable(pathName);
	}

}
