// dataset_pages.js - 개별 데이터셋 페이지를 위한 스크립트
// scene_config.js의 datasetConfigs를 재사용

// 메소드 이름 매핑 (scene_config.js와 동일)
const methodLabels = {
  ibrnet: "IBR-Net",
  enerf: "ENeRF",
  gpsg: "GPGS"
};

// Pseudo video scenes configuration
const pseudoScenes = [
  { id: "scene08", name: "Scene 08", videoFile: "dl3dv_minimal_start_end_scene08_4K.mp4" },
  { id: "scene21", name: "Scene 21", videoFile: "dl3dv_minimal_start_end_scene21_4K.mp4" },
  { id: "scene22", name: "Scene 22", videoFile: "dl3dv_minimal_start_end_scene22_4K.mp4" },
  { id: "scene25", name: "Scene 25", videoFile: "dl3dv_minimal_start_end_scene25_4K.mp4" },
  { id: "scene27", name: "Scene 27", videoFile: "dl3dv_minimal_start_end_scene27_4K.mp4" },
  { id: "scene31", name: "Scene 31", videoFile: "dl3dv_minimal_start_end_scene31_4K.mp4" },
  { id: "scene53", name: "Scene 53", videoFile: "dl3dv_minimal_start_end_scene53_4K.mp4" },
  { id: "scene65", name: "Scene 65", videoFile: "dl3dv_minimal_start_end_scene65_4K.mp4" },
  { id: "scene79", name: "Scene 79", videoFile: "dl3dv_minimal_start_end_scene79_4K.mp4" },
  { id: "scene98", name: "Scene 98", videoFile: "dl3dv_minimal_start_end_scene98_4K.mp4" },
  { id: "scene113", name: "Scene 113", videoFile: "dl3dv_minimal_start_end_scene113_4K.mp4" },
  { id: "scene127", name: "Scene 127", videoFile: "dl3dv_minimal_start_end_scene127_4K.mp4" }
];

// 데이터셋 설정 (scene_config.js에서 가져오거나 여기서 정의)
const datasetConfigs = {
  dynerf: {
    name: "DL3DV",
    folder: "DL3DV",
    backgroundColor: "rgb(240, 240, 240)",
    scenes: [
      { id: "flame_steak", thumbnail: "flame_steak.png", name: "Flame Steak" },
      { id: "sear_steak", thumbnail: "sear_steak.png", name: "Sear Steak" }
    ],
    methods: ["ibrnet", "enerf", "gpsg"],
    defaultMethod: "gpsg"
  },
  enerf: {
    name: "NAVI",
    folder: "NAVI",
    backgroundColor: "rgb(255, 255, 255)",
    scenes: [
      { id: "actor1", thumbnail: "actor1.jpg", name: "Actor 1" },
      { id: "actor1_4", thumbnail: "actor1_4.jpg", name: "Actor 1-4" },
      { id: "actor2", thumbnail: "actor2.jpg", name: "Actor 2" },
      { id: "actor2_3", thumbnail: "actor2_3.jpg", name: "Actor 2-3" },
      { id: "actor3", thumbnail: "actor3.jpg", name: "Actor 3" },
      { id: "actor5_6", thumbnail: "actor5_6.jpg", name: "Actor 5-6" }
    ],
    methods: ["ibrnet", "enerf", "gpsg"],
    defaultMethod: "gpsg"
  },
  d3dmv: {
    name: "ScanNet",
    folder: "ScanNet",
    backgroundColor: "rgb(240, 240, 240)",
    scenes: [
      { id: "scene003", thumbnail: "scene003.jpg", name: "Scene 003" },
      { id: "scene006", thumbnail: "scene006.jpg", name: "Scene 006" },
      { id: "scene014", thumbnail: "scene014.jpg", name: "Scene 014" },
      { id: "scene015", thumbnail: "scene015.jpg", name: "Scene 015" },
      { id: "scene016", thumbnail: "scene016.jpg", name: "Scene 016" },
      { id: "scene024", thumbnail: "scene024.jpg", name: "Scene 024" },
      { id: "scene026", thumbnail: "scene026.jpg", name: "Scene 026" }
    ],
    methods: ["ibrnet", "enerf", "gpsg"],
    defaultMethod: "gpsg"
  },
  cambridge: {
    name: "Cambridge Landmarks",
    folder: "Cambridge",
    backgroundColor: "rgb(255, 255, 255)",
    scenes: [
      // Cambridge 데이터가 준비되면 여기에 추가
    ],
    methods: ["ibrnet", "enerf", "gpsg"],
    defaultMethod: "gpsg"
  }
};

// Pseudo video 섹션 생성
function generatePseudoVideoSection() {
  const container = document.getElementById('dataset-container');
  if (!container) return;

  const datasetKey = container.getAttribute('data-dataset');
  if (datasetKey !== 'pseudo') return;
  
  const section = document.createElement('div');
  section.className = 'row text-center';
  section.style.backgroundColor = 'rgb(240, 240, 240)';
  
  const firstScene = pseudoScenes[0];
  const videoBaseName = firstScene.videoFile.replace('.mp4', '');
  
  section.innerHTML = `
    <div class="col-md-8 col-md-offset-2">
      <h3>Pseudo Video Dataset for Supervised Finetuning using the DL3DV Dataset</h3>
      <p style="text-align: center; margin: 20px 0;">
        By incorporating auxiliary frames, we achieve smoother camera transitions and geometrically consistent video generation.<br>
        These high-quality pseudo-videos are further used for <strong>pseudo video supervised finetuning</strong> of our model.<br>
        <strong>Left:</strong> Without auxiliary frame | <strong>Right:</strong> With auxiliary frame (Pseudo video, Ours)
      </p>
      <br>
      
      <!-- Scene Thumbnails -->
      <div class="text-center" style="margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; max-width: 900px; margin: 0 auto; justify-items: center;">
          ${pseudoScenes.map((scene, idx) => {
            const baseName = scene.videoFile.replace('.mp4', '');
            return `
            <span class="pill scene-pill-pseudo ${idx === 0 ? 'active' : ''}" 
                  data-scene-id="${scene.id}"
                  data-video-file="${scene.videoFile}"
                  onclick="selectPseudoScene(this)"
                  style="padding: 2px; margin: 0; border: none; background: transparent; display: block; width: 100%;">
              <img class="thumbnail-img" 
                   src="../videos/pseudo/DL3DV/${baseName}_ref.png" 
                   alt="${scene.name}" 
                   style="width: 100%; height: auto; border-radius: 3px; cursor: pointer; transition: all 0.3s ease; ${idx === 0 ? 'border: 3px solid #007bff; box-shadow: 0 0 10px rgba(0,123,255,0.5);' : 'border: 2px solid #ddd;'}">
            </span>
          `}).join('')}
        </div>
      </div>
      
      <!-- Main Video and Frame References Container -->
      <div style="background: white; border: 2px solid #ddd; border-radius: 12px; padding: 30px; margin: 20px auto; max-width: 95%; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Frame References Row -->
        <div class="text-center">
          <h4>Frame References</h4>
          <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 15px;">
            <div style="text-align: center;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #0066ff;">Reference frame</div>
              <img id="pseudoRefImage" 
                   src="../videos/pseudo/DL3DV/${videoBaseName}_ref.png" 
                   alt="Reference frame"
                   style="max-width: 300px; height: auto; border: 3px solid #0066ff; border-radius: 2px;">
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #ff9900;">Auxiliary frame</div>
              <img id="pseudoAuxImage" 
                   src="../videos/pseudo/DL3DV/${videoBaseName}_aux.png" 
                   alt="Auxiliary frame"
                   style="max-width: 300px; height: auto; border: 3px solid #ff9900; border-radius: 2px;">
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #ff0000;">Target frame</div>
              <img id="pseudoTargetImage" 
                   src="../videos/pseudo/DL3DV/${videoBaseName}_target.png" 
                   alt="Target frame"
                   style="max-width: 300px; height: auto; border: 3px solid #ff0000; border-radius: 2px;">
            </div>
          </div>
        </div>
        
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e0e0e0;">
        
        <!-- Main Video -->
        <div class="text-center">
          <h4>Generated Video Comparison</h4>
          <div style="margin-top: 15px;">
            <video id="pseudoMainVideo" 
                   style="max-width: 100%; border: 2px solid #ddd; border-radius: 8px;" 
                   loop autoplay muted controls>
              <source src="../videos/pseudo/DL3DV/${firstScene.videoFile}" type="video/mp4">
            </video>
          </div>
        </div>
      </div>
      <br>
    </div>
  `;
  
  container.appendChild(section);
}

// Pseudo scene 선택 함수
function selectPseudoScene(element) {
  // Remove active class from all pills and reset image styles
  document.querySelectorAll('.scene-pill-pseudo').forEach(pill => {
    pill.classList.remove('active');
    const img = pill.querySelector('img');
    if (img) {
      img.style.border = '3px solid #ddd';
      img.style.boxShadow = 'none';
    }
  });
  
  // Add active class to selected pill and highlight image
  element.classList.add('active');
  const activeImg = element.querySelector('img');
  if (activeImg) {
    activeImg.style.border = '4px solid #007bff';
    activeImg.style.boxShadow = '0 0 12px rgba(0,123,255,0.5)';
  }
  
  // Get video file name
  const videoFile = element.getAttribute('data-video-file');
  const videoBaseName = videoFile.replace('.mp4', '');
  
  // Update main video
  const mainVideo = document.getElementById('pseudoMainVideo');
  if (mainVideo) {
    mainVideo.src = `../videos/pseudo/DL3DV/${videoFile}`;
    mainVideo.load();
    mainVideo.play();
  }
  
  // Update reference images
  const refImage = document.getElementById('pseudoRefImage');
  const auxImage = document.getElementById('pseudoAuxImage');
  const targetImage = document.getElementById('pseudoTargetImage');
  
  if (refImage) refImage.src = `../videos/pseudo/DL3DV/${videoBaseName}_ref.png`;
  if (auxImage) auxImage.src = `../videos/pseudo/DL3DV/${videoBaseName}_aux.png`;
  if (targetImage) targetImage.src = `../videos/pseudo/DL3DV/${videoBaseName}_target.png`;
}

// 단일 데이터셋 섹션 생성 (기존 함수 유지)
function generateSingleDatasetSection() {
  const container = document.getElementById('dataset-container');
  if (!container) return;

  const datasetKey = container.getAttribute('data-dataset');
  
  // Pseudo dataset인 경우
  if (datasetKey === 'pseudo') {
    generatePseudoVideoSection();
    return;
  }
  
  if (!datasetConfigs[datasetKey]) return;

  const config = datasetConfigs[datasetKey];
  
  // 씬이 없으면 메시지 표시
  if (!config.scenes || config.scenes.length === 0) {
    container.innerHTML = `
      <div class="row text-center">
        <div class="col-md-8 col-md-offset-2">
          <h3>Coming Soon</h3>
          <p>Results for ${config.name} dataset will be available soon.</p>
        </div>
      </div>
    `;
    return;
  }
  
  const videoIndex = 0;
  
  const section = document.createElement('div');
  section.className = 'row text-center';
  section.style.backgroundColor = config.backgroundColor;
  
  section.innerHTML = `
    <div class="col-md-8 col-md-offset-2">
      <h3>Results on the ${config.name} Dataset</h3><br>
      <div class="text-center">
        <div style="display: inline-block;">
          <ul class="nav nav-pills center-pills" id="method-pills-${datasetKey}">
            ${config.methods.map(method => `
              <li class="method-pill-${datasetKey} ${method === config.defaultMethod ? 'active' : ''}" 
                  data-value="${method}"
                  onclick="selectCompVideo(this, activeScenePill_${datasetKey})">
                <a>${methodLabels[method]}</a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
      <br>
      
      <div class="text-center">
        <div class="video-compare-container" id="comp${datasetKey}">
          <video class="video" style="max-width: 100%;" 
                 id="compVideo${videoIndex}" 
                 loop playsinline autoPlay muted 
                 src="../videos/comparison/${config.folder}/${datasetKey}_${config.scenes[0].id}_${config.defaultMethod}_vs_ours.mp4" 
                 onplay="resizeAndPlay(this)"></video>
          <canvas height=0 class="videoMerge" id="compVideo${videoIndex}Merge"></canvas>
        </div>
        
        <div class="pill-row scene-pills" id="scene-pills-${datasetKey}">
          ${config.scenes.map((scene, idx) => `
            <span class="pill scene-pill-${datasetKey} ${idx === 0 ? 'active' : ''}" 
                  data-value="${datasetKey}_${scene.id}" 
                  onclick="selectCompVideo(activeMethodPill_${datasetKey}, this)">
              <img class="thumbnail-img" src="../thumbnails/${config.folder}/${scene.thumbnail}" alt="${scene.name}" width="64">
            </span>
          `).join('')}
        </div>
        <br>
        <p class="text-justify" style="text-align: center;">
          Baseline method (left) vs Ours (right). Click to select different methods and scenes.<br>
          Please move the slider to view the baseline (left) overlayed on our method (right).
        </p>
        <br>
      </div>
    </div>
  `;
  
  container.appendChild(section);
  
  // Active pill 초기화
  window[`activeMethodPill_${datasetKey}`] = document.querySelector(`.method-pill-${datasetKey}.active`);
  window[`activeScenePill_${datasetKey}`] = document.querySelector(`.scene-pill-${datasetKey}.active`);
}

// DOM 로드 후 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', generateSingleDatasetSection);
} else {
  generateSingleDatasetSection();
}
