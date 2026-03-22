import { Type } from "lucide-react";
import GeneratorForm from "@/components/dashboard/GeneratorForm";

export default function TitlesPage() {
  return (
    <GeneratorForm
      type="title"
      title="Titles"
      description="Create click-worthy titles for blogs, YouTube videos, newsletters, and more."
      icon={<Type className="w-6 h-6 text-warning" />}
      accentColor="bg-warning/10"
      topicPlaceholder="e.g. How to grow on Instagram in 2025, Building a SaaS with AI..."
      showPlatform
      showTone
      showFormat
    />
  );
}
