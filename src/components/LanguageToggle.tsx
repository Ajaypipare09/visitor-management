import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLang(lang === "en" ? "mr" : "en")}
      className="gap-2 rounded-full"
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">{lang === "en" ? "मराठी" : "English"}</span>
    </Button>
  );
}
