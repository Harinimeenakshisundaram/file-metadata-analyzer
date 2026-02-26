import { parseBlob } from "music-metadata-browser";

export async function extractAudioMetadata(file) {
  try {
    const metadata = await parseBlob(file);

    if (!metadata) {
      return {
        available: false,
        message: "No audio metadata found."
      };
    }

    const format = metadata.format || {};
    const common = metadata.common || {};

    return {
      available: true,
      duration: format.duration || null,
      bitrate: format.bitrate || null,
      sampleRate: format.sampleRate || null,
      numberOfChannels: format.numberOfChannels || null,
      codec: format.codec || null,
      container: format.container || null,
      creationTime: format.creationTime || null,
      modificationTime: format.modificationTime || null,
      encoder: format.encoder || null,
      tool: format.tool || null,
      title: common.title || null,
      artist: common.artist || null,
      album: common.album || null,
      genre: common.genre || null,
      comment: common.comment || null,

      raw: metadata
    };

  } catch (error) {
    console.error("Audio metadata extraction error:", error);
    return {
      available: false,
      message: "Failed to extract audio metadata."
    };
  }
}
