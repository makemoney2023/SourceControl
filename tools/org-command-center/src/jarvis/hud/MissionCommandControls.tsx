import { ChevronDown, Radio, Settings2, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

type Props = {
  showTheater: boolean;
  opsMode: boolean;
  followCam: boolean;
  alertCount: number;
  refreshing: boolean;
  lastUpdated: string | null;
  onTalk: () => void;
  onBriefMission: () => void;
  onBriefSeat: () => void;
  onBriefDigest: () => void;
  onAssign: () => void;
  onOutputs: () => void;
  onLegacyVoice: () => void;
  onRunNext: () => void;
  onPreviewWakeStart: () => void;
  onPreviewWakeEnd: () => void;
  onRuns: () => void;
  onDigest: () => void;
  onGraph: () => void;
  onAlerts: () => void;
  onRoutines: () => void;
  onToggleTheater: (next: boolean) => void;
  onToggleOps: (next: boolean) => void;
  onToggleFollowCam: (next: boolean) => void;
  onReplayTour: () => void;
  onFrameCompany?: () => void;
  onWorkspace: () => void;
  onRefresh: () => void;
};

export function MissionCommandControls(props: Props) {
  return (
    <div className="j-mission-controls">
      <div className="j-primary-actions">
        <button
          type="button"
          className="j-btn j-btn-primary"
          onClick={props.onRunNext}
          onMouseEnter={props.onPreviewWakeStart}
          onMouseLeave={props.onPreviewWakeEnd}
          onFocus={props.onPreviewWakeStart}
          onBlur={props.onPreviewWakeEnd}
        >
          Run next
        </button>
      </div>

      <div className="j-voice-cluster" role="group" aria-label="Voice and intelligence">
        <Radio aria-hidden="true" size={14} />
        <button type="button" className="j-btn" onClick={props.onTalk}>Talk</button>
        <button type="button" className="j-btn" onClick={props.onBriefMission}>Brief me</button>
      </div>

      <div className="j-control-menus">
        <DropdownMenu>
          <DropdownMenuTrigger className="j-btn" aria-label="Intelligence controls">
            <Sparkles aria-hidden="true" size={14} /> Intelligence <ChevronDown aria-hidden="true" size={13} />
          </DropdownMenuTrigger>
          <DropdownMenuContent aria-label="Intelligence controls">
            <DropdownMenuLabel>Intelligence</DropdownMenuLabel>
            <DropdownMenuItem onSelect={props.onAssign}>Assign</DropdownMenuItem>
            <DropdownMenuItem onSelect={props.onOutputs}>Outputs</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={props.onBriefSeat}>Brief CEO</DropdownMenuItem>
            <DropdownMenuItem onSelect={props.onBriefDigest}>Brief digest</DropdownMenuItem>
            <DropdownMenuItem onSelect={props.onLegacyVoice}>Legacy voice</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={props.onDigest}>Digest</DropdownMenuItem>
            <DropdownMenuItem onSelect={props.onGraph}>Knowledge graph</DropdownMenuItem>
            <DropdownMenuItem onSelect={props.onAlerts}>Alerts ({props.alertCount})</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="j-btn" aria-label="System controls">
            <Settings2 aria-hidden="true" size={14} /> System <ChevronDown aria-hidden="true" size={13} />
          </DropdownMenuTrigger>
          <DropdownMenuContent aria-label="System controls">
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuItem onSelect={props.onWorkspace}>Workspace…</DropdownMenuItem>
            <DropdownMenuItem onSelect={props.onRuns}>Runs</DropdownMenuItem>
            <DropdownMenuItem onSelect={props.onRoutines}>Routines</DropdownMenuItem>
            <DropdownMenuCheckboxItem
              aria-label="Theater"
              checked={props.showTheater}
              onCheckedChange={props.onToggleTheater}
            >
              Theater
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              aria-label="Ops tables"
              checked={props.opsMode}
              onCheckedChange={props.onToggleOps}
            >
              Ops tables
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              aria-label="Follow running seats"
              checked={props.followCam}
              onCheckedChange={props.onToggleFollowCam}
            >
              Follow running seats
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            {props.onFrameCompany ? (
              <DropdownMenuItem onSelect={props.onFrameCompany}>Frame company</DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onSelect={props.onReplayTour}>Replay tour</DropdownMenuItem>
            <DropdownMenuItem disabled={props.refreshing} onSelect={props.onRefresh}>
              {props.refreshing ? "Refreshing…" : "Refresh"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="j-update-status j-muted" role="status" aria-live="polite">
        {props.refreshing ? "Refreshing mission data…" : props.lastUpdated ? `Updated ${props.lastUpdated}` : "Awaiting sync"}
      </p>
    </div>
  );
}
