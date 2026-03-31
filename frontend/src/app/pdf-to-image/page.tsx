'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { Image as ImageIcon, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PdfToImagePage() {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'processing' | 'success' | 'error'>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeType, setRangeType] = useState<'all' | 'custom'>('all');
  const [customRange, setCustomRange] = useState('1-1');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (files.length > 0 && status === 'idle') {
      analyzePdf();
    }
  }, [files]);

  const analyzePdf = async () => {
    setStatus('analyzing');
    try {
      const response = await api.getPageCount(files[0]);
      setPageCount(response.data.count);
      setCustomRange(`1-${response.data.count}`);
      setStatus('idle');
    } catch (err: any) {
      console.error(err);
      setError('Could not analyze PDF file.');
      setStatus('error');
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to convert.');
      return;
    }

    setStatus('processing');
    setProgress(30);
    setError(null);

    const range = rangeType === 'all' ? `1-${pageCount}` : customRange;

    try {
      setProgress(60);
      const response = await api.pdfToImage(files[0], range);
      setProgress(90);
      
      const blob = response.data;
      const filename = `images_from_pdf_${Date.now()}.png`;
      
      setResult({ blob, filename });
      setProgress(100);
      setTimeout(() => setStatus('success'), 500);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while converting your PDF.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setFiles([]);
    setPageCount(0);
    setRangeType('all');
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex p-4 rounded-3xl bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/5 shadow-sm transform hover:rotate-12 transition-transform">
          <ImageIcon size={32} />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-foreground">PDF to Image</h1>
        <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">
          Transform your PDF pages into high-quality images effortlessly.
        </p>
      </div>

      {status === 'idle' && files.length === 0 && (
        <FileUpload onFilesSelected={(f) => setFiles(f)} multiple={false} />
      )}

      {status === 'analyzing' && (
        <div className="premium-card p-12 text-center space-y-6">
           <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
           <p className="text-xl font-bold">Analyzing your PDF...</p>
        </div>
      )}

      {status === 'idle' && files.length > 0 && pageCount > 0 && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="premium-card p-8 md:p-12 max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-border/50">
              <div className="p-3 bg-secondary rounded-2xl">
                <ImageIcon className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Selected File</p>
                <p className="font-bold truncate max-w-[200px] md:max-w-md">{files[0].name}</p>
              </div>
              <div className="ml-auto px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
              </div>
            </div>

            {pageCount > 1 && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => setRangeType('all')}
                    className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left space-y-2 ${rangeType === 'all' ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <p className="font-bold text-lg">Convert All Pages</p>
                    <p className="text-sm text-muted-foreground">Every page will be joined into one long image.</p>
                  </button>
                  <button 
                    onClick={() => setRangeType('custom')}
                    className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left space-y-2 ${rangeType === 'custom' ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <p className="font-bold text-lg">Select Range</p>
                    <p className="text-sm text-muted-foreground">Specify which pages you want to extract.</p>
                  </button>
                </div>

                {rangeType === 'custom' && (
                  <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-bold text-muted-foreground ml-1">Page Range (e.g. 1-5)</label>
                    <input 
                      type="text" 
                      value={customRange} 
                      onChange={(e) => setCustomRange(e.target.value)}
                      placeholder="e.g. 1-10"
                      className="w-full h-14 px-6 rounded-2xl bg-secondary border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold text-lg transition-all"
                    />
                  </div>
                )}

                {((rangeType === 'all' && pageCount > 10) || (rangeType === 'custom' && parseInt(customRange.split('-')[1]) - parseInt(customRange.split('-')[0]) > 10)) && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
                    <Info className="shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-medium">
                      <span className="font-bold">Heads up!</span> Converting many pages into a single image might result in a very large file. Browser and system limits may apply.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={reset} className="flex-1 h-14 rounded-2xl font-bold">Cancel</Button>
              <Button size="lg" onClick={handleConvert} className="flex-[2] rounded-2xl h-14 text-lg font-bold shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-transform group bg-rose-500 hover:bg-rose-600">
                <ImageIcon className="mr-2 group-hover:scale-110 transition-transform" />
                Convert to Image
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === 'processing' && (
        <ProgressBar progress={progress} label="Converting to Image..." sublabel="Joining pages into your final high-quality visual" />
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
