function decodeRFC2047(encoded) {
  if (!encoded) return null;
  try {
    return encoded
      .replace(/=\?UTF-8\?Q\?(.+?)\?=/gi, (_, str) =>
        decodeURIComponent(str.replace(/_/g, ' ').replace(/=([0-9A-F]{2})/gi, (_, hex) => `%${hex}`))
      )
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    return encoded;
  }
}

export default function EmlForensicAnalysis({ emlMeta }) {
  if (!emlMeta) return null;

  const text = emlMeta.bodyText || '';
  const html = emlMeta.bodyHTML || '';

  // Extract hyperlinks
  const textLinks = (text.match(/https?:\/\/[^\s"'<>]+/gi) || []).map(l => l);
  let htmlLinks = [];
  if (html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.querySelectorAll('a').forEach(a => htmlLinks.push(a.href));
  }
  const allLinks = [...textLinks, ...htmlLinks];
  const httpsCount = allLinks.filter(l => l.startsWith('https://')).length;
  const httpCount = allLinks.filter(l => l.startsWith('http://')).length;
  const trackedLinksCount = allLinks.filter(l => l.includes('?')).length;

  function generateInterpretationLines(meta) {
    const lines = [];

    lines.push(`Email Subject Line: ${decodeRFC2047(meta.subject) || 'Not present'}`);
    lines.push(`From: ${meta.from || 'Not present'}`);
    lines.push(`To: ${meta.to || 'Not present'}`);
    lines.push(`Date Sent: ${meta.date ? new Date(meta.date).toLocaleString() : 'Not present'}`);
    lines.push(`Message-ID: ${meta.messageId || 'Not present'}`);
    lines.push(`Originating IP: ${meta.originIP || 'Not present'}`);
    lines.push(`SPF Header: ${meta.spf || 'Not present'}`);
    lines.push(`DKIM Header: ${meta.dkim || 'Not present'}`);
    lines.push(`Total Hyperlinks Found: ${allLinks.length} (HTTPS: ${httpsCount}, HTTP: ${httpCount})`);
    if (trackedLinksCount > 0)
      lines.push(`Links with Query/Tracking Parameters: ${trackedLinksCount}`);

    return lines;
  }

  return (
    <div style={{
      background: "#334155",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "25px"
    }}>
      <h3>Data Interpretation :</h3>
      <ul>
        {generateInterpretationLines(emlMeta).map((line, idx) => (
          <li key={idx}>{line}</li>
           
        ))}
      </ul>
    </div>
  );
}