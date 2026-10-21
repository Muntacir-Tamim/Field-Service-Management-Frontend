"use client";

import { CameraIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useUploadProfileImage } from "@/hooks";
import type { User } from "@/types";
import { formatFileSize, getErrorMessage, getInitials } from "@/utils";
import { PROFILE_IMAGE_ACCEPT, PROFILE_IMAGE_MAX_MB } from "@/validation";

// ছবি বাছাই -> preview -> "Save photo" চাপলে upload
export default function ProfileImageUpload({ user }: { user: User }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate: upload, isPending } = useUploadProfileImage();

  // preview URL memory leak এড়াতে বদলালে/unmount এ মুছে ফেলি
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSelect = (selected: File | undefined) => {
    if (!selected) {
      return;
    }
    if (!PROFILE_IMAGE_ACCEPT.split(",").includes(selected.type)) {
      toast.add({
        title: "Unsupported file",
        description: "Please choose a JPG, PNG or WEBP image",
        type: "error",
      });
      return;
    }
    if (selected.size > PROFILE_IMAGE_MAX_MB * 1024 * 1024) {
      toast.add({
        title: "Image is too large",
        description: `Maximum size is ${PROFILE_IMAGE_MAX_MB} MB (yours is ${formatFileSize(selected.size)})`,
        type: "error",
      });
      return;
    }
    setFile(selected);
  };

  const handleSave = () => {
    if (!file) {
      return;
    }
    upload(file, {
      onSuccess: () => {
        toast.add({ title: "Profile photo updated", type: "success" });
        setFile(null);
      },
      onError: (err) => {
        toast.add({
          title: "Could not upload photo",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  const imageSrc = preview ?? user.imageUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar className="size-24">
        {imageSrc ? <AvatarImage src={imageSrc} alt={user.name} /> : null}
        <AvatarFallback className="text-2xl">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        accept={PROFILE_IMAGE_ACCEPT}
        onChange={(event) => {
          handleSelect(event.target.files?.[0]);
          // একই ফাইল আবার বাছাই করা যাবে
          event.target.value = "";
        }}
      />

      {file ? (
        <div className="flex gap-2">
          <Button size="sm" disabled={isPending} onClick={handleSave}>
            {isPending ? <Spinner /> : null}
            Save photo
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => setFile(null)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <CameraIcon />
          Change photo
        </Button>
      )}
      <p className="text-xs text-muted-foreground">
        JPG, PNG or WEBP, up to {PROFILE_IMAGE_MAX_MB} MB
      </p>
    </div>
  );
}
