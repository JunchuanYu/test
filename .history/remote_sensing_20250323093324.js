// Initialize the map
const map = L.map('map').setView([35.8617, 104.1954], 4); // Center on China

// Add ESRI World Imagery as the base layer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

// Update coordinates display
map.on('mousemove', function(e) {
    document.getElementById('coordinates').textContent = 
        e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4);
});

// Add click event to show coordinates
map.on('click', function(e) {
    L.popup()
        .setLatLng(e.latlng)
        .setContent('Coordinates: ' + e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4))
        .openOn(map);
});

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