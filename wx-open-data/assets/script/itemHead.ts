import Tool from './tool';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemHead extends cc.Component {

	// ///////////////////////////
	// ///属性检查器
	// /////////////////////////
	@property(cc.Integer)
	private headNum = 10;
	@property([cc.Sprite])
	private spHeadArray: cc.Sprite[] = [];
	// ///////////////////////////
	// ///成员变量
	// /////////////////////////

	// ///////////////////////////
	// ///cc.class 生命周期函数
	// /////////////////////////
	public show(headUrlArray: Array<string>) {
		for (let index = 0 ; index < this.headNum; index ++) {
			Tool.showRemoteImage(this.spHeadArray[index], headUrlArray[index]);
		}
	}
	// ///////////////////////////
	// ///业务逻辑(control层)
	// /////////////////////////

	// ///////////////////////////
	// ///事件
	// /////////////////////////

	// ///////////////////////////
	// ///view层
	// /////////////////////////
}
