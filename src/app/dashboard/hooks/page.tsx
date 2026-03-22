import { Zap } from "lucide-react";
import GeneratorForm from "@/components/dashboard/GeneratorForm";

export default function HooksPage() {
  return (
    <GeneratorForm
      type="hook"
      title="Viral Hooks"
      description="Generate scroll-stopping openers that grab attention in the first 3 seconds."
      icon={<Zap className="w-6 h-6 text-accent" />}
      accentColor="bg-accent/10"
      topicPlaceholder="e.g. Morning routine that changed my life, Why I quit my 9-5 job..."
      showPlatform
      showTone
      showNiche
    />
  );
}
