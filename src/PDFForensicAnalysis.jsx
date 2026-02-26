import { parsePDFDate } from "./utils/pdfDateParser";

export default function PDFForeensicAnalysis({ pdfMeta, file }) {
  if (!pdfMeta?.available) return null;

  const info = pdfMeta.info || {};


  function generatePdfInterpretation(data) {
    const lines = [];

    const creationDate = parsePDFDate(data.CreationDate);
    const modDate = parsePDFDate(data.ModDate);
    const fileSystemDate = file ? new Date(file.lastModified) : null;

    
    if (data.Title)
      lines.push(`Document title recorded as "${data.Title}".`);

    if (data.Author)
      lines.push(`Author field recorded as "${data.Author}".`);

    if (data.Creator)
      lines.push(`Creator application identified as "${data.Creator}".`);

    if (data.Producer)
      lines.push(`PDF producer software identified as "${data.Producer}".`);

    
    if (!data.Creator && !data.Producer) {
      lines.push("Standard PDF software identification fields (Creator/Producer) are not present.");
    }

    
    if (creationDate) {
      lines.push(`PDF internal creation date recorded as ${creationDate.toLocaleString()}.`);
    }

    if (modDate) {
      lines.push(`PDF internal modification date recorded as ${modDate.toLocaleString()}.`);
    }

    if (creationDate && modDate) {
      if (modDate > creationDate) {
        lines.push("The modification date is chronologically later than the creation date.");
      } else if (modDate < creationDate) {
        lines.push("The modification date is chronologically earlier than the creation date.");
      } else {
        lines.push("The creation and modification timestamps are identical.");
      }
    }

    
    if (fileSystemDate && modDate) {
      lines.push(`File system last modified timestamp recorded as ${fileSystemDate.toLocaleString()}.`);

      if (fileSystemDate > modDate) {
        lines.push("The file system modification timestamp is later than the internal PDF modification date.");
      } else if (fileSystemDate < modDate) {
        lines.push("The file system modification timestamp is earlier than the internal PDF modification date.");
      } else {
        lines.push("The file system and internal modification timestamps are consistent.");
      }
    }

    return lines;
  }

  const interpretation = generatePdfInterpretation(info);

  return (
    <div
      style={{
      background: "#334155",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "25px"
    }}
    >
      <h3>Data Interpretation :</h3>
      <ul>
        {interpretation.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  );
}