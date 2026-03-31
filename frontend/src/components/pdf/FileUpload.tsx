'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, FileText, File, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export const FileUpload = ({ onFilesSelected, accept = '.pdf', multiple = true, maxFiles = 10 }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(f => f.size <= 50 * 1024 * 1024); // 50MB limit
    const totalFiles = multiple ? [...selectedFiles, ...newFiles].slice(0, maxFiles) : [newFiles[0]];
    setSelectedFiles(totalFiles);
    onFilesSelected(totalFiles);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-3 border-dashed rounded-[32px] transition-all cursor-pointer flex flex-col items-center justify-center border-border/60 hover:border-primary group bg-secondary/20 hover:bg-white dark:hover:bg-slate-900 shadow-sm active:scale-[0.995] overflow-hidden ${
          selectedFiles.length > 0 ? 'p-8 min-h-[180px]' : 'p-16 min-h-[350px]'
        } ${
          dragActive ? 'border-primary bg-white dark:bg-slate-900 ring-[12px] ring-primary/5 scale-[1.01] shadow-2xl shadow-primary/10' : ''
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className={`relative ${selectedFiles.length > 0 ? 'mb-4' : 'mb-8'}`}>
           <div className={`absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 ${selectedFiles.length > 0 ? 'opacity-0' : 'animate-pulse'}`} />
           <div className={`relative bg-primary rounded-[24px] text-white shadow-xl shadow-primary/40 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out ${
             selectedFiles.length > 0 ? 'p-4' : 'p-6'
           }`}>
             <Upload size={selectedFiles.length > 0 ? 28 : 40} strokeWidth={2.5} className="group-hover:animate-bounce" />
           </div>
        </div>

        <div className="text-center space-y-2 max-w-md">
          <h2 className={`${selectedFiles.length > 0 ? 'text-xl' : 'text-2xl md:text-3xl'} font-black tracking-tight text-foreground group-hover:text-primary transition-colors`}>
            {selectedFiles.length > 0 ? 'Add More Files' : 'Upload Your Files'}
          </h2>
          <p className={`${selectedFiles.length > 0 ? 'text-sm' : 'text-lg'} text-muted-foreground font-medium leading-relaxed`}>
            {selectedFiles.length > 0 
              ? 'Drop or click here to add more'
              : 'Drag & drop your PDF, or browse your folders.'
            }
          </p>
        </div>

        {selectedFiles.length === 0 && (
          <div className="mt-8 flex items-center gap-4 text-xs font-bold text-muted-foreground/60">
             <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Secure</span>
             </div>
             <div className="w-1 h-1 rounded-full bg-border" />
             <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Max 50MB</span>
             </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"
          >
            {selectedFiles.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                layout
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                className="flex items-center gap-3 premium-card p-4 group relative hover:border-primary/40 border-2 rounded-2xl"
              >
                <div className="bg-primary/10 p-3 rounded-xl text-primary shadow-sm ring-4 ring-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <FileText size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-xs font-black truncate text-foreground group-hover:text-primary transition-colors">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="p-2 text-muted-foreground hover:text-white hover:bg-rose-500 rounded-lg transition-all absolute right-2 hover:scale-110"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
