import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export default function FileUpload({ onFileSelect, file, onClear, uploading }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: uploading
  });

  if (file) {
    return (
      <Card className="p-4 border shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          {!uploading ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X size={18} />
            </Button>
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          )}
        </div>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`relative group rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          isDragActive ? 'bg-primary/20' : 'bg-muted'
        }`}>
          <Upload size={22} className={isDragActive ? 'text-primary' : 'text-muted-foreground'} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {isDragActive ? 'Drop your resume here' : 'Click or drag resume here'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports PDF, DOCX (Max 10MB)
          </p>
        </div>
        {!isDragActive && (
          <Button variant="outline" size="sm" className="mt-2 shadow-sm font-medium">
            Select File
          </Button>
        )}
      </div>
    </div>
  );
}
