import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toPdfMakeObject } from "md-to-pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

// Initialize pdfmake fonts
(pdfMake as unknown as { vfs: typeof pdfFonts.vfs }).vfs = pdfFonts.vfs;

interface ExportOptions {
  title: string;
  content: string;
}

/**
 * Export markdown content as PDF using pdfmake + md-to-pdfmake
 */
export async function exportToPdf({ title, content }: ExportOptions): Promise<void> {
  // Convert markdown to pdfmake content
  const pdfContent = toPdfMakeObject(content);
  
  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: title, style: "title" },
      { canvas: [{ type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: "#cccccc" }] },
      { text: "", margin: [0, 10, 0, 0] },
      pdfContent,
    ],
    styles: {
      title: {
        fontSize: 24,
        bold: true,
        margin: [0, 0, 0, 15],
      },
      // md-to-pdfmake default styles
      h1: { fontSize: 22, bold: true, margin: [0, 15, 0, 10] },
      h2: { fontSize: 18, bold: true, margin: [0, 12, 0, 8] },
      h3: { fontSize: 16, bold: true, margin: [0, 10, 0, 6] },
      h4: { fontSize: 14, bold: true, margin: [0, 8, 0, 5] },
      h5: { fontSize: 12, bold: true, margin: [0, 6, 0, 4] },
      h6: { fontSize: 11, bold: true, margin: [0, 5, 0, 3] },
      p: { margin: [0, 0, 0, 8], lineHeight: 1.4 },
      a: { color: "#0066cc", decoration: "underline" },
      li: { margin: [0, 2, 0, 2] },
      code: { font: "Roboto", background: "#f5f5f5", fontSize: 10 },
      codeblock: { font: "Roboto", background: "#f5f5f5", fontSize: 9, margin: [0, 5, 0, 10] },
      blockquote: { italics: true, color: "#666666", margin: [20, 5, 0, 10] },
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 11,
    },
  };

  const filename = sanitizeFilename(title) + ".pdf";
  pdfMake.createPdf(docDefinition).download(filename);
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || "note";
}
