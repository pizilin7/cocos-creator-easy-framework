const global = {
	WXMESSAGE: {
		/** 获取当前用户的openid */
		GET_OPENID: 0,
		/** 提交得分 */
		SUBMIT_SCORE: 1,
		/** 显示好友排行总榜 */
		SHOW_FRIEND_RANK: 2,
		/** 隐藏好友排行总榜 */
		HIDE_FRIEND_RANK: 3,
		/** 好友排行总榜进入章节排行 */
		ENTER_CHAPTER_RANK: 4,
		/** 移除好友排行总榜 */
		REMOVE_FRIEND_RANK: 4,
		/** 显示好友排行关卡榜 */
		SHOW_LEVEL_RANK: 5,
		/** 隐藏好友排行关卡榜 */
		HIDE_LEVEL_RANK: 6,
		/** 移除好友排行关卡榜 */
		REMOVE_LEVEL_RANK: 7,
		/** 切换章节好友排行 */
		SWITCH_CHAPTER_RANk: 8,
		SHOW_CHAPTER_RANK: 9,
		/** 隐藏章节排行 */
		HIDE_CHAPTER_RANk: 10,
		/** 移除章节好友排行 */
		REMOVE_CHAPTER_RANK: 11,
		/** 从选章节界面进入游戏内界面 */
		ENTER_GAME_SCENE: 12,
		/** 从LEVEL界面进入选关界面 */
		ENTER_CHANPTER_RANK: 13
	}
};

export default global;
