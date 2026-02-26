export async function extractTxtMetadata(file) {
  try {
    const text = await file.text();

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const charCount = text.length;
    const lineCount = text.split(/\r?\n/).length;

    
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const links = text.match(urlRegex) || [];

    const suspiciousKeywords = [
      "password",
      "confidential",
      "secret",
      "attack",
      "exploit",
      "admin",
      "bitcoin",
      "urgent",
      "verify",
      "bank",
      "vulnerable",
      "exploit",
    ];

    const lowerText = text.toLowerCase();

   const detectedKeywords = suspiciousKeywords.filter(keyword => lowerText.includes(keyword) );

    // Detect excessive whitespace wiping
    const emptyLines = text.split(/\r?\n/).filter(line => line.trim() === "").length;

    return {
      available: true,

      fileName: file.name,
      fileSize: file.size,
      lastModified: file.lastModified,

      wordCount,
      charCount,
      lineCount,
      emptyLines,

      links,
      suspiciousKeywordsFound: detectedKeywords,

      rawPreview: text.slice(0, 800) 
    };

  } catch (error) {
    return {
      available: false,
      message: "TXT parsing failed."
    };
  }
}