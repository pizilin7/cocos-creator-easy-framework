/**
 * @description 声音模块
 */
class audio {
	////////////////////////////
	// 类成员
	///////////////////////////
	public static readonly _instance = new audio();
	private _isOpen = 1;
	private _soundStorageKey = 'SOUND';
	private _filePath = '';
	private soundResouces: cc.AudioClip[] = [];
	private musicID = 0;
	////////////////////////////
	//// get、set访问器
	/////////////////////////////
	public get isOpen(): number {
		return this._isOpen;
	}

	public set isOpen(num: number) {
		this._isOpen = num;
		cc.sys.localStorage.setItem(this._soundStorageKey);
	}

	public set filePath(path: string) {
		this._filePath = path;
	}

	public set soundStorageKey(key: string) {
		this._soundStorageKey = key;
	}

	////////////////////////////
	// 接口
	///////////////////////////
	private constructor() {
		this._isOpen = cc.sys.localStorage.getItem(this._soundStorageKey) || 1;
	}

	/**
	 * @description 加载音乐文件
	 */
	public loadAudioResoucre() {
		return new Promise((resolve, reject) => {
			cc.loader.loadResDir(this._filePath, cc.AudioClip, (error: Error, resources: any[]) => {
				if (error) {
					console.log('load sound error: ', error);
					reject();
					return;
				}
				for (let index = 0; index < resources.length; index++) {
					let soundResouce = resources[index];
					this.soundResouces[soundResouce._name] = soundResouce;
				}
				resolve();
				console.log('load sound resources success');
			});
		});
	}

	/**
	 * @description 播放音乐（默认循环）
	 * @param {string} fileName
	 */
	public playMusic(fileName: string) {
		let id = this.play(fileName, true);
		if (id) {
			this.musicID = id;
		}
	}

	/**
	 * @description 播放音效
	 * @param {string} fileName
	 */
	public playEffect(fileName: string) {
		this.play(fileName, false);
	}

	/**
	 * @description 暂停声音
	 */
	public pause() {
		if (this.isOpen) {
			cc.audioEngine.stop(this.musicID);
		}
	}

	/**
	 * @description 重起声音
	 */
	public resume() {
		if (this.isOpen) {
			cc.audioEngine.resume(this.musicID);
		}
	}
	////////////////////////////
	// 业务逻辑
	///////////////////////////
	/**
	 * @description 播放声音
	 * @param fileName
	 * @param loop
	 */
	private play(fileName: string, loop: boolean) {
		if (!this._isOpen) {
			return null;
		}
		let file = this.soundResouces[fileName];
		if (!file) {
			console.error('sound: fieName is error, please check it');
			return null;
		}
		let volume = 1;
		return cc.audioEngine.play(file, loop, volume);
	}
}

export const AudioMgr = audio._instance;
