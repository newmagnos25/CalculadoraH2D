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

// Cores de filamentos populares
const FILAMENT_COLORS = [
  { name: 'Laranja', color: 0xff6b35, hex: '#ff6b35' },
  { name: 'Vermelho', color: 0xe63946, hex: '#e63946' },
  { name: 'Azul', color: 0x1d3557, hex: '#1d3557' },
  { name: 'Verde', color: 0x06a77d, hex: '#06a77d' },
  { name: 'Amarelo', color: 0xffd23f, hex: '#ffd23f' },
  { name: 'Roxo', color: 0x7209b7, hex: '#7209b7' },
  { name: 'Preto', color: 0x1a1a1a, hex: '#1a1a1a' },
  { name: 'Branco', color: 0xf8f9fa, hex: '#f8f9fa' },
  { name: 'Cinza', color: 0x6c757d, hex: '#6c757d' },
  { name: 'Rosa', color: 0xff006e, hex: '#ff006e' },
];

export default function STLUploader({
  onAnalysisComplete,
  onFileLoaded,
  maxSizeMB = 50,
}: STLUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<STLAnalysis | null>(null);
  const [selectedColor, setSelectedColor] = useState(FILAMENT_COLORS[0]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Inicializar cena Three.js
  useEffect(() => {
    if (!canvasRef.current) {
      console.error('❌ Canvas ref não está disponível!');
      return;
    }

    console.log('🎨 Inicializando cena Three.js...');
    console.log('📦 Canvas element:', canvasRef.current);
    console.log('📐 Canvas dimensions:', {
      width: canvasRef.current.clientWidth,
      height: canvasRef.current.clientHeight,
      offsetWidth: canvasRef.current.offsetWidth,
      offsetHeight: canvasRef.current.offsetHeight,
    });

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Fundo mais claro e limpo
    sceneRef.current = scene;

    // Camera - Posicionada para visualizar a mesa de impressão
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(180, 140, 180); // Ângulo diagonal para melhor visão
    camera.lookAt(0, 20, 0); // Olha para o centro da mesa, um pouco acima
    cameraRef.current = camera;

    console.log('📷 Câmera criada:', camera.position);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    console.log('🖼️ Renderer criado:', canvasRef.current.clientWidth, 'x', canvasRef.current.clientHeight);

    // Controls - Centralizado na mesa de impressão
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.target.set(0, 20, 0); // Foca no centro da mesa
    controls.minDistance = 50; // Limite de zoom in
    controls.maxDistance = 500; // Limite de zoom out
    controls.maxPolarAngle = Math.PI / 2 + 0.3; // Impede de ir abaixo da mesa
    controls.update();
    controlsRef.current = controls;

    console.log('🎮 Controles criados');

    // Prevenir scroll da página quando estiver sobre o canvas
    const preventWheelScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const preventTouchScroll = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('wheel', preventWheelScroll, { passive: false });
    canvas.addEventListener('touchmove', preventTouchScroll, { passive: false });

    console.log('🚫 Eventos de scroll bloqueados no canvas');

    // Lights - Iluminação mais forte
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight1.position.set(100, 100, 100);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-100, -100, -100);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight3.position.set(0, 100, 0);
    scene.add(directionalLight3);

    console.log('💡 Luzes adicionadas à cena');

    // Grid e eixos para referência visual - mesa de impressão
    const gridSize = 220; // Simula uma mesa de impressão 220x220mm
    const gridDivisions = 22; // 10mm por divisão
    const gridHelper = new THREE.GridHelper(
      gridSize,
      gridDivisions,
      0x3b82f6, // Azul para linhas principais
      0xd1d5db  // Cinza claro para linhas secundárias
    );
    gridHelper.position.y = 0; // Grid alinhado com a base dos modelos
    scene.add(gridHelper);

    // Eixos XYZ menores e mais discretos
    const axesHelper = new THREE.AxesHelper(50);
    axesHelper.position.y = 0.1; // Ligeiramente acima do grid
    scene.add(axesHelper);

    console.log('📏 Grid de impressão e eixos adicionados');

    // Render inicial
    renderer.render(scene, camera);
    console.log('🎬 Primeira renderização executada');

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
      if (rendererRef.current) {
        const canvas = rendererRef.current.domElement;
        canvas.removeEventListener('wheel', preventWheelScroll);
        canvas.removeEventListener('touchmove', preventTouchScroll);
      }
      renderer.dispose();
      controls.dispose();
      console.log('🧹 Cena Three.js limpa');
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

    // Calcular volume usando método de triangulação (signed volume)
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

      // Volume de tetraedro: (v1 · (v2 × v3)) / 6
      const cross = new THREE.Vector3().crossVectors(v2, v3);
      volume += v1.dot(cross) / 6.0;
    }

    volume = Math.abs(volume); // Volume em mm³
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

      console.log('📊 Análise completa:', analysisResult);

      // Renderizar modelo
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        console.log('🎨 Iniciando renderização do modelo 3D...');

        // Remover mesh anterior
        if (meshRef.current) {
          console.log('🗑️ Removendo mesh anterior');
          sceneRef.current.remove(meshRef.current);
          meshRef.current.geometry.dispose();
          if (Array.isArray(meshRef.current.material)) {
            meshRef.current.material.forEach(m => m.dispose());
          } else {
            meshRef.current.material.dispose();
          }
        }

        // Criar novo material com cor selecionada
        const material = new THREE.MeshStandardMaterial({
          color: selectedColor.color,
          roughness: 0.35,
          metalness: 0.2,
          flatShading: false,
        });

        const mesh = new THREE.Mesh(geometry, material);
        console.log('🔷 Mesh criado com', geometry.attributes.position.count / 3, 'triângulos');

        // Centralizar modelo e alinhar na base da mesa
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox!;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);

        // Centralizar em X e Z, mas colocar base em Y = 0 (em cima da mesa)
        mesh.position.set(
          -center.x,
          -boundingBox.min.y, // Alinha a base do modelo no plano Y=0
          -center.z
        );

        console.log('📍 Modelo alinhado na mesa:', {
          center,
          baseY: boundingBox.min.y,
          position: mesh.position
        });

        sceneRef.current.add(mesh);
        meshRef.current = mesh;

        console.log('✅ Mesh adicionado à cena');

        // Ajustar câmera para visualizar o modelo perfeitamente
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = cameraRef.current.fov * (Math.PI / 180);
        let cameraDistance = Math.abs(maxDim / Math.sin(fov / 2));
        cameraDistance *= 1.8; // Zoom adequado para ver o modelo completo

        // O modelo agora está com base em Y=0, então o centro visual está em metade da altura
        const modelCenterY = size.y / 2;

        cameraRef.current.position.set(
          cameraDistance * 0.6,
          cameraDistance * 0.5,
          cameraDistance * 0.6
        );
        cameraRef.current.lookAt(0, modelCenterY, 0);

        if (controlsRef.current) {
          controlsRef.current.target.set(0, modelCenterY, 0); // Foca no centro do modelo
          controlsRef.current.update();
        }

        // Forçar renderização
        rendererRef.current.render(sceneRef.current, cameraRef.current);

        console.log('🎯 Modelo renderizado!', {
          triangles: analysisResult.triangles,
          dimensions: analysisResult.dimensions,
          volume: analysisResult.volume,
          boundingBox: { min: boundingBox.min, max: boundingBox.max },
          size: { x: size.x, y: size.y, z: size.z },
          cameraPosition: cameraRef.current.position,
          cameraDistance,
        });
      } else {
        console.error('❌ Elementos Three.js não disponíveis:', {
          scene: !!sceneRef.current,
          camera: !!cameraRef.current,
          renderer: !!rendererRef.current,
        });
        console.log('🔍 Valores das refs:', {
          sceneRef: sceneRef.current,
          cameraRef: cameraRef.current,
          rendererRef: rendererRef.current,
        });

        // Tentar inicializar se canvas existir
        if (canvasRef.current && !sceneRef.current) {
          console.log('🔧 Tentando inicializar cena agora...');
          // Força inicialização
          window.location.reload();
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

  // Função para trocar cor do modelo
  const handleColorChange = (colorOption: typeof FILAMENT_COLORS[0]) => {
    setSelectedColor(colorOption);

    // Atualizar cor do mesh atual se existir
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.color.setHex(colorOption.color);

      // Forçar re-render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      console.log('🎨 Cor alterada para:', colorOption.name);
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

      {/* Canvas 3D - Sempre visível para garantir que Three.js inicialize corretamente */}
      <div className="mb-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview 3D {fileName ? '(Arraste para rotacionar • Scroll para zoom)' : '(Carregue um arquivo STL para visualizar)'}
            </h4>
          </div>
          <div className="w-full h-96 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full bg-slate-50 dark:bg-slate-900"
            />
            {!fileName && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 pointer-events-none">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Nenhum modelo carregado
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Faça upload de um arquivo STL para visualizar
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Seletor de Cores - Aparece quando tem modelo carregado */}
          {fileName && (
            <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border-t-2 border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Cor do Filamento
                </h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {FILAMENT_COLORS.map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => handleColorChange(colorOption)}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                      selectedColor.name === colorOption.name
                        ? 'bg-white dark:bg-slate-900 shadow-lg ring-2 ring-blue-500 scale-105'
                        : 'bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:scale-102'
                    }`}
                    title={`Visualizar em ${colorOption.name}`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shadow-inner"
                      style={{ backgroundColor: colorOption.hex }}
                    />
                    <span className="text-slate-700 dark:text-slate-300">
                      {colorOption.name}
                    </span>
                    {selectedColor.name === colorOption.name && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Clique para visualizar o modelo na cor desejada
              </p>
            </div>
          )}
        </div>
      </div>

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
