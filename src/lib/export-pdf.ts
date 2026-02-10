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
      .pdf-export-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #1a1a1a;
        padding: 20px;
      }
      .pdf-export-container h1 { font-size: 24pt; margin: 0 0 16pt 0; border-bottom: 1px solid #ddd; padding-bottom: 8pt; }
      .pdf-export-container h2 { font-size: 18pt; margin: 16pt 0 12pt 0; }
      .pdf-export-container h3 { font-size: 14pt; margin: 14pt 0 10pt 0; }
      .pdf-export-container p { margin: 0 0 10pt 0; }
      .pdf-export-container ul, .pdf-export-container ol { margin: 0 0 10pt 0; padding-left: 20pt; }
      .pdf-export-container li { margin: 4pt 0; }
      .pdf-export-container code { 
        background: #f4f4f4; 
        padding: 2pt 4pt; 
        border-radius: 3pt;
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 10pt;
      }
      .pdf-export-container pre { 
        background: #f4f4f4; 
        padding: 12pt; 
        border-radius: 4pt;
        overflow-x: auto;
        margin: 0 0 10pt 0;
      }
      .pdf-export-container pre code { background: none; padding: 0; }
      .pdf-export-container blockquote { 
        border-left: 3pt solid #ddd; 
        margin: 0 0 10pt 0; 
        padding-left: 12pt;
        color: #666;
      }
      .pdf-export-container table { border-collapse: collapse; margin: 0 0 10pt 0; width: 100%; }
      .pdf-export-container th, .pdf-export-container td { 
        border: 1px solid #ddd; 
        padding: 6pt 10pt; 
        text-align: left;
      }
      .pdf-export-container th { background: #f4f4f4; font-weight: 600; }
      .pdf-export-container a { color: #0066cc; text-decoration: none; }
      .pdf-export-container hr { border: none; border-top: 1px solid #ddd; margin: 16pt 0; }
      .pdf-export-container img { max-width: 100%; height: auto; }
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
