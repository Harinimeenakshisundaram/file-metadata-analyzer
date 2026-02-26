import emlFormat from "eml-format";

export async function extractEmlMetadata(file) {
  try {
    const text = await file.text();

    const parsed = await new Promise((resolve, reject) => {
      emlFormat.read(text, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const headers = parsed.headers || {};

    // 🔎 Case-insensitive header lookup
    const getHeader = (name) => {
      const key = Object.keys(headers).find(
        (k) => k.toLowerCase() === name.toLowerCase()
      );
      return key ? headers[key] : null;
    };

    const from = getHeader("from");
    const to = getHeader("to");
    const subject = getHeader("subject");
    const date = getHeader("date");
    const messageId = getHeader("message-id");
    const received = getHeader("received");
    const spf = getHeader("received-spf");
    const dkim = getHeader("dkim-signature");

    
    let originIP = null;
    if (received) {
      const receivedText = Array.isArray(received)
        ? received.join(" ")
        : received;

      const ipMatch = receivedText.match(
        /\b(?:\d{1,3}\.){3}\d{1,3}\b/
      );

      if (ipMatch) {
        originIP = ipMatch[0];
      }
    }

  
  return {
  available: true,

  from,
  to,
  subject,
  date,
  messageId,

  originIP,
  spf,
  dkim,

  bodyText: parsed.text || null,
  bodyHTML: parsed.html || null,

  attachments: parsed.attachments || [],

  contentType: getHeader("content-type"),
  replyTo: getHeader("reply-to"),
  returnPath: getHeader("return-path"),

  rawHeaders: headers
};


  } catch (error) {
    console.error("EML Extraction Error:", error);
    return { available: false, message: "EML parsing failed." };
  }
}
