import Image from "next/image";
import { FileIcon } from "lucide-react";
import type { ServiceRequestAttachment } from "@/types";

export default function RequestAttachment({
  file,
}: {
  file: ServiceRequestAttachment;
}) {
  const isImage = file.fileType.startsWith("image/");

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 overflow-hidden rounded-lg border p-2 text-sm transition-colors hover:bg-muted/50"
    >
      {isImage ? (
        <Image
          src={file.url}
          alt={file.fileName ?? "Attachment"}
          width={48}
          height={48}
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
  );
}
