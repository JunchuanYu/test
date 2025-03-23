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
let gravity = 1;
let elasticity = 0.8;
let balls = [];

// 球类
class Ball {
    constructor(x, y, radius = 20) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    }

    update() {
        // 应用重力
        this.vy += gravity;

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 边界碰撞检测
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -elasticity;
        }
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -elasticity;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -elasticity;
        }
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -elasticity;
        }

        // 球之间的碰撞检测
        balls.forEach(ball => {
            if (ball === this) return;
            
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + ball.radius) {
                // 碰撞响应
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // 旋转速度
                const vx1 = this.vx * cos + this.vy * sin;
                const vy1 = this.vy * cos - this.vx * sin;
                const vx2 = ball.vx * cos + ball.vy * sin;
                const vy2 = ball.vy * cos - ball.vx * sin;

                // 碰撞后的速度
                const finalVx1 = ((this.radius - ball.radius) * vx1 + (2 * ball.radius) * vx2) / (this.radius + ball.radius) * elasticity;
                const finalVx2 = ((ball.radius - this.radius) * vx2 + (2 * this.radius) * vx1) / (this.radius + ball.radius) * elasticity;

                // 旋转回原始坐标系
                this.vx = finalVx1 * cos - vy1 * sin;
                this.vy = vy1 * cos + finalVx1 * sin;
                ball.vx = finalVx2 * cos - vy2 * sin;
                ball.vy = vy2 * cos + finalVx2 * sin;

                // 防止球重叠
                const overlap = (this.radius + ball.radius - distance) / 2;
                this.x -= overlap * cos;
                this.y -= overlap * sin;
                ball.x += overlap * cos;
                ball.y += overlap * sin;
            }
        });
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// 动画循环
function animate() {
    // 使用完全不透明的黑色背景
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加轨迹效果
    ctx.globalAlpha = 0.3;
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    });
    ctx.globalAlpha = 1.0;

    // 绘制当前球的位置
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });

    requestAnimationFrame(animate);
}

// 事件处理
canvas.addEventListener('click', (e) => {
    const ball = new Ball(e.clientX, e.clientY);
    balls.push(ball);
});

// 控制面板功能
function addBall() {
    const ball = new Ball(
        Math.random() * (canvas.width - 40) + 20,
        Math.random() * (canvas.height - 40) + 20
    );
    balls.push(ball);
}

function clearBalls() {
    balls = [];
}

// 更新物理参数
document.getElementById('gravity').addEventListener('input', (e) => {
    gravity = parseFloat(e.target.value);
});

document.getElementById('elasticity').addEventListener('input', (e) => {
    elasticity = parseFloat(e.target.value);
});

// 启动动画
animate(); 