import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { marked, type Token, type Tokens } from "marked";
import type { TDocumentDefinitions, Content, ContentText, ContentColumns, ContentTable, ContentCanvas, ContentStack } from "pdfmake/interfaces";

// Initialize pdfmake fonts
(pdfMake as unknown as { vfs: typeof pdfFonts.vfs }).vfs = pdfFonts.vfs;

interface ExportOptions {
  title: string;
  content: string;
}

/**
 * Export markdown content as PDF using pdfmake
 * No html2canvas = no oklch color parsing issues
 */
export async function exportToPdf({ title, content }: ExportOptions): Promise<void> {
  // Parse markdown to tokens
  const tokens = marked.lexer(content);
  
  // Convert tokens to pdfmake content
  const pdfContent = tokensToPdfContent(tokens);
  
  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: title, style: "title" } as ContentText,
      { canvas: [{ type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: "#cccccc" }] } as ContentCanvas,
      { text: "", margin: [0, 10, 0, 0] } as ContentText,
      ...pdfContent,
    ],
    styles: {
      title: {
        fontSize: 24,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      h1: {
        fontSize: 20,
        bold: true,
        margin: [0, 15, 0, 8],
      },
      h2: {
        fontSize: 16,
        bold: true,
        margin: [0, 12, 0, 6],
      },
      h3: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      h4: {
        fontSize: 12,
        bold: true,
        margin: [0, 8, 0, 4],
      },
      paragraph: {
        fontSize: 11,
        margin: [0, 0, 0, 8],
        lineHeight: 1.4,
      },
      code: {
        font: "Roboto",
        fontSize: 10,
      },
      codeBlock: {
        font: "Roboto",
        fontSize: 9,
        margin: [0, 5, 0, 10],
      },
      blockquote: {
        fontSize: 11,
        italics: true,
        color: "#666666",
        margin: [20, 5, 0, 10],
      },
      listItem: {
        fontSize: 11,
        margin: [0, 2, 0, 2],
      },
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 11,
    },
  };

  const filename = sanitizeFilename(title) + ".pdf";
  pdfMake.createPdf(docDefinition).download(filename);
}

function tokensToPdfContent(tokens: Token[]): Content[] {
  const content: Content[] = [];
  
  for (const token of tokens) {
    const converted = tokenToPdf(token);
    if (converted) {
      if (Array.isArray(converted)) {
        content.push(...converted);
      } else {
        content.push(converted);
      }
    }
  }
  
  return content;
}

function tokenToPdf(token: Token): Content | Content[] | null {
  switch (token.type) {
    case "heading": {
      const t = token as Tokens.Heading;
      const style = `h${Math.min(t.depth, 4)}`;
      return { text: parseInlineTokens(t.tokens), style } as ContentText;
    }
    
    case "paragraph": {
      const t = token as Tokens.Paragraph;
      return { text: parseInlineTokens(t.tokens), style: "paragraph" } as ContentText;
    }
    
    case "code": {
      const t = token as Tokens.Code;
      return {
        table: {
          widths: ["*"],
          body: [[{ text: t.text, style: "codeBlock", fillColor: "#f5f5f5" }]],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#e0e0e0",
          vLineColor: () => "#e0e0e0",
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
        margin: [0, 5, 0, 10],
      } as ContentTable;
    }
    
    case "blockquote": {
      const t = token as Tokens.Blockquote;
      const innerContent = tokensToPdfContent(t.tokens);
      return {
        columns: [
          { width: 3, canvas: [{ type: "rect", x: 0, y: 0, w: 3, h: 50, color: "#cccccc" }] },
          { width: "*", stack: innerContent, margin: [10, 0, 0, 0] } as ContentStack,
        ],
        margin: [0, 5, 0, 10],
      } as ContentColumns;
    }
    
    case "list": {
      const t = token as Tokens.List;
      const items: Content[] = t.items.map((item, index) => {
        const itemContent = tokensToPdfContent(item.tokens);
        const bullet = t.ordered ? `${index + 1}.` : "•";
        return {
          columns: [
            { width: 20, text: bullet, alignment: "right" as const },
            { width: "*", stack: itemContent },
          ],
          style: "listItem",
        } as ContentColumns;
      });
      return items;
    }
    
    case "table": {
      const t = token as Tokens.Table;
      const headerRow = t.header.map(cell => ({
        text: parseInlineTokens(cell.tokens),
        bold: true,
        fillColor: "#f0f0f0",
      }));
      const bodyRows = t.rows.map(row =>
        row.map(cell => ({ text: parseInlineTokens(cell.tokens) }))
      );
      
      return {
        table: {
          headerRows: 1,
          widths: Array(t.header.length).fill("*") as string[],
          body: [headerRow, ...bodyRows],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#dddddd",
          vLineColor: () => "#dddddd",
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
        margin: [0, 5, 0, 10],
      } as ContentTable;
    }
    
    case "hr":
      return {
        canvas: [{ type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: "#cccccc" }],
        margin: [0, 10, 0, 10],
      } as ContentCanvas;
    
    case "space":
      return { text: "", margin: [0, 5, 0, 5] } as ContentText;
    
    default:
      // For unknown tokens, try to extract text
      if ("text" in token && typeof token.text === "string") {
        return { text: token.text, style: "paragraph" } as ContentText;
      }
      return null;
  }
}

type InlineContent = string | { text: string | InlineContent[]; bold?: boolean; italics?: boolean; link?: string; decoration?: string; font?: string; background?: string };

function parseInlineTokens(tokens: Token[] | undefined): InlineContent[] {
  if (!tokens) return [];
  
  const result: InlineContent[] = [];
  
  for (const token of tokens) {
    switch (token.type) {
      case "text":
        result.push((token as Tokens.Text).text);
        break;
      
      case "strong":
        result.push({
          text: parseInlineTokens((token as Tokens.Strong).tokens),
          bold: true,
        });
        break;
      
      case "em":
        result.push({
          text: parseInlineTokens((token as Tokens.Em).tokens),
          italics: true,
        });
        break;
      
      case "codespan":
        result.push({
          text: (token as Tokens.Codespan).text,
          font: "Roboto",
          background: "#f5f5f5",
        });
        break;
      
      case "link":
        result.push({
          text: parseInlineTokens((token as Tokens.Link).tokens),
          link: (token as Tokens.Link).href,
          decoration: "underline",
        });
        break;
      
      case "del":
        result.push({
          text: parseInlineTokens((token as Tokens.Del).tokens),
          decoration: "lineThrough",
        });
        break;
      
      default:
        if ("text" in token && typeof token.text === "string") {
          result.push(token.text);
        }
    }
  }
  
  return result;
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || "note";
}
