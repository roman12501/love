const canvas = document.getElementById('roseCanvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
const stage = document.getElementById('stage');
const bloomBtn = document.getElementById('bloomBtn');
const progressFill = document.getElementById('progressFill');
const bloomText = document.getElementById('bloomText');
const noteBtn = document.getElementById('noteBtn');
const modal = document.getElementById('letterModal');
const closeBtn = document.getElementById('closeBtn');
const letterText = document.getElementById('letterText');
const yours = document.getElementById('yours');
const phone = document.querySelector('.phone');

let W, H;
function resize(){
  W = phone.clientWidth; H = phone.clientHeight;
  canvas.width = W; canvas.height = H;
}
resize();
window.addEventListener('resize', resize);

let prog = 0;
let loadTimer = setInterval(()=>{
  prog += 2;
  if(prog >= 100){ prog = 100; clearInterval(loadTimer); bloomBtn.disabled = false; bloomBtn.style.opacity = 1; }
  progressFill.style.width = prog + '%';
}, 30);

let hearts = [];
function drawRose(t){
  ctx.clearRect(0,0,W,H);
  let cx = W/2;
  let baseY = H * 0.78;
  // PC me gulab thoda chota, Mobile me thoda bara - auto hisab
  let isMobile = W <= 768;
  let stemH = (H * (isMobile ? 0.34 : 0.38)) * Math.min(1, t*1.6);

  ctx.strokeStyle = '#1faa3a';
  ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, baseY); ctx.lineTo(cx, baseY - stemH); ctx.stroke();

  if(t > 0.3){
    let lp = Math.min(1, (t-0.3)*2);
    ctx.fillStyle = '#1faa3a';
    ctx.beginPath(); ctx.ellipse(cx-26*lp, baseY - stemH*0.55, 26*lp, 11*lp, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+26*lp, baseY - stemH*0.68, 26*lp, 11*lp, 0.4, 0, Math.PI*2); ctx.fill();
  }

  if(t > 0.55){
    let bp = Math.min(1, (t-0.55)*2.2);
    let rx = 12 + bp * (isMobile ? W*0.42 : Math.min(W,H)*0.28);
    let ry = rx * 0.72;
    let cy = baseY - stemH - ry*0.6;

    let grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, rx*2);
    grad.addColorStop(0, 'rgba(255,0,40,0.35)');
    grad.addColorStop(1, 'rgba(255,0,40,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, rx*2, 0, Math.PI*2); ctx.fill();

    for(let i=0;i<9;i++){
      let ang = (i/9)*Math.PI*2 - Math.PI/2;
      let px = cx + Math.cos(ang)*rx*0.62;
      let py = cy + Math.sin(ang)*ry*0.62;
      ctx.fillStyle = i%2==0 ? '#e60023' : '#ff1e3c';
      ctx.beginPath(); ctx.ellipse(px, py, rx*0.55, ry*0.55, ang, 0, Math.PI*2); ctx.fill();
    }
    for(let i=0;i<7;i++){
      let ang = (i/7)*Math.PI*2;
      let px = cx + Math.cos(ang)*rx*0.35;
      let py = cy + Math.sin(ang)*ry*0.35;
      ctx.fillStyle = '#ff2e4d';
      ctx.beginPath(); ctx.ellipse(px, py, rx*0.38, ry*0.38, ang, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = '#c4001a';
    ctx.beginPath(); ctx.arc(cx, cy, rx*0.22*bp+4, 0, Math.PI*2); ctx.fill();
  }

  hearts.forEach(h=>{
    h.y -= h.speed; h.x += Math.sin(h.y*0.02)*0.5; h.life -= 0.004;
    ctx.globalAlpha = Math.max(0, h.life);
    ctx.fillStyle = '#ff2e4d';
    ctx.font = h.size + 'px Arial';
    ctx.fillText('♥', h.x, h.y);
    ctx.globalAlpha = 1;
  });
  hearts = hearts.filter(h=>h.life>0);
  if(Math.random()<0.08) hearts.push({x: W/2 + (Math.random()-0.5)*200, y: H*0.50, speed: 0.6+Math.random(), size: 10+Math.random()*12, life: 1});
}

bloomBtn.addEventListener('click', ()=>{
  loader.style.transition = 'opacity 0.6s, transform 0.6s';
  loader.style.opacity = 0; loader.style.transform = 'scale(0.8)';
  setTimeout(()=>{
    loader.classList.add('hidden');
    stage.classList.remove('hidden');
    resize();
    let start = null;
    function step(ts){
      if(!start) start = ts;
      let p = (ts-start)/2800; if(p>1) p=1;
      drawRose(p);
      if(p<1) requestAnimationFrame(step);
      else{ bloomText.classList.remove('hidden'); setInterval(()=>{ drawRose(1); }, 50); }
    }
    requestAnimationFrame(step);
  }, 600);
});

const fullLetter = `Every single line of this code was written with you in my heart. Just like this digital rose, my love for you blooms uniquely, growing stronger and more beautiful with every passing moment.

You are the brightness in my thoughts, the rhythm in my heart, and the warmth in my life. This rose is a small reflection of my feelings—timeless, true, and forever yours. 
 WILL YOU BE MINE? , I LOVE YOU😘🥰`;

noteBtn.addEventListener('click', ()=>{
  modal.classList.remove('hidden');
  letterText.textContent = ''; yours.classList.add('hidden');
  let i = 0;
  let type = setInterval(()=>{
    letterText.textContent += fullLetter[i]; i++;
    if(i >= fullLetter.length){ clearInterval(type); yours.classList.remove('hidden'); }
  }, 18);
});
closeBtn.addEventListener('click', ()=>{ modal.classList.add('hidden'); });