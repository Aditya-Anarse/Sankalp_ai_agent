export interface WorkflowStep {
  step: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  tag: string;
  iconName: string;
  deliverables: string[];
  systemMetric: string;
}

export interface Capability {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  gradient: string;
  highlights: string[];
  metrics: { label: string; value: string };
  badge: string;
}

export interface BusinessSegment {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  currentStruggle: string;
  sankalpSolution: string;
  keyFeature: string;
  activeAgents: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "01",
    title: "Research",
    shortDesc: "Continuous market radar & trend extraction.",
    fullDesc: "SANKALP monitors 40+ industry feeds, competitor accounts, viral formats, and audience sentiment to surface high-converting topics tailored to your exact niche.",
    tag: "Market Intelligence",
    iconName: "Compass",
    deliverables: ["Niche Trend Scorecards", "Competitor Gap Maps", "Audience Hook Bank"],
    systemMetric: "8,400+ signals parsed/hr",
  },
  {
    step: "02",
    title: "Strategy",
    shortDesc: "Translates business goals into weekly campaign architectures.",
    fullDesc: "Converts your revenue targets, product launches, or brand awareness goals into an adaptive content roadmap with calculated posting frequencies and formats.",
    tag: "Autonomous Planning",
    iconName: "Cpu",
    deliverables: ["Multi-week Editorial Calendar", "Pillar Balancing Matrix", "Format Allocation Plan"],
    systemMetric: "100% Goal-aligned pacing",
  },
  {
    step: "03",
    title: "Create",
    shortDesc: "High-retention copy, visual assets & story frameworks.",
    fullDesc: "Synthesizes multi-format posts including carousel scripts, short-form video hooks, rich captions, hashtag clusters, and on-brand visual prompt compositions.",
    tag: "Generative Studio",
    iconName: "Sparkles",
    deliverables: ["Visual Asset Packs", "Hook-optimized Scripts", "Platform-Native Copy"],
    systemMetric: "Multi-variant output",
  },
  {
    step: "04",
    title: "Quality Check",
    shortDesc: "Automated brand guideline & tone-of-voice validation.",
    fullDesc: "Evaluates every piece against your company's persona, legal compliance, banned phrases, typography standards, and quality benchmarks before it ever leaves the studio.",
    tag: "Guardrails & Compliance",
    iconName: "ShieldCheck",
    deliverables: ["Brand Voice Alignment Score", "Fact Check Verification", "Visual Contrast Audit"],
    systemMetric: "99.8% Brand fidelity",
  },
  {
    step: "05",
    title: "Publish",
    shortDesc: "Omnichannel deployment at algorithmically optimal peak hours.",
    fullDesc: "Dispatches approved assets across Instagram, LinkedIn, X, TikTok, and YouTube Shorts precisely when your specific target audience is most active and receptive.",
    tag: "Smart Dispatch",
    iconName: "Send",
    deliverables: ["Timezone Synchronization", "Auto-thread Generation", "Native Tagging"],
    systemMetric: "Sub-second sync",
  },
  {
    step: "06",
    title: "Analyze",
    shortDesc: "Engagement telemetry, retention metrics & conversion attribution.",
    fullDesc: "Captures second-by-second watch times, comment sentiment, click-through velocities, and bookmark ratios to reveal what truly resonates with your audience.",
    tag: "Deep Telemetry",
    iconName: "BarChart3",
    deliverables: ["Sentiment Heatmaps", "Cohort Retention Curves", "ROI Attribution Trees"],
    systemMetric: "Real-time stream",
  },
  {
    step: "07",
    title: "Learn",
    shortDesc: "Feedback loop parameter tuning & autonomous strategy refinement.",
    fullDesc: "Ingests performance signals to update future content weights, adjusting hook structures, tone nuances, and timing parameters for perpetual compounding growth.",
    tag: "Reinforcement Loop",
    iconName: "RefreshCw",
    deliverables: ["Model Memory Updates", "Prompt Optimization Delta", "Predictive Virality Tuning"],
    systemMetric: "Continuous self-evolution",
  },
];

export const CAPABILITIES: Capability[] = [
  {
    id: "research",
    num: "01",
    title: "RESEARCH",
    subtitle: "Autonomous Market & Competitor Intelligence",
    description: "Continuously scans industry trends, viral narrative patterns, and competitor engagement anomalies to identify high-potential content topics before they saturate.",
    iconName: "Search",
    gradient: "from-cyan-500/20 to-blue-600/20",
    highlights: ["40+ Data Stream Monitoring", "Competitor Sentiment Delta", "Niche Viral Vector Prediction"],
    metrics: { label: "Trend Discovery Lead Time", value: "3.4 Days Early" },
    badge: "Radar Engine",
  },
  {
    id: "strategy",
    num: "02",
    title: "STRATEGY",
    subtitle: "Objective-Driven Campaign Architecture",
    description: "Transforms your macro business objectives—like lead generation or e-commerce sales—into structured, multi-channel editorial calendars that keep audience engagement compounding.",
    iconName: "Target",
    gradient: "from-blue-500/20 to-indigo-600/20",
    highlights: ["Objective-to-Content Mapping", "Dynamic Frequency Tuning", "Audience Persona Segmenting"],
    metrics: { label: "Strategy Alignment", value: "99.4% Precision" },
    badge: "Campaign Cortex",
  },
  {
    id: "creative",
    num: "03",
    title: "CREATIVE",
    subtitle: "Brand-Grounded Multi-Modal Studio",
    description: "Generates high-retention hooks, compelling long-form captions, carousel outlines, video scripts, and visual direction tailored precisely to your brand's unique design language.",
    iconName: "Wand2",
    gradient: "from-indigo-500/20 to-purple-600/20",
    highlights: ["Brand Voice Replication", "Multi-Variant Visual Layouts", "High-Retention Hook Engineering"],
    metrics: { label: "Creative Output Velocity", value: "14x Faster" },
    badge: "Generative Core",
  },
  {
    id: "publisher",
    num: "04",
    title: "PUBLISHER",
    subtitle: "Precision Omnichannel Orchestration",
    description: "Coordinates automated, native publishing across Instagram, LinkedIn, X, TikTok, and YouTube Shorts, deploying content at dynamic peak algorithmic velocity windows.",
    iconName: "Layers",
    gradient: "from-purple-500/20 to-pink-600/20",
    highlights: ["Audience Heatmap Scheduling", "Platform-Specific Formatting", "Cross-Channel Coordinated Drops"],
    metrics: { label: "Dispatch Precision", value: "<100ms Window" },
    badge: "Sync Grid",
  },
  {
    id: "performance",
    num: "05",
    title: "PERFORMANCE",
    subtitle: "Granular Engagement & Attribution Telemetry",
    description: "Tracks granular interaction metrics beyond simple likes: comment sentiment, save rates, conversion paths, and audience retention decay curves across every published asset.",
    iconName: "Activity",
    gradient: "from-cyan-500/20 to-emerald-600/20",
    highlights: ["Sentiment Natural Language Processing", "Conversion Attribution Tracking", "Hook Drop-off Analytics"],
    metrics: { label: "Data Depth", value: "38 Telemetry Points" },
    badge: "Telemetry Hub",
  },
  {
    id: "learning",
    num: "06",
    title: "LEARNING",
    subtitle: "Reinforced Continuous Self-Improvement",
    description: "Every impression, comment, and conversion signal is fed back into SANKALP's memory mesh, continuously tuning future hooks, pacing, and topics for exponential organic growth.",
    iconName: "BrainCircuit",
    gradient: "from-violet-500/20 to-cyan-600/20",
    highlights: ["Reinforcement Learning from Feedback", "Adaptive Style Calibration", "Perpetual ROI Optimization"],
    metrics: { label: "Monthly Performance Uplift", value: "+32.8% MoM" },
    badge: "Neural Memory",
  },
];

export const BUSINESS_SEGMENTS: BusinessSegment[] = [
  {
    id: "local-shops",
    title: "Local Shops & Boutiques",
    subtitle: "High Street Retail & Experiences",
    description: "Keep neighborhood foot traffic bustling with daily local promotions, event highlights, and aesthetic product showcases without hiring an agency.",
    iconName: "Store",
    currentStruggle: "No time between customer service, inventory, and register to post consistently.",
    sankalpSolution: "Autonomous daily highlight reels, localized geotagged posts, and weekend sale countdowns.",
    keyFeature: "Geolocated Story & Post Automation",
    activeAgents: "2 Agents active",
  },
  {
    id: "small-businesses",
    title: "Small Businesses & Services",
    subtitle: "Agencies, Consultants & Clinics",
    description: "Establish authority in your field with educational carousels, client case studies, and thought leadership that convert passive browsers into booked consultations.",
    iconName: "Briefcase",
    currentStruggle: "Struggling to turn technical knowledge into accessible, engaging marketing content.",
    sankalpSolution: "Extracts your case studies and transforms them into high-authority LinkedIn and Instagram carousels.",
    keyFeature: "Authority & Case Study Synthesis",
    activeAgents: "3 Agents active",
  },
  {
    id: "startups",
    title: "Venture & Tech Startups",
    subtitle: "SaaS, AI & High-Growth Apps",
    description: "Ship aggressive product updates, feature breakdowns, launch hype campaigns, and founder narratives to dominate tech circles on X and LinkedIn.",
    iconName: "Rocket",
    currentStruggle: "Engineering and product teams move fast, but social marketing lags weeks behind.",
    sankalpSolution: "Syncs directly with product changelogs to spin up instant launch graphics, threads, and demos.",
    keyFeature: "Changelog-to-Campaign Pipeline",
    activeAgents: "4 Agents active",
  },
  {
    id: "local-brands",
    title: "Direct-to-Consumer Brands",
    subtitle: "Apparel, Wellness & Packaged Goods",
    description: "Maintain an irresistible aesthetic feed with UGC curation, aesthetic product mockups, and lifestyle narrative storytelling that drives recurring cart checkouts.",
    iconName: "Sparkle",
    currentStruggle: "High agency retainers eating into e-commerce margins.",
    sankalpSolution: "24/7 autonomous brand narrative creation with aesthetic visual consistency.",
    keyFeature: "Brand Aesthetic Enforcement",
    activeAgents: "3 Agents active",
  },
  {
    id: "creators",
    title: "Solopreneurs & Creators",
    subtitle: "Educators, Writers & Coaches",
    description: "Turn your single long-form podcast, video, or newsletter into 20+ viral atomic posts, threads, and clips across all major networks simultaneously.",
    iconName: "UserCheck",
    currentStruggle: "Creative burnout from manual distribution and re-formatting across multiple platforms.",
    sankalpSolution: "Autonomous 1-to-Many content repurposing with voice fidelity preservation.",
    keyFeature: "Multi-Platform Atomization",
    activeAgents: "2 Agents active",
  },
  {
    id: "marketing-teams",
    title: "Lean Marketing Teams",
    subtitle: "Scale-ups & In-House Departments",
    description: "Multiply your team's output 10x by delegating daily execution, scheduling, QA, and metric reporting to SANKALP while your team focuses on macro strategy.",
    iconName: "Users",
    currentStruggle: "Senior marketers bogged down by repetitive daily posting schedules and copy tweaks.",
    sankalpSolution: "Acts as a dedicated Tier-1 AI marketing executive that executes the roadmap autonomously.",
    keyFeature: "Full-Funnel Team Co-Pilot",
    activeAgents: "6 Agents active",
  },
];

export const MOCK_AGENT_LOGS = [
  { time: "10:42:01", tag: "RESEARCH", message: "Discovered surging engagement pattern in #SustainableLiving (+240% velocity over 12h)." },
  { time: "10:42:15", tag: "STRATEGY", message: "Mapped trend to Q4 Organic Silk line; generated 3 variant narrative angles." },
  { time: "10:42:29", tag: "CREATIVE", message: "Synthesized carousel slides + high-hook opening: 'Why 82% of shoppers switched fabrics in 2026'." },
  { time: "10:42:44", tag: "QA AUDIT", message: "Tone checked against Brand Constitution (Fidelity score: 99.4%). Zero banned keywords detected." },
  { time: "10:43:02", tag: "SCHEDULER", message: "Queued Instagram Carousel & LinkedIn PDF for optimal release window at 18:30 EST." },
  { time: "10:43:18", tag: "MEMORY", message: "Updated feedback loop weights: visual carousels displaying 1.8x longer retention in cohort." }
];

export const MOCK_DASHBOARD_METRICS = {
  totalReach: "248.6K",
  reachDelta: "+34.2%",
  avgEngagement: "6.84%",
  engagementDelta: "+1.9%",
  postsAutomated: "42",
  brandConsistency: "99.2%",
  activeCampaigns: [
    { name: "Spring Minimalist Collection", channel: "Instagram", status: "Active", reach: "84.2K", score: "98%" },
    { name: "Founder Engineering Insights", channel: "LinkedIn", status: "Active", reach: "61.9K", score: "99%" },
    { name: "Daily Product Drops & Teasers", channel: "X / Twitter", status: "Active", reach: "102.5K", score: "97%" },
  ],
  upcomingQueue: [
    { title: "The Architecture of Clean Aesthetics", time: "Today, 18:30", type: "Carousel", status: "Ready", platform: "Instagram" },
    { title: "Autonomous Systems in Retail (Deep Dive)", time: "Tomorrow, 09:15", type: "Article / PDF", status: "Approved", platform: "LinkedIn" },
    { title: "Behind The Scenes: Material Sourcing", time: "Tomorrow, 14:00", type: "Short / Reel", status: "Rendering", platform: "TikTok" },
  ]
};
