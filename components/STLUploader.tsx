'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface STLAnalysis {
  volume: number; // em cm³
  dimensions: {
    width: number; // em mm
    height: number; // em mm
    depth: number; // em mm
  };
  surfaceArea: number; // em cm²
  estimatedPrintTime: number; // em minutos
  estimatedWeight: number; // em gramas (baseado em PLA 1.24g/cm³)
  triangles: number;
}

interface STLUploaderProps {
  onAnalysisComplete: (analysis: STLAnalysis) => void;
  onFileLoaded?: (fileName: string) => void;
  maxSizeMB?: number;
}

export default function STLUploader({
  onAnalysisComplete,
  onFileLoaded,
  maxSizeMB = 50,
}: STLUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<STLAnalysis | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Inicializar cena Three.js
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(150, 150, 150);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(100, 100, 100);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-100, -100, -100);
    scene.add(directionalLight2);

    // Grid
    const gridHelper = new THREE.GridHelper(200, 20, 0xcccccc, 0xeeeeee);
    scene.add(gridHelper);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !camera || !renderer) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  const calculateGeometry = (geometry: THREE.BufferGeometry): STLAnalysis => {
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    const boundingBox = geometry.boundingBox!;
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    // Dimensões em mm
    const dimensions = {
      width: Math.round(size.x * 10) / 10,
      height: Math.round(size.y * 10) / 10,
      depth: Math.round(size.z * 10) / 10,
    };

    // Calcular volume usando método de triangulação
    let volume = 0;
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i += 3) {
      const v1 = new THREE.Vector3(
        position.getX(i),
        position.getY(i),
        position.getZ(i)
      );
      const v2 = new THREE.Vector3(
        position.getX(i + 1),
        position.getY(i + 1),
        position.getZ(i + 1)
      );
      const v3 = new THREE.Vector3(
        position.getX(i + 2),
        position.getY(i + 2),
        position.getZ(i + 2)
      );

      // Volume de tetraedro formado com origem
      volume += v1.dot(new THREE.Vector3().crossVectors(v2, v3)) / 6.0;
    }

    volume = Math.abs(volume);
    const volumeCm3 = volume / 1000; // mm³ para cm³

    // Área de superfície
    let surfaceArea = 0;
    for (let i = 0; i < position.count; i += 3) {
      const v1 = new THREE.Vector3(
        position.getX(i),
        position.getY(i),
        position.getZ(i)
      );
      const v2 = new THREE.Vector3(
        position.getX(i + 1),
        position.getY(i + 1),
        position.getZ(i + 1)
      );
      const v3 = new THREE.Vector3(
        position.getX(i + 2),
        position.getY(i + 2),
        position.getZ(i + 2)
      );

      const edge1 = new THREE.Vector3().subVectors(v2, v1);
      const edge2 = new THREE.Vector3().subVectors(v3, v1);
      const cross = new THREE.Vector3().crossVectors(edge1, edge2);
      surfaceArea += cross.length() / 2;
    }
    surfaceArea = surfaceArea / 100; // mm² para cm²

    // Estimativa de peso (PLA densidade ~1.24 g/cm³)
    // Considerando 20% de infill
    const infillFactor = 0.2;
    const pla_density = 1.24;
    const estimatedWeight = Math.round(volumeCm3 * pla_density * infillFactor * 10) / 10;

    // Estimativa de tempo de impressão
    // Baseado em: 1cm³ ≈ 3-5 minutos de impressão com qualidade média
    const timePerCm3 = 4; // minutos por cm³
    const estimatedPrintTime = Math.round(volumeCm3 * timePerCm3);

    return {
      volume: Math.round(volumeCm3 * 100) / 100,
      dimensions,
      surfaceArea: Math.round(surfaceArea * 100) / 100,
      estimatedPrintTime,
      estimatedWeight,
      triangles: position.count / 3,
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.name.toLowerCase().endsWith('.stl')) {
      setError('Por favor, selecione um arquivo STL válido');
      return;
    }

    // Validar tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loader = new STLLoader();
      const geometry = loader.parse(arrayBuffer);

      // Analisar geometria
      const analysisResult = calculateGeometry(geometry);
      setAnalysis(analysisResult);
      onAnalysisComplete(analysisResult);
      if (onFileLoaded) onFileLoaded(file.name);

      // Renderizar modelo
      if (sceneRef.current && cameraRef.current) {
        // Remover mesh anterior
        if (meshRef.current) {
          sceneRef.current.remove(meshRef.current);
          meshRef.current.geometry.dispose();
          if (Array.isArray(meshRef.current.material)) {
            meshRef.current.material.forEach(m => m.dispose());
          } else {
            meshRef.current.material.dispose();
          }
        }

        // Criar novo material com gradiente laranja
        const material = new THREE.MeshPhongMaterial({
          color: 0xff8c42,
          specular: 0x111111,
          shininess: 200,
          flatShading: false,
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Centralizar modelo
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox!;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        mesh.position.sub(center);

        sceneRef.current.add(mesh);
        meshRef.current = mesh;

        // Ajustar câmera para visualizar o modelo
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = cameraRef.current.fov * (Math.PI / 180);
        let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraDistance *= 2; // Zoom out um pouco

        cameraRef.current.position.set(
          cameraDistance,
          cameraDistance,
          cameraDistance
        );
        cameraRef.current.lookAt(0, 0, 0);

        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }
      }
    } catch (err) {
      console.error('Erro ao processar STL:', err);
      setError('Erro ao processar arquivo STL. Verifique se o arquivo está correto.');
    } finally {
      setIsLoading(false);
      event.target.value = ''; // Permitir re-upload do mesmo arquivo
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
          📐 Upload de Modelo 3D (STL)
        </label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {isLoading ? 'Processando...' : 'Carregar STL'}
            <input
              type="file"
              accept=".stl"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Máx. {maxSizeMB}MB • Análise automática de volume e dimensões
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400 font-semibold">❌ {error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold">
              Analisando modelo 3D...
            </p>
          </div>
        </div>
      )}

      {/* Preview e Análise */}
      {fileName && analysis && (
        <div className="space-y-4">
          {/* Nome do arquivo */}
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{fileName}</span>
            <span className="text-slate-500 dark:text-slate-400">
              ({analysis.triangles.toLocaleString('pt-BR')} triângulos)
            </span>
          </div>

          {/* Preview 3D */}
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview 3D (Arraste para rotacionar • Scroll para zoom)
              </h4>
            </div>
            <canvas
              ref={canvasRef}
              className="w-full h-96 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          {/* Análise */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4 shadow-md">
            <h4 className="text-sm font-bold text-orange-800 dark:text-orange-400 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Análise Automática do Modelo
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Volume */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Volume</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {analysis.volume.toLocaleString('pt-BR')} cm³
                </p>
              </div>

              {/* Peso Estimado */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Peso Est. (20% infill)</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {analysis.estimatedWeight.toLocaleString('pt-BR')} g
                </p>
              </div>

              {/* Tempo Estimado */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tempo Est.</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {Math.floor(analysis.estimatedPrintTime / 60)}h {analysis.estimatedPrintTime % 60}min
                </p>
              </div>

              {/* Largura */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Largura (X)</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {analysis.dimensions.width.toLocaleString('pt-BR')} mm
                </p>
              </div>

              {/* Altura */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Altura (Z)</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {analysis.dimensions.height.toLocaleString('pt-BR')} mm
                </p>
              </div>

              {/* Profundidade */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Profundidade (Y)</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {analysis.dimensions.depth.toLocaleString('pt-BR')} mm
                </p>
              </div>
            </div>

            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                💡 <strong>Os valores foram calculados automaticamente</strong> e já preencheram os campos abaixo. Você pode ajustá-los manualmente se necessário.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
