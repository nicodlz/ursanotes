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
  // Create a temporary container with the rendered content
  const container = document.createElement("div");
  container.className = "pdf-export-container";
  
  // Import and render markdown
  const { marked } = await import("marked");
  const html = await marked(content);
  
  container.innerHTML = `
    <style>
      /* Force all elements to use hex colors - html2canvas doesn't support oklch() */
      .pdf-export-container,
      .pdf-export-container * {
        color: #1a1a1a !important;
        background-color: transparent !important;
        border-color: #dddddd !important;
        outline-color: #dddddd !important;
        text-decoration-color: #1a1a1a !important;
        caret-color: #1a1a1a !important;
        fill: #1a1a1a !important;
        stroke: #1a1a1a !important;
      }
      .pdf-export-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #1a1a1a !important;
        background-color: #ffffff !important;
        padding: 20px;
      }
      .pdf-export-container h1 { font-size: 24pt; margin: 0 0 16pt 0; border-bottom: 1px solid #dddddd !important; padding-bottom: 8pt; color: #1a1a1a !important; }
      .pdf-export-container h2 { font-size: 18pt; margin: 16pt 0 12pt 0; color: #1a1a1a !important; }
      .pdf-export-container h3 { font-size: 14pt; margin: 14pt 0 10pt 0; color: #1a1a1a !important; }
      .pdf-export-container p { margin: 0 0 10pt 0; color: #1a1a1a !important; }
      .pdf-export-container ul, .pdf-export-container ol { margin: 0 0 10pt 0; padding-left: 20pt; color: #1a1a1a !important; }
      .pdf-export-container li { margin: 4pt 0; color: #1a1a1a !important; }
      .pdf-export-container code { 
        background-color: #f4f4f4 !important; 
        color: #1a1a1a !important;
        padding: 2pt 4pt; 
        border-radius: 3pt;
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 10pt;
      }
      .pdf-export-container pre { 
        background-color: #f4f4f4 !important; 
        color: #1a1a1a !important;
        padding: 12pt; 
        border-radius: 4pt;
        overflow-x: auto;
        margin: 0 0 10pt 0;
      }
      .pdf-export-container pre code { background-color: transparent !important; padding: 0; color: #1a1a1a !important; }
      .pdf-export-container blockquote { 
        border-left: 3pt solid #cccccc !important; 
        margin: 0 0 10pt 0; 
        padding-left: 12pt;
        color: #666666 !important;
        background-color: transparent !important;
      }
      .pdf-export-container table { border-collapse: collapse; margin: 0 0 10pt 0; width: 100%; }
      .pdf-export-container th, .pdf-export-container td { 
        border: 1px solid #dddddd !important; 
        padding: 6pt 10pt; 
        text-align: left;
        color: #1a1a1a !important;
      }
      .pdf-export-container th { background-color: #f4f4f4 !important; font-weight: 600; color: #1a1a1a !important; }
      .pdf-export-container td { background-color: #ffffff !important; }
      .pdf-export-container a { color: #0066cc !important; text-decoration: none; }
      .pdf-export-container hr { border: none; border-top: 1px solid #dddddd !important; margin: 16pt 0; }
      .pdf-export-container img { max-width: 100%; height: auto; }
      .pdf-export-container mark { background-color: #ffff00 !important; color: #1a1a1a !important; }
      .pdf-export-container strong, .pdf-export-container b { color: #1a1a1a !important; }
      .pdf-export-container em, .pdf-export-container i { color: #1a1a1a !important; }
    </style>
    <h1>${escapeHtml(title)}</h1>
    ${html}
  `;
  
  // Temporarily add to DOM (required by html2pdf)
  container.style.position = "absolute";
  container.style.left = "-9999px";
  document.body.appendChild(container);
  
  try {
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
      .from(container)
      .save();
  } finally {
    document.body.removeChild(container);
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
