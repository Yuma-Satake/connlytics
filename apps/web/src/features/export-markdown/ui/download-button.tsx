'use client';

import { Download } from 'lucide-react';
import type React from 'react';
import { Button } from '@/shared/ui';

type DownloadButtonProps = {
  markdown: string;
  filename?: string;
};

const DEFAULT_FILENAME = 'event-description';

/**
 * Button to download markdown content as a file
 */
export const DownloadButton = ({
  markdown,
  filename,
}: DownloadButtonProps): React.JSX.Element => {
  const handleDownload = (): void => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename ? `${filename}.md` : `${DEFAULT_FILENAME}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={!markdown}
    >
      <Download className="h-4 w-4" />
      ダウンロード
    </Button>
  );
};
