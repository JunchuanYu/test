# Remote Sensing Data Viewer

一个基于 Leaflet 的遥感数据可视化工具，支持多种卫星影像底图切换和交互式绘制功能。

## 功能特点

- 支持多种卫星影像底图（ESRI World Imagery、Google Maps、Bing Maps）
- 交互式绘制工具（多边形、矩形、圆形、标记等）
- 实时坐标和缩放级别显示
- 响应式设计，适配各种设备

## 使用方法

1. 打开网页后，默认显示 ESRI World Imagery 底图
2. 使用右上角的底图选择器切换不同的卫星影像
3. 点击"绘制工具"按钮进行区域标注
4. 使用"清除绘制"按钮删除所有标注

## 在线访问

访问 [https://[你的GitHub用户名].github.io/remote-sensing-viewer](https://[你的GitHub用户名].github.io/remote-sensing-viewer) 查看在线演示。

## 本地运行

1. 克隆仓库：
```bash
git clone https://github.com/[你的GitHub用户名]/remote-sensing-viewer.git
```

2. 使用本地服务器运行（例如 Python 的简单 HTTP 服务器）：
```bash
python -m http.server 8000
```

3. 在浏览器中访问 `http://localhost:8000` 