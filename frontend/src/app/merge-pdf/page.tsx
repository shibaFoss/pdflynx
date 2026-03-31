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
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while merging your PDFs.');
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
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center space-y-6 pt-12">
        <div className="inline-flex p-5 rounded-[32px] bg-indigo-500/10 text-indigo-500 ring-8 ring-indigo-500/5 shadow-2xl shadow-indigo-500/20 transform hover:rotate-12 transition-transform duration-500">
          <Layers size={48} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tight text-foreground">Merge PDF Files</h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto">
            Combine multiple PDF documents into a single, professional file in the exact order you need.
          </p>
        </div>
      </div>

      {status === 'idle' && (
        <div className="space-y-16 animate-in zoom-in-95 duration-700">
          <FileUpload onFilesSelected={setFiles} multiple={true} />
          {files.length >= 2 && (
            <div className="flex justify-center pt-8">
              <Button size="lg" onClick={handleMerge} className="px-16 rounded-[24px] h-20 text-xl font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group bg-primary hover:bg-indigo-600">
                <Plus className="mr-3 group-hover:rotate-90 transition-transform duration-500" size={24} strokeWidth={3} />
                Merge PDFs Now
              </Button>
            </div>
          )}
        </div>
      )}

      {status === 'processing' && (
        <ProgressBar progress={progress} label="Merging Your Files..." sublabel="Our engine is welding your documents together for the perfect final result." />
      )}

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
