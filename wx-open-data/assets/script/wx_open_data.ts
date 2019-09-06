/**
 * @description 控制子域脚本
 */
import global from './config';
import ItemLongRank from './itemLongRank';
import ItemRank from './itemRank';
import Wechat from './wechat';
import ItemHead from './itemHead';

const { ccclass, property } = cc._decorator;

// 不能直接赋值
// 否者会照成引用
export interface ILevel {
	chapter: number;
	point: number;
	medal?: number;
	passTime?: string;
	heighestTime?: string;
}

@ccclass
export default class OpenData extends cc.Component {

	// ///////////////////////////
	// ///属性检查器
	// /////////////////////////
	@property(cc.Prefab)
	private prefabItemLongRank: cc.Prefab = null;
	@property(cc.Prefab)
	private prefabItemRank: cc.Prefab = null;
	@property(cc.Prefab)
	private prefabItemHead1: cc.Prefab = null;
	@property(cc.Prefab)
	private prefabItemHead2: cc.Prefab = null;
	@property(cc.Prefab)
	private prefabItemHead3: cc.Prefab = null;
	@property(cc.Node)
	private nodeFriendRank: cc.Node = null;
	@property(cc.Node)
	private nodeFriendRankContent: cc.Node = null;
	@property(ItemLongRank)
	private itemLongRankScript: ItemLongRank = null;
	@property(cc.Node)
	private nodeLevelRank: cc.Node = null;
	@property(cc.Node)
	private nodeLevelRankContent: cc.Node = null;
	@property(cc.Node)
	private nodeChapterLevel: cc.Node = null;
	@property(cc.ScrollView)
	private svFriendRank: cc.ScrollView = null;
	@property(cc.ScrollView)
	private svLevelRank: cc.ScrollView = null;
	@property([cc.Node])
	private nodeChapterLevelRankArray: cc.Node[] = [];
	// ///////////////////////////
	// ///成员变量
	// /////////////////////////
	private myOpenId = '';
	private selfOpenData: UserGameData;
	/** 总榜key */
	private totalRankCloudStorageKey: string;
	/** 章节榜单key,使用（chapter1） */
	private chapterRankCloudStorageKey: string;
	private chapterRankDataKey: string;
	private friendRankList: Array<UserGameData> = [];
	private levelRankList: Array<UserGameData> = [];
	/** 当前选择的章节关卡 */
	private selectLevel = null;
	/** 当前章节 */
	private curChapter = null;
	private isFriendRankLock: boolean;
	private isLevelRankLock: boolean;
	private isSortChapterRankData: boolean;
	/** 章节排行数据分布 */
	private chapterRankData = {};
	private timeOut = [];
	// ///////////////////////////
	// ///cc.class 生命周期函数
	// /////////////////////////
	protected onLoad() {
		// console.log('进入子域');
		this.totalRankCloudStorageKey = 'totalRank';
		this.chapterRankCloudStorageKey = 'chapter';
		this.chapterRankDataKey = 'chapterRank';
		this.isFriendRankLock = true;
		this.isLevelRankLock = true;
		this.registerEvent();
	}

	protected start() {

	}

	protected onDestroy() {
		if (this.timeOut.length) {
			this.timeOut.forEach((value: number) => {
				clearTimeout(value);
			});
			this.timeOut = [];
		}
	}
	// ///////////////////////////
	// ///事件
	// /////////////////////////
	private registerEvent() {
		// Wechat.removeUserCloudStorage([this.chapterRankCloudStorageKey + '1', this.totalRankCloudStorageKey]);
		Wechat.onMessage()
			.then((data: any) => {
				let type = data.messageType;
				let value: any = data.value;
				switch (type) {
					case global.WXMESSAGE.GET_OPENID:
						this.myOpenId = value.openId;
						this.onGetSelfOpenDataEvent();
						break;
					case global.WXMESSAGE.SUBMIT_SCORE:
						this.onSubmitScoreEvent(value.level, value.medals);
						break;
					case global.WXMESSAGE.SHOW_FRIEND_RANK:
						this.onShowFriendRankEvent();
						break;
					case global.WXMESSAGE.ENTER_CHAPTER_RANK:
						this.onEnterChapterRankEvent();
						break;
					case global.WXMESSAGE.HIDE_FRIEND_RANK:
						this.onHideFriendRankEvent();
						break;
					case global.WXMESSAGE.REMOVE_FRIEND_RANK:
						this.onRemoveFriendRankEvent();
						break;
					case global.WXMESSAGE.SHOW_LEVEL_RANK:
						this.onShowLevelRankEvent(value.level);
						break;
					case global.WXMESSAGE.HIDE_LEVEL_RANK:
						this.onHideLevelRankEvent();
						break;
					case global.WXMESSAGE.REMOVE_LEVEL_RANK:
						this.onRemoveRankEvent();
						break;
					case global.WXMESSAGE.SWITCH_CHAPTER_RANk:
						this.curChapter = value.chapter;
						this.onSwitchChapterRankEvent();
						break;
					case global.WXMESSAGE.SHOW_CHAPTER_RANK:
						this.onShowChapterRankEvent();
						break;
					case global.WXMESSAGE.HIDE_CHAPTER_RANk:
						this.onHideChapterRankEvent();
						break;
					case global.WXMESSAGE.REMOVE_CHAPTER_RANK:
						this.onRemoveChapterRankEvent();
						break;
					case global.WXMESSAGE.ENTER_GAME_SCENE:
						this.onEnterGameSceneEvent();
						break;
					default:
					// console.log('不存在此messageTtyp');
				}
			});
	}

	/**
	 * @description 获取玩家信息
	 */
	private onGetSelfOpenDataEvent() {
		Wechat.getUserInfo(['selfOpenId'])
			.then((res: any) => {
				this.selfOpenData = res.data[0];
			});
	}

	/**
	 * 提交总榜数据和关卡排行数据
	 * @param {ILevel} level
	 * @param {number} _medals
	 */
	private onSubmitScoreEvent(level: ILevel, _medals: number) {
		this.submitScoreLevelRank(level);
		let id = setTimeout(() => {
			this.submitScoreTotalRank(level, _medals);
		});
		this.timeOut.push(id);
	}

	/**
	 * @description 显示总榜
	 */
	private onShowFriendRankEvent() {
		this.svFriendRank.scrollToTop();
		// 隐藏章节排行
		this.onHideChapterRankEvent();
		if (this.isFriendRankLock) {
			this.onRemoveFriendRankEvent();
			// 排行总榜数据存在
			if (this.friendRankList.length) {
				// console.log('排行总榜数据存在');
				this.showFriendRank();
				this.nodeFriendRank.active = true;
			// 排行总榜数据不存在
			} else {
				Wechat.getFriendCloudStorage([this.totalRankCloudStorageKey])
					.then((res: any) => {
						let data: Array<UserGameData> = res.data;
						if (data.length) {
							this.friendRankList = this.sortFriendRankData(data);
							// console.log('排行总榜数据存在');
							this.showFriendRank();
							this.nodeFriendRank.active = true;
						}
				});
			}
			this.isFriendRankLock = false;
		} else {
			this.nodeFriendRank.active = true;
		}
	}

	/**
	 * @description 从排行总榜进入章节排行榜
	 */
	private onEnterChapterRankEvent() {
		// console.log('从排行总榜进入章节排行榜');
		this.nodeChapterLevel.active = true;
		this.nodeFriendRank.active = false;
	}
	/**
	 * @description 隐藏总榜
	 */
	private onHideFriendRankEvent() {
		this.nodeFriendRank.active = false;
	}

	/**
	 * @description 移除总榜
	 */
	private onRemoveFriendRankEvent() {
		this.nodeFriendRankContent.removeAllChildren();
	}

	/**
	 * @description 显示关卡排行
	 */
	private onShowLevelRankEvent(level: ILevel) {
		this.svLevelRank.scrollToTop();
		this.nodeLevelRank.active = true;
		if (this.isLevelRankLock) {
			this.selectLevel = level;
			let levelCloudStorageKey = `${this.chapterRankCloudStorageKey}${level.chapter}`;
			Wechat.getFriendCloudStorage([levelCloudStorageKey])
				.then((res: any) => {
					let data: Array<UserGameData> = res.data;
					if (data.length) {
						this.selectLevel = level;
						this.nodeLevelRankContent.removeAllChildren();
						this.showLevelRank(data);
					}
				});
			this.isLevelRankLock = false;
		}
	}

	/**
	 * @description 隐藏关卡排行
	 */
	private onHideLevelRankEvent() {
		this.nodeLevelRank.active = false;
	}

	/**
	 * @description 显示关卡排行
	 */
	private onRemoveRankEvent() {
		this.onHideLevelRankEvent();
		this.isLevelRankLock = true;
		this.nodeLevelRankContent.removeAllChildren();
	}

	private onSwitchChapterRankEvent() {
		this.onRemoveChapterRankEvent();
		// 排行总榜数据存在
		if (this.friendRankList.length) {
			this.showChapterRank();
			this.nodeChapterLevel.active = true;
		// 排行总榜数据不存在
		} else {
			Wechat.getFriendCloudStorage([this.totalRankCloudStorageKey])
				.then((res: any) => {
					let data: Array<UserGameData> = res.data;
					if (data.length) {
						this.friendRankList = this.sortFriendRankData(data);
						this.sortChapterRankData(this.friendRankList);
						this.showChapterRank();
						this.nodeChapterLevel.active = true;
					}
			});
		}
	}

	private onShowChapterRankEvent() {
		this.nodeChapterLevel.active = true;
	}

	private onRemoveChapterRankEvent() {
		this.nodeChapterLevel.active = false;
		for (let index = 0; index < this.nodeChapterLevelRankArray.length; index ++) {
			let node = this.nodeChapterLevelRankArray[index];
			if (node) {
				node.removeAllChildren();
			}
		}
	}

	private onHideChapterRankEvent() {
		this.nodeChapterLevel.active = false;
	}

	private onEnterGameSceneEvent() {
		this.isFriendRankLock = true;
		this.friendRankList = [];
		this.isSortChapterRankData = true;
		this.chapterRankData = {};
		this.onRemoveRankEvent();
	}
	// ///////////////////////////
	// ///主界面排行榜
	// /////////////////////////
	/**
	 * @description 提交主榜的玩家分数
	 * @param {ILevel} level
	 * @param {number} _medals
	 */
	private submitScoreTotalRank(level: ILevel, _medals: number) {
		Wechat.getUserCloudStorage([this.totalRankCloudStorageKey])
			.then((res: any) => {
				let KVDataList = res.KVDataList;
				let nowTime = Math.round(Date.now() / 1000);
				let totalRankData: any = {
					wxgame: {
						score: '',
						update_time: nowTime
					},
					/** 当前章节 */
					chapter: level.chapter,
					/** 当前关卡 */
					point: level.point,
					/** 勋章总数 */
					medals: _medals
				};

				if (KVDataList.length) {
					let KVDataItem: any = JSON.parse(KVDataList[0].value);
					let multiple = 10000;
					let isFreshLevel = (KVDataItem.chapter * multiple + KVDataItem.point) > (totalRankData.chapter * multiple + totalRankData.point);
					let isFreshMedals = KVDataItem.medals > totalRankData.medals;
					// 无需更新数据
					if (isFreshLevel && isFreshMedals) {
						return null;
					}

					if (isFreshLevel) {
						totalRankData.chapter = KVDataItem.chapter;
						totalRankData.point = KVDataItem.point;
					}

					if (isFreshMedals) {
						totalRankData.medals = KVDataItem.medals;
					}
				}
				let kvData: KVData = {
					key: this.totalRankCloudStorageKey,
					value: JSON.stringify(totalRankData)
				};
				return kvData;

			}).then((res: any) => {
			if (res) {
				Wechat.setUserCloudStorage([res]);
			}
		});
	}

	/**
	 * @description 显示好友排行
	 * @param {Array<UserGameData>} data
	 */
	private showFriendRank() {
		let selfIndex = this.frindSelfIndexInFriendRankList(this.friendRankList);
		let selfOpenData: UserGameData = this.friendRankList[selfIndex];
		if (selfOpenData) {
			let isSelf = true;
			let rank = selfIndex + 1;
			let headUrl = selfOpenData.avatarUrl;
			let nickname = selfOpenData.nickname;
			let value = JSON.parse(selfOpenData.KVDataList[0].value);
			let medals = value.medals;
			let chapter = value.chapter;
			let point = value.point;
			let level = `${chapter}-${point}`;
			this.itemLongRankScript.show(isSelf, rank, headUrl, nickname, level, medals);
		}

		for (let index = 0; index < this.friendRankList.length; index ++) {
			let playerInfo = this.friendRankList[index];
			if (playerInfo && playerInfo.KVDataList.length) {
				let isSelf = false;
				if (index === selfIndex) {
					isSelf = true;
				}
				let prefab = cc.instantiate(this.prefabItemLongRank);
				prefab.parent = this.nodeFriendRankContent;
				let script = prefab.getComponent(ItemLongRank);
				let rank = index + 1;
				let headUrl = playerInfo.avatarUrl;
				let nickname = playerInfo.nickname;
				let value = JSON.parse(playerInfo.KVDataList[0].value);
				let medals = value.medals;
				let chapter = value.chapter;
				let point = value.point;
				let level = `${chapter}-${point}`;
				script.show(isSelf, rank, headUrl, nickname, level, medals);
			}
		}
	}

	/**
	 * @description 对好友总榜数据进行排序
	 * @param {Array<UserGameData>} data
	 * @returns {Array<UserGameData>}
	 */
	private sortFriendRankData(data: Array<UserGameData>) {
		data.sort((item1: UserGameData, item2: UserGameData) => {
			let KVDataListA = item1.KVDataList;
			let	KVDataListB = item2.KVDataList;
			if (!KVDataListA.length && !KVDataListB.length) {
				return 0;
			}
			if (!KVDataListA.length) {
				return 1;
			}
			if (!KVDataListB.length) {
				return -1;
			}
			// 用户的托管 KV 数据列表
			let	kvd_a = JSON.parse(KVDataListA[0].value);
			let kvd_b = JSON.parse(KVDataListB[0].value);
			// key
			let multiple = 10000;
			if ((kvd_a.chapter * multiple + kvd_a.point) > (kvd_b.chapter * multiple + kvd_b.point)) {
				return -1;
			// 章节关卡一致比较勋章数量
			} else if ((kvd_a.chapter * multiple + kvd_a.point) === (kvd_b.chapter * multiple + kvd_b.point)) {
				if (kvd_a.medals > kvd_b.medals) {
					return -1;
				} else if (kvd_a.medals === kvd_b.medals) {
					return 0;
				} else if (kvd_a.medals < kvd_b.medals) {
					return 1;
				}
			} else if ((kvd_a.chapter * multiple + kvd_a.point) < (kvd_b.chapter * multiple + kvd_b.point)) {
				return 1;
			}
		});
		return data;
	}

	/**
	 * @description 查找当前玩家的排列序号
	 * @param {Array<UserGameData>} data
	 * @returns {any}
	 */
	private frindSelfIndexInFriendRankList(data: Array<UserGameData>) {
		let selfIndex = null;
		for (let i = data.length - 1; i >= 0 ; i--) {
			let playerInfo: UserGameData = data[i];
			if (!playerInfo.KVDataList || !playerInfo.KVDataList.length) {
				data.splice(i, 1);
				continue;
			}
			if (this.myOpenId === playerInfo.openid) {
				selfIndex = i;
			}
		}
		return selfIndex;
	}
	// ///////////////////////////
	// ///关卡排行榜
	// /////////////////////////
	/**
	 * @description 提交关卡排行数据
	 * @param {ILevel} level
	 */
	private submitScoreLevelRank(level: ILevel) {
		// 关卡排行榜数据更新
		let levelCloudStorageKey = `${this.chapterRankCloudStorageKey}${level.chapter}`;
		Wechat.getUserCloudStorage([levelCloudStorageKey])
			.then((res: any) => {
				let KVDataList = res.KVDataList;
				let nowTime = Math.round(Date.now() / 1000);
				let levelRankData: any = {
					wxgame: {
						score: '',
						update_time: nowTime
					},
					levelData: {}
				};

				if (!KVDataList.length) {
					levelRankData.levelData[level.point] = level.heighestTime;
				} else {
					let KVDataItem: any = JSON.parse(KVDataList[0].value);

					let heighestTime = KVDataItem.levelData[level.point];
					if (heighestTime) {
						if (heighestTime > level.heighestTime) {
							KVDataItem.levelData[level.point] = level.heighestTime;
							levelRankData.levelData = KVDataItem.levelData;
						} else {
							return null;
						}
					} else {
						KVDataItem.levelData[level.point] = level.heighestTime;
						levelRankData.levelData = KVDataItem.levelData;
					}
				}

				let kvData: KVData = {
					key: levelCloudStorageKey,
					value: JSON.stringify(levelRankData)
				};
				return kvData;
			}).then((res: any) => {
				if (res) {
					Wechat.setUserCloudStorage([res]);
				}
		});
	}

	private showLevelRank(data?: Array<UserGameData>) {
		this.levelRankList = this.sortLevelRankData(data);
		for (let index = 0; index < this.levelRankList.length; index ++) {
			let playerInfo = this.levelRankList[index];
			if (playerInfo && playerInfo.KVDataList.length) {
				let levelRankData: any = JSON.parse(playerInfo.KVDataList[0].value);
				let heighestTime = levelRankData.levelData[this.selectLevel.point];
				if (heighestTime) {
					let prefab = cc.instantiate(this.prefabItemRank);
					prefab.parent = this.nodeLevelRankContent;
					let script = prefab.getComponent(ItemRank);
					let rank = index + 1;
					let headUrl = playerInfo.avatarUrl;
					let nickname = playerInfo.nickname;
					script.show(headUrl, nickname, heighestTime, rank);
				}
			}
		}
	}

	/**
	 * @description 对关卡数据进行排序
	 * @param {Array<UserGameData>} data
	 * @returns {Array<UserGameData>}
	 */
	private sortLevelRankData(data: Array<UserGameData>) {
		data.sort((item1: UserGameData, item2: UserGameData) => {
			let KVDataListA = item1.KVDataList;
			let	KVDataListB = item2.KVDataList;
			if (!KVDataListA.length && !KVDataListB.length) return 0;
			if (!KVDataListA.length) return 1;
			if (!KVDataListB.length) return -1;
			// 用户的托管 KV 数据列表
			// key = `${this.chapterRankCloudStorageKey}${this.selectLevel.chapter}`;
			let	kvd_a = JSON.parse(KVDataListA[0].value);
			let kvd_b = JSON.parse(KVDataListB[0].value);
			if (!kvd_a.levelData[this.selectLevel.point] && !kvd_b.levelData[this.selectLevel.point]) {
				return 0;
			} else if (!kvd_a.levelData[this.selectLevel.point]) {
				return 1;
			} else if (!kvd_b.levelData[this.selectLevel.point]) {
				return -1;
			} else {
				if (kvd_a.levelData[this.selectLevel.point] > kvd_b.levelData[this.selectLevel.point]) {
					return 1;
				} else {
					return -1;
				}
			}
		});
		return data;
	}
	// ///////////////////////////
	// ///章节排行
	// /////////////////////////
	private showChapterRank() {
		let key = `${this.chapterRankDataKey}${this.curChapter}`;
		let chapterRankItem = this.chapterRankData[key];
		if (chapterRankItem) {
			for (let key in chapterRankItem) {
				if (chapterRankItem.hasOwnProperty(key)) {
					let point = Number(key);
					let avatarUrlArray = chapterRankItem[key];
					let length = avatarUrlArray.length;
					let prefab = null;
					let script = null;
					let prefabItemHead = null;
					if (length === 1) {
						prefabItemHead = this.prefabItemHead1;
					} else if (length === 2) {
						prefabItemHead = this.prefabItemHead2;
					} else if (length === 3) {
						prefabItemHead = this.prefabItemHead3;
					}

					if (prefabItemHead) {
						prefab = cc.instantiate(prefabItemHead);
						prefab.parent = this.nodeChapterLevelRankArray[point - 1] || this.nodeChapterLevelRankArray[0];
						script = prefab.getComponent(ItemHead);
						script.show(avatarUrlArray);
					}
				}
			}
		}
	}

	private sortChapterRankData(data: Array<UserGameData>) {
		for (let index = 0; index < data.length; index ++) {
			let itemData = data[index];
			let KVDataItem = JSON.parse(itemData.KVDataList[0].value);
			let key = `${this.chapterRankDataKey}${KVDataItem.chapter}`;
			// 获取好友
			if (itemData.openid !== this.myOpenId) {
				this.chapterRankData[key] = this.chapterRankData[key] || {};
				let chapterRankItem = this.chapterRankData[key];
				chapterRankItem[KVDataItem.point] = chapterRankItem[KVDataItem.point] || [];
				if (chapterRankItem[KVDataItem.point].length <= 3) {
					chapterRankItem[KVDataItem.point].push(itemData.avatarUrl);
				}
			}
		}
	}
}
