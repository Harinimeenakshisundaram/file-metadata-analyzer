import { useState } from "react";
import { generateSHA256 } from "./utils/hash";
import { identifyFileType } from "./utils/fileType";
import { extractImageMetadata } from "./utils/imageMetadata";
import ImageForensicAnalysis from "./ImageForensicAnalysis";
import { extractPDFMetadata } from "./utils/pdfMetadata";
import PDFForensicAnalysis from "./PDFForensicAnalysis";
import { parsePDFDate } from "./utils/pdfDateParser";
import { extractAudioMetadata } from "./utils/audioMetadata";
import AudioForensicAnalysis from "./AudioForensicAnalysis";
import { extractVideoMetadata } from "./utils/videoMetadata";
import VideoForensicAnalysis from "./VideoForensicAnalysis";
import { extractDocxMetadata } from "./utils/docxMetadata";
import DocxForensicAnalysis from "./DocxForensicAnalysis";
import { extractEmlMetadata } from "./utils/emlMetadata";
import EmlForensicAnalysis from "./EmlForensicAnalysis";
import { extractTxtMetadata } from "./utils/txtMetadata";
import TxtForensicAnalysis from "./TxtForensicAnalysis";
import { formatFileSize } from "./utils/fileSizeFormatter";
import "./App.css";


export default function App(){

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState('');
  const [fileType, setFileType] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [pdfMeta, setPdfMeta] = useState(null);
  const [audioMeta, setAudioMeta] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [docxMeta, setDocxMeta] = useState(null);
  const [emlMeta, setEmlMeta] = useState(null);
  const [txtMeta, setTxtMeta] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");



  async function handleFileSelect(selectedFile) {

    try{
  
      if (!selectedFile) return;

  if (selectedFile.size > 50 * 1024 * 1024) {
  setErrorMessage("File exceeds 50MB limit.");
  setFile(null);
  setLoading(false);
  return;
}

setErrorMessage("");
setLoading(true);
  setFile(selectedFile);
  setHash("Calculating...");
  setFileType(null);
  setImageMeta(null);
  setPdfMeta(null);
  setAudioMeta(null);
  setVideoMeta(null);
  setDocxMeta(null);
  setEmlMeta(null);
  setTxtMeta(null);


  //hashing
  const sha256 = await generateSHA256(selectedFile);
  setHash(sha256);
 
  //file-type
  const typeInfo = await identifyFileType(selectedFile);
  setFileType(typeInfo);
  
  //image
  if (selectedFile.type?.startsWith("image/")) {
    const metadata = await extractImageMetadata(selectedFile);
    setImageMeta(metadata);
  }


  // PDF
if (selectedFile.type === "application/pdf") {
  const metadata = await extractPDFMetadata(selectedFile);
  setPdfMeta(metadata);
} 

//audio
if (selectedFile.type?.startsWith("audio/")) {
  const metadata = await extractAudioMetadata(selectedFile);
  setAudioMeta(metadata);
}


// video
if (selectedFile.type?.startsWith("video/")) {
  const metadata = await extractVideoMetadata(selectedFile);
  setVideoMeta(metadata);
}

// docx
if (
  selectedFile.name.toLowerCase().endsWith(".docx")
) {
  const metadata = await extractDocxMetadata(selectedFile);
  setDocxMeta(metadata);
}


//email
if (
  selectedFile.name.toLowerCase().endsWith(".eml")
) {
  const metadata = await extractEmlMetadata(selectedFile);
  setEmlMeta(metadata);
}

//txt
if (selectedFile.name.toLowerCase().endsWith(".txt")) {
  const metadata = await extractTxtMetadata(selectedFile);
  setTxtMeta(metadata);
}
setLoading(false); 
}  
    catch(error){
      console.error("Analysis failed:", error);
      setErrorMessage("File analysis failed.");
      setLoading(false);
    }
 

}



return (
  <div className="app-container">
    <div className="upload-card">

      <h1 className="app-title">File Metadata Analyzer</h1>

      {/* File Upload */}
      <div className="upload-info">
        <input
          type="file"
          className="file-input"
          accept=".jpg,.jpeg,.png,.webp,.mp4,.mp3,.pdf,.docx,.txt,.eml"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            handleFileSelect(selected);
          }}
        />
        <br />
        <strong>Supported File Types:</strong><br />
    Images (JPG, PNG, WEBP), Videos (MP4), Audio (MP3),PDF, DOCX, TXT, Email (.eml)<br />
    <strong>Maximum File Size:</strong> 50 MB
    <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "8px" }}>
    Unsupported formats will not appear in the file selector.
  </p>
        
      {errorMessage && (
  <div className="error-message">
    {errorMessage}
  </div>
)}
</div>

{loading && !errorMessage && (
  <div className="analysis-card">
    <p>🔄 Analyzing file... Please wait.</p>
  </div>
)}

      {/* uploaded file info */}
      {file && (
        <div className="analysis-card">
          <h3>📁 File Information</h3>
          <p><b>Name:</b> {file.name}</p>
          <p><b>Size:</b> {formatFileSize(file.size)}</p>
          <p><b>File Type:</b> {file.type || "Not provided"}</p>

          <hr />
        
        {/*file hashing */}
          <h4> Hash Value (SHA-256) </h4>
          <p className="hash-text"> {hash} </p>

          <hr />
         
         {/* type of mime info*/}
          <h4> File Type Detection</h4>
          {fileType?.detected ? (
            <p>Detected as <b>{fileType.extension}</b><br /> MIME: {fileType.mime}  </p>
          ) : (
            <p>{fileType?.message}</p>
          )}


          <div className="consistency-section">
               <hr />

{fileType?.detected && fileType?.extension && (
  <>
    <h4> File Type Consistency Assessment</h4>

    {(() => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      const detectedExtension = fileType.extension?.toLowerCase();

      if (!extension || !detectedExtension) return null;

      if (extension === detectedExtension) {
        return (
          <p>
            The declared file extension (<b>.{extension}</b>) is consistent with the internally detected file format (<b>{detectedExtension}</b>). No structural inconsistency 
            was identified based on binary signature analysis.
          </p>
        );
      } else {
        return (
          <p>
            The declared file extension (<b>.{extension}</b>) does not correspond with the internally detected file format (<b>{detectedExtension}</b>). This inconsistency may indicate 
            extension modification, file renaming, or potential format 
            obfuscation.
          </p>
        );
      }
    })()}
  </>
)}
</div>
        </div>

      )}

      {/* image */}
      {imageMeta && (
        <div className="analysis-card">
          <h3> File Data</h3>

          {imageMeta.available ? (
            <>
              <p><b>Camera:</b> {imageMeta.camera || "Not available"}</p>
              <p><b>Date Taken:</b> {imageMeta.dateTaken?.toString() || "Not available"}</p>
              <p><b>Creation Date:</b>{" "}{imageMeta.createDate ? new Date(imageMeta.createDate).toLocaleString() : "Not available"} </p>
              <p><b>Modification Date:</b>{" "} {imageMeta.modifyDate ? new Date(imageMeta.modifyDate).toLocaleString() : "Not available"} </p>
              <p><b>Software:</b> {imageMeta.software || "Not available"}</p>
            
              {imageMeta.gps && (
                <p>GPS: {imageMeta.gps?.latitude}, {imageMeta.gps?.longitude}</p>

              )}

              
            {/*raw data*/}
               {imageMeta.raw && ( <details className="raw-toggle"> <summary style={{ cursor: "pointer" }}> Raw Data</summary>
                <pre  className="raw-metadata wrap"> {JSON.stringify(imageMeta.raw, null, 2)}</pre> </details> )}

            </>
              ) : (
                <p>{imageMeta.message}</p>
              )}
        </div>
              )}

      {/* ImageForensicAnalysis */}
           {imageMeta && ( <ImageForensicAnalysis imageMeta={imageMeta} file={file} /> )}

      {/* PDF metadata*/}
          {pdfMeta && ( <div className="analysis-card">
           <h3> File Data</h3>

          {pdfMeta.available ? (
          <>
          <p><b>PDF Version:</b> {pdfMeta.info?.PDFFormatVersion || "Not available"}</p>

          <p><b>Producer:</b> {pdfMeta.info?.Producer || "Not available"}</p>

        {(() => {
         const creation = parsePDFDate(pdfMeta.info?.CreationDate);
         const mod = parsePDFDate(pdfMeta.info?.ModDate);

         let timeDifference = null;

         if (creation && mod) {
         const diffMs = mod - creation;
         const diffMinutes = Math.round(diffMs / (1000 * 60));
         timeDifference = diffMinutes;
        }

          return (
                  <>
                  <p>
                     <b>Creation Date:</b>{" "}
                     {creation ? creation.toLocaleString() : "Not available"}
                  </p>

                  <p><b>Modification Date:</b>{" "} {mod ? mod.toLocaleString() : "Not available"} </p>

                {timeDifference !== null && (
               <p>
                 <b>Time Difference:</b> {timeDifference} minutes
              </p>
            )}
               </>
             );
               })()}


        <p><b>Digital Signatures:</b> {pdfMeta.info?.IsSignaturesPresent ? "Present" : "Not present"}</p>

        <p><b>Forms Present:</b> {pdfMeta.info?.IsAcroFormPresent ? "Yes" : "No"}</p>

        <p><b>Encryption:</b> {pdfMeta.info?.EncryptFilterName || "None"}</p>

        {/* pdf raw data*/}
        <details className="raw-toggle">
        <summary style={{ cursor: "pointer" }}> Raw Data </summary>
          <pre  className="raw-metadata wrap">
            {JSON.stringify(pdfMeta.info, null, 2)}
          </pre>
        </details>

          </>
            ) : (
             <p>{pdfMeta.message}</p>
        )}
    </div>
)}


{pdfMeta && <PDFForensicAnalysis pdfMeta={pdfMeta} />}


{/* Audio */}
{audioMeta && (
  <div className="analysis-card">
    <h3> File Data</h3>

    {audioMeta.available ? (
      <>
        <p><b>Duration:</b> {audioMeta.duration ? `${Math.round(audioMeta.duration)} seconds` : "Not available"}</p>

        <p><b>Bitrate:</b>{" "} {audioMeta.bitrate ? `${Math.round(audioMeta.bitrate / 1000)} kbps` : "Not available"} </p>

        <p><b>Sample Rate:</b> {audioMeta.sampleRate ? `${audioMeta.sampleRate} Hz` : "Not available"}</p>

        <p><b>Channels:</b> {audioMeta.numberOfChannels || "Not available"}</p>

        <p><b>Codec:</b> {audioMeta.codec || "Not available"}</p>

        <p><b>Container:</b> {audioMeta.container || "Not available"}</p>

        <p><b>Encoder:</b> {audioMeta.encoder || "Not available"}</p>

        <p><b>Title:</b> {audioMeta.title || "Not available"}</p>

        <p><b>Artist:</b> {audioMeta.artist || "Not available"}</p>

        <p><b>Album:</b> {audioMeta.album || "Not available"}</p>

        {/* audio raw Metadata */}
        <details className="raw-toggle">
          <summary style={{ cursor: "pointer" }}> Raw Data</summary>
          <pre  className="raw-metadata wrap"> {JSON.stringify(audioMeta.raw, null, 2)}  </pre>
        </details>
      </>
    ) : (
      <p>{audioMeta.message}</p>
    )}
  </div>
)}

{audioMeta && <AudioForensicAnalysis audioMeta={audioMeta} file={file} />}


{/* Video */}
{videoMeta && (
  <div className="analysis-card">
    <h3> File Data</h3>

    {videoMeta.available ? (
      <>
        <p><b>Duration:</b> {videoMeta.duration ? `${Math.round(videoMeta.duration)} seconds` : "Not available"}</p>

        <p><b>Bitrate:</b> {videoMeta.bitrate ? `${videoMeta.bitrate} bps` : "Not available"}</p>

        <p><b>Container:</b> {videoMeta.container || "Not available"}</p>

        <p><b>Codec:</b> {videoMeta.codec || "Not available"}</p>

         <p><b>Resolution:</b>  {videoMeta.width && videoMeta.height  ? `${videoMeta.width} x ${videoMeta.height}` : "Not available"} </p>

         <p><b>Frame Rate:</b>  {videoMeta.frameRate  ? `${videoMeta.frameRate} fps`  : "Not available"} </p>

         <p><b>Encoder:</b> {videoMeta.encoder || "Not available"}</p>

         <p><b>Writing Library:</b> {videoMeta.writingLibrary || "Not available"}</p>

        <p><b>Color Space:</b> {videoMeta.colorSpace || "Not available"}</p>

        <p><b>Scan Type:</b> {videoMeta.scanType || "Not available"}</p>

       <p><b>Aspect Ratio:</b> {videoMeta.aspectRatio || "Not available"}</p>

       {videoMeta.gps && (<p><b>GPS:</b> {videoMeta.gps}</p>)}
        
        {videoMeta.latitude && videoMeta.longitude && (
          <>
           <p><b>Latitude:</b> {videoMeta.latitude}</p>
           <p><b>Longitude:</b> {videoMeta.longitude}</p>
          </>
        )}


            <p><b>Video Streams:</b> {videoMeta.videoStreamCount}</p>
            <p><b>Audio Streams:</b> {videoMeta.audioStreamCount}</p>

       
        <details className="raw-toggle">
          <summary style={{ cursor: "pointer" }}> Raw Data </summary>
          <pre  className="raw-metadata wrap">  {JSON.stringify(videoMeta.raw, null, 2)} </pre>
        </details>
      </>
    ) : (
      <p>{videoMeta.message}</p>
    )}
  </div>
)}
{videoMeta && ( <VideoForensicAnalysis videoMeta={videoMeta} file={file} /> )}

{/*docx */}
   {docxMeta && ( <div className="analysis-card">
    <h3> File Data</h3>

    {docxMeta.available ? (
      <>
        <p><b>Title:</b> {docxMeta.title || "Not available"}</p>
        <p><b>Author:</b> {docxMeta.creator || "Not available"}</p>
        <p><b>Last Modified By:</b> {docxMeta.lastModifiedBy || "Not available"}</p>
        <p><b>Created:</b> {docxMeta.created || "Not available"}</p>
        <p><b>Modified:</b> {docxMeta.modified || "Not available"}</p>
        <p><b>Revision:</b> {docxMeta.revision || "Not available"}</p>
        <p><b>Application:</b> {docxMeta.application || "Not available"}</p>

        <details className="raw-toggle">
          <summary style={{ cursor: "pointer" }}> Raw Data</summary>
          <pre  className="raw-metadata wrap"> {JSON.stringify(docxMeta.raw, null, 2)} </pre>
        </details>
      </>
    ) : (
      <p>{docxMeta.message}</p>
    )}
  </div>
)}
  {docxMeta && <DocxForensicAnalysis docxMeta={docxMeta} />}

{/*  Email */}
{emlMeta && (
  <div className="analysis-card">
    <h3> File Data</h3>

    {emlMeta.available ? (
      <>
        <p><b>From:</b> {emlMeta.from || "Not available"}</p>
        <p><b>To:</b> {emlMeta.to || "Not available"}</p>
        <p><b>Subject:</b> {emlMeta.subject || "Not available"}</p>
        <p><b>Date:</b> {emlMeta.date || "Not available"}</p>
        <p><b>Message ID:</b> {emlMeta.messageId || "Not available"}</p>

        <details className="raw-toggle">
          <summary style={{ cursor: "pointer" }}> Raw Data  </summary>
          {/*raw*/}
          <pre  className="raw-metadata wrap"> {JSON.stringify(emlMeta.rawHeaders, null, 2)} </pre>
        </details>
      </>
    ) : (
      <p>{emlMeta.message}</p>
    )}
  </div>
)}

{emlMeta && <EmlForensicAnalysis emlMeta={emlMeta} />}


  

{/* TxT */}
{txtMeta && (
  <div className="analysis-card">
    <h3> File Data</h3>

    {txtMeta.available ? (
      <>
        <p><b>Word Count:</b> {txtMeta.wordCount}</p>
        <p><b>Character Count:</b> {txtMeta.charCount}</p>
        <p><b>Line Count:</b> {txtMeta.lineCount}</p>

        <p>
          <b> Content Keyword Observation:</b>{" "}
          {txtMeta.suspiciousKeywordsFound.length > 0 ? txtMeta.suspiciousKeywordsFound.join(", ") : "None"}
        </p>

        <details className="raw-toggle">
          <summary style={{ cursor: "pointer" }}>Raw Data</summary>
          <pre  className="raw-metadata wrap"> {txtMeta.rawPreview} </pre>
        </details>
      </>
    ) : (
      <p>{txtMeta.message}</p>
    )}
  </div>
)}

{txtMeta && <TxtForensicAnalysis txtMeta={txtMeta} />}


{file && (
  <>
  <hr style={{ opacity: 0.2, marginTop: "30px" }} />
  <div style={{
             marginTop: "25px",
             padding: "12px",
             backgroundColor: "#111827",
             borderRadius: "8px",
             fontSize: "0.9rem",
             color: "#9ca3af",
             borderLeft: "3px solid #334155",
  }}>
    <p>
      <strong>Assessment Conditions:</strong> 
      Analysis was performed entirely within the client-side browser environment. 
      The uploaded file was not altered, stored, or transmitted during processing.
    </p>
  </div>
  </>
)}
    </div>
  </div>
);
}