'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { Globe, AlertCircle, Sparkles, Link as LinkIcon, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function HtmlToPdfPage() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (mode === 'url' && !url) {
      setError('Please enter a valid URL.');
      return;
    }
    if (mode === 'file' && !file) {
      setError('Please select an HTML file.');
      return;
    }

    setStatus('processing');
    setProgress(20);
    setError(null);

    try {
      setProgress(40);
      const response = await api.htmlToPdf({
        url: mode === 'url' ? url : undefined,
        file: mode === 'file' ? file || undefined : undefined
      });
      setProgress(80);
      
      const blob = response.data;
      const filename = `converted_html_${Date.now()}.pdf`;
      
      setResult({ blob, filename });
      setProgress(100);
      setTimeout(() => setStatus('success'), 500);
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || 'An error occurred while converting your HTML.';
      setError(message);
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setUrl('');
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pt-4">
        <div className="flex items-center gap-6 text-left">
          <div className="p-4 rounded-[24px] bg-emerald-500/10 text-emerald-500 ring-4 ring-emerald-500/5 shadow-xl shadow-emerald-500/10">
            <Globe size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">HTML to PDF</h1>
            <p className="text-base text-muted-foreground font-medium max-w-md">
              Convert any web page or HTML file into a high-quality PDF.
            </p>
          </div>
        </div>

        {status === 'idle' && ((mode === 'url' && url) || (mode === 'file' && file)) && (
          <div className="flex-shrink-0 animate-in zoom-in-95 duration-500">
            <Button size="lg" onClick={handleConvert} className="px-10 rounded-[20px] h-16 text-lg font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group bg-emerald-600 hover:bg-emerald-700">
              <Sparkles className="mr-2 group-hover:rotate-12 transition-transform duration-500" size={20} strokeWidth={3} />
              Convert Now
            </Button>
          </div>
        )}
      </div>

      <div className="pt-2">
        {status === 'idle' && (
          <div className="space-y-8">
            <div className="flex p-1.5 bg-secondary/50 backdrop-blur-xl rounded-[24px] w-fit mx-auto border border-border/50">
              <button
                onClick={() => setMode('url')}
                className={`flex items-center gap-2 px-8 py-3 rounded-[18px] font-bold transition-all ${
                  mode === 'url' ? 'bg-white text-primary shadow-lg ring-1 ring-black/5' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LinkIcon size={18} />
                URL to PDF
              </button>
              <button
                onClick={() => setMode('file')}
                className={`flex items-center gap-2 px-8 py-3 rounded-[18px] font-bold transition-all ${
                  mode === 'file' ? 'bg-white text-primary shadow-lg ring-1 ring-black/5' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileCode size={18} />
                HTML File
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'url' ? (
                <motion.div
                  key="url-mode"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="premium-card p-12 md:p-20 text-center"
                >
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="url-input" className="text-sm font-black uppercase tracking-widest text-muted-foreground">Enter Website URL</label>
                      <input
                        id="url-input"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full h-16 px-6 rounded-[20px] bg-secondary/50 border-2 border-transparent focus:border-emerald-500/50 focus:bg-white outline-none text-xl font-medium transition-all text-center"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Make sure the URL is public and accessible without login.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file-mode"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <FileUpload onFilesSelected={(files) => setFile(files[0])} multiple={false} accept=".html,.htm" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {status === 'processing' && (
          <div className="py-12">
            <ProgressBar 
              progress={progress} 
              label="Converting HTML..." 
              sublabel={mode === 'url' ? `Fetching content from ${url}` : "Rendering your HTML layout."} 
            />
          </div>
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
    </div>
  );
}
