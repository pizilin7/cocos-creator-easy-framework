import Tool from './tool';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemRank extends  cc.Component {
	// ///////////////////////////
	// ///属性检查器
	// /////////////////////////
	@property(cc.Sprite)
	private spHead: cc.Sprite = null;
	@property(cc.Label)
	private labBestTime: cc.Label = null;
	@property(cc.Label)
	private labName: cc.Label = null;
	@property(cc.Sprite)
	private spRank: cc.Sprite = null;
	@property([cc.SpriteFrame])
	private sfRankArray: cc.SpriteFrame[] = [];
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
	public show(url: string, name: string, bestTime: string, rank: number) {
		Tool.showRemoteImage(this.spHead, url);
		this.labName.string = Tool.matchStr(name, 4);
		this.labBestTime.string = Tool.timerFormat1(bestTime);
		// 只显示前三名
		if (rank >= 1 && rank <= 3) {
			this.spRank.spriteFrame = this.sfRankArray[rank - 1] || this.sfRankArray[0];
		}
	}
	// ///////////////////////////
	// ///事件
	// /////////////////////////

	// ///////////////////////////
	// ///view层
	// /////////////////////////
}
