import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  currentImageUrl: string | null;
  onRemoveImage: () => void;
  imagePreview: string | null;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ImageUploader = ({
  onFileChange,
  currentImageUrl,
  onRemoveImage,
  imagePreview
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const validateImageType = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Formato não suportado. Use apenas JPG, JPEG, PNG ou WEBP');
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateImageType(droppedFile)) {
        onFileChange(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateImageType(file)) {
        onFileChange(file);
      }
    }
  };

  return (
    <div 
      className={`flex flex-col items-center gap-1 border-2 border-dashed ${
        isDragging ? 'border-primary bg-orange-50 dark:bg-gray-900' : 'border-primary/30 dark:border-foreground/30'
      } p-8 rounded-lg transition-colors relative`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDrag}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-transparent z-10" />
      )}
      <label htmlFor="image" className="text-xl text-center pointer-events-none">
        Arraste uma imagem ou clique para selecionar
      </label>
      <Input 
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="mt-4 file:flex file:py-1 file:items-center justify-center file:w-full file:mb-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold bg-primary file:text-white hover:bg-orange-700 file:transition-all file:duration-150 pointer-events-none" 
        id="image" 
        onChange={handleFileChange} 
      />
      {(imagePreview || currentImageUrl) && (
        <div className="mt-4 space-y-4">
          <img 
            src={imagePreview || currentImageUrl || ''} 
            alt="Pré-visualização da imagem" 
            className="sm:max-w-[500px] w-full h-auto rounded-lg" 
          />
          <Button 
            type="button"
            variant="destructive"
            onClick={onRemoveImage}
            className="w-full"
          >
            Remover imagem
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;