export function parsePDFDate(pdfDate) {
  if (!pdfDate) return null;

  const cleaned = pdfDate.replace("D:", "");

  const year = cleaned.substring(0, 4);
  const month = cleaned.substring(4, 6) || "01";
  const day = cleaned.substring(6, 8) || "01";
  const hour = cleaned.substring(8, 10) || "00";
  const min = cleaned.substring(10, 12) || "00";
  const sec = cleaned.substring(12, 14) || "00";

  return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}`);
}