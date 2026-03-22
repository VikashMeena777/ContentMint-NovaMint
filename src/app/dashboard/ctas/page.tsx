import { Target } from "lucide-react";
import GeneratorForm from "@/components/dashboard/GeneratorForm";

export default function CTAsPage() {
  return (
    <GeneratorForm
      type="cta"
      title="CTAs"
      description="Generate action-driving calls-to-action with urgency and scarcity variants."
      icon={<Target className="w-6 h-6 text-success" />}
      accentColor="bg-success/10"
      topicPlaceholder="e.g. Online course about web development, Fitness coaching program..."
      showTone
      showGoal
      goalLabel="Goal"
      goalPlaceholder="e.g. Get more signups, drive purchases, book a call..."
    />
  );
}
