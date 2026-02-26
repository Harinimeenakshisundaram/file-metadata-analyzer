import JSZip from "jszip";

export async function extractDocxMetadata(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const coreFile = zip.file("docProps/core.xml");
    const appFile = zip.file("docProps/app.xml");

    if (!coreFile) {
      return { available: false, message: "No DOCX metadata found." };
    }

    const coreXml = await coreFile.async("text");
    const appXml = appFile ? await appFile.async("text") : null;

    const getTag = (xml, tag) => {
      const match = xml.match(new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`));
      return match ? match[1] : null;
    };

    return {
      available: true,
      title: getTag(coreXml, "dc:title"),
      creator: getTag(coreXml, "dc:creator"),
      lastModifiedBy: getTag(coreXml, "cp:lastModifiedBy"),
      created: getTag(coreXml, "dcterms:created"),
      modified: getTag(coreXml, "dcterms:modified"),
      revision: getTag(coreXml, "cp:revision"),
      application: appXml ? getTag(appXml, "Application") : null,
      raw: { coreXml, appXml }
    };

  } catch (error) {
    return { available: false, message: "DOCX parsing failed." };
  }
}
