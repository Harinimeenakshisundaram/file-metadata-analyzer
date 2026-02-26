import * as exifr from "exifr";

export async function extractImageMetadata(file) {
  try {
    const data = await exifr.parse(file, {
      exif: true,
      gps: true,
      tiff: true,
      xmp: true
    });

    if (!data) {
      return {
        available: false,
        message: "No EXIF metadata found in this image."
      };
    }

    return {
      available: true,
      camera: `${data.Make || ""} ${data.Model || ""}`.trim() || null,
      dateTaken: data.DateTimeOriginal || null,
      modifyDate: data.ModifyDate || null,
      createDate: data.CreateDate || data.DateTimeOriginal || null,
  
      gps:
       data.latitude != null && data.longitude != null
       ? {
        latitude: data.latitude,
        longitude: data.longitude
      }
      : null,

      software: data.Software || null,
      creatorTool: data.CreatorTool || data["XMP:CreatorTool"] || null,
      raw: data
    };
  } catch (error) {
    console.error("EXIF Extraction Error:", error);
    return {
      available: false,
      message: "Failed to extract metadata."
    };
  }
}
