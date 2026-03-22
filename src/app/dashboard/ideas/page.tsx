import { Lightbulb } from "lucide-react";
import GeneratorForm from "@/components/dashboard/GeneratorForm";

export default function IdeasPage() {
  return (
    <GeneratorForm
      type="idea"
      title="Content Ideas"
      description="Get trending content ideas for your niche, tailored to your audience and format."
      icon={<Lightbulb className="w-6 h-6 text-error" />}
      accentColor="bg-error/10"
      topicPlaceholder="e.g. AI tools for productivity, Home workout tips..."
      showNiche
      showAudience
      showFormat
      showTone
    />
  );
}
