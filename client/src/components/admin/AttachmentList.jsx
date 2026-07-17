import { FileText } from 'lucide-react';

export default function AttachmentList({ attachments = [] }) {
  if (!attachments.length) {
    return <p className="text-sm text-text-muted">No attachments</p>;
  }

  return (
    <ul className="space-y-2">
      {attachments.map((attachment) => (
        <li key={attachment.id}>
          <a
            href={attachment.secureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-button border border-border-light bg-white px-3 py-2 text-sm font-semibold hover:border-brand-red"
          >
            <FileText className="h-4 w-4 text-brand-red" />
            {attachment.originalName || 'Attachment'}
          </a>
        </li>
      ))}
    </ul>
  );
}
