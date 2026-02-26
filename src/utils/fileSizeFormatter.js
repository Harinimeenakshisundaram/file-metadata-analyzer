export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "Unknown";

  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;

  if (gb >= 1) return `${bytes} bytes (${gb.toFixed(2)} GB)`;
  if (mb >= 1) return `${bytes} bytes (${mb.toFixed(2)} MB)`;
  if (kb >= 1) return `${bytes} bytes (${kb.toFixed(2)} KB)`;

  return `${bytes.toLocaleString()} bytes`;
}
