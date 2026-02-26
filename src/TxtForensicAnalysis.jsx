export default function TxtForensicAnalysis({ txtMeta }) {
  if (!txtMeta?.available) return null;

  function generateTxtInterpretation(data) {
    const lines = [];

    
    lines.push(`Text file name identified as "${data.fileName}".`);
    lines.push(`File size recorded as ${data.fileSize} bytes.`);
    lines.push(`Last modified timestamp recorded as ${new Date(data.lastModified).toLocaleString()}.`);

    
    lines.push(`Total word count identified as ${data.wordCount}.`);
    lines.push(`Total character count identified as ${data.charCount}.`);
    lines.push(`Total line count identified as ${data.lineCount}.`);

    if (data.emptyLines > 0) {
      lines.push(`The document contains ${data.emptyLines} empty or blank lines.`);
    }

    
    if (data.wordCount < 10) {
      lines.push("The document contains a very limited amount of textual content.");
    }

    if (data.wordCount > 10000) {
      lines.push("The document contains a substantially large volume of textual content.");
    }

    
    if (data.links.length > 0) {
      lines.push(`A total of ${data.links.length} URL(s) were identified within the text content.`);
      data.links.slice(0, 3).forEach((link, index) => {
        lines.push(`URL ${index + 1} identified as: ${link}`);
      });
    }

    
    if (data.suspiciousKeywordsFound.length > 0) {
      lines.push(
        `The following predefined sensitive terms were detected within the text: ${data.suspiciousKeywordsFound.join(", ")}.`
      );
    }

    if (
      data.links.length === 0 &&
      data.suspiciousKeywordsFound.length === 0
    ) {
      lines.push("No predefined sensitive terms or URLs were identified within the examined text content.");
    }

    return lines;
  }

  const interpretation = generateTxtInterpretation(txtMeta);

  return (
    <div style={{
      background: "#1f2937",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "25px"
    }}>
      <h3>Data Interpretation :</h3>
      <ul>
        {interpretation.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  );
}