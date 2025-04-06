import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PaperClipIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'],
  className = '',
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errorMessages = rejectedFiles.map((file) => {
          if (file.errors[0]?.code === 'file-too-large') {
            return `File "${file.file.name}" is too large, maximum allowed is ${(maxSize / 1024 / 1024).toFixed(0)}MB`;
          }
          if (file.errors[0]?.code === 'file-invalid-type') {
            return `File "${file.file.name}" type is not supported`;
          }
          return `File "${file.file.name}" cannot be uploaded: ${file.errors[0]?.message}`;
        });
        setErrors(errorMessages);
      } else {
        setErrors([]);
      }

      // Check if adding new files would exceed maxFiles
      if (files.length + acceptedFiles.length > maxFiles) {
        setErrors((prev) => [...prev, `Maximum ${maxFiles} files allowed`]);
        // Only add files up to the max limit
        const remainingSlots = Math.max(0, maxFiles - files.length);
        const newFiles = [...files, ...acceptedFiles.slice(0, remainingSlots)];
        setFiles(newFiles);
        onFilesChange(newFiles);
      } else {
        const newFiles = [...files, ...acceptedFiles];
        setFiles(newFiles);
        onFilesChange(newFiles);
      }
    },
    [files, maxFiles, maxSize, onFilesChange]
  );

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange(newFiles);
    // Clear errors when removing files
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedFileTypes.reduce((acc, type) => {
      // Convert file extensions to proper MIME types if needed
      if (type.startsWith('.')) {
        // This is a file extension like .pdf
        const mimeType = type.substring(1);
        return { ...acc, [mimeType]: [] };
      }
      // This is already a MIME type like image/*
      return { ...acc, [type]: [] };
    }, {}),
  });

  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / 1024 / 1024).toFixed(1)} MB`;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drop files here, or <span className="text-primary-600 font-medium">click to select files</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Maximum {maxFiles} files, each up to {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mt-2">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-md">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between py-2 px-3 text-sm">
              <div className="flex items-center">
                <PaperClipIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="truncate max-w-xs">{file.name}</span>
                <span className="ml-2 text-gray-500 text-xs">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-gray-500 hover:text-red-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;