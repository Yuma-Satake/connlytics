'use client';

import { Check, Copy } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Button } from '@/shared/ui';

type CopyButtonProps = {
  markdown: string;
};

const COPY_FEEDBACK_DURATION_MS = 2000;

/**
 * Button to copy markdown content to clipboard
 */
export const CopyButton = ({
  markdown,
}: CopyButtonProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      disabled={!markdown}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          コピー済み
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          コピー
        </>
      )}
    </Button>
  );
};
