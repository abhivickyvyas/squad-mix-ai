
import React, { useState } from 'react';
import { AspectRatio, VibeType, VibeOption } from './types';
import { generateSquadImage } from './services/geminiService';
import { Button } from './components/Button';
import { UploadZone } from './components/UploadZone';

// Vibe Constants
const VIBE_OPTIONS: VibeOption[] = [
  { id: VibeType.TOGETHER, label: 'Chilling', emoji: '🛋️', promptSuffix: 'casual vibe', description: 'Sitting together' },
  { id: VibeType.DANCING, label: 'Party', emoji: '🪩', promptSuffix: 'party vibe', description: 'Dancing together' },
  { id: VibeType.CELEBRATING, label: 'Hyped', emoji: '🎉', promptSuffix: 'celebration', description: 'Celebrating wins' },
  { id: VibeType.CARTOON, label: 'Toon', emoji: '🦄', promptSuffix: '3d render', description: 'Pixar style' },
  { id: VibeType.CYBERPUNK, label: 'Cyber', emoji: '🤖', promptSuffix: 'neon city', description: 'Futuristic tech' },
  { id: VibeType.BEACH_DAY, label: 'Sunny', emoji: '🏖️', promptSuffix: 'summer vibes', description: 'Beach day' },
  { id: VibeType.RETRO_90S, label: '90s', emoji: '📼', promptSuffix: '90s aesthetic', description: 'Vintage sitcom' },
  { id: VibeType.FESTIVAL, label: 'Fest', emoji: '🎡', promptSuffix: 'music festival', description: 'Coachella vibes' },
  { id: VibeType.STARTUP, label: 'Founders', emoji: '💼', promptSuffix: 'tech startup', description: 'Forbes cover' },
  { id: VibeType.FANTASY, label: 'RPG', emoji: '⚔️', promptSuffix: 'fantasy characters', description: 'Epic heroes' },
];

const ASPECT_RATIOS: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: 'Square' },
  { value: '3:4', label: 'Portrait' },
  { value: '16:9', label: 'Wide' },
];

export default function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<VibeType>(VibeType.TOGETHER);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (files.length === 0) {
      setError("Please upload at least 1 image.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const vibeOpt = VIBE_OPTIONS.find(v => v.id === selectedVibe);
      const resultUrl = await generateSquadImage(
        files, 
        selectedVibe, 
        selectedAspectRatio, 
        vibeOpt ? vibeOpt.promptSuffix : ''
      );
      setGeneratedImage(resultUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong cooking up the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `squad-mix-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-neon-pink selection:text-white pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-black/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-pink to-neon-blue flex items-center justify-center font-bold text-black">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight">Squad<span className="text-neon-blue">Mix</span></h1>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse"></span>
             <span className="text-xs text-gray-400 font-mono">FLASH MODEL</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-10 space-y-10">
        
        {/* Hero Text */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Blend the Squad.
          </h2>
          <p className="text-gray-400 text-lg">Upload pics, choose the vibe, get the masterpiece.</p>
        </div>

        {/* Step 1: Upload */}
        <section>
          <div className="flex items-center gap-3 mb-4">
             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neon-purple text-black text-xs font-bold">1</span>
             <h3 className="font-bold text-lg">Drop the Pics</h3>
          </div>
          <UploadZone 
            files={files} 
            onFilesSelected={setFiles} 
            onRemoveFile={(idx) => setFiles(prev => prev.filter((_, i) => i !== idx))} 
          />
        </section>

        {/* Step 2: Options */}
        <section>
          <div className="flex items-center gap-3 mb-4">
             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neon-blue text-black text-xs font-bold">2</span>
             <h3 className="font-bold text-lg">Pick the Vibe</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {VIBE_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedVibe(option.id)}
                className={`
                  relative p-4 rounded-2xl border text-left transition-all duration-200
                  flex flex-col gap-2 overflow-hidden
                  ${selectedVibe === option.id 
                    ? 'border-neon-blue bg-neon-blue/10 shadow-[0_0_15px_rgba(0,255,255,0.15)]' 
                    : 'border-white/10 bg-dark-card hover:border-white/30'}
                `}
              >
                <span className="text-2xl">{option.emoji}</span>
                <div>
                  <div className="font-bold text-sm">{option.label}</div>
                  <div className="text-[10px] text-gray-400">{option.description}</div>
                </div>
                {selectedVibe === option.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_5px_#00ffff]"></div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Aspect Ratio */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neon-lime text-black text-xs font-bold">3</span>
              <h3 className="font-bold text-lg">Shape It</h3>
            </div>
          </div>
          <div className="flex gap-2 bg-dark-card p-1 rounded-xl border border-white/10 w-fit">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setSelectedAspectRatio(ratio.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-bold transition-all
                  ${selectedAspectRatio === ratio.value 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </section>

        {/* Action Area */}
        <div className="sticky bottom-6 pt-4">
            {error && (
                <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-200 text-sm text-center animate-pulse">
                    {error}
                </div>
            )}
            
            <Button 
                variant="neon" 
                className="w-full py-4 text-lg tracking-wide"
                onClick={handleGenerate}
                isLoading={isLoading}
                disabled={files.length === 0}
            >
                COOK IT UP ✨
            </Button>
        </div>

        {/* Result View */}
        {generatedImage && (
          <div id="result" className="scroll-mt-24 pt-10 border-t border-white/10 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <span>Result</span>
                <span className="text-sm font-normal text-gray-500 bg-white/10 px-2 py-0.5 rounded-md">
                    {ASPECT_RATIOS.find(r => r.value === selectedAspectRatio)?.label}
                </span>
            </h3>
            
            <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-dark-card shadow-2xl shadow-neon-purple/10">
               <img 
                 src={generatedImage} 
                 alt="Generated Squad" 
                 className="w-full h-auto object-contain max-h-[600px] bg-black/50"
               />
               
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <Button onClick={downloadImage} className="w-full bg-white text-black hover:bg-gray-200">
                      Download
                  </Button>
               </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
                Generated with Gemini 2.5 Flash
            </p>
          </div>
        )}

        <div className="h-20"></div> {/* Spacer */}
      </main>
    </div>
  );
}
