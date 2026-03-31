'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { Layers, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MergePdfPage() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    setStatus('processing');
    setProgress(20);
    setError(null);

    try {
      setProgress(40);
      const response = await api.merge(files);
      setProgress(80);
      
      const blob = response.data;
      const filename = `merged_pdf_${Date.now()}.pdf`;
      
      setResult({ blob, filename });
      setProgress(100);
      setTimeout(() => setStatus('success'), 500);
    } catch (err) {
      console.error(err);
      const message = (err as any).response?.data?.message || 'An error occurred while merging your PDFs.';
      setError(message);
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pt-4">
        <div className="flex items-center gap-6 text-left">
          <div className="p-4 rounded-[24px] bg-indigo-500/10 text-indigo-500 ring-4 ring-indigo-500/5 shadow-xl shadow-indigo-500/10">
            <Layers size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Merge PDF</h1>
            <p className="text-base text-muted-foreground font-medium max-w-md">
              Combine multiple PDF documents into a single file.
            </p>
          </div>
        </div>

        {status === 'idle' && files.length >= 2 && (
          <div className="flex-shrink-0 animate-in zoom-in-95 duration-500">
            <Button size="lg" onClick={handleMerge} className="px-10 rounded-[20px] h-16 text-lg font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group bg-primary hover:bg-indigo-600">
              <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-500" size={20} strokeWidth={3} />
              Merge Now
            </Button>
          </div>
        )}
      </div>

      <div className="pt-2">
        {status === 'idle' && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <FileUpload onFilesSelected={setFiles} multiple={true} />
          </div>
        )}

        {status === 'processing' && (
          <div className="py-12">
            <ProgressBar progress={progress} label="Merging Your Files..." sublabel="Our engine is welding your documents together." />
          </div>
        )}
      </div>

      {status === 'success' && result && (
        <ResultDownload 
          filename={result.filename} 
          onDownload={() => downloadBlob(result.blob, result.filename)}
          onReset={reset}
        />
      )}

      {status === 'error' && (
        <div className="premium-card p-16 text-center space-y-10 border-destructive/20 bg-destructive/5 animate-in shake duration-500 rounded-[48px]">
          <div className="inline-flex p-8 rounded-[32px] bg-destructive/10 text-destructive ring-8 ring-destructive/5">
             <AlertCircle size={64} strokeWidth={2.5} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-foreground">Wait! Something went wrong</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">{error}</p>
          </div>
          <Button onClick={reset} variant="outline" className="rounded-2xl px-12 h-14 font-black border-2">Try Again</Button>
        </div>
      )}
    </div>
  );
}
