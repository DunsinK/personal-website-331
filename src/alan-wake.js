function createAlanWakeGame(stage, gameRoot) {
    const container = stage.querySelector('.alan-canvas');
    const score = gameRoot.querySelector('.alan-score');
    const alanStatus = gameRoot.querySelector('.alan-status');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080d12);
    scene.fog = new THREE.Fog(0x080d12, 12, 42);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 7, 9);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.append(renderer.domElement);
    const ambient = new THREE.HemisphereLight(0x668099, 0x080808, 1.1);
    scene.add(ambient);
    const moon = new THREE.DirectionalLight(0xaac7ff, 1.8);
    moon.position.set(-5, 10, 4);
    moon.castShadow = true;
    scene.add(moon);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshStandardMaterial({ color: 0x17221d, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const player = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, 1.1, 8), new THREE.MeshStandardMaterial({ color: 0x314d5b }));
    player.position.y = 1;
    player.castShadow = true;
    scene.add(player);
    const flashlight = new THREE.SpotLight(0xdcecff, 18, 18, Math.PI / 8, .45, 1);
    flashlight.position.set(0, 1.5, 0);
    flashlight.target.position.set(0, 1, -8);
    scene.add(flashlight, flashlight.target);
    const ghosts = [];
    const shots = [];
    const keys = new Set();
    let points = 0;
    let active = true;
    const ghostMaterial = new THREE.MeshStandardMaterial({ color: 0x9b1747, emissive: 0x26000f });
    for (let index = 0; index < 5; index += 1) {
        const ghost = new THREE.Mesh(new THREE.SphereGeometry(.65, 12, 8), ghostMaterial.clone());
        ghost.position.set((index - 2) * 2.5, .8, -8 - (index % 2) * 3);
        ghost.castShadow = true;
        scene.add(ghost);
        ghosts.push(ghost);
    }
    const resize = () => {
        const width = container.clientWidth || 640;
        const height = container.clientHeight || 360;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    };
    const shoot = () => {
        if (!active) return;
        const shot = new THREE.Mesh(new THREE.SphereGeometry(.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfff3b0 }));
        shot.position.copy(player.position);
        shot.position.y = 1;
        shot.userData.velocity = new THREE.Vector3(0, 0, -1).multiplyScalar(15);
        scene.add(shot);
        shots.push(shot);
    };
    const onKeyDown = event => {
        keys.add(event.key.toLowerCase());
        if (event.code === 'Space') {
            event.preventDefault();
            shoot();
        }
    };
    const onKeyUp = event => keys.delete(event.key.toLowerCase());
    const onPointerDown = () => shoot();
    const clock = new THREE.Clock();
    let animationFrame;
    const animate = () => {
        if (!active) return;
        animationFrame = requestAnimationFrame(animate);
        const delta = Math.min(clock.getDelta(), .05);
        const direction = new THREE.Vector3(
            (keys.has('d') ? 1 : 0) - (keys.has('a') ? 1 : 0),
            0,
            (keys.has('s') ? 1 : 0) - (keys.has('w') ? 1 : 0)
        );
        if (direction.lengthSq()) player.position.add(direction.normalize().multiplyScalar(delta * 5));
        player.position.x = THREE.MathUtils.clamp(player.position.x, -8, 8);
        player.position.z = THREE.MathUtils.clamp(player.position.z, -12, 8);
        flashlight.position.copy(player.position).add(new THREE.Vector3(0, .8, 0));
        flashlight.target.position.set(player.position.x, 1, player.position.z - 8);
        camera.position.lerp(new THREE.Vector3(player.position.x, 7, player.position.z + 9), .08);
        camera.lookAt(player.position.x, 0, player.position.z - 4);
        shots.forEach((shot, shotIndex) => {
            shot.position.addScaledVector(shot.userData.velocity, delta);
            if (shot.position.z < -30) {
                scene.remove(shot);
                shots.splice(shotIndex, 1);
            }
            ghosts.forEach((ghost) => {
                if (ghost.visible && shot.position.distanceTo(ghost.position) < 1) {
                    ghost.visible = false;
                    scene.remove(shot);
                    points += 1;
                    score.textContent = String(points);
                }
            });
        });
        ghosts.forEach(ghost => {
            if (!ghost.visible) return;
            ghost.lookAt(player.position);
            ghost.position.lerp(new THREE.Vector3(player.position.x, .8, player.position.z), delta * .18);
            if (ghost.position.distanceTo(player.position) < 1) {
                active = false;
                alanStatus.textContent = 'The darkness caught you. Exit and try again.';
            }
        });
        renderer.render(scene, camera);
    };
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    resize();
    animate();
    return () => {
        active = false;
        cancelAnimationFrame(animationFrame);
        window.removeEventListener('resize', resize);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.dispose();
        container.replaceChildren();
    };
}
