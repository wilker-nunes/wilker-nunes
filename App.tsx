
import React, { useState, useRef, useCallback } from 'react';
import { ConstructionStage, GeneratedImage } from './types';
import { CONSTRUCTION_STAGES } from './constants';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<ConstructionStage>(ConstructionStage.ORIGINAL);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBaseImage(reader.result as string);
        setActiveStage(ConstructionStage.ORIGINAL);
        setGeneratedImages([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateStage = useCallback(async (stageId: ConstructionStage) => {
    if (!baseImage) return;
    
    const config = CONSTRUCTION_STAGES.find(s => s.id === stageId);
    if (!config) return;

    const existing = generatedImages.find(img => img.stage === stageId);
    if (existing) {
      setActiveStage(stageId);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const gemini = GeminiService.getInstance();
      const transformedUrl = await gemini.transformImage(baseImage, config.prompt);
      
      setGeneratedImages(prev => [
        ...prev,
        { stage: stageId, url: transformedUrl, timestamp: Date.now() }
      ]);
      setActiveStage(stageId);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao transformar imagem. Verifique se o prompt não viola políticas de segurança ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [baseImage, generatedImages]);

  const getCurrentDisplayImage = () => {
    if (showOriginal || activeStage === ConstructionStage.ORIGINAL) return baseImage;
    const found = generatedImages.find(img => img.stage === activeStage);
    return found ? found.url : baseImage;
  };

  const downloadCurrent = () => {
    const url = getCurrentDisplayImage();
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `rooftop-${activeStage.toLowerCase()}-${Date.now()}.png`;
    link.click();
  };

  const loadingMessages = [
    "Analisando volumetria do rooftop...",
    "Simulando iluminação global ao pôr do sol...",
    "Aplicando texturas de cimento e madeira...",
    "Processando reflexos em vidros laminados...",
    "Finalizando renderização 8K..."
  ];
  
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  React.useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-6xl mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
          AI Vision Architecture
        </div>
        <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-6 tracking-tight">
          Rooftop Vision Builder
        </h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto font-light leading-relaxed">
          Transforme seus projetos arquitetônicos em renders hiper-realistas através de todas as etapas de construção usando inteligência artificial generativa.
        </p>
      </header>

      <main className="w-full max-w-7xl flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Viewer */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="glass rounded-[2rem] overflow-hidden aspect-video relative shadow-2xl group border-slate-800/50">
            {baseImage ? (
              <>
                <img 
                  src={getCurrentDisplayImage() || ''} 
                  alt="Transformation Viewer" 
                  className={`w-full h-full object-cover transition-all duration-500 ${isLoading ? 'scale-105 blur-sm' : 'scale-100'}`}
                />
                
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-20 transition-opacity">
                    <div className="relative w-24 h-24 mb-8">
                      <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <i className="fa-solid fa-cube absolute inset-0 flex items-center justify-center text-2xl text-orange-400 animate-pulse"></i>
                    </div>
                    <p className="text-white font-bold text-xl mb-2 tracking-tight">Renderizando Etapa...</p>
                    <p className="text-slate-400 text-sm font-medium animate-pulse">{loadingMessages[loadingMsgIdx]}</p>
                  </div>
                )}

                {error && (
                  <div className="absolute top-6 left-6 right-6 bg-red-500/90 backdrop-blur-xl text-white p-4 rounded-2xl flex items-center gap-4 z-30 shadow-2xl border border-red-400/50 animate-in fade-in slide-in-from-top-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-circle-exclamation"></i>
                    </div>
                    <span className="font-medium">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-white/60 hover:text-white">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                )}
                
                {/* Overlay Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onMouseDown={() => setShowOriginal(true)}
                    onMouseUp={() => setShowOriginal(false)}
                    onMouseLeave={() => setShowOriginal(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-xs font-bold uppercase transition-colors"
                  >
                    <i className="fa-solid fa-eye"></i>
                    Segure p/ ver original
                  </button>
                  <div className="w-px h-4 bg-white/10"></div>
                  <button 
                    onClick={downloadCurrent}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-xs font-bold uppercase transition-colors"
                  >
                    <i className="fa-solid fa-download"></i>
                    Baixar Render
                  </button>
                </div>

                <div className="absolute top-6 right-6 px-4 py-2 bg-orange-600/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-orange-400/30 shadow-lg">
                  {activeStage === ConstructionStage.ORIGINAL ? 'Esboço Original' : CONSTRUCTION_STAGES.find(s => s.id === activeStage)?.title}
                </div>
              </>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all duration-500 border-2 border-dashed border-slate-800 m-2 rounded-[2rem] group"
              >
                <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-slate-800">
                  <i className="fa-solid fa-plus text-3xl text-slate-600 group-hover:text-orange-500 transition-colors"></i>
                </div>
                <p className="text-slate-300 font-bold text-xl">Novo Projeto</p>
                <p className="text-slate-500 text-sm mt-2 max-w-xs text-center px-4">Faça upload de uma foto, planta ou modelo 3D para iniciar a visualização.</p>
              </div>
            )}
          </div>

          {/* Viewer Actions */}
          <div className="flex gap-4 items-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 rounded-2xl bg-white text-black hover:bg-slate-200 transition-all flex items-center gap-3 font-bold shadow-xl shadow-white/5"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              {baseImage ? 'Alterar Modelo' : 'Upload do Modelo'}
            </button>
            {baseImage && (
              <button 
                onClick={() => {
                  setActiveStage(ConstructionStage.ORIGINAL);
                  setGeneratedImages([]);
                }}
                className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-3 font-bold"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
                Limpar Etapas
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Construction Timeline */}
        <div className="lg:w-[400px] flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-200 tracking-tight">Timeline</h2>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {generatedImages.length} / {CONSTRUCTION_STAGES.length}
            </span>
          </div>
          
          <div className="space-y-4 relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-10 top-8 bottom-8 w-px bg-slate-800"></div>

            {CONSTRUCTION_STAGES.map((stage, idx) => {
              const isGenerated = generatedImages.some(img => img.stage === stage.id);
              const isActive = activeStage === stage.id;
              
              return (
                <button
                  key={stage.id}
                  disabled={!baseImage || isLoading}
                  onClick={() => generateStage(stage.id)}
                  className={`w-full text-left p-5 rounded-[1.5rem] border transition-all duration-500 flex items-start gap-6 group relative z-10 ${
                    isActive 
                      ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20' 
                      : isGenerated 
                        ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-900/30 border-slate-900 hover:border-slate-800'
                  } ${(!baseImage || isLoading) ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 rotate-12 scale-110' 
                      : isGenerated
                        ? 'bg-slate-800 text-orange-400'
                        : 'bg-slate-900 text-slate-600 group-hover:bg-slate-800'
                  }`}>
                    <i className={`fa-solid ${stage.icon} text-lg`}></i>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-black text-sm uppercase tracking-wider ${isActive ? 'text-orange-400' : 'text-slate-300'}`}>
                        {stage.title}
                      </span>
                      {isGenerated && !isActive && (
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                           <i className="fa-solid fa-check text-[8px] text-green-500"></i>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed transition-colors duration-500 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {stage.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {!baseImage && (
            <div className="mt-6 p-8 rounded-[2rem] bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/10 text-center relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              <i className="fa-solid fa-wand-magic-sparkles text-orange-500/40 mb-4 block text-4xl"></i>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nossa IA processará o seu esboço para criar texturas, sombras e iluminação realistas em segundos.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mt-24 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm pb-16">
        <div className="flex flex-col gap-1 items-center md:items-start">
          <p className="font-bold text-slate-400">Rooftop Vision Builder AI</p>
          <p className="text-xs">Motor de renderização ultra-realista baseado em Gemini 2.5</p>
        </div>
        <div className="flex gap-8 items-center">
          <span className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Flash 2.5 Ready</span>
          </span>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-white transition-colors">Portfolio</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
