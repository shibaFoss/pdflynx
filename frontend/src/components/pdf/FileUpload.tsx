'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, FileText, Plus, File, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
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
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-3 border-dashed rounded-[40px] p-16 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[400px] border-border/60 hover:border-primary group bg-secondary/20 hover:bg-white dark:hover:bg-slate-900 shadow-sm active:scale-[0.995] overflow-hidden ${
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
        
        <div className="relative mb-10">
           <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
           <div className="relative bg-primary p-8 rounded-[32px] text-white shadow-2xl shadow-primary/40 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
             <Upload size={48} strokeWidth={2.5} className="group-hover:animate-bounce" />
           </div>
        </div>

        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
            Upload Your Files
          </h2>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Drag and drop your PDF here, or <span className="text-primary font-bold decoration-2 underline-offset-4 hover:underline">browse</span> your folders.
          </p>
        </div>

        <div className="mt-12 flex items-center gap-6 text-sm font-bold text-muted-foreground/60">
           <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>Secure & AES-256 Encrypted</span>
           </div>
           <div className="w-1.5 h-1.5 rounded-full bg-border" />
           <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Max 50MB per file</span>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {selectedFiles.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                layout
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="flex items-center gap-4 premium-card p-5 group relative hover:border-primary/40 border-2 rounded-3xl"
              >
                <div className="bg-primary/10 p-4 rounded-2xl text-primary shadow-sm ring-8 ring-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <FileText size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-sm font-black truncate text-foreground group-hover:text-primary transition-colors">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="p-2.5 text-muted-foreground hover:text-white hover:bg-rose-500 rounded-xl transition-all absolute right-3 hover:scale-110 shadow-sm"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </motion.div>
            ))}
            {multiple && selectedFiles.length < maxFiles && (
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center justify-center gap-3 border-3 border-dashed border-border rounded-3xl p-5 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all font-black text-sm bg-secondary/20 h-[84px] group"
              >
                <div className="p-1.5 rounded-lg bg-border group-hover:bg-primary group-hover:text-white transition-all">
                   <Plus size={20} strokeWidth={3} />
                </div>
                <span>Add More</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
