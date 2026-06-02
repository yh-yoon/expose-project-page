// Three.js Point Cloud Viewer with Camera Poses from NPZ data (PLY + JSON format)

class NPZPointCloudViewer {
    constructor(containerId, dataSource) {
        this.container = document.getElementById(containerId);
        this.dataSource = dataSource;  // Can be: JSON path (string), embedded object, or HTML path
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.pointCloud = null;
        this.cameraFrustums = [];
        this.data = null;
        
        this.init();
    }
    
    init() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        
        // Camera (viewer camera, not the scene cameras)
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 1000);
        this.camera.up.set(0, -1, 0);  // Set up vector to negative Y (flip upside down)
        // Initial position will be set after loading data in fitCameraToScene()
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 0.1;
        this.controls.maxDistance = 100;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Load data
        this.loadData();
        
        // Start animation
        this.animate();
    }
    
    async loadData() {
        const loadingDiv = this.container.querySelector('.loading-overlay');
        
        try {
            if (loadingDiv) {
                loadingDiv.textContent = 'Loading metadata...';
            }
            
            // Check data source type
            if (typeof this.dataSource === 'object' && this.dataSource.plyBase64) {
                // Direct embedded object (from JavaScript variable)
                await this.loadFromEmbeddedObject(this.dataSource);
            } else if (typeof this.dataSource === 'string') {
                // JSON file path
                const response = await fetch(this.dataSource);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                this.data = await response.json();
                
                if (loadingDiv) {
                    loadingDiv.textContent = 'Loading point cloud (PLY)...';
                }
                
                // Load PLY file
                const plyFile = this.data.metadata.ply_file;
                const plyPath = this.dataSource.replace(/[^\/]*$/, plyFile);
                
                await this.loadPLY(plyPath);
            } else {
                throw new Error('Invalid data source type');
            }
            
            if (loadingDiv) {
                loadingDiv.textContent = 'Building camera frustums...';
            }
            
            // Build camera frustums
            this.buildCameraFrustums();
            
            // Fit camera to scene
            this.fitCameraToScene();
            
            if (loadingDiv) {
                loadingDiv.remove();
            }
            
            console.log('Loaded point cloud:', this.data.metadata);
            
        } catch (error) {
            console.error('Error loading point cloud data:', error);
            if (loadingDiv) {
                loadingDiv.textContent = `Error: ${error.message}`;
                loadingDiv.style.color = '#ff0000';
            }
        }
    }
    
    async loadPLY(plyPath) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.PLYLoader();
            
            loader.load(
                plyPath,
                (geometry) => {
                    // PLY loaded successfully
                    // Create point cloud material
                    const material = new THREE.PointsMaterial({
                        size: 0.01,
                        vertexColors: true,
                        sizeAttenuation: true
                    });
                    
                    this.pointCloud = new THREE.Points(geometry, material);
                    this.scene.add(this.pointCloud);
                    
                    resolve();
                },
                (progress) => {
                    // Progress callback
                    if (progress.lengthComputable) {
                        const percentComplete = (progress.loaded / progress.total * 100).toFixed(1);
                        const loadingDiv = this.container.querySelector('.loading-overlay');
                        if (loadingDiv) {
                            loadingDiv.textContent = `Loading PLY: ${percentComplete}%`;
                        }
                    }
                },
                (error) => {
                    reject(new Error(`Failed to load PLY: ${error}`));
                }
            );
        });
    }
    
    async loadFromEmbeddedObject(embeddedData) {
        const loadingDiv = this.container.querySelector('.loading-overlay');
        
        if (loadingDiv) {
            loadingDiv.textContent = 'Processing embedded data...';
        }
        
        // Store metadata
        this.data = {
            metadata: embeddedData.metadata,
            cameras: embeddedData.cameras
        };
        
        if (loadingDiv) {
            loadingDiv.textContent = 'Decoding point cloud...';
        }
        
        // Decode base64 PLY data
        const plyBlob = this.base64ToBlob(embeddedData.plyBase64, 'application/octet-stream');
        const plyUrl = URL.createObjectURL(plyBlob);
        
        if (loadingDiv) {
            loadingDiv.textContent = 'Loading point cloud...';
        }
        
        // Load the PLY
        await this.loadPLY(plyUrl);
        
        // Clean up blob URL
        URL.revokeObjectURL(plyUrl);
    }
    
    base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }
    
    buildPointCloud() {
        // This method is no longer used as we load PLY directly
        // Kept for backwards compatibility
    }
    
    buildCameraFrustums() {
        if (!this.data || !this.data.cameras) return;
        
        const sceneScale = this.data.metadata.scene_scale || 1.0;
        
        this.data.cameras.forEach((camData, index) => {
            const color = this.getCameraColor(camData, index);
            const frustum = this.createCameraFrustum(camData, sceneScale, color);
            this.cameraFrustums.push(frustum);
            this.scene.add(frustum);
        });
    }
    
    getCameraColor(camData, index) {
        if (camData.type === 'ground_truth') {
            return new THREE.Color(0.8, 0.8, 0.0); // Darker yellow for GT
        }
        
        // Vivid colors for predicted cameras
        const totalPredicted = this.data.cameras.filter(c => c.type === 'predicted').length;
        if (index === 0) {
            return new THREE.Color(0.0, 0.0, 1.0); // Blue for first
        }
        if (camData.frame_index === this.data.metadata.frames[this.data.metadata.frames.length - 1]) {
            return new THREE.Color(1.0, 0.0, 0.0); // Red for last
        }
        if (index === Math.floor(totalPredicted / 2)) {
            return new THREE.Color(0.0, 1.0, 0.0); // Green for middle
        }
        
        // Use turbo colormap for others
        const t = index / Math.max(1, totalPredicted - 1);
        return this.turboColormap(t);
    }
    
    turboColormap(t) {
        // Simplified turbo colormap approximation
        const r = Math.max(0, Math.min(1, 1.5 - Math.abs(2 * t - 1) * 2));
        const g = Math.max(0, Math.min(1, 1.5 - Math.abs(2 * t - 0.5) * 2));
        const b = Math.max(0, Math.min(1, 1.5 - Math.abs(2 * t) * 2));
        return new THREE.Color(r, g, b);
    }
    
    createCameraFrustum(camData, sceneScale, color) {
        const group = new THREE.Group();
        
        // Extract camera parameters
        const K = camData.intrinsic;
        const c2w = camData.camera_to_world;
        const W = camData.width;
        const H = camData.height;
        
        const fx = K[0][0];
        const fy = K[1][1];
        // Use symmetric principal point at image center to avoid skewed frustum (matching demo_open3d.py)
        const cx = (W - 1) * 0.5;
        const cy = (H - 1) * 0.5;
        
        // Near and far plane distances (2x larger for better visibility)
        const zn = 0.08 * sceneScale;
        const zf = 0.08 * sceneScale;
        
        // Corner points in image space
        const corners = [
            [0, 0],
            [W - 1, 0],
            [W - 1, H - 1],
            [0, H - 1]
        ];
        
        // Build transformation matrix from c2w (row-major from Python)
        // Three.js uses column-major, so we need to transpose
        const mat = new THREE.Matrix4();
        mat.set(
            c2w[0][0], c2w[0][1], c2w[0][2], c2w[0][3],
            c2w[1][0], c2w[1][1], c2w[1][2], c2w[1][3],
            c2w[2][0], c2w[2][1], c2w[2][2], c2w[2][3],
            c2w[3][0], c2w[3][1], c2w[3][2], c2w[3][3]
        );
        
        // Convert to camera space then world space
        const getCornerPoint = (u, v, z) => {
            // OpenCV convention: Y-axis points down in image space
            // So we need to negate y when converting to camera space
            const x = (u - cx) / fx * z;
            const y = (v - cy) / fy * z;  // Y points down in OpenCV
            const camPoint = new THREE.Vector4(x, y, z, 1);
            
            // Transform to world space
            camPoint.applyMatrix4(mat);
            
            return new THREE.Vector3(camPoint.x, camPoint.y, camPoint.z);
        };
        
        // Camera center in world space (extract translation from c2w)
        const center = new THREE.Vector3(c2w[0][3], c2w[1][3], c2w[2][3]);
        
        // Near plane corners
        const nearCorners = corners.map(([u, v]) => getCornerPoint(u, v, zn));
        
        // Far plane corners
        const farCorners = corners.map(([u, v]) => getCornerPoint(u, v, zf));
        
        // Create thick lines using cylinders (for better visibility)
        const lineRadius = 0.004 * sceneScale;  // 2x thicker lines
        
        // Helper function to create cylinder between two points
        const createCylinderLine = (start, end, color) => {
            const direction = new THREE.Vector3().subVectors(end, start);
            const length = direction.length();
            const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            
            const geometry = new THREE.CylinderGeometry(lineRadius, lineRadius, length, 8);
            const material = new THREE.MeshBasicMaterial({ color: color });
            const cylinder = new THREE.Mesh(geometry, material);
            
            // Orient cylinder to connect start and end points
            cylinder.position.copy(midpoint);
            cylinder.lookAt(end);
            cylinder.rotateX(Math.PI / 2);
            
            return cylinder;
        };
        
        // Lines from center to near corners
        for (let i = 0; i < 4; i++) {
            const cylinder = createCylinderLine(center, nearCorners[i], color);
            group.add(cylinder);
        }
        
        // Near rectangle
        for (let i = 0; i < 4; i++) {
            const cylinder = createCylinderLine(nearCorners[i], nearCorners[(i + 1) % 4], color);
            group.add(cylinder);
        }
        
        // Far rectangle
        for (let i = 0; i < 4; i++) {
            const cylinder = createCylinderLine(farCorners[i], farCorners[(i + 1) % 4], color);
            group.add(cylinder);
        }
        
        // Lines from near to far
        for (let i = 0; i < 4; i++) {
            const cylinder = createCylinderLine(nearCorners[i], farCorners[i], color);
            group.add(cylinder);
        }
        
        // Add a smaller sphere at camera center
        const sphereGeometry = new THREE.SphereGeometry(0.01 * sceneScale, 16, 16);  // 2x larger sphere
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(center);
        group.add(sphere);
        
        return group;
    }
    
    fitCameraToScene() {
        if (!this.pointCloud) return;
        
        // Compute bounding box of point cloud
        this.pointCloud.geometry.computeBoundingBox();
        const bbox = this.pointCloud.geometry.boundingBox;
        
        if (!bbox) return;
        
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        
        const size = new THREE.Vector3();
        bbox.getSize(size);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 2.0; // Add more margin for better initial view
        
        // Position camera considering the flipped up vector (Y-down)
        // Place camera above the scene looking down (negative Y due to flip means moving up)
        this.camera.position.set(center.x, center.y - cameraZ * 1.0, center.z + cameraZ * 0.3);
        this.camera.lookAt(center);
        this.controls.target.copy(center);
        this.controls.update();
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.pointCloud) {
            this.pointCloud.geometry.dispose();
            this.pointCloud.material.dispose();
        }
        this.cameraFrustums.forEach(frustum => {
            frustum.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });
    }
}

// Initialize viewers when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewers);
} else {
    initViewers();
}

function initViewers() {
    // Example usage - will be customized per scene
    // const viewer = new NPZPointCloudViewer('viewer-container', 'path/to/data.json');
}
