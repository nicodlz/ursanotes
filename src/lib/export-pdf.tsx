import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Link,
  Font,
} from "@react-pdf/renderer";
import { marked, type Token, type Tokens } from "marked";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf", fontWeight: 700 },
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xP.ttf", fontWeight: 400, fontStyle: "italic" },
  ],
});

Font.register({
  family: "RobotoMono",
  src: "https://fonts.gstatic.com/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 11,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  h1: { fontSize: 18, fontWeight: 700, marginTop: 16, marginBottom: 8 },
  h2: { fontSize: 15, fontWeight: 700, marginTop: 14, marginBottom: 6 },
  h3: { fontSize: 13, fontWeight: 700, marginTop: 12, marginBottom: 5 },
  h4: { fontSize: 11, fontWeight: 700, marginTop: 10, marginBottom: 4 },
  h5: { fontSize: 11, fontWeight: 700, marginTop: 8, marginBottom: 4 },
  h6: { fontSize: 11, fontWeight: 700, marginTop: 8, marginBottom: 4 },
  paragraph: { marginBottom: 8 },
  bold: { fontWeight: 700 },
  italic: { fontStyle: "italic" },
  code: {
    fontFamily: "RobotoMono",
    fontSize: 9,
    backgroundColor: "#f4f4f4",
    padding: 2,
  },
  codeBlock: {
    fontFamily: "RobotoMono",
    fontSize: 9,
    backgroundColor: "#f4f4f4",
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: "#ccc",
    paddingLeft: 10,
    marginVertical: 8,
    fontStyle: "italic",
    color: "#555",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 15,
    marginRight: 5,
  },
  listContent: {
    flex: 1,
  },
  link: {
    color: "#0066cc",
    textDecoration: "underline",
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  tableHeader: {
    fontWeight: 700,
    backgroundColor: "#f4f4f4",
  },
});

interface ExportOptions {
  title: string;
  content: string;
}

interface PdfDocumentProps {
  title: string;
  tokens: Token[];
}

function PdfDocument({ title, tokens }: PdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        {tokens.map((token, i) => (
          <TokenRenderer key={i} token={token} />
        ))}
      </Page>
    </Document>
  );
}

function TokenRenderer({ token }: { token: Token }): React.ReactElement | null {
  switch (token.type) {
    case "heading": {
      const t = token as Tokens.Heading;
      const depth = Math.min(t.depth, 6);
      const styleKey = `h${depth}` as keyof typeof styles;
      return (
        <Text style={styles[styleKey] || styles.h4}>
          <InlineTokens tokens={t.tokens} />
        </Text>
      );
    }

    case "paragraph": {
      const t = token as Tokens.Paragraph;
      return (
        <Text style={styles.paragraph}>
          <InlineTokens tokens={t.tokens} />
        </Text>
      );
    }

    case "text": {
      const t = token as Tokens.Text;
      // Text tokens can have nested tokens
      if (t.tokens && t.tokens.length > 0) {
        return (
          <Text>
            <InlineTokens tokens={t.tokens} />
          </Text>
        );
      }
      return <Text>{t.text}</Text>;
    }

    case "code": {
      const t = token as Tokens.Code;
      return <Text style={styles.codeBlock}>{t.text}</Text>;
    }

    case "blockquote": {
      const t = token as Tokens.Blockquote;
      return (
        <View style={styles.blockquote}>
          {t.tokens.map((tok, i) => (
            <TokenRenderer key={i} token={tok} />
          ))}
        </View>
      );
    }

    case "list": {
      const t = token as Tokens.List;
      return (
        <View style={{ marginBottom: 8 }}>
          {t.items.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>{t.ordered ? `${i + 1}.` : "•"}</Text>
              <Text style={styles.listContent}>
                <ListItemContent tokens={item.tokens} />
              </Text>
            </View>
          ))}
        </View>
      );
    }

    case "table": {
      const t = token as Tokens.Table;
      return (
        <View style={{ marginVertical: 8 }}>
          <View style={styles.tableRow}>
            {t.header.map((cell, i) => (
              <Text key={i} style={[styles.tableCell, styles.tableHeader]}>
                <InlineTokens tokens={cell.tokens} />
              </Text>
            ))}
          </View>
          {t.rows.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              {row.map((cell, j) => (
                <Text key={j} style={styles.tableCell}>
                  <InlineTokens tokens={cell.tokens} />
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
    }

    case "hr":
      return <View style={styles.hr} />;

    case "space":
      return <View style={{ height: 8 }} />;

    default:
      // Fallback for any unhandled token types
      if ("text" in token && typeof token.text === "string") {
        return <Text style={styles.paragraph}>{token.text}</Text>;
      }
      if ("tokens" in token && Array.isArray(token.tokens)) {
        return (
          <View>
            {token.tokens.map((t: Token, i: number) => (
              <TokenRenderer key={i} token={t} />
            ))}
          </View>
        );
      }
      return null;
  }
}

// Special handler for list item content - flattens everything into inline content
function ListItemContent({ tokens }: { tokens: Token[] }): React.ReactElement {
  return (
    <>
      {tokens.map((token, i) => (
        <ListItemToken key={i} token={token} />
      ))}
    </>
  );
}

function ListItemToken({ token }: { token: Token }): React.ReactElement {
  switch (token.type) {
    case "text": {
      const t = token as Tokens.Text;
      if (t.tokens && t.tokens.length > 0) {
        return <InlineTokens tokens={t.tokens} />;
      }
      return <>{t.text}</>;
    }
    case "paragraph": {
      const t = token as Tokens.Paragraph;
      return <InlineTokens tokens={t.tokens} />;
    }
    case "strong":
      return (
        <Text style={styles.bold}>
          <InlineTokens tokens={(token as Tokens.Strong).tokens} />
        </Text>
      );
    case "em":
      return (
        <Text style={styles.italic}>
          <InlineTokens tokens={(token as Tokens.Em).tokens} />
        </Text>
      );
    case "link": {
      const t = token as Tokens.Link;
      return (
        <Link src={t.href} style={styles.link}>
          <InlineTokens tokens={t.tokens} />
        </Link>
      );
    }
    case "codespan":
      return <Text style={styles.code}>{(token as Tokens.Codespan).text}</Text>;
    default:
      if ("text" in token && typeof token.text === "string") {
        return <>{token.text}</>;
      }
      return <></>;
  }
}

function InlineTokens({ tokens }: { tokens?: Token[] }): React.ReactElement {
  if (!tokens) return <></>;

  return (
    <>
      {tokens.map((token, i) => (
        <InlineToken key={i} token={token} />
      ))}
    </>
  );
}

function InlineToken({ token }: { token: Token }): React.ReactElement {
  switch (token.type) {
    case "text": {
      const t = token as Tokens.Text;
      // Handle nested tokens in text
      if (t.tokens && t.tokens.length > 0) {
        return <InlineTokens tokens={t.tokens} />;
      }
      return <>{t.text}</>;
    }

    case "strong":
      return (
        <Text style={styles.bold}>
          <InlineTokens tokens={(token as Tokens.Strong).tokens} />
        </Text>
      );

    case "em":
      return (
        <Text style={styles.italic}>
          <InlineTokens tokens={(token as Tokens.Em).tokens} />
        </Text>
      );

    case "codespan":
      return <Text style={styles.code}>{(token as Tokens.Codespan).text}</Text>;

    case "link": {
      const t = token as Tokens.Link;
      return (
        <Link src={t.href} style={styles.link}>
          <InlineTokens tokens={t.tokens} />
        </Link>
      );
    }

    case "del":
      return (
        <Text style={{ textDecoration: "line-through" }}>
          <InlineTokens tokens={(token as Tokens.Del).tokens} />
        </Text>
      );

    case "br":
      return <Text>{"\n"}</Text>;

    default:
      if ("text" in token && typeof token.text === "string") {
        return <>{token.text}</>;
      }
      return <></>;
  }
}

export async function exportToPdf({ title, content }: ExportOptions): Promise<void> {
  // Parse markdown
  const tokens = marked.lexer(content);
  console.log("[PDF Export] Parsed tokens:", JSON.stringify(tokens, null, 2));

  // Generate PDF blob
  const blob = await pdf(<PdfDocument title={title} tokens={tokens} />).toBlob();

  // Download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = sanitizeFilename(title) + ".pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || "note";
}
