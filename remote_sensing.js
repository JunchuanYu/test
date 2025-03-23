// 初始化地图
const map = L.map('map').setView([35.0, 105.0], 4); // 中国中心位置

// 图层定义
const layers = {
    esri: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
    }),
    google: L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    bing: L.tileLayer('https://ecn.t{s}.tiles.virtualearth.net/tiles/a{q}?g=1278&n=z', {
        maxZoom: 19,
        subdomains: ['0', '1', '2', '3', '4']
    })
};

// 当前激活的图层
let currentLayer = layers.esri;

// 初始化图层
function initLayers() {
    // 添加默认ESRI图层
    currentLayer.addTo(map);
    
    // 添加图层控制器
    L.control.layers(layers).addTo(map);
}

// 绘制工具
let drawControl;
let drawnItems = new L.FeatureGroup();

function initDrawTools() {
    drawnItems.addTo(map);
    
    drawControl = new L.Control.Draw({
        draw: {
            polygon: true,
            rectangle: true,
            circle: true,
            circlemarker: true,
            marker: true,
            polyline: true
        },
        edit: {
            featureGroup: drawnItems,
            remove: true
        }
    });
    
    map.addControl(drawControl);
    
    // 绘制事件监听
    map.on('draw:created', function(e) {
        drawnItems.addLayer(e.layer);
    });
}

// 切换绘制工具
function toggleDraw() {
    if (map.hasControl(drawControl)) {
        map.removeControl(drawControl);
    } else {
        map.addControl(drawControl);
    }
}

// 清除绘制
function clearDrawings() {
    drawnItems.clearLayers();
}

// 更新图层
function updateLayers() {
    const selectedLayer = document.getElementById('satellite').value;
    
    // 移除当前图层
    map.removeLayer(currentLayer);
    
    // 添加新图层
    currentLayer = layers[selectedLayer];
    currentLayer.addTo(map);
}

// 更新信息面板
function updateInfo(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    document.getElementById('coordinates').textContent = `${lat}, ${lng}`;
    document.getElementById('zoom').textContent = map.getZoom();
}

// 事件监听
map.on('mousemove', updateInfo);
map.on('zoomend', updateInfo);

// 初始化
initLayers();
initDrawTools();

// 添加图层切换事件监听
document.getElementById('satellite').addEventListener('change', updateLayers);

// 初始化信息面板
updateInfo({ latlng: map.getCenter() }); 