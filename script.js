/* ==========================================================================
   FLEELEARN - ULTRA 3D JAVASCRIPT & THREE.JS LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJsBackground();
  initCalculator();
});

/* ============================================================
   1. THREE.JS ULTRA 3D BACKGROUND (Floating Golden Coins & Gem)
   ============================================================ */
function initThreeJsBackground() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 24;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLightCyan = new THREE.PointLight(0x00f5ff, 2.5, 80);
  pointLightCyan.position.set(-15, 12, 10);
  scene.add(pointLightCyan);

  const pointLightGold = new THREE.PointLight(0xffd700, 3.5, 80);
  pointLightGold.position.set(15, -8, 10);
  scene.add(pointLightGold);

  const pointLightPurple = new THREE.PointLight(0x9b51e0, 2.0, 60);
  pointLightPurple.position.set(0, 0, 15);
  scene.add(pointLightPurple);

  // Group Container
  const objectsGroup = new THREE.Group();
  scene.add(objectsGroup);

  // 3D Golden Coins
  const coinGeometry = new THREE.CylinderGeometry(1.6, 1.6, 0.28, 32);
  const coinMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.88,
    roughness: 0.18,
    emissive: 0x221a00
  });

  const coins = [];
  const numCoins = 18;

  for (let i = 0; i < numCoins; i++) {
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.position.x = (Math.random() - 0.5) * 45;
    coin.position.y = (Math.random() - 0.5) * 35;
    coin.position.z = (Math.random() - 0.5) * 20 - 4;

    coin.rotation.x = Math.random() * Math.PI;
    coin.rotation.y = Math.random() * Math.PI;

    coin.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.025,
      rotSpeedY: (Math.random() - 0.5) * 0.035,
      initialY: coin.position.y
    };

    coins.push(coin);
    objectsGroup.add(coin);
  }

  // Futuristic Holographic Gem
  const gemGeometry = new THREE.IcosahedronGeometry(2.8, 0);
  const gemMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00f5ff,
    metalness: 0.3,
    roughness: 0.1,
    transmission: 0.65,
    thickness: 1.2
  });
  const mainGem = new THREE.Mesh(gemGeometry, gemMaterial);
  mainGem.position.set(16, 5, -2);
  scene.add(mainGem);

  // Gem Wireframe Cage
  const gemWireGeo = new THREE.IcosahedronGeometry(3.2, 1);
  const gemWireMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.25 });
  const wireCage = new THREE.Mesh(gemWireGeo, gemWireMat);
  mainGem.add(wireCage);

  // Glowing Torus Energy Ring
  const ringGeo = new THREE.TorusGeometry(3.5, 0.15, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x9b51e0,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x3d0077
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(-18, -6, -4);
  ring.rotation.x = Math.PI / 3;
  scene.add(ring);

  // Stardust Particles
  const particleCount = 450;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 70;
    particlePositions[i + 1] = (Math.random() - 0.5) * 60;
    particlePositions[i + 2] = (Math.random() - 0.5) * 40;
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00f5ff,
    size: 0.15,
    transparent: true,
    opacity: 0.6
  });
  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Interactive Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Render Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Camera follow mouse smoothly
    targetX = mouseX * 8;
    targetY = -mouseY * 8;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // Rotate Coins
    coins.forEach((c) => {
      c.rotation.x += c.userData.rotSpeedX;
      c.rotation.y += c.userData.rotSpeedY;
      c.position.y = c.userData.initialY + Math.sin(elapsedTime * 2 + c.userData.initialY) * 0.8;
    });

    // Rotate Gem & Cage
    mainGem.rotation.x = elapsedTime * 0.4;
    mainGem.rotation.y = elapsedTime * 0.6;
    wireCage.rotation.y = -elapsedTime * 0.3;

    // Rotate Ring & Particles
    ring.rotation.z = elapsedTime * 0.5;
    ring.rotation.y = Math.sin(elapsedTime * 0.4) * 0.5;
    particleSystem.rotation.y = elapsedTime * 0.03;

    renderer.render(scene, camera);
  }
  animate();
}

/* ============================================================
   2. INTERACTIVE CALCULATOR
   ============================================================ */
let currentMultiplier = 1.6;

function initCalculator() {
  const hoursSlider = document.getElementById('hours-slider');
  const alliesSlider = document.getElementById('allies-slider');
  if (!hoursSlider || !alliesSlider) return;

  hoursSlider.addEventListener('input', calculateEarnings);
  alliesSlider.addEventListener('input', calculateEarnings);
  calculateEarnings();
}

function calculateEarnings() {
  const hoursSlider = document.getElementById('hours-slider');
  const alliesSlider = document.getElementById('allies-slider');
  const hoursDisplay = document.getElementById('hours-display');
  const alliesDisplay = document.getElementById('allies-display');
  const totalMonthly = document.getElementById('total-monthly');
  const totalCrypto = document.getElementById('total-crypto');
  const baseIncomeDisplay = document.getElementById('base-income');
  const bonusIncomeDisplay = document.getElementById('bonus-income');

  if (!hoursSlider) return;

  const hours = parseFloat(hoursSlider.value);
  const allies = parseInt(alliesSlider.value);

  hoursDisplay.textContent = `${hours} Hours / Day`;
  alliesDisplay.textContent = `${allies} Friends`;

  const hourlyRate = 7.0 * currentMultiplier;
  const baseMonthly = Math.round(hours * hourlyRate * 30);
  const affiliateMonthly = Math.round(allies * 30.0);
  const total = baseMonthly + affiliateMonthly;

  totalMonthly.textContent = `$${total.toLocaleString()}.00`;
  totalCrypto.textContent = `${total.toLocaleString()} USDT`;
  baseIncomeDisplay.textContent = `$${baseMonthly.toLocaleString()}.00`;
  bonusIncomeDisplay.textContent = `+$${affiliateMonthly.toLocaleString()}.00`;
}

function setTier(tier, btn) {
  document.querySelectorAll('.tier-btn').forEach(b => {
    b.classList.remove('active', 'border-cyan-500', 'bg-cyan-500/20');
    b.classList.add('border-white/10', 'bg-white/5');
  });
  btn.classList.add('active', 'border-cyan-500', 'bg-cyan-500/20');
  btn.classList.remove('border-white/10', 'bg-white/5');

  const tierLabel = document.getElementById('tier-display');
  if (tier === 1) {
    currentMultiplier = 1.1;
    tierLabel.textContent = "Micro Surveys & Polls";
  } else if (tier === 2) {
    currentMultiplier = 1.6;
    tierLabel.textContent = "Gaming + Beta Testing";
  } else {
    currentMultiplier = 2.4;
    tierLabel.textContent = "VIP High-Roll Tournaments";
  }
  calculateEarnings();
}

/* ============================================================
   3. 3D LUCKY VAULT WHEEL
   ============================================================ */
let isSpinning = false;
let currentWheelRotation = 0;

function spinVaultWheel() {
  if (isSpinning) return;
  isSpinning = true;
  const wheel = document.getElementById('vault-wheel');
  const spinBtn = document.getElementById('spin-btn');
  const spinStatus = document.getElementById('spin-status');

  spinBtn.disabled = true;
  spinBtn.classList.add('opacity-50');
  spinStatus.textContent = "Unlocking Cryptographic Vault Chamber...";

  const randomExtra = Math.floor(Math.random() * 360) + 1800;
  currentWheelRotation += randomExtra;

  wheel.style.transform = `rotate(${currentWheelRotation}deg)`;

  setTimeout(() => {
    isSpinning = false;
    spinBtn.disabled = false;
    spinBtn.classList.remove('opacity-50');
    triggerConfetti();

    const prizes = ["$50.00 PayPal Cash Bonus", "$100 USDT Direct Voucher", "$25 Instant Credit", "5x All-Day Multiplier Booster"];
    const awarded = prizes[Math.floor(Math.random() * prizes.length)];
    
    spinStatus.innerHTML = `<span class="text-brand-emerald font-bold">🎉 CONGRATULATIONS! You won ${awarded}!</span>`;
    alert(`🎉 JACKPOT UNLOCKED!\nYou won: ${awarded}!\nDownload Fleearn to claim it to your account immediately.`);
  }, 4200);
}

function spinWheelModal() {
  const vaultSec = document.getElementById('vault');
  vaultSec.scrollIntoView({ behavior: 'smooth' });
  setTimeout(spinVaultWheel, 600);
}

/* ============================================================
   4. CONFETTI CELEBRATION
   ============================================================ */
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F5FF', '#FFD700', '#00FFA3', '#9B51E0']
    });
  }
}

/* ============================================================
   5. MODALS & FAQ ACCORDION
   ============================================================ */
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function toggleFaq(element) {
  const content = element.querySelector('.text-sm');
  const icon = element.querySelector('i');
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.classList.add('rotate-180');
  } else {
    content.classList.add('hidden');
    icon.classList.remove('rotate-180');
  }
}

// Close modal on escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('downloadModal');
    closeModal('loginModal');
  }
});
