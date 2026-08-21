import { ShieldAlert } from "lucide-react";
import { Panel } from "@/components/workspace/primitives";

/**
 * Shown on the admin screens whose endpoints (`/admin/users/**`,
 * `/admin/dashboard/**`) aren't in the backend's OpenAPI spec yet. Said once,
 * plainly, so the resulting error state reads as "not built yet" rather than
 * as a bug in this console.
 */
export function NotImplementedNotice({ endpoint }: { endpoint: string }) {
  return (
    <Panel tone="alert">
      <div className="flex items-start gap-3">
        <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p className="text-sm leading-6">
          <code className="font-mono text-xs">{endpoint}</code> isn&apos;t
          implemented on the backend yet, so this screen will show an error
          until it is. The UI and request are ready to go the moment that
          route ships.
        </p>
      </div>
    </Panel>
  );
}
