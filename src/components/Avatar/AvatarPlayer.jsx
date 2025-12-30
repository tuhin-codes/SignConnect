import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function AvatarPlayer({ sign }) {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    if (!mountRef.current || !sign) return;

    /* ---------- CLEAN OLD RENDER ---------- */
    mountRef.current.innerHTML = "";

    /* ---------- SCENE ---------- */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0b1220");
    sceneRef.current = scene;

    /* ---------- CAMERA ---------- */
    const camera = new THREE.PerspectiveCamera(
      35,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.55, 4.2);
    camera.lookAt(0, 1.25, 0);

    /* ---------- RENDERER ---------- */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    /* ---------- LIGHTING ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(3, 6, 4);
    scene.add(dirLight);

    /* ---------- LOAD MODEL ---------- */
    const loader = new GLTFLoader();

    loader.load(
      `/avatars/${sign}.glb`,
      (gltf) => {
        const model = gltf.scene;

        /* CENTER MODEL */
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);
        model.position.y += size.y / 2.15; // full body visible
        model.scale.set(1.15, 1.15, 1.15);

        scene.add(model);

        /* ---------- ANIMATION ---------- */
        mixerRef.current = new THREE.AnimationMixer(model);

        if (gltf.animations.length > 0) {
          const action = mixerRef.current.clipAction(gltf.animations[0]);

          const speedMap = {
            HELLO: 0.7,
            YES: 0.90,
            NO: 0.90,       // fixed (was too fast)
            THANKYOU: 0.65,
            SORRY: 0.6,
          };

          action.reset();
          action.setLoop(THREE.LoopRepeat);
          action.clampWhenFinished = false;
          action.timeScale = speedMap[sign] ?? 0.7;
          action.play();
        }
      },
      undefined,
      (err) => {
        console.error("Avatar load error:", err);
      }
    );

    /* ---------- RENDER LOOP ---------- */
    const animate = () => {
      requestAnimationFrame(animate);
      if (mixerRef.current) {
        mixerRef.current.update(clockRef.current.getDelta());
      }
      renderer.render(scene, camera);
    };
    animate();

    /* ---------- CLEANUP ---------- */
    return () => {
      renderer.dispose();
      mixerRef.current = null;
      sceneRef.current = null;
    };
  }, [sign]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    />
  );
}
