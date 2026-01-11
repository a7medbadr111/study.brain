import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface ResultSectionProps {
  title: string;
  content: string;
  index: number;
}

const sectionIcons: Record<string, string> = {
  "شرح مبسط": "💡",
  "نقاط للحفظ": "📝",
  "أسئلة امتحانية": "❓",
  "خطة مذاكرة سريعة": "📅",
};

export const ResultSection = ({ title, content, index }: ResultSectionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${title}\n${content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const icon = sectionIcons[title] || "📌";

  return (
    <div
      className="card-gradient rounded-xl border border-border p-5 md:p-6 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg md:text-xl font-bold text-foreground">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-9 w-9 shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-base">
        {content}
      </div>
    </div>
  );
};
