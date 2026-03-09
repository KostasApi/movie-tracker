import { LoaderIcon } from 'lucide-react';

export default function ModalMovieLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <LoaderIcon className="size-8 animate-spin text-white" />
    </div>
  );
}
