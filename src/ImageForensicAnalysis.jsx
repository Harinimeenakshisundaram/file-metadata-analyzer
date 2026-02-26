import ForensicMap from "./ForensicMap";


function cleanCreatorTool(value) {
  if (!value) return null;

  
  const cleaned = value.split(" doc=")[0];

  
  return cleaned.replace(/\(.*?\)/g, "").trim();
}

function formatTimeDifference(ms) {
  const absMs = Math.abs(ms);

  const seconds = Math.floor(absMs / 1000);
  if (seconds < 60) {
    return `${seconds} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hrs`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} days`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} weeks`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} months`;
  }

  const years = Math.floor(days / 365);
  return `${years} years`;
}

export default function ImageForensicAnalysis({ imageMeta, file }) {

  if (!file || !file.type?.startsWith("image/")) return null;

  const findings = [];

  
  if (!imageMeta || !imageMeta.available) {

    findings.push("Metadata appears completely stripped or unavailable.");
  } else {

    const { camera, dateTaken, software, creatorTool, gps, createDate, modifyDate } = imageMeta;

    
    if (software) {
      const s = software.toLowerCase();
      const editors = ["photoshop", "lightroom", "gimp", "snapseed", "canva"];

      if (editors.some(editor => s.includes(editor))) {

        findings.push(`Software metadata field present: ${software}.`);
      }
    }
    

    if (creatorTool) {
      const cleanedTool = cleanCreatorTool(creatorTool);
      findings.push(`CreatorTool metadata field present: ${cleanedTool}.`);
    }

    
    if (!camera) {

      findings.push("Camera information missing.");
    }

    
    if (!dateTaken) {

      findings.push("Capture date missing.");
    }

    
    if (gps) {

      findings.push("GPS location data embedded.");
    }

    
    const metadataFields = [camera, dateTaken, software, gps];
    const missingCount = metadataFields.filter(field => !field).length;

    if (missingCount >= 3) {

      findings.push("Metadata appears partially stripped.");
    }

    
    const extension = file.name.split(".").pop().toLowerCase();

    if (
      (extension === "jpg" || extension === "jpeg") &&
      file.type !== "image/jpeg"
    ) {

      findings.push("File extension does not match MIME type.");
    }

  }

function generateInterpretationLines(meta) {
  const lines = [];

  if (!meta || !meta.available) {
    lines.push("No embedded image metadata was identified within the file.");
    lines.push("This may occur when an image is exported, compressed, or processed through editing platforms.");
    return lines;
  }

  const { camera, dateTaken, software, creatorTool, gps, createDate, modifyDate } = meta;

  if (camera) {
    lines.push(`The image metadata indicates it was captured using: ${camera}.`);
  } else {
    lines.push("No camera device information was identified in the metadata.");
  }

  if (dateTaken) {
    lines.push(`The recorded capture date is ${new Date(dateTaken).toLocaleString()}.`);
  } else {
    lines.push("No original capture date was identified in the metadata.");
  }

  if (software) {
    lines.push(`Metadata indicates the file was processed using: ${software}.`);
  }

  if (creatorTool) {
    const cleanedTool = cleanCreatorTool(creatorTool);
    lines.push(`The file contains metadata indicating it was created or exported using: ${cleanedTool}.`);
  }

  
  if (createDate && dateTaken) {
    const creation = new Date(createDate);
    const capture = new Date(dateTaken);

    if (!isNaN(creation) && !isNaN(capture)) {
      const diffMs = creation - capture;
      const formatted = formatTimeDifference(diffMs);

      if (creation < capture) {
        lines.push(
          `The file system creation timestamp predates the recorded capture date by approximately ${formatted}. This chronological inconsistency may indicate manual metadata alteration or system-level timestamp modification.`
        );
      } else if (creation > capture) {
        lines.push(
          `The file appears to have been created approximately ${formatted} after the recorded capture time, suggesting the image may have been transferred, exported, or processed after capture.`
        );
      }
    }
  }

  
  if (createDate && modifyDate) {
    const created = new Date(createDate);
    const modified = new Date(modifyDate);

    if (!isNaN(created) && !isNaN(modified)) {
      const diffMs = modified - created;

      if (diffMs !== 0) {
        const formatted = formatTimeDifference(diffMs);

        if (modified < created) {
          lines.push(
            `The last modification timestamp predates the file system creation timestamp by approximately ${formatted}. This anomaly may indicate metadata tampering or clock manipulation.`
          );
        } else {
          lines.push(
            `The file was modified approximately ${formatted} after creation, indicating post-capture editing or re-saving activity.`
          );
        }
      }
    }
  }

  if (gps) {
    lines.push("Geographical location information is embedded within the image metadata.");
  } else {
    lines.push("No geographical location information was identified in the metadata.");
  }

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
        {findings.length > 0 ? (
          findings.map((item, index) => (
            <li key={index}>{item}</li>
          ))
        ) : (
          <li>No significant forensic anomalies detected.</li>
        )}
    
        {generateInterpretationLines(imageMeta).map((line, idx) => (
  <li key={`interp-${idx}`}>{line}</li>
))}

      
      {imageMeta?.gps?.latitude != null && imageMeta?.gps?.longitude != null && (
        <div style={{ marginTop: "20px" }}>
          <p><b>Latitude:</b> {imageMeta.gps.latitude}</p>
          <p><b>Longitude:</b> {imageMeta.gps.longitude}</p>

          <ForensicMap
            lat={parseFloat(imageMeta.gps.latitude)}
            lon={parseFloat(imageMeta.gps.longitude)}
          />
        </div>
      )}
</ul>

    </div>
  );
}
  