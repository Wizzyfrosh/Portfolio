import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading page">
      <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" aria-hidden="true" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
