/* ============================================
   极客风格个人网站 - 脚本
   粒子背景 + 打字机 + 鼠标光晕 + 滚动动画
============================================ */

// ============================================
// 1. 粒子背景系统
// ============================================
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            // 边界回弹
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 157, ${this.opacity})`;
            ctx.fill();
        }
    }

    // 初始化粒子
    function createParticles() {
        particles = [];
        const count = Math.min(100, Math.floor(canvas.width * canvas.height / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    createParticles();
    window.addEventListener('resize', createParticles);

    // 连线
    function connectParticles() {
        const maxDist = 120;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.2;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 157, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
            // 鼠标连线
            if (mouse.x !== null) {
                const dx = particles[a].x - mouse.x;
                const dy = particles[a].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.5;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();

    // 鼠标位置
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
})();


// ============================================
// 2. 鼠标光晕跟随
// ============================================
(function initCursorGlow() {
    if (window.innerWidth <= 768) return;
    const glow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
})();


// ============================================
// 3. 终端打字机效果
// ============================================
(function initTerminal() {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    const lines = CONFIG.terminalLines;
    let lineIndex = 0;

    function typeLine() {
        if (lineIndex >= lines.length) return;
        const line = document.createElement('div');
        line.className = 'line';
        output.appendChild(line);

        const text = lines[lineIndex];
        let charIndex = 0;

        function typeChar() {
            if (charIndex < text.length) {
                line.textContent = text.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeChar, 40);
            } else {
                lineIndex++;
                if (lineIndex < lines.length) {
                    setTimeout(typeLine, 300);
                } else {
                    // 添加闪烁光标
                    const cursor = document.createElement('span');
                    cursor.className = 'cursor-blink';
                    line.appendChild(cursor);
                }
            }
        }
        typeChar();
    }

    // 延迟启动
    setTimeout(typeLine, 800);
})();


// ============================================
// 4. 动态渲染技能卡片
// ============================================
(function renderSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    CONFIG.skills.forEach((skill, i) => {
        const card = document.createElement('div');
        card.className = 'skill-card fade-in';
        card.style.transitionDelay = (i * 0.1) + 's';
        card.innerHTML = `
            <div class="skill-icon">${skill.icon}</div>
            <h3>${skill.name}</h3>
            <p>${skill.tech}</p>
            <div class="skill-bar"><div class="skill-progress" data-width="${skill.level}%"></div></div>
        `;
        grid.appendChild(card);
    });
})();


// ============================================
// 5. 动态渲染作品集
// ============================================
(function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    CONFIG.projects.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        card.style.transitionDelay = (i * 0.1) + 's';
        card.innerHTML = `
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <span class="project-tech">${p.tech}</span>
        `;
        grid.appendChild(card);
    });
})();


// ============================================
// 6. 动态渲染社交链接
// ============================================
(function renderSocial() {
    const container = document.getElementById('social-links');
    if (!container) return;
    CONFIG.social.forEach(s => {
        const link = document.createElement('a');
        link.href = s.url;
        link.className = 'social-btn';
        link.innerHTML = `${s.icon} ${s.name}`;
        container.appendChild(link);
    });
})();


// ============================================
// 7. 滚动进入动画 + 技能进度条
// ============================================
(function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 触发技能进度条
                const bars = entry.target.querySelectorAll('.skill-progress');
                bars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    // 也观察 about-card
    const aboutCard = document.querySelector('.about-card');
    if (aboutCard) {
        aboutCard.classList.add('fade-in');
        observer.observe(aboutCard);
    }
})();


// ============================================
// 8. 导航栏滚动效果
// ============================================
(function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 20, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 14, 20, 0.85)';
        }
    });
})();


// ============================================
// 9. 平滑滚动
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

console.log('%c⚡ Harley | 极客个人网站已加载', 'color: #00ff9d; font-size: 16px; font-weight: bold;');