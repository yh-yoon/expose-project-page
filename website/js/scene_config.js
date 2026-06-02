// 각 데이터셋의 씬 설정
const datasetConfigs = {
  dl3dv: {
    name: "DL3DV",
    folder: "DL3DV",
    backgroundColor: "rgb(240, 240, 240)",
    scenes: [
      { id: "planning_frame_00066_frame_00182_rgb", thumbnail: "planning_frame_00066_frame_00182_rgb_ref.png", name: "Scene 1" },
      { id: "planning_frame_00102_frame_00188_rgb", thumbnail: "planning_frame_00102_frame_00188_rgb_ref.png", name: "Scene 2" },
      { id: "planning_frame_00111_frame_00307_rgb", thumbnail: "planning_frame_00111_frame_00307_rgb_ref.png", name: "Scene 3" },
      { id: "planning_frame_00161_frame_00095_rgb", thumbnail: "planning_frame_00161_frame_00095_rgb_ref.png", name: "Scene 4" },
      { id: "planning_frame_00196_frame_00306_rgb", thumbnail: "planning_frame_00196_frame_00306_rgb_ref.png", name: "Scene 5" },
      { id: "planning_frame_00207_frame_00282_rgb", thumbnail: "planning_frame_00207_frame_00282_rgb_ref.png", name: "Scene 6" }
    ],
    methods: ["ltxvideo", "aether", "dynamicrafter", "interpose"],
    defaultMethod: "ltxvideo"
  },
  navi: {
    name: "NAVI",
    folder: "NAVI",
    backgroundColor: "rgb(255, 255, 255)",
    scenes: [
      { id: "planning_002_004_rgb", thumbnail: "planning_002_004_rgb_ref.jpg", name: "Scene 1" },
      { id: "planning_003_004_rgb", thumbnail: "planning_003_004_rgb_ref.jpg", name: "Scene 2" },
      { id: "planning_004_005_rgb", thumbnail: "planning_004_005_rgb_ref.jpg", name: "Scene 3" },
      { id: "planning_006_014_rgb", thumbnail: "planning_006_014_rgb_ref.jpg", name: "Scene 4" },
      { id: "planning_006_019_rgb", thumbnail: "planning_006_019_rgb_ref.jpg", name: "Scene 5" },
      { id: "planning_frame_00460_frame_00600_rgb", thumbnail: "planning_frame_00460_frame_00600_rgb_ref.jpg", name: "Scene 6" }
    ],
    methods: ["ltxvideo", "aether", "dynamicrafter", "interpose"],
    defaultMethod: "ltxvideo"
  },
  scannet: {
    name: "ScanNet",
    folder: "ScanNet",
    backgroundColor: "rgb(240, 240, 240)",
    scenes: [
      { id: "planning_221_868_rgb", thumbnail: "planning_221_868_rgb_ref.jpg", name: "Scene 1" },
      { id: "planning_229_324_rgb", thumbnail: "planning_229_324_rgb_ref.jpg", name: "Scene 2" },
      { id: "planning_2380_2835_rgb", thumbnail: "planning_2380_2835_rgb_ref.jpg", name: "Scene 3" },
      { id: "planning_609_773_rgb", thumbnail: "planning_609_773_rgb_ref.jpg", name: "Scene 4" },
      { id: "planning_614_985_rgb", thumbnail: "planning_614_985_rgb_ref.jpg", name: "Scene 5" },
      { id: "planning_6_789_rgb", thumbnail: "planning_6_789_rgb_ref.jpg", name: "Scene 6" }
    ],
    methods: ["ltxvideo", "aether", "dynamicrafter", "interpose"],
    defaultMethod: "ltxvideo"
  },
  cambridge: {
    name: "Cambridge Landmarks",
    folder: "Cambridge",
    backgroundColor: "rgb(255, 255, 255)",
    scenes: [
      { id: "planning_frame00129_frame00281_rgb", thumbnail: "planning_frame00129_frame00281_rgb_ref.png", name: "Scene 1" },
      { id: "planning_frame00150_frame00588_rgb", thumbnail: "planning_frame00150_frame00588_rgb_ref.png", name: "Scene 2" },
      { id: "planning_frame00373_frame00378_rgb", thumbnail: "planning_frame00373_frame00378_rgb_ref.png", name: "Scene 3" },
      { id: "planning_image2_000191_image2_000208_rgb", thumbnail: "planning_image2_000191_image2_000208_rgb_ref.png", name: "Scene 4" },
      { id: "planning_image2_000243_image2_000247_rgb", thumbnail: "planning_image2_000243_image2_000247_rgb_ref.png", name: "Scene 5" },
      { id: "planning_image2_001416_image2_001457_rgb", thumbnail: "planning_image2_001416_image2_001457_rgb_ref.png", name: "Scene 6" }
    ],
    methods: ["ltxvideo", "aether", "dynamicrafter", "interpose"],
    defaultMethod: "ltxvideo"
  }
};

// 메소드 이름 매핑
const methodLabels = {
  ltxvideo: "LTX-Video",
  aether: "Aether",
  dynamicrafter: "DynamiCrafter",
  interpose: "InterPose"
};

// 데이터셋별 비디오 컴페어 섹션 생성
function generateComparisonSections() {
  const container = document.getElementById('comparison-container');
  if (!container) return;

  let videoIndex = 0;
  
  // 데이터셋 ID 매핑
  const datasetIdMap = {
    dl3dv: 'dl3dv-section',
    navi: 'navi-section',
    scannet: 'scannet-section',
    cambridge: 'cambridge-section'
  };
  
  Object.keys(datasetConfigs).forEach(datasetKey => {
    const config = datasetConfigs[datasetKey];
    
    // 씬이 없으면 건너뛰기
    if (!config.scenes || config.scenes.length === 0) return;
    
    const section = document.createElement('div');
    section.className = 'row text-center';
    section.style.backgroundColor = config.backgroundColor;
    section.id = datasetIdMap[datasetKey]; // 섹션 ID 추가
    
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
        
        <!-- Frame References Row -->
        <div class="text-center" style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <div style="text-align: center;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #0066ff;">Reference frame</div>
              <img id="refImage${videoIndex}" 
                   src="website/videos/comparison/${config.folder}/${config.scenes[0].thumbnail}" 
                   alt="Reference frame"
                   style="max-width: 200px; height: auto; border: 3px solid #0066ff; border-radius: 2px;">
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #ff0000;">Target frame</div>
              <img id="targetImage${videoIndex}" 
                   src="website/videos/comparison/${config.folder}/${config.scenes[0].thumbnail.replace('_ref', '_target')}" 
                   alt="Target frame"
                   style="max-width: 200px; height: auto; border: 3px solid #ff0000; border-radius: 2px;">
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <div class="video-compare-container" id="comp${datasetKey}">
            <video class="video" style="max-width: 100%;" 
                   id="compVideo${videoIndex}" 
                   loop playsinline autoPlay muted 
                   src="website/videos/comparison/${config.folder}/${config.defaultMethod}/${config.scenes[0].id}.mp4" 
                   onplay="resizeAndPlay(this)"></video>
            <canvas height=0 class="videoMerge" id="compVideo${videoIndex}Merge"></canvas>
          </div>
          
          <div class="pill-row scene-pills" id="scene-pills-${datasetKey}" style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
            ${config.scenes.map((scene, idx) => `
              <span class="pill scene-pill-${datasetKey} ${idx === 0 ? 'active' : ''}" 
                    data-value="${scene.id}" 
                    onclick="selectCompVideo(activeMethodPill_${datasetKey}, this)"
                    style="padding: 2px; margin: 0; border: none; background: transparent; display: inline-block; cursor: pointer;">
                <img class="thumbnail-img" 
                     src="website/videos/comparison/${config.folder}/${scene.thumbnail}" 
                     alt="${scene.name}" 
                     style="width: 80px; height: auto; border-radius: 3px; transition: all 0.3s ease; ${idx === 0 ? 'border: 3px solid #007bff; box-shadow: 0 0 10px rgba(0,123,255,0.5);' : 'border: 2px solid #ddd;'}">
              </span>
            `).join('')}
          </div>
          <br>
          <p class="text-justify" style="text-align: center;">
            Baseline method (left) vs Ours (right). Click to select different methods and scenes on the ${config.name} dataset.<br>
            Please move the slider to view the baseline (left) overlayed on our method (right).
          </p>
          <br>
        </div>
      </div>
    `;
    
    container.appendChild(section);
    
    // 구분선 추가
    const spacer = document.createElement('br');
    container.appendChild(spacer);
    container.appendChild(spacer.cloneNode());
    
    videoIndex++;
  });
  
  // 각 데이터셋의 active pill 초기화
  Object.keys(datasetConfigs).forEach(datasetKey => {
    window[`activeMethodPill_${datasetKey}`] = document.querySelector(`.method-pill-${datasetKey}.active`);
    window[`activeScenePill_${datasetKey}`] = document.querySelector(`.scene-pill-${datasetKey}.active`);
  });
}

// DOM 로드 후 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', generateComparisonSections);
} else {
  generateComparisonSections();
}
