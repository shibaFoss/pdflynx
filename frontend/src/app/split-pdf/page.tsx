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
      const filename = `split_pdf_${Date.now()}.pdf`;
      
      setResult({ blob, filename });
      setProgress(100);
      setTimeout(() => setStatus('success'), 500);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while splitting your PDF.');
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
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5 shadow-sm transform hover:scale-110 transition-transform">
          <Scissors size={32} />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-foreground">Split PDF File</h1>
        <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">
          Separate a single PDF file into multiple documents or extract specific pages.
        </p>
      </div>

      {status === 'idle' && (
        <div className="space-y-12">
          <FileUpload onFilesSelected={(f) => setFiles(f)} multiple={false} />
          {files.length > 0 && (
            <div className="premium-card p-10 space-y-10 animate-in zoom-in duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Hash size={120} />
              </div>
              <div className="space-y-4 relative z-10">
                <label className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary ring-4 ring-primary/5">
                    <Hash size={20} />
                  </div>
                  Page Range
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="e.g. 1-5, 8, 11-z"
                    className="flex-1 w-full bg-muted/30 border-2 border-border/40 rounded-2xl px-6 h-14 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                  <Button size="lg" onClick={handleSplit} className="w-full sm:w-auto px-12 rounded-full h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform group">
                    <Scissors className="mr-2 group-hover:rotate-12 transition-transform" />
                    Split PDF Now
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground font-medium italic pl-1 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                   Use "z" for the last page (e.g., 1-z, 5-10)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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
