// JavaScript to handle mouseover and mouseout events
// 동적으로 생성되는 active pill 변수들 (scene_config.js에서 초기화)
var activeVidID = 0;
var select = false;


$(document).ready(function () {
    var bibtexElement = document.getElementById("bibtex");
    if (bibtexElement) {
        var editor = CodeMirror.fromTextArea(bibtexElement, {
            lineNumbers: false,
            lineWrapping: true,
            readOnly: true
        });
    }
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    // 동적으로 각 데이터셋의 active pill 초기화 (scene_config.js에서도 수행)
    if (typeof datasetConfigs !== 'undefined') {
        Object.keys(datasetConfigs).forEach(datasetKey => {
            window[`activeMethodPill_${datasetKey}`] = $(`.method-pill-${datasetKey}.active`)[0];
            window[`activeScenePill_${datasetKey}`] = $(`.scene-pill-${datasetKey}.active`)[0];
        });
    }
});

function selectCompVideo(methodPill, scenePill, n_views, modePill) {
    method = methodPill.getAttribute("data-value");
    if(scenePill != null){
        pill = scenePill.getAttribute("data-value");
    }
    
    select = true;
    var videoSwitch = document.getElementById("compVideoSwitch");
    var viewNum = document.getElementById("compVideoValue");
    
    // 데이터셋 키 자동 감지
    var datasetKey = null;
    var videoIndex = null;
    
    // datasetConfigs가 있으면 동적으로 처리
    if (typeof datasetConfigs !== 'undefined') {
        Object.keys(datasetConfigs).forEach((key, index) => {
            if (methodPill.className.indexOf(key) >= 0) {
                datasetKey = key;
                videoIndex = index;
            }
        });
    }
    
    // 데이터셋 키를 찾았으면 동적 처리
    if (datasetKey) {
        var activeMethodPill = window[`activeMethodPill_${datasetKey}`];
        var activeScenePill = window[`activeScenePill_${datasetKey}`];
        var activeModePill = window[`activeModePill_${datasetKey}`];
        
        if (activeMethodPill) {
            activeMethodPill.classList.remove("active");
        }
        if (activeScenePill) {
            activeScenePill.classList.remove("active");
            // Reset scene pill image style
            var oldImg = activeScenePill.querySelector('img');
            if (oldImg) {
                oldImg.style.border = '2px solid #ddd';
                oldImg.style.boxShadow = 'none';
            }
        }
        if (modePill && activeModePill) {
            activeModePill.classList.remove("active");
            modePill.classList.add("active");
            window[`activeModePill_${datasetKey}`] = modePill;
        }
        
        window[`activeMethodPill_${datasetKey}`] = methodPill;
        window[`activeScenePill_${datasetKey}`] = scenePill;
        
        methodPill.classList.add("active");
        if(scenePill != null){
            scenePill.classList.add("active");
            // Highlight selected scene pill image
            var newImg = scenePill.querySelector('img');
            if (newImg) {
                newImg.style.border = '3px solid #007bff';
                newImg.style.boxShadow = '0 0 10px rgba(0,123,255,0.5)';
            }
        }
        
        // 비디오 업데이트
        activeVidID = videoIndex;
        var video_active = document.getElementById(`compVideo${videoIndex}`);
        if (video_active && typeof datasetConfigs !== 'undefined') {
            var config = datasetConfigs[datasetKey];
            // 현재 페이지가 html/ 폴더 안에 있는지 확인
            var basePath = window.location.pathname.includes('/html/') ? '../' : 'website/';
            video_active.src = `${basePath}videos/comparison/${config.folder}/${method}/${pill}.mp4`;
            console.log(video_active.src);
            video_active.load();
            
            // Update reference and target images
            var refImage = document.getElementById(`refImage${videoIndex}`);
            var targetImage = document.getElementById(`targetImage${videoIndex}`);
            if (refImage && targetImage) {
                // Find the thumbnail for this scene
                var scene = config.scenes.find(s => s.id === pill);
                if (scene) {
                    refImage.src = `${basePath}videos/comparison/${config.folder}/${scene.thumbnail}`;
                    targetImage.src = `${basePath}videos/comparison/${config.folder}/${scene.thumbnail.replace('_ref', '_target')}`;
                }
            }
        }
    }

    if (n_views) {
        viewNum.innerHTML = n_views;
    }
}
