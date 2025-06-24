import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "~/app/api/uploadthing/core";

const BaseUploadButton = generateUploadButton<OurFileRouter>();
const BaseUploadDropzone = generateUploadDropzone<OurFileRouter>();

export const UploadButton = (props: React.ComponentProps<typeof BaseUploadButton>) => (
  <div className="mt-4">
    <BaseUploadButton
      {...props}
      className="border border-indigo-500/50 bg-indigo-900/30 text-indigo-100 backdrop-blur-md transition-colors hover:bg-indigo-800/50 px-8 py-3 rounded-lg font-medium cursor-pointer"
    />
  </div>
);

export const UploadDropzone = (props: React.ComponentProps<typeof BaseUploadDropzone>) => (
  <BaseUploadDropzone
    {...props}
    className="border-2 border-dashed border-indigo-500/30 bg-neutral-900/20 backdrop-blur-sm rounded-lg p-8 mt-4"
  />
);
