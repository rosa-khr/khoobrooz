import { ClipboardCheck, FileSearch, Handshake, MessagesSquare, Route } from "lucide-react";
import { Dictionary } from "@/data/i18n";

const flowIcons = [MessagesSquare, Route, FileSearch, Handshake];

export function ProcessFlow({ content }: { content: Dictionary["processFlow"] }) {
  return (
    <div className="process-flow" aria-label={content.aria}>
      <ol className="process-flow-track">
        {content.steps.map((step, index) => {
          const Icon = flowIcons[index] ?? Handshake;

          return (
            <li key={step.title} className="process-flow-node">
              <span className="process-flow-count">{index + 1}</span>
              <div className="process-flow-card">
                <span className="process-flow-icon">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="process-flow-outcomes">
        <span className="process-flow-outcome-title">
          <ClipboardCheck className="size-5" aria-hidden="true" />
          {content.outcomeTitle}
        </span>
        <div className="process-flow-outcome-list">
          {content.outcomes.map((outcome) => (
            <span key={outcome}>{outcome}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
