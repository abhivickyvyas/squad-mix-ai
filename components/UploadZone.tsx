import React, { useCallback } from 'react';

interface UploadZoneProps {
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ files, onFilesSelected, onRemoveFile }) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Limit total to 5
      const combined = [...files, ...newFiles].slice(0, 5);
      onFilesSelected(combined);
    }
  };

  return (
    <div className="w-full space-y-4">
      <label className="block group cursor-pointer relative">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={files.length >= 5}
        />
        <div className={`
          border-2 border-dashed rounded-3xl p-8 transition-all duration-300
          flex flex-col items-center justify-center text-center gap-4
          ${files.length >= 5 
            ? 'border-gray-700 bg-dark-surface/50 opacity-50 cursor-not-allowed' 
            : 'border-white/20 bg-dark-surface hover:border-neon-blue/50 hover:bg-dark-surface/80 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)]'}
        `}>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-white mb-1">Upload the Squad</p>
            <p className="text-sm text-gray-400">Select 1-5 photos of your friends</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-neon-pink border border-neon-pink/30">
            {files.length} / 5 Selected
          </span>
        </div>
      </label>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
              <img 
                src={URL.createObjectURL(file)} 
                alt="preview" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => onRemoveFile(idx)}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};