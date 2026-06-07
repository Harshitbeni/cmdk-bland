export const COMMAND_TABS = ['All', 'Incidents', 'Assets', 'Logs', 'Members']

export const COMMAND_SUB_TABS = {
  Incidents: ['Ongoing', 'Resolved'],
  Assets: ['Devices', 'Servers', 'Cloud', 'Endpoints'],
  Members: ['On-call', 'Internal', 'External'],
}

export const SMARTBAR_ITEMS = [
  {
    id: 'on-call',
    tab: 'Members',
    subTab: 'On-call',
    eyebrow: 'On-call',
    title: '5 People',
    detail: 'Harshit, Pari, Spencer, Michelle, Alexander',
    avatars: ['HB', 'PG', '+3'],
    tone: 'neutral',
    actions: [
      { id: 'copy-email', label: 'Copy email', keys: ['Alt', 'C'], copyValue: 'harshit@aegis.com' },
      { id: 'view', label: 'View', keys: ['Enter'], primary: true },
    ],
  },
  {
    id: 'incident-health',
    tab: 'Incidents',
    subTab: 'Ongoing',
    eyebrow: 'Incidents',
    title: '3 ongoing incidents',
    detail: 'Critical Okta, AWS, and endpoint investigations active',
    icon: 'exclamation-triangle',
    tone: 'alert',
    actions: [
      { id: 'summary', label: 'Summary', keys: ['S'] },
      { id: 'view', label: 'View', keys: ['Enter'], primary: true },
    ],
  },
]

const memberRows = [
  member('contact-harshit', 'Harshit Beni', 'HB', 'harshit@aegis.com', 'Internal', 'On-call', ['incident commander', 'soc lead', 'pager']),
  member('contact-pari', 'Pari Gill', 'PG', 'pari@aegis.com', 'Internal', 'On-call', ['cloud response', 'aws', 'pager']),
  member('contact-spencer', 'Spencer Voss', 'SV', 'spencer@aegis.com', 'Internal', 'On-call', ['endpoint response', 'macos', 'pager']),
  member('contact-michelle', 'Michelle Park', 'MP', 'michelle@aegis.com', 'Internal', 'On-call', ['malware analyst', 'reverse engineering', 'pager']),
  member('contact-alexander', 'Alexander Chen', 'AC', 'alexander@aegis.com', 'Internal', 'On-call', ['identity response', 'okta', 'pager']),
  member('contact-nora', 'Nora Shah', 'NS', 'nora@aegis.com', 'Internal', 'Off-call', ['detection engineering', 'sigma']),
  member('contact-omar', 'Omar Reyes', 'OR', 'omar@aegis.com', 'Internal', 'Off-call', ['network forensics', 'zeek']),
  member('contact-lena', 'Lena Ortiz', 'LO', 'lena@aegis.com', 'Internal', 'Off-call', ['threat intel', 'apt']),
  member('contact-jules', 'Jules Martin', 'JM', 'jules@aegis.com', 'Internal', 'Off-call', ['triage', 'case review']),
  member('contact-iris', 'Iris Nakamura', 'IN', 'iris@aegis.com', 'Internal', 'Off-call', ['cloud posture', 'gcp']),
  member('contact-dev', 'Dev Patel', 'DP', 'dev@aegis.com', 'Internal', 'Off-call', ['automation', 'runbooks']),
  member('contact-zara', 'Zara Ali', 'ZA', 'zara@aegis.com', 'Internal', 'Off-call', ['compliance', 'audit']),
  member('contact-kai', 'Kai Morgan', 'KM', 'kai@aegis.com', 'Internal', 'Off-call', ['database security', 'postgres']),
  member('contact-ana', 'Ana Brooks', 'AB', 'ana@aegis.com', 'Internal', 'Off-call', ['windows endpoint', 'edr']),
  member('contact-tom', 'Tom Willis', 'TW', 'tom@aegis.com', 'Internal', 'Off-call', ['linux servers', 'ssh']),
  member('contact-okta', 'Okta support analyst', 'OS', 'support@okta.example', 'External', 'Vendor', ['identity', 'vendor', 'sso']),
  member('contact-crowdstrike', 'CrowdStrike response desk', 'CR', 'response@crowdstrike.example', 'External', 'Vendor', ['edr', 'endpoint', 'vendor']),
  member('contact-aws-tam', 'AWS technical account manager', 'AT', 'tam@amazon.example', 'External', 'Vendor', ['aws', 'cloud', 'vendor']),
  member('contact-slack-sec', 'Slack security contact', 'SC', 'security@slack.example', 'External', 'Vendor', ['slack', 'collaboration', 'vendor']),
  member('contact-mandiant', 'Mandiant retainer lead', 'ML', 'lead@mandiant.example', 'External', 'Vendor', ['forensics', 'retainer', 'vendor']),
]

const ownerStateByAvatar = Object.fromEntries(
  memberRows.map((item) => [item.avatar, item.meta === 'On-call' ? 'on-call' : 'default']),
)

const incidentRows = [
  incident('incident-okta-token-theft', 'Okta token replay from unmanaged device', 'Ongoing - Critical', 'Identity / Alexander', '2026-06-06T20:42:00Z', ['okta', 'token', 'identity', 'critical', 'unmanaged device']),
  incident('incident-aws-iam-spike', 'AWS IAM privilege escalation spike', 'Ongoing - High', 'Cloud / Pari', '2026-06-06T19:18:00Z', ['aws', 'iam', 'privilege escalation', 'cloud', 'high']),
  incident('incident-endpoint-beacon', 'Suspicious endpoint beacon on SOC-floor-macbook-07', 'Ongoing - Medium', 'Endpoint / Spencer', '2026-06-06T18:03:00Z', ['endpoint', 'beacon', 'macbook', 'edr', 'medium']),
  incident('incident-db-exfil', 'Database export volume anomaly', 'Resolved - High', 'Data / Kai', '2026-06-06T15:12:00Z', ['database', 'export', 'exfiltration', 'postgres', 'high']),
  incident('incident-vpn-bruteforce', 'VPN brute-force cluster from new ASN', 'Resolved - Medium', 'Network / Omar', '2026-06-06T12:27:00Z', ['vpn', 'brute force', 'asn', 'network']),
  incident('incident-slack-phish', 'Credential phishing link reported in Slack', 'Resolved - Medium', 'Triage / Jules', '2026-06-05T22:44:00Z', ['slack', 'phishing', 'credential', 'medium']),
  incident('incident-github-pat', 'GitHub personal access token exposed', 'Resolved - High', 'AppSec / Nora', '2026-06-05T17:09:00Z', ['github', 'token', 'pat', 'repository', 'high']),
  incident('incident-edr-disabled', 'EDR disabled on finance laptop', 'Resolved - High', 'Endpoint / Ana', '2026-06-05T09:36:00Z', ['edr', 'finance', 'laptop', 'high']),
  incident('incident-s3-policy', 'Public S3 bucket policy drift', 'Resolved - Medium', 'Cloud / Iris', '2026-06-04T21:20:00Z', ['s3', 'bucket', 'policy', 'aws', 'medium']),
  incident('incident-linux-ssh', 'Unusual SSH fan-out from bastion host', 'Resolved - Medium', 'Servers / Tom', '2026-06-04T13:51:00Z', ['ssh', 'linux', 'bastion', 'servers']),
  incident('incident-malware-doc', 'Malware attachment blocked in payroll inbox', 'Resolved - Low', 'Malware / Michelle', '2026-06-03T23:17:00Z', ['malware', 'payroll', 'email', 'attachment']),
  incident('incident-impossible-travel', 'Impossible travel alert for executive account', 'Resolved - Medium', 'Identity / Alexander', '2026-06-03T08:48:00Z', ['identity', 'impossible travel', 'executive']),
  incident('incident-cloudtrail-gap', 'CloudTrail delivery gap detected', 'Resolved - Low', 'Cloud / Pari', '2026-06-02T18:25:00Z', ['cloudtrail', 'logging', 'aws', 'gap']),
  incident('incident-runbook-drill', 'Runbook drill: ransomware containment', 'Resolved - Low', 'Automation / Dev', '2026-06-01T14:00:00Z', ['runbook', 'drill', 'ransomware', 'automation']),
]

const assetRows = [
  asset('open-workstation', "Harshit's workstation", 'Devices', 'Personal device', 'laptop', 'HB', ['harshit', 'workstation', 'personal', 'laptop', 'device'], true),
  asset('open-admin-ipad', 'exec-admin-ipad-02', 'Devices', 'Managed iPad', 'laptop', 'AC', ['ipad', 'executive', 'managed', 'device']),
  asset('open-yubikey-fleet', 'yubikey-fleet-policy', 'Devices', 'Hardware keys', 'tasks', 'NS', ['yubikey', 'mfa', 'hardware key']),
  asset('open-database', 'database-name', 'Servers', 'Postgres primary', 'server', 'HB', ['database', 'server', 'asset', 'data']),
  asset('open-auth-bastion', 'auth-bastion-use1-03', 'Servers', 'Linux bastion', 'server', 'TW', ['bastion', 'ssh', 'linux', 'server'], true),
  asset('open-payroll-api', 'payroll-api-prod-01', 'Servers', 'Production API', 'server', 'AB', ['payroll', 'api', 'server', 'prod']),
  asset('open-siem-indexer', 'siem-indexer-hot-12', 'Servers', 'Log indexer', 'server', 'OR', ['siem', 'logs', 'indexer', 'server']),
  asset('open-cloud-trail', 'aws-cloudtrail-prod', 'Cloud', 'AWS', 'server', 'PG', ['aws', 'cloudtrail', 'prod', 'cloud']),
  asset('open-s3-finance', 's3-finance-reports-prod', 'Cloud', 'AWS S3', 'server', 'IN', ['s3', 'finance', 'reports', 'aws', 'cloud'], true),
  asset('open-gcp-billing', 'gcp-billing-export', 'Cloud', 'GCP', 'server', 'IN', ['gcp', 'billing', 'cloud']),
  asset('open-azure-id', 'azure-id-sync-prod', 'Cloud', 'Azure AD', 'server', 'AC', ['azure', 'identity', 'cloud']),
  asset('open-endpoint-macbook', 'SOC-floor-macbook-07', 'Endpoints', 'Endpoint', 'laptop', 'SV', ['soc', 'floor', 'macbook', 'endpoint']),
  asset('open-finance-laptop', 'finance-laptop-31', 'Endpoints', 'Windows endpoint', 'laptop', 'AB', ['finance', 'windows', 'endpoint'], true),
  asset('open-build-runner', 'build-runner-macos-14', 'Endpoints', 'CI runner', 'laptop', 'DP', ['build', 'runner', 'macos', 'endpoint']),
  asset('open-vip-laptop', 'vip-laptop-05', 'Endpoints', 'Executive endpoint', 'laptop', 'JM', ['vip', 'executive', 'endpoint']),
]

const logRows = [
  log('log-okta-replay', 'Okta session replay signal', '2m ago', ['okta', 'session', 'identity', 'replay']),
  log('log-cloudtrail-policy', 'CloudTrail policy change recorded', '7m ago', ['cloudtrail', 'aws', 'policy', 'logs']),
  log('log-edr-beacon', 'EDR beacon confidence updated', '12m ago', ['edr', 'beacon', 'endpoint']),
  log('log-vpn-auth', 'VPN authentication failures grouped', '28m ago', ['vpn', 'auth', 'failed login']),
  log('log-s3-public', 'S3 public access block changed', '43m ago', ['s3', 'public', 'aws']),
  log('log-slack-report', 'Slack user report attached to case', '1h ago', ['slack', 'report', 'phishing']),
  log('log-db-export', 'Database export exceeded baseline', '2h ago', ['database', 'export', 'baseline']),
  log('log-runbook-step', 'Runbook step completed: isolate endpoint', '3h ago', ['runbook', 'isolate', 'endpoint']),
  log('log-yara-match', 'YARA match added to malware note', '5h ago', ['yara', 'malware', 'note']),
  log('log-github-token', 'GitHub token revoked by automation', '7h ago', ['github', 'token', 'automation']),
  log('log-bastion-ssh', 'Bastion SSH session archived', 'Yesterday', ['bastion', 'ssh', 'archive']),
  log('log-ticket-sync', 'Jira case sync completed', 'Yesterday', ['jira', 'case', 'sync']),
]

const allTabRows = {
  showLogs: {
    id: 'show-logs',
    tab: 'Logs',
    label: 'Logs',
    icon: 'tasks',
    keywords: ['logs', 'audit', 'events', 'activity'],
    actions: [
      { id: 'view', label: 'View', keys: ['Enter'], primary: true },
    ],
  },
}

export const ALL_COMMAND_SECTIONS = [
  {
    id: 'pinned',
    label: 'Pinned',
    items: [
      memberRows.find((item) => item.id === 'contact-harshit'),
      assetRows.find((item) => item.id === 'open-workstation'),
      allTabRows.showLogs,
    ].filter(Boolean),
  },
  {
    id: 'suggestions',
    label: 'Suggestions',
    items: [
      assetRows.find((item) => item.id === 'open-database'),
      assetRows.find((item) => item.id === 'open-cloud-trail'),
      assetRows.find((item) => item.id === 'open-endpoint-macbook'),
      {
        id: 'open-runbooks',
        tab: 'Incidents',
        label: 'Runbooks',
        meta: 'Response guide',
        icon: 'book',
        keywords: ['runbooks', 'response', 'playbook', 'guide'],
        actions: [
          { id: 'view', label: 'View', keys: ['Enter'], primary: true },
        ],
      },
    ].filter(Boolean),
  },
]

export const COMMAND_SECTIONS = [
  {
    id: 'on-call-members',
    label: 'On-call',
    items: memberRows.filter((item) => item.meta === 'On-call'),
  },
  {
    id: 'team-members',
    label: 'Team members',
    items: memberRows.filter((item) => item.subTab === 'Internal' && item.meta !== 'On-call'),
  },
  {
    id: 'external-members',
    label: 'External contacts',
    items: memberRows.filter((item) => item.subTab === 'External'),
  },
  {
    id: 'ongoing-incidents',
    label: 'Ongoing incidents',
    items: incidentRows.filter((item) => item.incidentState === 'ongoing'),
  },
  {
    id: 'recent-incidents',
    label: 'Recent incidents',
    items: incidentRows
      .filter((item) => item.incidentState !== 'ongoing')
      .sort((first, second) => second.occurredAt.localeCompare(first.occurredAt)),
  },
  {
    id: 'assets',
    label: 'Assets',
    items: assetRows,
  },
  {
    id: 'logs',
    label: 'Logs',
    items: logRows,
  },
  {
    id: 'response-actions',
    label: 'Response actions',
    items: [
      {
        id: 'open-runbooks-full',
        tab: 'Incidents',
        label: 'Runbooks',
        meta: 'Response guide',
        icon: 'book',
        keywords: ['runbooks', 'response', 'playbook', 'guide'],
        actions: [
          { id: 'view', label: 'View', keys: ['Enter'], primary: true },
        ],
      },
      {
        id: 'start-containment',
        tab: 'Incidents',
        label: 'Start endpoint containment runbook',
        meta: 'Automation',
        icon: 'tasks',
        keywords: ['containment', 'endpoint', 'automation', 'runbook'],
        actions: [
          { id: 'start', label: 'Start', keys: ['Enter'], primary: true },
        ],
      },
      {
        id: 'summarize-active-incidents',
        tab: 'Incidents',
        label: 'Summarize active incidents',
        meta: 'AI assist',
        icon: 'tasks',
        keywords: ['summary', 'active', 'incidents', 'ai'],
        actions: [
          { id: 'summary', label: 'Summary', keys: ['S'], primary: true },
        ],
      },
    ],
  },
]

export const COMMAND_ITEMS = COMMAND_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({ ...item, sectionId: section.id })),
)

function member(id, label, avatar, email, subTab, meta, extraKeywords = []) {
  return {
    id,
    tab: 'Members',
    subTab,
    label,
    meta,
    avatar,
    email,
    kind: 'member',
    keywords: [
      label,
      email,
      subTab,
      meta,
      'person',
      'member',
      ...extraKeywords,
    ].map((keyword) => keyword.toLowerCase()),
    actions: [
      { id: 'copy-email', label: 'Copy email', keys: ['Alt', 'C'], copyValue: email },
      { id: 'view', label: 'View', keys: ['Enter'], primary: true },
    ],
  }
}

function incident(id, label, meta, owner, occurredAt, extraKeywords = []) {
  const incidentState = meta.toLowerCase().startsWith('ongoing') ? 'ongoing' : 'resolved'

  return {
    id,
    tab: 'Incidents',
    label,
    meta,
    icon: 'tasks',
    kind: 'incident',
    owner,
    occurredAt,
    incidentState,
    keywords: [
      label,
      meta,
      owner,
      incidentState,
      'incident',
      'case',
      ...extraKeywords,
    ].map((keyword) => keyword.toLowerCase()),
    actions: [
      { id: 'copy-name', label: 'Copy name', keys: ['Alt', 'C'], copyValue: label },
      { id: 'assign', label: 'Assign', keys: ['A'] },
      { id: 'view', label: 'View', keys: ['Enter'], primary: true },
    ],
  }
}

function asset(id, label, subTab, meta, icon, ownerAvatar, extraKeywords = [], hasAlert = false) {
  return {
    id,
    tab: 'Assets',
    subTab,
    label,
    meta,
    icon,
    kind: 'asset',
    ownerAvatar,
    ownerState: ownerStateByAvatar[ownerAvatar],
    hasAlert,
    keywords: [
      label,
      subTab,
      meta,
      'asset',
      ...extraKeywords,
    ].map((keyword) => keyword.toLowerCase()),
    actions: [
      { id: 'copy-name', label: 'Copy name', keys: ['Alt', 'C'], copyValue: label },
      { id: 'owner', label: 'Owner', keys: ['Alt', 'O'] },
      { id: 'view', label: 'View', keys: ['Enter'], primary: true },
    ],
  }
}

function log(id, label, meta, extraKeywords = []) {
  return {
    id,
    tab: 'Logs',
    label,
    meta,
    icon: 'tasks',
    kind: 'log',
    keywords: [
      label,
      meta,
      'log',
      'event',
      'audit',
      ...extraKeywords,
    ].map((keyword) => keyword.toLowerCase()),
    actions: [
      { id: 'copy-name', label: 'Copy name', keys: ['Alt', 'C'], copyValue: label },
      { id: 'view', label: 'View', keys: ['Enter'], primary: true },
    ],
  }
}
