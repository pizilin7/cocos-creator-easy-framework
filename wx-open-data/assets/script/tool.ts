export default class Tool {
	/**
	 * @description 加载远程头像
	 * @param spHead
	 * @param headUrl
	 */
	public static showRemoteImage(spHead: cc.Sprite, headUrl: string) {
		if (!headUrl) {
			// console.error('showRemoteImage error');
			return ;
		}
		new Promise((resolve, reject) => {
			cc.loader.load({url: headUrl, type: 'jpg'}, (err, data) => {
				if (err) {
					// return console.error(err);
				}
				resolve(new cc.SpriteFrame(data));
			});
		}).then((data: cc.SpriteFrame) => {
			spHead.spriteFrame = data;
		});
	}

	/**
	 * @description 匹配用户名称
	 * @param {string} str
	 * @param {number} x
	 * @returns {string}
	 */
	public static matchStr(str: string, x = 4): string {
		if (!str) {
			return;
		}
		let newStr = str;
		if (str.length >= x) {
			newStr = str.slice(0, 4) + '...';
		}
		return newStr;
	}

	public static timerFormat1(_time) {
		let ms = Math.floor(_time % 1000);
		let s = Math.floor(_time / 1000);
		let m = Math.floor(s / 60);
		s = s % 60;
		let str_m = m < 10 ? '0' + m : m;
		let str_s = s < 10 ? '0' + s : s;
		let str_ms: any = ms;
		ms = Math.floor(ms / 10);
		if (ms === 0) {
			str_ms = '00';
		} else if (ms < 100) {
			str_ms = ms < 10 ? '0' + ms : ms;
		}
		return `${str_m}:${str_s}.${str_ms}`;
	}
}
