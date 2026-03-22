import { MessageSquare } from "lucide-react";
import GeneratorForm from "@/components/dashboard/GeneratorForm";

export default function CaptionsPage() {
  return (
    <GeneratorForm
      type="caption"
      title="Captions"
      description="Create platform-optimized captions with hashtags, emojis, and compelling CTAs."
      icon={<MessageSquare className="w-6 h-6 text-spark" />}
      accentColor="bg-spark/10"
      topicPlaceholder="e.g. Just launched my new SaaS product, Behind the scenes of my photoshoot..."
      showPlatform
      showTone
    />
  );
}
