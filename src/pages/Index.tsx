import { useState } from "react";
import { Send, Trash2, Copy, Check, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResultSection } from "@/components/ResultSection";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

interface Section {
  title: string;
  content: string;
}

const parseAnswer = (answer: string): Section[] => {
  const sections: Section[] = [];
  const regex = /\[([^\]]+)\]/g;
  const parts = answer.split(regex);

  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i]?.trim();
    const content = parts[i + 1]?.trim();
    if (title && content) {
      sections.push({ title, content });
    }
  }

  // If no sections found, return the whole answer as one section
  if (sections.length === 0 && answer.trim()) {
    sections.push({ title: "الإجابة", content: answer.trim() });
  }

  return sections;
};

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const { toast } = useToast();

  const isValidInput = inputText.trim().length >= 5;

  const handleSubmit = async () => {
    if (!isValidInput) {
      toast({
        title: "نص قصير جداً",
        description: "يرجى إدخال 5 حروف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSections([]);

    try {
      const response = await fetch("https://study-brain.vercel.app/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.answer) {
        const parsedSections = parseAnswer(data.answer);
        setSections(parsedSections);
      } else {
        setError("لم يتم استلام إجابة صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setSections([]);
    setError(null);
  };

  const handleCopyAll = async () => {
    const allContent = sections
      .map((s) => `[${s.title}]\n${s.content}`)
      .join("\n\n");
    await navigator.clipboard.writeText(allContent);
    setAllCopied(true);
    toast({
      title: "تم النسخ",
      description: "تم نسخ جميع الأقسام بنجاح",
    });
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <Sparkles className="w-6 h-6 text-primary/70 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-gradient">
            مترجم دماغ الطالب
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
            اكتب أي موضوع دراسي وسنشرحه لك بطريقة سهلة ومنظمة
          </p>
        </header>

        {/* Main Input Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="card-gradient rounded-2xl border border-border p-4 md:p-6 shadow-lg">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب الموضوع أو السؤال اللي عايز تفهمه..."
              className="min-h-[150px] md:min-h-[180px] bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground resize-none text-base md:text-lg leading-relaxed focus:ring-2 focus:ring-primary/50 rounded-xl"
              disabled={isLoading}
            />
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                variant="glow"
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading || !isValidInput}
                className="flex-1"
              >
                <Send className="h-5 w-5" />
                <span>اشرح</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleClear}
                disabled={isLoading}
                className="sm:w-auto"
              >
                <Trash2 className="h-5 w-5" />
                <span>مسح</span>
              </Button>
            </div>

            {!isValidInput && inputText.length > 0 && (
              <p className="text-destructive text-sm mt-3 text-center">
                يرجى إدخال 5 حروف على الأقل ({inputText.trim().length}/5)
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 text-center">
              <p className="text-destructive font-medium text-lg">⚠️ {error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {sections.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                النتيجة
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAll}
                className="gap-2"
              >
                {allCopied ? (
                  <>
                    <Check className="h-4 w-4 text-green-400" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>نسخ الكل</span>
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <ResultSection
                  key={index}
                  title={section.title}
                  content={section.content}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground text-sm">
          <p>صُنع بـ ❤️ لمساعدة الطلاب</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
