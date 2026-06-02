// Point cloud scene configuration for visualization page
const POINTCLOUD_SCENES_CONFIG = {
    datasets: [
        {
            id: 'dl3dv',
            name: 'DL3DV',
            scenes: [
                {
                    id: 'planning_frame_00066_frame_00182_rgb',
                    name: 'planning_frame_00066_frame_00182_rgb',
                    referenceImage: '../pointcloud/DL3DV/planning_frame_00066_frame_00182_rgb_ref.png',
                    targetImage: '../pointcloud/DL3DV/planning_frame_00066_frame_00182_rgb_target.png',
                    vggtDataJs: '../pointcloud/DL3DV/planning_frame_00066_frame_00182_rgb_vggt_embedded.js',
                    vggtDataVar: 'DL3DV_PLANNING_FRAME_00066_FRAME_00182_RGB_VGGT_DATA',
                    ltxvideoDataJs: '../pointcloud/DL3DV/planning_frame_00066_frame_00182_rgb_ltxvideo_embedded.js',
                    ltxvideoDataVar: 'DL3DV_PLANNING_FRAME_00066_FRAME_00182_RGB_LTXVIDEO_DATA',
                    oursDataJs: '../pointcloud/DL3DV/planning_frame_00066_frame_00182_rgb_ours_embedded.js',
                    oursDataVar: 'DL3DV_PLANNING_FRAME_00066_FRAME_00182_RGB_OURS_DATA'
                }
            ]
        },
        {
            id: 'cambridge',
            name: 'Cambridge Landmarks',
            scenes: [
                {
                    id: 'planning_frame00585_frame00588_rgb',
                    name: 'planning_frame00585_frame00588_rgb',
                    referenceImage: '../pointcloud/Cambridge/planning_frame00585_frame00588_rgb_ref.png',
                    targetImage: '../pointcloud/Cambridge/planning_frame00585_frame00588_rgb_target.png',
                    vggtDataJs: '../pointcloud/Cambridge/planning_frame00585_frame00588_rgb_vggt_embedded.js',
                    vggtDataVar: 'CAMBRIDGE_PLANNING_FRAME00585_FRAME00588_RGB_VGGT_DATA',
                    ltxvideoDataJs: '../pointcloud/Cambridge/planning_frame00585_frame00588_rgb_ltxvideo_embedded.js',
                    ltxvideoDataVar: 'CAMBRIDGE_PLANNING_FRAME00585_FRAME00588_RGB_LTXVIDEO_DATA',
                    oursDataJs: '../pointcloud/Cambridge/planning_frame00585_frame00588_rgb_ours_embedded.js',
                    oursDataVar: 'CAMBRIDGE_PLANNING_FRAME00585_FRAME00588_RGB_OURS_DATA'
                }
            ]
        },
        {
            id: 'scannet',
            name: 'ScanNet',
            scenes: [
                {
                    id: 'planning_527_873_rgb',
                    name: 'planning_527_873_rgb',
                    referenceImage: '../pointcloud/ScanNet/planning_527_873_rgb_ref.jpg',
                    targetImage: '../pointcloud/ScanNet/planning_527_873_rgb_target.jpg',
                    vggtDataJs: '../pointcloud/ScanNet/planning_527_873_rgb_vggt_embedded.js',
                    vggtDataVar: 'SCANNET_PLANNING_527_873_RGB_VGGT_DATA',
                    ltxvideoDataJs: '../pointcloud/ScanNet/planning_527_873_rgb_ltxvideo_embedded.js',
                    ltxvideoDataVar: 'SCANNET_PLANNING_527_873_RGB_LTXVIDEO_DATA',
                    oursDataJs: '../pointcloud/ScanNet/planning_527_873_rgb_ours_embedded.js',
                    oursDataVar: 'SCANNET_PLANNING_527_873_RGB_OURS_DATA'
                }
            ]
        },
        {
            id: 'navi',
            name: 'NAVI',
            scenes: [
                {
                    id: 'planning_012_018_rgb',
                    name: 'planning_012_018_rgb',
                    referenceImage: '../pointcloud/NAVI/planning_012_018_rgb_ref.jpg',
                    targetImage: '../pointcloud/NAVI/planning_012_018_rgb_target.jpg',
                    vggtDataJs: '../pointcloud/NAVI/planning_012_018_rgb_vggt_embedded.js',
                    vggtDataVar: 'NAVI_PLANNING_012_018_RGB_VGGT_DATA',
                    ltxvideoDataJs: '../pointcloud/NAVI/planning_012_018_rgb_ltxvideo_embedded.js',
                    ltxvideoDataVar: 'NAVI_PLANNING_012_018_RGB_LTXVIDEO_DATA',
                    oursDataJs: '../pointcloud/NAVI/planning_012_018_rgb_ours_embedded.js',
                    oursDataVar: 'NAVI_PLANNING_012_018_RGB_OURS_DATA'
                }
            ]
        }
    ]
};

// Show page loader
function showPageLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.95); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="text-align: center;">
                <div style="border: 8px solid #f3f3f3; border-top: 8px solid #007bff; border-radius: 50%; width: 80px; height: 80px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <h3 style="margin-top: 30px; color: #333; font-family: 'Lato', sans-serif;">Loading Point Cloud Data...</h3>
                <p style="color: #666; margin-top: 10px; font-size: 14px;">Please wait while we initialize the 3D viewers</p>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loader);
}

// Hide page loader
function hidePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
}

// Load a JavaScript file dynamically
function loadScript(src) {
    return new Promise((resolve, reject) => {
        console.log(`Loading script: ${src}`);
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`Successfully loaded: ${src}`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Failed to load script: ${src}`);
            reject(new Error(`Failed to load script: ${src}`));
        };
        document.head.appendChild(script);
    });
}

// Collect all JS files that need to be loaded
function collectEmbeddedJsFiles() {
    const jsFiles = new Set();
    
    POINTCLOUD_SCENES_CONFIG.datasets.forEach(dataset => {
        dataset.scenes.forEach(scene => {
            if (scene.vggtDataJs) {
                jsFiles.add(scene.vggtDataJs);
            }
            if (scene.ltxvideoDataJs) {
                jsFiles.add(scene.ltxvideoDataJs);
            }
            if (scene.oursDataJs) {
                jsFiles.add(scene.oursDataJs);
            }
        });
    });
    
    return Array.from(jsFiles);
}

// Generate scene HTML dynamically
function generateSceneHTML(dataset, scene, sectionIndex) {
    const datasetId = dataset.id;
    const sceneId = scene.id;
    const viewerId = `${datasetId}-${sceneId}`;
    const isCambridge = datasetId === 'cambridge';
    
    // Determine legend background: alternate between gray and white based on section
    // Even sections (0, 2, 4...) have gray bg, odd sections (1, 3, 5...) have white bg
    const legendBgColor = sectionIndex % 2 === 0 ? 'rgba(255, 255, 255, 1.0)' : 'rgba(240, 240, 240, 1.0)' ;
    
    // GT pose legend for non-Cambridge datasets only
    const gtPoseLegend = isCambridge ? '' : `
                    <span style="display: inline-block; margin: 0 15px;">
                        <span style="display: inline-block; width: 20px; height: 20px; background: rgb(204, 204, 0); border: 1px solid #333; vertical-align: middle; margin-right: 5px;"></span>
                        <strong>Yellow</strong> = Ground-truth target pose
                    </span>
                    <br style="margin: 5px 0;">
                    <span style="display: block; margin-top: 10px; font-style: italic; color: #555;">
                        (The closer the <strong style="color: rgb(255, 0, 0);">red</strong> and <strong style="color: rgb(204, 204, 0);">Yellow</strong> frustums are, the better the pose estimation)
                    </span>`;
    
    return `
        <div style="margin: 40px 0;">
            <!-- Input Images -->
            <div class="images-container">
                <div class="image-box">
                    <img src="${scene.referenceImage}" alt="Reference image" 
                        style="border: 4px solid #0066ff; border-radius: 4px;"
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect width=%22300%22 height=%22200%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 text-anchor=%22middle%22 dy=%22.3em%22%3EReference Image%3C/text%3E%3C/svg%3E'">
                    <p>Reference image</p>
                </div>
                <div class="image-box">
                    <img src="${scene.targetImage}" alt="Target image" 
                        style="border: 4px solid #ff0000; border-radius: 4px;"
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect width=%22300%22 height=%22200%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 text-anchor=%22middle%22 dy=%22.3em%22%3ETarget Image%3C/text%3E%3C/svg%3E'">
                    <p>Target image</p>
                </div>
            </div>
            
            <!-- Camera Color Legend -->
            <div style="text-align: center; margin: 20px 0; padding: 15px; background: ${legendBgColor}; border-radius: 8px; display: inline-block; width: 100%; border: 1px solid #ccc;">
                <div style="display: inline-block; margin: 0 auto;">
                    <strong style="margin-right: 20px;">Camera frustum colors:</strong>
                    <span style="display: inline-block; margin: 0 15px;">
                        <span style="display: inline-block; width: 20px; height: 20px; background: rgb(0, 0, 255); border: 1px solid #333; vertical-align: middle; margin-right: 5px;"></span>
                        <strong>Blue</strong> = Reference pose
                    </span>
                    <span style="display: inline-block; margin: 0 15px;">
                        <span style="display: inline-block; width: 20px; height: 20px; background: rgb(255, 0, 0); border: 1px solid #333; vertical-align: middle; margin-right: 5px;"></span>
                        <strong>Red</strong> = Estimated target pose
                    </span>${gtPoseLegend}
                </div>
            </div>
            
            <!-- Point Cloud Comparison -->
            <div class="pointcloud-container">
                <div class="comparison-row">
                    <!-- Left: VGGT -->
                    <div>
                        <div class="viewer-label">VGGT (Baseline)</div>
                        <div id="${viewerId}-vggt-viewer" class="pointcloud-viewer">
                            <div class="loading-overlay">${scene.vggtDataVar ? 'Loading point cloud data...' : 'VGGT results coming soon...'}</div>
                        </div>
                        <div class="metrics" id="${viewerId}-vggt-info" style="display:none;">
                            <strong>Points:</strong> <span class="point-count">-</span> | 
                            <strong>Cameras:</strong> <span class="camera-count">-</span> | 
                            <strong>Scene Scale:</strong> <span class="scene-scale">-</span>
                        </div>
                    </div>
                    
                    <!-- Middle: VGGT + LTX-Video -->
                    <div>
                        <div class="viewer-label">VGGT + LTX-Video</div>
                        <div id="${viewerId}-ltxvideo-viewer" class="pointcloud-viewer">
                            <div class="loading-overlay">${scene.ltxvideoDataVar ? 'Loading point cloud data...' : 'LTX-Video results coming soon...'}</div>
                        </div>
                        <div class="metrics" id="${viewerId}-ltxvideo-info" style="display:none;">
                            <strong>Points:</strong> <span class="point-count">-</span> | 
                            <strong>Cameras:</strong> <span class="camera-count">-</span> | 
                            <strong>Scene Scale:</strong> <span class="scene-scale">-</span>
                        </div>
                    </div>
                    
                    <!-- Right: ExPose (Ours) -->
                    <div>
                        <div class="viewer-label" style="background: rgba(0, 123, 255, 0.1); border-left: 4px solid #007bff;">ExPose (Ours)</div>
                        <div id="${viewerId}-ours-viewer" class="pointcloud-viewer">
                            <div class="loading-overlay">Loading point cloud data...</div>
                        </div>
                        <div class="metrics" id="${viewerId}-ours-info" style="display:none;">
                            <strong>Points:</strong> <span class="point-count">-</span> | 
                            <strong>Cameras:</strong> <span class="camera-count">-</span> | 
                            <strong>Scene Scale:</strong> <span class="scene-scale">-</span>
                        </div>
                    </div>
                </div>
                <div class="controls-hint" style="text-align: center; margin-top: 10px;">Use mouse to rotate, zoom, and pan</div>
            </div>
        </div>
    `;
}

// Initialize all viewers (async to load JS files first)
async function initializePointCloudViewers() {
    try {
        // Show loading indicator
        showPageLoader();
        
        console.log('=== Starting Point Cloud Viewer Initialization ===');
        console.log('Config:', POINTCLOUD_SCENES_CONFIG);
        
        // First, load all embedded JS files
        const jsFiles = collectEmbeddedJsFiles();
        console.log('Loading embedded JS files:', jsFiles);
        
        if (jsFiles.length > 0) {
            await Promise.all(jsFiles.map(file => loadScript(file)));
            console.log('All embedded JS files loaded successfully');
        } else {
            console.warn('No JS files to load!');
        }
        
        // Update loader message - JS files loaded, now initializing viewers
        const loaderText = document.querySelector('#page-loader h3');
        const loaderSubtext = document.querySelector('#page-loader p');
        if (loaderText) loaderText.textContent = 'Initializing 3D Viewers...';
        if (loaderSubtext) loaderSubtext.textContent = 'Setting up point cloud visualizations';
        
        const viewers = [];
        
        POINTCLOUD_SCENES_CONFIG.datasets.forEach((dataset, datasetIndex) => {
            console.log(`Processing dataset: ${dataset.name} (${dataset.id})`);
            const sectionId = `${dataset.id}-section`;
            const section = document.getElementById(sectionId);
            
            if (!section) {
                console.error(`Section not found: ${sectionId}`);
                return;
            }
            
            const container = section.querySelector('.container');
            if (!container) {
                console.error(`Container not found in section: ${sectionId}`);
                return;
            }
            
            console.log(`Found section and container for ${dataset.id}, processing ${dataset.scenes.length} scenes`);
            
            // Generate HTML for each scene
            dataset.scenes.forEach(scene => {
                console.log(`  - Scene: ${scene.name}`);
                const sceneHTML = generateSceneHTML(dataset, scene, datasetIndex);
                container.insertAdjacentHTML('beforeend', sceneHTML);
                
                const viewerId = `${dataset.id}-${scene.id}`;
                
                // Initialize VGGT viewer if embedded JS data is available
                if (scene.vggtDataVar) {
                    console.log(`Looking for VGGT variable: ${scene.vggtDataVar}`);
                    
                    const dataSource = window[scene.vggtDataVar];
                    if (!dataSource) {
                        console.error(`Embedded data variable "${scene.vggtDataVar}" not found. JS file may not be loaded.`);
                        console.error(`JS file path was: ${scene.vggtDataJs}`);
                        const loadingDiv = document.querySelector(`#${viewerId}-vggt-viewer .loading-overlay`);
                        if (loadingDiv) {
                            loadingDiv.textContent = `Error: Data variable "${scene.vggtDataVar}" not found`;
                            loadingDiv.style.background = 'rgba(200, 0, 0, 0.8)';
                        }
                    } else {
                        console.log(`Found VGGT data variable ${scene.vggtDataVar}, creating viewer...`);
                        const vggtViewer = new NPZPointCloudViewer(
                            `${viewerId}-vggt-viewer`,
                            dataSource
                        );
                        
                        const originalVggtLoad = vggtViewer.loadData.bind(vggtViewer);
                        vggtViewer.loadData = async function() {
                            await originalVggtLoad();
                            updatePointCloudMetrics(`${viewerId}-vggt-info`, this.data);
                        };
                        
                        viewers.push(vggtViewer);
                    }
                }
                
                // Initialize LTX-Video viewer if embedded JS data is available
                if (scene.ltxvideoDataVar) {
                    console.log(`Looking for LTX-Video variable: ${scene.ltxvideoDataVar}`);
                    
                    const dataSource = window[scene.ltxvideoDataVar];
                    if (!dataSource) {
                        console.error(`Embedded data variable "${scene.ltxvideoDataVar}" not found. JS file may not be loaded.`);
                        console.error(`JS file path was: ${scene.ltxvideoDataJs}`);
                        const loadingDiv = document.querySelector(`#${viewerId}-ltxvideo-viewer .loading-overlay`);
                        if (loadingDiv) {
                            loadingDiv.textContent = `Error: Data variable "${scene.ltxvideoDataVar}" not found`;
                            loadingDiv.style.background = 'rgba(200, 0, 0, 0.8)';
                        }
                    } else {
                        console.log(`Found LTX-Video data variable ${scene.ltxvideoDataVar}, creating viewer...`);
                        const ltxvideoViewer = new NPZPointCloudViewer(
                            `${viewerId}-ltxvideo-viewer`,
                            dataSource
                        );
                        
                        const originalLtxvideoLoad = ltxvideoViewer.loadData.bind(ltxvideoViewer);
                        ltxvideoViewer.loadData = async function() {
                            await originalLtxvideoLoad();
                            updatePointCloudMetrics(`${viewerId}-ltxvideo-info`, this.data);
                        };
                        
                        viewers.push(ltxvideoViewer);
                    }
                }
                
                // Initialize Ours viewer if embedded JS data is available
                if (scene.oursDataVar) {
                    console.log(`Looking for variable: ${scene.oursDataVar}`);
                    console.log('Available global variables:', Object.keys(window).filter(k => k.includes('EMBEDDED')));
                    
                    const dataSource = window[scene.oursDataVar];
                    if (!dataSource) {
                        console.error(`Embedded data variable "${scene.oursDataVar}" not found. JS file may not be loaded.`);
                        console.error(`JS file path was: ${scene.oursDataJs}`);
                        const loadingDiv = document.querySelector(`#${viewerId}-ours-viewer .loading-overlay`);
                        if (loadingDiv) {
                            loadingDiv.textContent = `Error: Data variable "${scene.oursDataVar}" not found`;
                            loadingDiv.style.background = 'rgba(200, 0, 0, 0.8)';
                        }
                        return;
                    }
                    
                    console.log(`Found data variable ${scene.oursDataVar}, creating viewer...`);
                    const oursViewer = new NPZPointCloudViewer(
                        `${viewerId}-ours-viewer`,
                        dataSource
                    );
                    
                    const originalOursLoad = oursViewer.loadData.bind(oursViewer);
                    oursViewer.loadData = async function() {
                        await originalOursLoad();
                        updatePointCloudMetrics(`${viewerId}-ours-info`, this.data);
                    };
                    
                    viewers.push(oursViewer);
                }
            });
        });
        
        // Hide loading indicator after everything is loaded
        hidePageLoader();
        
        return viewers;
        
    } catch (error) {
        console.error('Error initializing point cloud viewers:', error);
        hidePageLoader();
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; border: 1px solid #f5c6cb; z-index: 10000; text-align: center;';
        errorDiv.innerHTML = `
            <h4 style="margin-top: 0;">⚠️ Loading Error</h4>
            <p>Failed to initialize point cloud viewers.</p>
            <p style="font-size: 12px; margin-top: 10px;">Please refresh the page or check the console for details.</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 8px 16px; background: #721c24; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        `;
        document.body.appendChild(errorDiv);
        
        throw error;
    }
}

// Update metrics display
function updatePointCloudMetrics(infoId, data) {
    if (!data || !data.metadata) return;
    
    const meta = data.metadata;
    const infoDiv = document.getElementById(infoId);
    
    if (infoDiv) {
        infoDiv.querySelector('.point-count').textContent = meta.num_points.toLocaleString();
        infoDiv.querySelector('.camera-count').textContent = meta.num_cameras;
        infoDiv.querySelector('.scene-scale').textContent = meta.scene_scale.toFixed(3);
        infoDiv.style.display = 'block';
    }
}
