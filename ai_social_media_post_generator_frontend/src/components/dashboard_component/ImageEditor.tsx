"use client";

import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { useImageManagement } from '@/hooks/api/useImageManagement';
import { toast } from 'sonner';

interface ImageEditorProps {
  postId: string;
  contentIndex: number;
  currentImages: string[];
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  postId,
  contentIndex,
  currentImages,
  onClose
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { replaceImages, addImages, removeImages } = useImageManagement();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast.error('Some files were skipped', {
        description: 'Only JPEG, PNG, GIF, and WebP images are supported.'
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      
      // Create preview URLs
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    try {
      // Convert files to base64 strings (for demo purposes)
      // In a real app, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
      const imageUrls = await Promise.all(
        selectedFiles.map(file => convertFileToBase64(file))
      );

      // Replace current images with new ones
      await replaceImages.mutateAsync({
        postId,
        contentIndex,
        images: imageUrls
      });

      onClose();
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleRemoveCurrentImages = async () => {
    try {
      await removeImages.mutateAsync({
        postId,
        contentIndex
      });
      onClose();
    } catch (error) {
      console.error('Error removing images:', error);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Edit Images</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Images */}
          {currentImages.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Current Images</h3>
              <div className="grid grid-cols-2 gap-3">
                {currentImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Current image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveCurrentImages()}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload */}
          <div>
            <h3 className="text-sm font-medium mb-3">Upload New Images</h3>
            
            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Upload Button */}
            <Button
              onClick={openFileDialog}
              variant="outline"
              className="w-full h-20 border-dashed border-2 border-gray-300 hover:border-gray-400"
            >
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to select images or drag and drop
                </span>
              </div>
            </Button>
          </div>

          {/* Preview Selected Files */}
          {previewUrls.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Selected Images</h3>
              <div className="grid grid-cols-2 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            
            {currentImages.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleRemoveCurrentImages}
                disabled={removeImages.isPending}
                className="flex-1"
              >
                {removeImages.isPending ? 'Removing...' : 'Remove All'}
              </Button>
            )}
            
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || replaceImages.isPending}
              className="flex-1"
            >
              {replaceImages.isPending ? 'Uploading...' : 'Upload Images'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageEditor;
