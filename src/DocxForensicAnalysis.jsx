export default function DocxForensicAnalysis({ docxMeta }) {
  if (!docxMeta?.available) return null;

  const findings = [];

  const created = docxMeta.created ? new Date(docxMeta.created) : null;
  const modified = docxMeta.modified ? new Date(docxMeta.modified) : null;
  const author = docxMeta.creator || null;
  const lastModifiedBy = docxMeta.lastModifiedBy || null;
  const revision = docxMeta.revision ? parseInt(docxMeta.revision) : null;

 
  if (created && modified) {
    const diffMs = modified - created;

    if (!isNaN(diffMs) && diffMs !== 0) {
      const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365);

      findings.push(
        "Creation and modification timestamps are not identical."
      );

      if (Math.abs(diffYears) > 1) {
        findings.push(
          "A significant temporal interval exists between creation and modification timestamps."
        );
      }
    }
  }

  
  if (!author) {
    findings.push(
      "Creator metadata field is not present in the document properties."
    );
  }

 
  if (author && lastModifiedBy && author !== lastModifiedBy) {
    findings.push(
      "Creator and Last Modified By metadata fields contain different values."
    );
  }

 
  function generateDocxInterpretation(docMeta) {
    const lines = [];

    if (!docMeta) {
      lines.push(
        "No document property metadata was extracted from the file."
      );
      return lines;
    }

    if (docMeta.created) {
      lines.push(
        `Creation timestamp recorded as: ${new Date(docMeta.created).toLocaleString()}.`
      );
    } else {
      lines.push(
        "Creation timestamp metadata field not present."
      );
    }

    if (docMeta.modified) {
      lines.push(
        `Modification timestamp recorded as: ${new Date(docMeta.modified).toLocaleString()}.`
      );
    } else {
      lines.push(
        "Modification timestamp metadata field not present."
      );
    }

    if (docMeta.creator) {
      lines.push(
        `Creator metadata field value: ${docMeta.creator}.`
      );
    } else {
      lines.push(
        "Creator metadata field not available."
      );
    }

    if (docMeta.lastModifiedBy) {
      lines.push(
        `Last Modified By metadata field value: ${docMeta.lastModifiedBy}.`
      );
    } else {
      lines.push(
        "Last Modified By metadata field not available."
      );
    }

    if (docMeta.revision) {
      lines.push(
        `Revision number recorded as: ${docMeta.revision}.`
      );
    } else {
      lines.push(
        "Revision number metadata field not present."
      );
    }

    
    return lines;
  }

  return (
    <div
      style={{
        background: "#1f2937",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "25px",
      }}
    >
      <h3>Data Interpretation :</h3>

      <ul>
        {findings.length > 0 ? (
          findings.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>
            No metadata structural irregularities were identified based on the
            extracted document properties.
          </li>
        )}
    
        {generateDocxInterpretation(docxMeta).map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  );
}