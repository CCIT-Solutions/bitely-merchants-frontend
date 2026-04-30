"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api/api";
import ProfileApiEndpoints from "@/services/profile/api";
import { notify } from "@/lib/notify";
import { useLang } from "@/hooks/useLang";
import Translate from "@/components/shared/Translate";
import { Camera, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/custom/dialog";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { useQueryClient } from "@tanstack/react-query";

interface AvatarUploadProps {
  currentAvatar?: string;
}

interface CropCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

function AvatarUpload({ currentAvatar }: AvatarUploadProps) {
  const { t } = useLang();
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Supported image formats
  const SUPPORTED_FORMATS = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/tiff",
    "image/bmp",
  ];
  const SUPPORTED_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".tiff",
    ".bmp",
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - check both MIME type and extension
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidFormat =
      SUPPORTED_FORMATS.includes(file.type) ||
      SUPPORTED_EXTENSIONS.includes(fileExtension);

    if (!isValidFormat) {
      notify(
        t("settings.invalidImageType") ||
          "Please select a valid image file (JPG, JPEG, PNG, WEBP, TIFF, or BMP)",
        {
          type: "error",
        }
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notify(
        t("settings.imageTooLarge") || "Image size should be less than 5MB",
        {
          type: "error",
        }
      );
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      // Reset crop and zoom
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      // Use setTimeout to ensure dialog opens after state is set
      setTimeout(() => {
        setShowCropDialog(true);
      }, 0);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createCroppedImage = useCallback(
    async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Set canvas size to the cropped area
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Draw the cropped image
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Convert canvas to blob
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          0.95
        );
      });
    },
    []
  );

  const handleUpload = async () => {
    if (!selectedFile || !croppedAreaPixels || !preview) return;

    setIsUploading(true);

    try {
      // Create cropped image blob
      const croppedBlob = await createCroppedImage(preview, croppedAreaPixels);

      // Create a new file from the cropped blob
      const croppedFile = new File([croppedBlob], selectedFile.name, {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("avatar", croppedFile);
      formData.append(
        "coords",
        JSON.stringify({
          x: croppedAreaPixels.x,
          y: croppedAreaPixels.y,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height,
        })
      );

      await apiRequest(ProfileApiEndpoints.updateProfileAvatar(formData), {
        t,
        setLoading: setIsUploading,
        showErrorToast: true,
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ["user"] });
          notify(t("settings.avatarUpdated") || "Avatar updated successfully");
          setPreview(null);
          setSelectedFile(null);
          setShowCropDialog(false);
          setCroppedAreaPixels(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        onError: () => {
          setIsUploading(false);
        },
      });
    } catch (error) {
      setIsUploading(false);
      notify(
        t("settings.cropError") || "Failed to crop image. Please try again.",
        {
          type: "error",
        }
      );
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const cancelCrop = () => {
    setShowCropDialog(false);
    setPreview(null);
    setSelectedFile(null);
    setCroppedAreaPixels(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Preview */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-800 border-4 border-neutral-700 relative">
              <Image
                src={currentAvatar || "/images/fallbacks/avatar.jpg"}
                alt="Profile Avatar"
                fill
                sizes="128px"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay on hover */}
            <div
              onClick={triggerFileInput}
              className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="bg-neutral-800 hover:bg-neutral-700 text-white transition-all py-6 px-6 rounded-xl cursor-pointer font-medium flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <Translate text="settings.uploadAvatar" />
            </Button>

            <p className="text-xs text-neutral-500">
              {t("settings.avatarHint") ||
                "JPG, PNG, WEBP, TIFF, BMP (max 5MB)"}
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.tiff,.bmp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Crop Dialog */}
      <Dialog
        open={showCropDialog}
        onOpenChange={(open) => {
          if (!open) {
            cancelCrop();
          } else {
            setShowCropDialog(true);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[600px] mx-auto bg-neutral-900/90 p-8 max-h-fit"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-white">
              <Translate text="settings.cropAvatar" />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Cropper Container */}
            <div className="relative w-full h-[500px]  rounded-2xl overflow-hidden">
              {preview && (
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  style={{
                    cropAreaStyle: {
                      border: "1px solid #ddd",
                    },
                  }}
                />
              )}
            </div>

            {/* Zoom Control */}
            <div className="px-4">
              <label className="text-sm text-neutral-400 mb-2 block">
                {t("settings.zoom") || "Zoom"}
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: "#fff",
                }}
              />
            </div>

            <p className="text-sm text-neutral-400 text-center">
              {t("settings.cropInstructions") ||
                "Drag to reposition • Scroll or use slider to zoom"}
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                onClick={cancelCrop}
                variant="outline"
                className="border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-4 h-4 mr-2" />
                <Translate text="shared.cancel" />
              </Button>

              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || !croppedAreaPixels}
                className="bg-neutral-200 hover:bg-white text-black cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    <Translate text="settings.uploading" />
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    <Translate text="settings.upload" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper function to create an image element from a source
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export default AvatarUpload;
