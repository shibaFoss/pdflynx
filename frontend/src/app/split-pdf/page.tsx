'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { Scissors, AlertCircle, Hash } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SplitPdfPage() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState('1-z');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSplit = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to split.');
      return;
    }

    setStatus('processing');
    setProgress(20);
    setError(null);

    try {
      setProgress(40);
      const response = await api.split(files[0], range);
      setProgress(80);
      
      const blob = response.data;
      const filename = `split_pdf_${Date.now()}.zip`;
      
      setResult({ blob, filename });
      setProgress(100);
      setTimeout(() => setStatus('success'), 500);
    } catch (err) {
      console.error(err);
      const message = (err as any).response?.data?.message || 'An error occurred while splitting your PDF.';
      setError(message);
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setFiles([]);
    setRange('1-z');
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pt-4">
        <div className="flex items-center gap-6 text-left">
          <div className="p-4 rounded-[24px] bg-emerald-500/10 text-emerald-500 ring-4 ring-emerald-500/5 shadow-xl shadow-emerald-500/10 active:rotate-12 transition-transform">
            <Scissors size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Split PDF</h1>
            <p className="text-base text-muted-foreground font-medium max-w-md">
               Extract pages or split a document into parts.
            </p>
          </div>
        </div>

        {status === 'idle' && files.length > 0 && (
          <div className="flex-shrink-0 animate-in zoom-in-95 duration-500">
            <Button size="lg" onClick={handleSplit} className="px-10 rounded-[20px] h-16 text-lg font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group bg-primary hover:bg-emerald-600">
              <Scissors className="mr-2 group-hover:rotate-12 transition-transform duration-500" size={20} strokeWidth={3} />
              Split Now
            </Button>
          </div>
        )}
      </div>

      <div className="pt-2">
        {status === 'idle' && (
          <div className="space-y-6">
            <FileUpload onFilesSelected={(f) => setFiles(f)} multiple={false} />
            
            {files.length > 0 && (
              <div className="premium-card p-6 px-8 animate-in zoom-in duration-500 relative overflow-hidden group border-2 rounded-[32px]">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center gap-3 min-w-max">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary ring-4 ring-primary/5">
                      <Hash size={20} strokeWidth={3} />
                    </div>
                    <label className="text-lg font-black tracking-tight text-foreground">
                      Page Range
                    </label>
                  </div>
                  
                  <div className="flex-1 w-full relative">
                    <input
                      type="text"
                      value={range}
                      onChange={(e) => setRange(e.target.value)}
                      placeholder="e.g. 1-5, 8, 11-z"
                      className="w-full bg-muted/40 border-2 border-border/40 rounded-2xl px-6 h-14 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground font-bold whitespace-nowrap italic opacity-70">
                    Use &quot;z&quot; for last page
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {status === 'processing' && (
        <ProgressBar progress={progress} label="Splitting PDF..." sublabel="Slicing your document into precisely what you need" />
      )}

      {status === 'success' && result && (
        <ResultDownload 
          filename={result.filename} 
          onDownload={() => downloadBlob(result.blob, result.filename)}
          onReset={reset}
        />
      )}

      {status === 'error' && (
        <div className="premium-card p-12 text-center space-y-8 border-destructive/20 bg-destructive/5 animate-in shake duration-500">
          <div className="inline-flex p-6 rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
             <AlertCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-foreground">Oops! Something went wrong</h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">{error}</p>
          <Button onClick={reset} variant="outline" className="rounded-full px-10">Try Again</Button>
        </div>
      )}
    </div>
  );
}
