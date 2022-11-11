// import * as THREE from "three";
// import Experience from "../Experience.js";
// export default class Room {
//   constructor() {
//     this.experience = new Experience();
//     this.scene = this.experience.scene;
//     this.resources = this.experience.resources;
//     this.time = this.experience.time;
//     this.room = this.resources.items.room;

//     this.actualRoom = this.room.scene;

//     // this.roomChildren = {};

//     // this.lerp = {
//     //   current: 0,
//     //   target: 0,
//     //   ease: 0.1,
//     // };

//     this.setModel();

//     // this.onMouseMove();
//   }

//   setModel() {
//     this.actualRoom.children.forEach((child) => {
//       child.castShadow = true;
//       child.receiveShadow = true;

//       if (child instanceof THREE.Group) {
//         child.children.forEach((groupchild) => {
//           groupchild.castShadow = true;
//           groupchild.receiveShadow = true;
//         });
//       }
//       if (child.name === "Screen.001") {
//         child.overrideMaterial = new THREE.MeshBasicMaterial({
//           map: this.resources.items.screen,
//         });
//       }
//     });

//     this.scene.add(this.actualRoom);
//     this.actualRoom.scale.set(0.2, 0.2, 0.2);
//   }
//   // setAnimation() {
//   //   this.mixer = new THREE.AnimationMixer(this.actualRoom);
//   //   this.swim = this.mixer.clipAction(this.room.animations[0]);
//   //   this.swim.play();
//   // }
//   resize() {}

//   update() {}
// }
import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;
    this.roomChildren = {};

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setModel();
    // this.initMixer()

    this.onMouseMove();
  }

  setModel() {
    // 添加模型
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }
      child.scale.set(0, 0, 0);

      if (child.name === "Cube") {
        // child.scale.set(0.3, 0.3, 0.3);
        child.position.set(0, -0.1, 0);
        child.rotation.y = Math.PI / 4;
      }
      this.resources.items.screen.flipY = false;
      if (child.name === "work") {
        child.children[27].material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }

      this.roomChildren[child.name.toLowerCase()] = child;
    });
    //   if (child instanceof THREE.Group) {
    //     child.children.forEach((groupchild) => {
    //       groupchild.castShadow = true;
    //       groupchild.receiveShadow = true;
    //     });
    //   }
    //   child.scale.set(0, 0, 0);
    //   if (child.name === "Cube") {
    //     // child.scale.set(1, 1, 1);
    //     child.position.set(0, -1, 0);
    //     child.rotation.y = Math.PI / 4;
    //   }

    //   this.roomChildren[child.name.toLowerCase()] = child;
    // });
    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.6, 0.6, 0.6);
  }

  initMixer() {
    // 动画混合器
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    // 播放指定动画
    this.swim = this.mixer.clipAction(this.room.animations[0]);
    this.swim.play();
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.01;
    });
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualRoom.rotation.y = this.lerp.current * 3;

    if (this.mixer) this.mixer.update(this.time.delta * 0.0009);
  }
}
