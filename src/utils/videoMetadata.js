import MediaInfo from "mediainfo.js";

export async function extractVideoMetadata(file) {
  try {
    const mediaInfo = await MediaInfo({
      locateFile: () => "/MediaInfoModule.wasm"
    
    });

    const getSize = () => file.size;

    const readChunk = (size, offset) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(new Uint8Array(event.target.result));
        };
        reader.readAsArrayBuffer(file.slice(offset, offset + size));
      });

    const result = await mediaInfo.analyzeData(getSize, readChunk);
    const parsed = typeof result === "string" ? JSON.parse(result) : result;


    const tracks = parsed.media?.track || [];

    
    const generalTrack = tracks.find(t => t["@type"] === "General");
    const videoTracks = tracks.filter(t => t["@type"] === "Video" || t.type === "Video");
    const audioTracks = tracks.filter(t => t["@type"] === "Audio" || t.type === "Audio");
    const gps = generalTrack?.Recorded_Location || null;
    let latitude = null;
    let longitude = null;

            if (gps) {
               const match = gps.match(/([+-]?\d+\.\d+)/g);
               if (match && match.length >= 2) {
                      latitude = match[0];
                      longitude = match[1];
                                               }
                     }

    const durationSeconds = generalTrack?.Duration
  ? parseFloat(generalTrack.Duration)
  : null;

const creationTime =
  generalTrack?.Recorded_Date ||
  generalTrack?.Encoded_Date ||
  generalTrack?.Tagged_Date ||
  null;

return {
  available: true,

  fileSize: file.size,
  fileName: file.name,

  duration: durationSeconds,
  bitrate: generalTrack?.OverallBitRate
    ? parseInt(generalTrack.OverallBitRate)
    : null,

  container: generalTrack?.Format || null,
  creationTime,

  codec: videoTracks[0]?.Format || null,
  profile: videoTracks[0]?.Format_Profile || null,

  width: videoTracks[0]?.Width
    ? parseInt(videoTracks[0].Width)
    : null,

  height: videoTracks[0]?.Height
    ? parseInt(videoTracks[0].Height)
    : null,

  frameRate: videoTracks[0]?.FrameRate
    ? parseFloat(videoTracks[0].FrameRate)
    : null,

  frameRateMode: videoTracks[0]?.FrameRate_Mode || null,
  frameRateMin: videoTracks[0]?.FrameRate_Minimum || null,
  frameRateMax: videoTracks[0]?.FrameRate_Maximum || null,

  encoder: generalTrack?.Encoded_Library || null,
  writingLibrary: videoTracks[0]?.Encoded_Library || null,

  audioCodec: audioTracks[0]?.Format || null,
  audioBitrate: audioTracks[0]?.BitRate || null,

  colorSpace: videoTracks[0]?.ColorSpace || null,
  scanType: videoTracks[0]?.ScanType || null,
  aspectRatio: videoTracks[0]?.DisplayAspectRatio || null,

  videoStreamCount: videoTracks.length,
  audioStreamCount: audioTracks.length,

  gps,
  latitude,
  longitude,

  raw: parsed
};
    

  } catch (error) {
    console.error("Video metadata extraction error:", error);
    return {
      available: false,
      message: "Failed to extract video metadata."
    };
  }
}