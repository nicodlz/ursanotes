import html2pdf from "html2pdf.js";

interface ExportOptions {
  title: string;
  content: string;
}

/**
 * Export markdown content as PDF
 * Renders markdown to HTML, then converts to PDF
 */
export async function exportToPdf({ title, content }: ExportOptions): Promise<void> {
  // Create an iframe to completely isolate from page styles
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.left = "-9999px";
  iframe.style.width = "800px";
  iframe.style.height = "600px";
  document.body.appendChild(iframe);
  
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error("Failed to create iframe document");
    
    // Import and render markdown
    const { marked } = await import("marked");
    const html = await marked(content);
    
    // Write complete HTML document with isolated styles
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #1a1a1a;
            background: #ffffff;
            padding: 20px;
          }
          h1 { font-size: 24pt; margin: 0 0 16pt 0; border-bottom: 1px solid #dddddd; padding-bottom: 8pt; }
          h2 { font-size: 18pt; margin: 16pt 0 12pt 0; }
          h3 { font-size: 14pt; margin: 14pt 0 10pt 0; }
          h4, h5, h6 { font-size: 12pt; margin: 12pt 0 8pt 0; }
          p { margin: 0 0 10pt 0; }
          ul, ol { margin: 0 0 10pt 0; padding-left: 20pt; }
          li { margin: 4pt 0; }
          code {
            background: #f4f4f4;
            padding: 2pt 4pt;
            border-radius: 3pt;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 10pt;
          }
          pre {
            background: #f4f4f4;
            padding: 12pt;
            border-radius: 4pt;
            overflow-x: auto;
            margin: 0 0 10pt 0;
          }
          pre code { background: transparent; padding: 0; }
          blockquote {
            border-left: 3pt solid #cccccc;
            margin: 0 0 10pt 0;
            padding-left: 12pt;
            color: #666666;
          }
          table { border-collapse: collapse; margin: 0 0 10pt 0; width: 100%; }
          th, td {
            border: 1px solid #dddddd;
            padding: 6pt 10pt;
            text-align: left;
          }
          th { background: #f4f4f4; font-weight: 600; }
          a { color: #0066cc; text-decoration: none; }
          hr { border: none; border-top: 1px solid #dddddd; margin: 16pt 0; }
          img { max-width: 100%; height: auto; }
          strong, b { font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        ${html}
      </body>
      </html>
    `);
    iframeDoc.close();
    
    const filename = sanitizeFilename(title) + ".pdf";
    
    await html2pdf()
      .set({
        margin: [15, 15, 15, 15],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { 
          unit: "mm", 
          format: "a4", 
          orientation: "portrait" 
        },
      })
      .from(iframeDoc.body)
      .save();
  } finally {
    document.body.removeChild(iframe);
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || "note";
}
