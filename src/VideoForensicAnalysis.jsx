import ForensicMap from "./ForensicMap";

export default function VideoForensicAnalysis({ videoMeta, file }) {
  if (!videoMeta?.available) return null;

  const findings = [];
  const interpretation = [];

  const {
    duration,
    bitrate,
    container,
    encoder,
    videoStreamCount,
    audioStreamCount,
    frameRateMode,
    frameRateMin,
    frameRateMax,
    width,
    height,
    aspectRatio,
    creationTime,
    fileSize
  } = videoMeta;

  
  const extension = file.name.split(".").pop().toLowerCase();

  const containerLower = container?.toLowerCase() || "";

if (
  (extension === "mp4" && !containerLower.includes("mp4")) ||
  (extension === "mkv" && !containerLower.includes("matroska"))
) {
   findings.push("File extension and internal container format mismatch detected.");
}

  
  if (videoStreamCount === 0) {
    findings.push(
      "No video stream structure was detected inside the container."
    );
  }


  if (duration && fileSize && bitrate) {
    const calculatedBitrate = (fileSize * 8) / duration;
    const difference = Math.abs(calculatedBitrate - bitrate);

    if (difference > bitrate * 0.15) {
      findings.push(
        "Calculated bitrate derived from file size and duration differs from the bitrate declared in metadata."
      );
    }

    interpretation.push(
      `File size, duration, and overall bitrate were mathematically compared to evaluate internal structural consistency.`
    );
  }

  
  if (!encoder) {
    findings.push(
      "Encoding software information is not present within metadata fields."
    );
  }

  
  if (frameRateMode === "VFR" && frameRateMin && frameRateMax) {
    const variation = Math.abs(frameRateMax - frameRateMin);

    if (variation > 10) {
      findings.push(
        "A wide variation between minimum and maximum frame rate values was identified."
      );
    }

    interpretation.push(
      "Frame rate mode indicates variable frame rate behavior, meaning frames are not captured at uniform time intervals."
    );
  }

  
  if (width && height && aspectRatio) {
    interpretation.push(
      `Video resolution recorded as ${width} x ${height} pixels with display aspect ratio ${aspectRatio}.`
    );
  }

  
  if (creationTime) {
    interpretation.push(
      `Video container creation or encoding timestamp recorded as ${creationTime}.`
    );
  } else {
    interpretation.push(
      "No creation or encoding timestamp metadata was identified."
    );
  }

  
  interpretation.push(
    `Container structure contains ${videoStreamCount} video stream(s) and ${audioStreamCount} audio stream(s).`
  );

  
  if (videoMeta.latitude && videoMeta.longitude) {
    interpretation.push(
      `Geolocation metadata recorded with latitude ${videoMeta.latitude} and longitude ${videoMeta.longitude}.`
    );

    if (width && height) {
  const totalPixels = width * height;

  if (totalPixels < 300000) {
    findings.push("Low resolution detected. Possible compression or re-encoding.");
  }
}
  }

  const allResults = [...findings, ...interpretation];

  return (
    <div style={{
      background: "#334155",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "25px"
    }}>
      <h4>Data Interpretation :</h4>

      <ul>
        {allResults.length > 0 ? (
          allResults.map((item, index) => (
            <li key={index}>{item}</li>
          ))
        ) : (
          <li>No structural inconsistencies were identified within the video metadata.</li>
        )}
      </ul>

      {videoMeta.latitude && videoMeta.longitude && (
        <>
          <div style={{ marginTop: "15px" }}>
            <p><b>Latitude:</b> {videoMeta.latitude}</p>
            <p><b>Longitude:</b> {videoMeta.longitude}</p>
          </div>

          <ForensicMap
            lat={parseFloat(videoMeta.latitude)}
            lon={parseFloat(videoMeta.longitude)}
          />
        </>
      )}
    </div>
  );
}