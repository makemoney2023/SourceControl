# DISPATCH routines

YAML cron jobs polled every 30s by Org Command Center.

Example (disabled by default — copy and set `enabled: true`):

```yaml
id: example-research-pulse
enabled: false
cron: "0 13 * * *"
action: enqueue
phase: "2"
position: head-of-research
goal: "Daily research pulse"
budget_usd: null
```

- `cron`: 5-field UTC (minute hour dom month dow)
- `action`: `enqueue` | `rewake`
- For `rewake`, set `rewake_dispatch` to a claimed YAML filename
