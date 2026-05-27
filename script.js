// Cena, câmera e renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // céu azul

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de primeira pessoa
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

// Luzes
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Chão
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Alvo (cubo vermelho)
const targetGeometry = new THREE.BoxGeometry(1, 1, 1);
const targetMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const target = new THREE.Mesh(targetGeometry, targetMaterial);
target.position.set(0, 0.5, -10);
scene.add(target);

// Balas
const bullets = [];
function shoot() {
  const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const bulletMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

  bullet.position.copy(camera.position);
  bullet.userData.velocity = new THREE.Vector3();
  camera.getWorldDirection(bullet.userData.velocity);
  bullet.userData.velocity.multiplyScalar(1);

  scene.add(bullet);
  bullets.push(bullet);
}

document.addEventListener('mousedown', shoot);

// Loop de animação
function animate() {
  requestAnimationFrame(animate);

  // Atualizar balas
  bullets.forEach((bullet, i) => {
    bullet.position.add(bullet.userData.velocity);
    if (bullet.position.distanceTo(camera.position) > 100) {
      scene.remove(bullet);
      bullets.splice(i, 1);
    }
  });

  renderer.render(scene, camera);
}
animate();

// Ajustar tela ao redimensionar
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
