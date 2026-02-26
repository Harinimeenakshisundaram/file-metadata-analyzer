export default function AudioForensicAnalysis({ audioMeta, file }) {
  if (!audioMeta || !audioMeta.available) return null;

  let reasons = [];

  const bitrate = audioMeta.bitrate;
  const duration = audioMeta.duration;
  const fileSize = file?.size;

  
  if (bitrate && duration && fileSize) {
    const expectedSize = (bitrate * duration) / 8;
    const difference = Math.abs(expectedSize - fileSize);
    const percentageDiff = (difference / fileSize) * 100;

    if (percentageDiff > 15) {
      
      reasons.push("File size does not match expected size based on bitrate and duration.");
    }
  }

  
  const suspiciousPatterns = /(\.com|www|mass|tamil|mp3|free)/i;
  if (
    suspiciousPatterns.test(audioMeta.title || "") ||
    suspiciousPatterns.test(audioMeta.artist || "") ||
    suspiciousPatterns.test(audioMeta.album || "")
  ) {
    
    reasons.push("Distribution-related metadata tags were identified. These tags indicate prior processing or platform-based handling.");
  }

  
  if (
    audioMeta.codec?.toLowerCase().includes("mpeg") &&
    !audioMeta.encoder
  ) {
    
    reasons.push("MPEG audio detected without encoder information. Metadata structure appears altered (partially stripped).");
  }

  
  if (bitrate && bitrate < 64000) {
    
    reasons.push("Audio stream exhibits reduced bitrate. Compression level appears elevated.");
  }

  
const kbps = Math.round(bitrate / 1000);
if ([128, 192, 320].includes(kbps)) {
    reasons.push("Detected parameters correspond to standard consumer-level production environments.");
  }

  function generateAudioInterpretation(meta, file) {
  const lines = [];

  if (!meta) {
    lines.push("No recoverable audio metadata was identified within the file.");
    return lines;
  }

  
 if (meta.codec && meta.container) {
  lines.push(
    `The file is an ${meta.codec} audio file contained within an ${meta.container} container.`
  );
} else if (meta.codec) {
  lines.push(`The audio encoding format is ${meta.codec}.`);
} else {
  lines.push("The file format could not be automatically determined.");
}

  
  if (file?.size) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    lines.push(`The file size is approximately ${sizeMB} MB.`);
  }

  
  if (meta.duration) {
    const minutes = Math.floor(meta.duration / 60);
    const seconds = Math.round(meta.duration % 60);
    lines.push(`The audio duration is approximately ${minutes} minutes and ${seconds} seconds.`);
  }

  
  if (meta.bitrate) {
    const kbps = Math.round(meta.bitrate / 1000);
    lines.push(`The average audio quality level (bitrate) is approximately ${kbps} kbps, which reflects the level of compression applied to the file.`);
  }

  
  if (!meta.container && meta.codec) {
  lines.push(`The audio encoding format is ${meta.codec}.`);
}

  
  if (meta.encoder) {
    lines.push(`Metadata indicates the file was processed using ${meta.encoder}.`);
  } else {
    lines.push("No information about the specific software used to create or export this file was found in the metadata.");
  }

  
  if (meta.sampleRate) {
    lines.push(`The sampling rate is ${meta.sampleRate} Hz, which is standard for consumer audio recordings.`);
  }

  
  if (meta.title || meta.artist || meta.album) {
    lines.push("Descriptive information such as title, artist, or album is embedded within the file metadata.");
  } else {
    lines.push("No descriptive title or artist information was identified in the metadata.");
  }

  
  if (meta.bitrate && meta.duration && file?.size) {
    const expectedSize = (meta.bitrate * meta.duration) / 8;
    const difference = Math.abs(expectedSize - file.size);
    const percentageDiff = ((difference / file.size) * 100).toFixed(2);

    lines.push(`The calculated file size based on duration and bitrate differs from the actual file size by approximately ${percentageDiff}%. Minor variations can occur due to compression structure and metadata overhead.`);
  }

  return lines;
}
 
const interpretationLines = generateAudioInterpretation(audioMeta,file);
const allFindings = [...reasons, ...interpretationLines];

  return (
    <div style={{
      background: "#334155",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "25px"
    }}>
      <h3>Data Interpretation :</h3>
     
<ul>
  {allFindings.length > 0 ? (
    allFindings.map((item, index) => (
      <li key={index}>{item}</li>
    ))
  ) : (
    <li>No significant forensic inconsistencies detected.</li>
  )}
</ul>
    </div>
  );
}
 