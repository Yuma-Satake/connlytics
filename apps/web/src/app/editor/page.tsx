import { Suspense } from 'react';
import { EditorPage } from '@/views/editor';

export default function Editor() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorPage />
    </Suspense>
  );
}
