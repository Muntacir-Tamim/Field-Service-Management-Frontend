"use client";

import { FileIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/confirm-dialog";
import FileDropzone from "@/components/common/file-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useAddAttachments, useRemoveAttachment } from "@/hooks";
import type { WorkOrderAttachment } from "@/types";
import { getErrorMessage } from "@/utils";
import {
  WORK_ORDER_FILE_ACCEPT,
  WORK_ORDER_FILE_MAX_MB,
  WORK_ORDER_MAX_ATTACHMENTS_PER_UPLOAD,
} from "@/validation";

interface AttachmentsManagerProps {
  workOrderId: string;
  attachments: WorkOrderAttachment[];

  editable: boolean;
}

function AttachmentTile({
  file,
  onRemove,
}: {
  file: WorkOrderAttachment;
  onRemove?: (file: WorkOrderAttachment) => void;
}) {
  const isImage = file.fileType.startsWith("image/");

  return (
    <div className="group relative flex items-center gap-3 overflow-hidden rounded-lg border p-2 text-sm">
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 flex-1 items-center gap-3 transition-colors hover:text-primary"
      >
        {isImage ? (
          <img
            src={file.url}
            alt={file.fileName ?? "Attachment"}
            className="size-12 shrink-0 rounded-md object-cover"
          />
        ) : (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <FileIcon className="size-5" aria-hidden="true" />
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">
          {file.fileName ?? "Attachment"}
        </span>
      </a>
      {onRemove ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${file.fileName ?? "attachment"}`}
          onClick={() => onRemove(file)}
        >
          <Trash2Icon />
        </Button>
      ) : null}
    </div>
  );
}

export default function AttachmentsManager({
  workOrderId,
  attachments,
  editable,
}: AttachmentsManagerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [removing, setRemoving] = useState<WorkOrderAttachment | null>(null);

  const { mutate: upload, isPending: uploading } = useAddAttachments();
  const { mutate: remove, isPending: removingPending } = useRemoveAttachment();

  const handleUpload = () => {
    if (files.length === 0) {
      return;
    }
    upload(
      { id: workOrderId, files },
      {
        onSuccess: () => {
          toast.add({ title: "Files uploaded", type: "success" });
          setFiles([]);
        },
        onError: (err) => {
          toast.add({
            title: "Could not upload files",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  const handleRemove = () => {
    if (!removing) {
      return;
    }
    remove(
      { id: workOrderId, attachmentId: removing.id },
      {
        onSuccess: () => {
          toast.add({ title: "File removed", type: "success" });
          setRemoving(null);
        },
        onError: (err) => {
          toast.add({
            title: "Could not remove file",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos &amp; files</CardTitle>
        <CardDescription>
          {editable
            ? "Before / after photos and documents. You can upload only after arriving on site."
            : attachments.length === 0
              ? "No files were uploaded."
              : `${attachments.length} file(s)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {attachments.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {attachments.map((file) => (
              <AttachmentTile
                key={file.id}
                file={file}
                onRemove={editable ? setRemoving : undefined}
              />
            ))}
          </div>
        ) : null}

        {editable ? (
          <div className="flex flex-col gap-3">
            <FileDropzone
              multiple
              value={files}
              onChange={setFiles}
              accept={WORK_ORDER_FILE_ACCEPT}
              maxFiles={WORK_ORDER_MAX_ATTACHMENTS_PER_UPLOAD}
              maxSizeMB={WORK_ORDER_FILE_MAX_MB}
              disabled={uploading}
              hint={`PDF or image, up to ${WORK_ORDER_MAX_ATTACHMENTS_PER_UPLOAD} files at a time, ${WORK_ORDER_FILE_MAX_MB} MB each`}
            />
            {files.length > 0 ? (
              <div className="flex justify-end">
                <Button disabled={uploading} onClick={handleUpload}>
                  {uploading ? <Spinner /> : <UploadIcon />}
                  Upload {files.length} file{files.length === 1 ? "" : "s"}
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>

      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(open) => {
          if (!open) {
            setRemoving(null);
          }
        }}
        title="Remove this file?"
        description={removing?.fileName ?? undefined}
        confirmText="Remove"
        variant="destructive"
        isLoading={removingPending}
        onConfirm={handleRemove}
      />
    </Card>
  );
}
