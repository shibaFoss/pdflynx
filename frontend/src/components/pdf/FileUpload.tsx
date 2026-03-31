'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, FileText, Plus, File } from 'lucide-react';
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
    const totalFiles = [...selectedFiles, ...newFiles].slice(0, maxFiles);
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
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[300px] border-border hover:border-primary group bg-muted/30 hover:bg-primary/5 active:scale-[0.99] overflow-hidden ${
          dragActive ? 'border-primary bg-primary/10 ring-8 ring-primary/5 scale-[1.01]' : ''
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="bg-primary/10 p-6 rounded-2xl text-primary mb-6 ring-8 ring-primary/5 group-hover:scale-110 transition-transform shadow-sm">
          <Upload size={40} className="group-hover:animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-tight">Upload Your Files</h2>
        <p className="text-muted-foreground text-center font-medium max-w-sm mb-6">
          Drag and drop your PDF here, or click to browse. Support multiple files up to 50MB.
        </p>
        <Button size="lg" className="rounded-full px-10 shadow-lg shadow-primary/20">
          Choose Files
        </Button>
      </div>

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {selectedFiles.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex items-center gap-4 premium-card p-4 group relative hover:border-primary/40 transition-all border-dashed"
              >
                <div className="bg-primary/10 p-3 rounded-xl text-primary shadow-sm ring-4 ring-primary/5">
                  <File size={22} />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">{file.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all absolute right-2 hover:scale-110"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
            {multiple && (
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl p-4 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all font-bold text-sm bg-muted/20 h-[74px]"
              >
                <Plus size={18} />
                Add More
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
