# 自由训练场景优化验收

- 三个本地摄影背景：力量、普拉提、阻力有氧，JPEG 1200×800，各约 100–126 KB。
- 本页中英文文案、训练特点、设置训练入口；整张入口可点击，保留训练类型到预设页的数据流。
- 读取现有 selectedDevice：已连接进入设备管理；未连接进入局域网发现，不阻止选择场景。
- 390×844 与 1280×900 中英文布局已检查，截图见本目录；入口最小高度 176px、间距 12px、内容最大宽度 760px。
- 浏览器验证三个入口分别显示正确的预设类型；验证断开设备后的状态与发现入口。
- npm run lint（tsc --noEmit）通过；带部署子路径的 Web 导出通过。
- 图片错误时保留暗色底、文案与操作。没有新增真实设备通信或后端 API；未执行 Android/iOS 真机测试。

## 图片生成记录

使用内置 imagegen；最终资产保存在 assets/training/{strength,pilates,cardio}.jpg。
以下共同提示词分别加上各场景提示词，用于三个独立生成请求：

> Use case: photorealistic-natural. Asset: wide 3:2 photographic background for a premium dark fitness app training entry, cropped as a shallow landscape banner. Editorial sports photography, realistic anatomy, charcoal studio, soft directional side lighting, desaturated natural skin, subtle film grain. Athlete and action placed in the RIGHT half, LEFT half mostly quiet dark negative space for white UI copy. No text, no logos, no watermarks, no identifiable branded equipment, no futuristic machines.

Strength:
> An athletic adult man in a black sleeveless shirt doing a standing cable resistance row, tensioned cable handle in hands, chest and arms visibly engaged, controlled posture, dramatic close three-quarter frame with handle and cable entering from right. Restrained warm neutral highlights.

Pilates:
> An athletic adult woman in muted grey exercise clothing performing a controlled side stretch in a kneeling Pilates pose on a mat, long elegant arm line and stable core, full upper body visible on right, tranquil charcoal studio with soft cool daylight.

Cardio:
> An athletic adult woman in dark sportswear doing a dynamic standing resistance-band punch with a stable staggered stance, elastic band clearly visible under tension, energetic athletic movement, crisp subject with subtle background motion blur, restrained neutral lighting.
