import * as THREE from "three";
import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import Experience from "../Experience.js";

export default class Sizes extends EventEmitter {
  constructor(assests) {
    super();
    this.experience = new Experience();
    this.renderer = this.experience.renderer;

    this.assests = assests;
    this.items = {};
    this.queue = this.assests.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }
  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
  }
  startLoading() {
    for (const assest of this.assests) {
      if (assest.type === "glbModel") {
        this.loaders.gltfLoader.load(assest.path, (file) => {
          this.singleAssestLoaded(assest, file);
        });
      } else if (assest.type === "videoTexture") {
        this.video = {};
        this.videoTexture = {};

        this.video[assest.name] = document.createElement("video");
        this.video[assest.name].src = assest.path;
        this.video[assest.name].muted = true;
        this.video[assest.name].playsInline = true;
        this.video[assest.name].autoplay = true;
        this.video[assest.name].loop = true;
        this.video[assest.name].play();

        this.videoTexture[assest.name] = new THREE.VideoTexture(
          this.video[assest.name]
        );
        // this.videoTexture[assest.name].flipY = false;
        this.videoTexture[assest.name].minFilter = THREE.NearestFilter;
        this.videoTexture[assest.name].magFilter = THREE.NearestFilter;
        this.videoTexture[assest.name].generateMipmaps = false;
        this.videoTexture[assest.name].encoding = THREE.sRGBEncoding;

        this.singleAssestLoaded(assest, this.videoTexture[assest.name]);
      }
    }
  }
  singleAssestLoaded(assest, file) {
    this.items[assest.name] = file;
    this.loaded++;

    if (this.loaded === this.queue) {
      this.emit("ready");
    }
  }
}
