import Tool from './tool';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemLongRank extends cc.Component {

	// ///////////////////////////
	// ///属性检查器
	// /////////////////////////
	@property(cc.Label)
	private labName: cc.Label = null;
	@property(cc.Label)
	private labLevel: cc.Label = null;
	@property(cc.Label)
	private labMedal: cc.Label = null;
	@property(cc.Label)
	private labRank: cc.Label = null;
	@property(cc.Sprite)
	private spRank: cc.Sprite = null;
	@property(cc.Sprite)
	private spHead: cc.Sprite = null;
	@property(cc.Sprite)
	private spHeadFrame: cc.Sprite = null;
	@property(cc.Sprite)
	private spSelfBg: cc.Sprite = null;
	@property([cc.SpriteFrame])
	private sfRankArray: cc.SpriteFrame[] = [];
	@property([cc.SpriteFrame])
	private sfHeadFrameArray: cc.SpriteFrame[] = [];
	// ///////////////////////////
	// ///成员变量
	// /////////////////////////

	// ///////////////////////////
	// ///cc.class 生命周期函数
	// /////////////////////////
	public start() {

	}

	public onDestroy() {

	}
	// ///////////////////////////
	// ///业务逻辑(control层)
	// /////////////////////////
	/**
	 * @description 显示玩家排行
	 * @param {boolean} isSelf
	 * @param {number} rank
	 * @param {string} headUrl
	 * @param {string} name
	 * @param {string} level
	 * @param {number} medal
	 */
	public show(isSelf: boolean, rank: number, headUrl: string, name: string, level: string, medal: number) {
		this.labMedal.string = `x${medal}`;
		this.labLevel.string = `${level}`;
		// 显示前三排行
		if (rank >= 1 && rank <= 3) {
			this.spRank.node.active = true;
			this.spRank.spriteFrame = this.sfRankArray[rank - 1] || this.sfRankArray[0];
			this.spHeadFrame.spriteFrame = this.sfHeadFrameArray[rank - 1] || this.sfHeadFrameArray[0];
		} else {
			this.labRank.string = String(rank);
		}

		if (isSelf) {
			this.spSelfBg.enabled = true;
			let color = new cc.Color().fromHEX('#ecc997');
			this.labLevel.node.color = color;
			this.labName.node.color = color;
			this.labRank.node.color = color;
			this.labMedal.node.color = color;
			this.labLevel.fontSize = 24;
			this.labName.fontSize = 24;
			this.labMedal.fontSize = 24;
		}
		Tool.showRemoteImage(this.spHead, headUrl);
		this.labName.string = Tool.matchStr(name, 6);
	}

	// ///////////////////////////
	// ///事件
	// /////////////////////////

	// ///////////////////////////
	// ///view层
	// /////////////////////////
}
