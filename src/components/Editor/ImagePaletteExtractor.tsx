import { useState, useRef } from 'react';
import { extractColorsFromImage, generatePaletteFromColors } from '../../utils/imageColorExtractor';
import type { ColorPalette } from '../../types/theme';

interface ImagePaletteExtractorProps {
  onApplyPalette: (light: ColorPalette, dark: ColorPalette) => void;
}

export function ImagePaletteExtractor({ onApplyPalette }: ImagePaletteExtractorProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const colors = await extractColorsFromImage(file, 6);
      setExtractedColors(colors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract colors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      setError('Please drop an image file');
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const colors = await extractColorsFromImage(file, 6);
      setExtractedColors(colors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract colors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleApply = () => {
    if (extractedColors.length === 0) return;

    const lightColors = generatePaletteFromColors(extractedColors, false);
    const darkColors = generatePaletteFromColors(extractedColors, true);

    const lightPalette: ColorPalette = {
      name: 'From Image (Light)',
      colors: lightColors,
    };

    const darkPalette: ColorPalette = {
      name: 'From Image (Dark)',
      colors: darkColors,
    };

    onApplyPalette(lightPalette, darkPalette);
  };

  const handleClear = () => {
    setImagePreview(null);
    setExtractedColors([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Extract from Image
        </h3>
      </div>

      {/* Drop zone / Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          imagePreview
            ? 'border-purple-300 dark:border-purple-700'
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {isLoading ? (
          <div className="py-4">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Extracting colors...</p>
          </div>
        ) : imagePreview ? (
          <div className="space-y-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 mx-auto rounded object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              Remove image
            </button>
          </div>
        ) : (
          <div className="py-4">
            <svg className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drop an image or <span className="text-purple-500">browse</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Extracted colors */}
      {extractedColors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Extracted Colors</span>
            <span className="text-xs text-gray-400">{extractedColors.length} colors</span>
          </div>

          <div className="flex gap-1">
            {extractedColors.map((color, idx) => (
              <div
                key={idx}
                className="flex-1 h-8 rounded first:rounded-l-lg last:rounded-r-lg relative group"
                style={{ backgroundColor: color }}
                title={color}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-black/50 text-white rounded">
                  {color}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleApply}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Apply to Theme
          </button>
        </div>
      )}
    </div>
  );
}
