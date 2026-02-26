import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractPDFMetadata(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const metadata = await pdf.getMetadata();

   return {
  available: true,

  info: metadata.info || {},  

  title: metadata.info?.Title || null,
  author: metadata.info?.Author || null,
  subject: metadata.info?.Subject || null,
  keywords: metadata.info?.Keywords || null,

  creator: metadata.info?.Creator || null,
  producer: metadata.info?.Producer || null,

  creationDate: metadata.info?.CreationDate || null,
  modificationDate: metadata.info?.ModDate || null,

  trapped: metadata.info?.Trapped || null,

  pageCount: pdf.numPages || null,
  fileSize: file.size || null,

  encrypted: pdf.isEncrypted || false,
  
  raw: {  info: metadata.info || {},
          xmp: metadata.metadata || null
       }
};

  } catch (error) {
    console.error("PDF metadata extraction error:", error);
    return {
      available: false,
      message: "Unable to extract PDF metadata."
    };
  }
}
