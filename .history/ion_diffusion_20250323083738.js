const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 设置画布大小为窗口大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 物理参数
let temperature = 1;
let ionStrength = 1;
let ions = [];
const k = 8.99e9; // 库仑常数
const ionRadius = 5;
const maxSpeed = 5;

// 离子类
class Ion {
    constructor(x, y, charge) {
        this.x = x;
        this.y = y;
        this.charge = charge; // 1 为正离子，-1 为负离子
        this.vx = (Math.random() - 0.5) * maxSpeed;
        this.vy = (Math.random() - 0.5) * maxSpeed;
        this.color = charge > 0 ? '#ff4444' : '#4444ff';
    }

    update() {
        // 布朗运动
        this.vx += (Math.random() - 0.5) * temperature;
        this.vy += (Math.random() - 0.5) * temperature;

        // 限制最大速度
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 边界碰撞
        if (this.x - ionRadius < 0) {
            this.x = ionRadius;
            this.vx *= -0.8;
        }
        if (this.x + ionRadius > canvas.width) {
            this.x = canvas.width - ionRadius;
            this.vx *= -0.8;
        }
        if (this.y - ionRadius < 0) {
            this.y = ionRadius;
            this.vy *= -0.8;
        }
        if (this.y + ionRadius > canvas.height) {
            this.y = canvas.height - ionRadius;
            this.vy *= -0.8;
        }

        // 离子间相互作用
        ions.forEach(ion => {
            if (ion === this) return;

            const dx = ion.x - this.x;
            const dy = ion.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                // 库仑力
                const force = (k * this.charge * ion.charge * ionStrength) / (distance * distance);
                const angle = Math.atan2(dy, dx);
                
                // 应用力
                const fx = force * Math.cos(angle);
                const fy = force * Math.sin(angle);
                
                this.vx += fx * 0.01;
                this.vy += fy * 0.01;
                ion.vx -= fx * 0.01;
                ion.vy -= fy * 0.01;
            }
        });
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, ionRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// 动画循环
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ions.forEach(ion => {
        ion.update();
        ion.draw();
    });

    // 更新离子计数
    document.getElementById('positiveCount').textContent = ions.filter(ion => ion.charge > 0).length;
    document.getElementById('negativeCount').textContent = ions.filter(ion => ion.charge < 0).length;

    requestAnimationFrame(animate);
}

// 添加离子
function addIons(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * (canvas.width - 2 * ionRadius) + ionRadius;
        const y = Math.random() * (canvas.height - 2 * ionRadius) + ionRadius;
        const charge = Math.random() < 0.5 ? 1 : -1;
        ions.push(new Ion(x, y, charge));
    }
}

// 清除所有离子
function clearIons() {
    ions = [];
}

// 更新物理参数
document.getElementById('temperature').addEventListener('input', (e) => {
    temperature = parseFloat(e.target.value);
});

document.getElementById('ionStrength').addEventListener('input', (e) => {
    ionStrength = parseFloat(e.target.value);
});

// 启动动画
animate(); 