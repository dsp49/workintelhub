# Generate 100 SEO Pages — Full Topical Authority Pipeline

You are executing the **eMonitor Topical Authority Pipeline** — a multi-phase content generation system that produces 100 unique, traffic-driving, conversion-targeted HTML pages for the employee monitoring software niche.

**This is a long-running task.** You will use the Agent tool extensively to parallelize work. Every topic is discovered through LIVE, open-ended competitive research — no hardcoded keyword lists, no fixed competitor rosters.

$ARGUMENTS — optional: a number (e.g., `50`) to override the default 100-page target, or `resume` to continue a previous run.

---

## PHASE 0: SETUP & CONTEXT LOADING

### Step 0.1: Create output directories
```
agents/topical-authority/output/
agents/topical-authority/output/research/
agents/topical-authority/output/topical-map/
agents/topical-authority/output/pages/
agents/topical-authority/output/pages/blog/
agents/topical-authority/output/pages/features/
agents/topical-authority/output/pages/use-cases/
agents/topical-authority/output/pages/compare/
agents/topical-authority/output/pages/resources/
agents/topical-authority/output/pages/tools/
agents/topical-authority/output/pages/compliance/
agents/topical-authority/output/pages/industries/
```

### Step 0.2: Audit existing site
Use Glob to find ALL existing `.html` files in the repo root and subdirectories. Build a complete list of:
- Every existing page URL and its topic
- Every existing H1 and primary keyword
This is the **DO NOT DUPLICATE** list.

### Step 0.3: Load manifest (cross-run deduplication)
Read `agents/topical-authority/output/manifest.json` if it exists. This tracks:
- `all_generated_slugs` — topics from ALL previous runs (NEVER regenerate these)
- `explored_searches` — search queries already used in research (NEVER repeat these)
- `explored_competitors` — competitor domains already deeply audited
- `explored_niches` — adjacent niches already mined for ideas
- `run_count` — how many times this pipeline has run before

The manifest drives **research diversification**: each run MUST explore NEW territory.

### Step 0.4: Read HTML template
Read `features/time-tracking.html` and `blog/how-to-increase-employee-productivity.html` to extract the exact HTML template (header, nav, footer, CSS links, schema patterns).

---

## PHASE 1: OPEN-ENDED MARKET DISCOVERY

This is the most critical phase. The research is **exploratory, not scripted**. Each run discovers different opportunities by searching different corners of the niche.

### Research Diversification Strategy

The manifest tells you what's been explored before. Use this to chart NEW research territory:

**Run 1 (no manifest):** Start with the core — direct competitors, primary keywords, obvious gaps.

**Run 2+ (manifest exists):** The obvious stuff is done. Now go deeper:
- Find competitors you haven't audited yet (search "employee monitoring software" and look past page 1)
- Explore adjacent niches: HR tech, workforce management, insider threat, DLP, project management, payroll, compliance automation
- Mine new geographies: employee monitoring laws in countries you haven't covered
- Find new industries: verticals you haven't targeted
- Discover trending topics: AI in workplace, new regulations, remote work evolution, Gen Z workforce expectations
- Look at what content aggregators (G2, Capterra, GetApp, TrustRadius, Software Advice) are publishing — they reveal buyer search patterns
- Check Reddit, Quora, LinkedIn for real questions people ask about employee monitoring
- Explore the "People Also Ask" and related searches for queries you haven't tried
- Find influencers, thought leaders, podcasts in the space — what topics are they covering?
- Look at job postings for "employee monitoring" roles — what problems do companies describe?
- Check government/regulatory sites for new compliance requirements

### Spawn 5 Research Agents in Parallel

**Agent 1: Competitive Landscape Discovery**
```
Spawn Agent (subagent_type: "Competitive SEO Analyst"):

You are a competitive intelligence researcher for eMonitor (employee-monitoring.net) in the employee monitoring software space.

YOUR GOAL: Find content opportunities by studying what competitors and adjacent players are doing.

PREVIOUSLY EXPLORED COMPETITORS (from manifest — do NOT re-audit these in depth):
[Insert explored_competitors from manifest, or "None — this is the first run" if no manifest]

RESEARCH APPROACH — be exploratory, not scripted:

1. START with broad discovery searches using WebSearch:
   - "employee monitoring software" — who ranks? Find sites you haven't seen before
   - "best employee monitoring tools [current year]" — what listicles exist? What tools are featured?
   - "workforce analytics platform" — adjacent positioning, who plays here?
   - "insider threat detection software" — overlapping niche, what content exists?
   - "remote work management tools" — broader category, who's creating content?

2. For EVERY new domain you discover that creates content in this space:
   - Use WebFetch to check their sitemap.xml or /blog/ page
   - Note what topics they cover that eMonitor doesn't
   - Note their content formats (calculators, templates, tools, courses, webinars, glossaries)
   - Identify their most creative/unique content pieces

3. DIVE INTO content aggregator platforms:
   - Search for "employee monitoring" on G2, Capterra, GetApp
   - What categories do they use? What comparison pages exist?
   - What buyer questions appear in reviews?
   - What alternative groupings do they create? (by company size, industry, feature)

4. EXPLORE adjacent niches for crossover content opportunities:
   - "data loss prevention software" — DLP is part of eMonitor's offering
   - "employee engagement software" — monitoring + engagement overlap
   - "workforce planning software" — analytics overlap
   - "project time tracking" — time tracking overlap
   - "compliance management software" — compliance overlap
   - "cybersecurity employee training" — insider threat overlap
   - "HR analytics tools" — workforce intelligence overlap

5. Find REAL QUESTIONS people ask:
   - Search Reddit: "employee monitoring" site:reddit.com
   - Search Quora: "employee monitoring" site:quora.com
   - Check Google's "People Also Ask" for your searches
   - Look at forum discussions, LinkedIn posts

6. TREND HUNTING:
   - "[current year] workplace trends employee monitoring"
   - "AI employee monitoring"
   - "new employee monitoring regulations [current year]"
   - "employee monitoring [recent event/trend]"
   - "hybrid work monitoring challenges [current year]"

OUTPUT — Write to agents/topical-authority/output/research/competitor-discovery.json:
{
  "newly_discovered_competitors": [
    {"domain":"","name":"","positioning":"","unique_content":[],"content_volume_estimate":0}
  ],
  "adjacent_niche_players": [
    {"domain":"","niche":"","crossover_topics":[]}
  ],
  "content_formats_seen": ["calculator","template","glossary","course","webinar","tool","quiz","assessment","checklist","infographic","video series","podcast","ebook","whitepaper"],
  "all_topics_discovered": [
    {"topic":"","found_on":"domain","content_type":"","our_coverage":"none|thin|adequate","opportunity":"description"}
  ],
  "real_questions_from_forums": [
    {"question":"","source":"reddit|quora|linkedin|forum","upvotes_or_engagement":"","topic_cluster":""}
  ],
  "trending_topics": [
    {"topic":"","evidence":"where you found it","timeliness":"evergreen|trending|seasonal"}
  ],
  "searches_performed": ["list every search query you used — these go into the manifest"]
}
```

**Agent 2: SERP & Intent Exploration**
```
Spawn Agent (subagent_type: "Content & Keyword Strategist"):

You are an SEO researcher finding high-value search opportunities for eMonitor (employee-monitoring.net).

YOUR GOAL: Discover keywords and search intents that represent REAL traffic opportunities. Do NOT use a fixed keyword list — explore dynamically.

PREVIOUSLY EXPLORED SEARCHES (from manifest — use DIFFERENT queries):
[Insert explored_searches from manifest, or "None — this is the first run" if no manifest]

RESEARCH APPROACH — start broad, follow the trail:

1. SEED EXPLORATION — Run 15-20 broad WebSearches and analyze what appears:
   Pick from these CATEGORIES (vary each run, don't repeat manifest queries):
   
   Category A: Buyer-intent variations
   - Try different phrasings: "software to monitor employees", "track employee computer usage", "see what employees do on computer", "monitor staff productivity"
   - Try different modifiers: "free", "open source", "enterprise", "small business", "cheap", "affordable", "[year]"
   - Try question formats: "how to track", "what is the best", "which tool", "how much does"
   
   Category B: Problem-first searches
   - "employees wasting time at work solution", "reduce payroll fraud", "stop time theft at work", "employees lying about hours worked"
   - "remote workers not productive", "how to know if remote employees are working", "proof of work remote employees"
   - "employee data theft prevention", "stop employees stealing company data"
   
   Category C: Role-based searches
   - "HR tools for remote teams", "manager tools employee productivity", "CEO dashboard employee performance"
   - "IT admin monitor network usage", "compliance officer employee audit tools"
   
   Category D: Event-driven / seasonal
   - "return to office monitoring", "layoff workforce planning tools", "new hire onboarding monitoring"
   - "tax season time tracking", "audit preparation employee records", "year-end productivity review"
   
   Category E: Comparison & alternatives (discover NEW ones)
   - Don't just search known competitors — find NEW tools being compared
   - "[any tool you discover] vs [any other tool]", "[new tool] alternative", "[new tool] review"
   
   Category F: Industry + compliance deep dives
   - Search for industries you haven't covered: legal, accounting, architecture, real estate, insurance, logistics, telecom, energy, pharma, non-profit, education
   - Search for regulations you haven't covered: state-specific laws, EU countries, APAC privacy laws, sector-specific compliance
   
   Category G: Content format opportunities
   - "employee monitoring policy template", "remote work agreement template", "BYOD policy template"
   - "employee monitoring checklist", "productivity audit checklist"
   - "time tracking spreadsheet", "employee schedule template"
   - "employee monitoring infographic", "productivity statistics infographic"

2. For EACH search, note:
   - Top 5 results: domain, title, estimated word count, content format
   - SERP features present: featured snippets, PAA (list the PAA questions!), FAQ rich results, video, images
   - The PAA questions are GOLD — each one is a potential page topic
   - "Related searches" at the bottom — each one is a keyword opportunity
   - Content gaps: queries where results are thin, outdated, or generic

3. FOLLOW THE TRAIL — When you find a promising area:
   - Click into PAA questions mentally and note what they lead to
   - Search for the related searches to find deeper long-tail opportunities
   - Look for underserved intents: many searches return blog posts when someone wants a tool, or vice versa

OUTPUT — Write to agents/topical-authority/output/research/serp-discovery.json:
{
  "search_sessions": [
    {
      "query": "",
      "category": "",
      "top_results": [{"position":1,"domain":"","title":"","content_type":"","word_count_estimate":0}],
      "serp_features": [],
      "paa_questions": ["every People Also Ask question you see"],
      "related_searches": ["every related search at bottom"],
      "opportunity_assessment": "description of the opportunity",
      "gap_found": "what's missing from current results"
    }
  ],
  "keyword_opportunities": [
    {
      "keyword": "",
      "discovery_path": "how you found it (PAA from X, related search from Y, forum question, etc.)",
      "intent": "informational|commercial|transactional",
      "funnel_stage": "TOFU|MOFU|BOFU",
      "difficulty_estimate": "easy|medium|hard",
      "content_format": "blog|feature|comparison|resource|tool|template|calculator|guide|checklist",
      "why_valuable": "specific reasoning",
      "existing_coverage_quality": "poor|thin|decent|strong"
    }
  ],
  "paa_goldmine": ["every unique PAA question found across all searches — deduplicated"],
  "searches_performed": ["list every query — these go into manifest"]
}
```

**Agent 3: Audience & Intent Mining**
```
Spawn Agent (subagent_type: "Conversion Rate Optimizer"):

You are researching REAL buyer questions, pain points, and decision criteria for employee monitoring software.

YOUR GOAL: Find content topics that match ACTUAL buyer intent — not just keywords, but the real questions and anxieties people have when evaluating employee monitoring.

RESEARCH APPROACH:

1. BUYER JOURNEY RESEARCH:
   Use WebSearch to find:
   
   AWARENESS STAGE:
   - "do I need employee monitoring software", "signs you need employee monitoring"
   - "employee monitoring pros and cons", "is employee monitoring worth it"
   - "employee monitoring controversy", "employee monitoring ethical concerns"
   - Search for news articles about employee monitoring — what angles do journalists cover?
   
   CONSIDERATION STAGE:
   - "how to evaluate employee monitoring software", "employee monitoring software features to look for"
   - "employee monitoring software requirements", "RFP template employee monitoring"
   - "employee monitoring software demo questions", "questions to ask employee monitoring vendor"
   - "employee monitoring implementation checklist", "employee monitoring rollout plan"
   
   DECISION STAGE:
   - "employee monitoring software pricing comparison", "employee monitoring software ROI"
   - "employee monitoring software reviews [year]", "employee monitoring software ratings"
   - "switch from [tool] to [tool]", "migrate employee monitoring tool"
   - "employee monitoring free trial", "employee monitoring pilot program"
   
   POST-PURCHASE:
   - "employee monitoring software setup guide", "employee monitoring software training"
   - "employee monitoring software not working", "employee monitoring software best practices after install"
   - "how to communicate employee monitoring to employees", "employee monitoring announcement template"
   - "employee monitoring software reporting dashboard tips"

2. PERSONA-BASED RESEARCH:
   Search for content targeting different buyer personas:
   - IT Director/CTO: security, integration, deployment, compliance
   - HR Director/CHRO: employee relations, legal, culture, engagement
   - CEO/COO: ROI, productivity, cost savings, strategic visibility
   - Operations Manager: workflow efficiency, accountability, team management
   - Compliance Officer: regulations, audit trails, data protection
   - Team Lead: day-to-day management, remote team coordination
   - Finance/CFP: cost justification, billing, payroll integration
   
   For each persona, search: "[persona] employee monitoring concerns", "[persona] workforce management needs"

3. OBJECTION & CONCERN MINING:
   Search for the fears and objections:
   - "employee monitoring privacy concerns", "employees hate monitoring software"
   - "employee monitoring reduces trust", "employee monitoring backfire"
   - "employee monitoring lawsuit", "employee monitoring legal risks"
   - "employee monitoring morale impact", "employee monitoring turnover"
   - What negative reviews say about monitoring tools (search G2, Capterra reviews)

4. USE CASE DEEP DIVES:
   Search for specific workplace scenarios:
   - "monitoring employees on personal devices", "BYOD monitoring policy"
   - "monitoring employees across time zones", "international remote team monitoring"
   - "monitoring contract workers vs full-time", "1099 contractor monitoring"
   - "monitoring during probation period", "new hire monitoring first 90 days"
   - "monitoring executive employees", "C-suite productivity tracking"
   - "monitoring creative teams", "monitoring developers productivity"
   - "monitoring sales team activity", "sales team productivity tracking"

5. SEASONAL & EVENT-DRIVEN OPPORTUNITIES:
   Search for time-sensitive content:
   - "employee monitoring trends [current year]"
   - "workplace technology predictions [current year]"
   - "new labor laws [current year] employee monitoring"
   - "remote work statistics [current year]"
   - "employee productivity benchmarks [current year]"

OUTPUT — Write to agents/topical-authority/output/research/audience-intent.json:
{
  "buyer_journey_topics": {
    "awareness": [{"topic":"","search_evidence":"","content_angle":""}],
    "consideration": [{"topic":"","search_evidence":"","content_angle":""}],
    "decision": [{"topic":"","search_evidence":"","content_angle":""}],
    "post_purchase": [{"topic":"","search_evidence":"","content_angle":""}]
  },
  "persona_topics": {
    "it_director": [{"topic":"","pain_point":"","content_type":""}],
    "hr_director": [],
    "ceo_coo": [],
    "ops_manager": [],
    "compliance_officer": [],
    "team_lead": [],
    "finance": []
  },
  "objection_content_opportunities": [
    {"objection":"","search_evidence":"","content_that_addresses_it":"","angle":""}
  ],
  "use_case_opportunities": [
    {"scenario":"","search_evidence":"","content_type":"","keyword":""}
  ],
  "seasonal_opportunities": [
    {"topic":"","timeliness":"","peak_period":"","content_type":""}
  ],
  "searches_performed": ["every query used"]
}
```

**Agent 4: Adjacent Niche & Content Format Discovery**
```
Spawn Agent (subagent_type: "SERP & Distribution SEO Strategist"):

You are exploring ADJACENT NICHES and CREATIVE CONTENT FORMATS to find untapped traffic sources for eMonitor.

YOUR GOAL: Find traffic that competitors in the employee monitoring space are NOT capturing — by looking at neighboring topics, creative content formats, and unconventional angles.

PREVIOUSLY EXPLORED NICHES (from manifest — find NEW ones):
[Insert explored_niches from manifest, or "None — first run" if no manifest]

RESEARCH APPROACH:

1. ADJACENT NICHE CONTENT MINING:
   Employee monitoring touches many adjacent spaces. For each, search for what content exists and where eMonitor could contribute:
   
   - HR Technology & People Analytics: "people analytics tools", "HR dashboard", "employee experience platform"
   - Cybersecurity & Insider Threat: "insider threat program", "data exfiltration prevention", "endpoint security monitoring"
   - Remote Work & Digital Workplace: "digital workplace tools", "virtual office software", "remote team culture"
   - Workforce Management & Planning: "workforce optimization", "capacity planning tools", "resource allocation software"
   - Time & Attendance: "biometric attendance system", "clock in clock out software", "shift management"
   - Project Management & Billing: "project profitability tracking", "billable hours software", "client billing automation"
   - Legal & Compliance Tech: "compliance automation", "audit trail software", "regulatory technology"
   - Business Process Outsourcing: "BPO management tools", "outsourcing productivity metrics", "nearshore team management"
   - Field Service Management: "field service monitoring", "fleet management", "mobile workforce tracking"
   
   For each niche: What topics exist? What content formats work? Where does eMonitor naturally fit in?

2. CONTENT FORMAT INNOVATION:
   Search for interactive and high-engagement content formats in this space:
   - Calculators: ROI calculators, cost calculators, productivity calculators, savings estimators
   - Templates: policy templates, agreement templates, checklist templates, spreadsheet templates
   - Assessments/Quizzes: "is your team productive assessment", "remote work readiness quiz", "monitoring maturity assessment"
   - Comparison tools: interactive feature comparisons, pricing comparisons
   - Glossaries: employee monitoring glossary, HR tech glossary, compliance terminology
   - Statistics pages: "[topic] statistics [year]", data roundups, benchmark reports
   - Case study angles: industry-specific results, before/after stories
   - Infographic topics: complex data that visualizes well
   - Video content opportunities: tutorials, demos, explanations
   
   Search for: "[format] employee monitoring", "[format] workforce management", "[format] HR technology"

3. GEOGRAPHIC & REGULATORY EXPANSION:
   Search for monitoring laws and workplace regulations in countries/regions not yet covered:
   - Asia-Pacific: Japan, South Korea, Singapore, Philippines, Malaysia, Indonesia, Thailand, Vietnam
   - Middle East: UAE, Saudi Arabia, Israel, Qatar
   - Latin America: Brazil, Mexico, Argentina, Colombia, Chile
   - Africa: South Africa, Nigeria, Kenya, Egypt
   - Europe specifics: France, Italy, Spain, Netherlands, Poland, Sweden, Norway, Denmark, Switzerland
   - US State-specific: states with unique monitoring laws
   
   For each: Search "[country] employee monitoring law", "[country] workplace privacy regulation"

4. EMERGING TREND DISCOVERY:
   Search for what's NEW and CHANGING:
   - "AI workplace monitoring [current year]"
   - "employee monitoring after COVID evolution"
   - "Gen Z workplace monitoring expectations"
   - "four day work week monitoring"
   - "employee monitoring mental health"
   - "productivity paranoia" (a trending concept)
   - "quiet quitting detection"
   - "employee monitoring and unions [current year]"
   - "EU AI Act workplace implications"
   - "employee monitoring and DEI"
   - "neurodivergent employees monitoring considerations"
   - "environmental social governance employee monitoring"

5. LINK-WORTHY CONTENT DISCOVERY:
   Search for what types of content in this space attract backlinks:
   - "employee monitoring statistics" — data pages attract citations
   - "employee monitoring survey results" — original research gets linked
   - "workplace productivity report [year]" — annual reports attract media
   - "employee monitoring infographic" — visual content gets shared
   
   What data could eMonitor compile into a link-magnet page?

OUTPUT — Write to agents/topical-authority/output/research/niche-expansion.json:
{
  "adjacent_niche_opportunities": [
    {"niche":"","crossover_topic":"","content_angle":"","keyword":"","eMonitor_fit":"how eMonitor naturally connects"}
  ],
  "content_format_opportunities": [
    {"format":"","topic":"","keyword":"","search_evidence":"","why_valuable":""}
  ],
  "geographic_opportunities": [
    {"country_region":"","topic":"","regulation":"","content_type":"","keyword":""}
  ],
  "trending_topics": [
    {"topic":"","evidence":"","timeliness":"","content_angle":"","keyword":""}
  ],
  "linkworthy_content_ideas": [
    {"idea":"","format":"","why_linkable":"","keyword":""}
  ],
  "niches_explored": ["list of adjacent niches searched — goes into manifest"],
  "searches_performed": ["every query used"]
}
```

**Agent 5: eMonitor Gap Analysis**
```
Spawn Agent (subagent_type: "Explore"):

Thoroughly audit the existing eMonitor site at c:/Repos/Emonitor/TC.eMonitor/

For EVERY .html file in the repo (root, features/, use-cases/, blog/, resources/, compare/):
1. Read the file
2. Extract: URL (from canonical tag), title, H1, meta description, word count (body content only), internal link count, schema types, FAQ count
3. Rate content depth: thin (<1000w) | basic (1000-1500) | adequate (1500-2500) | comprehensive (2500-3500) | definitive (3500+)

Also read sitemap.xml for the full URL list.

OUTPUT — Write to agents/topical-authority/output/research/emonitor-audit.json:
{
  "existing_pages": [
    {"file_path":"","url":"","title":"","h1":"","word_count":0,"content_depth":"","content_type":""}
  ],
  "total_pages": 0,
  "depth_distribution": {"thin":0,"basic":0,"adequate":0,"comprehensive":0,"definitive":0},
  "topics_covered": ["deduplicated list of topics already covered"],
  "thin_pages_needing_expansion": ["urls"]
}
```

**WAIT for ALL 5 research agents to complete before Phase 2.**

---

## PHASE 2: TOPICAL MAP CONSTRUCTION

Read ALL research output files:
- `agents/topical-authority/output/research/competitor-discovery.json`
- `agents/topical-authority/output/research/serp-discovery.json`
- `agents/topical-authority/output/research/audience-intent.json`
- `agents/topical-authority/output/research/niche-expansion.json`
- `agents/topical-authority/output/research/emonitor-audit.json`
- `agents/topical-authority/output/manifest.json` (if exists)

Now spawn the **Topical Map Builder**:

```
Spawn Agent (subagent_type: "Content & Keyword Strategist"):

You are building a topical map of 100 NEW pages for eMonitor (employee-monitoring.net) to dominate the employee monitoring space.

READ ALL RESEARCH FILES FIRST (listed above). These contain LIVE market intelligence — real opportunities discovered through actual web research.

ALSO READ the manifest (if exists) — every slug in `all_generated_slugs` is OFF LIMITS.

EXISTING SITE PAGES (from emonitor-audit.json) — do NOT duplicate these.

YOUR TASK: Synthesize ALL research into EXACTLY 100 new page topics.

## TOPIC SELECTION PRINCIPLES:

1. **Traffic-first**: Every page must target a keyword/query that real people are searching for. The research files provide evidence of search demand — use it.

2. **Conversion-aware**: Mix the funnel stages:
   - ~20-25% BOFU (comparison pages, feature pages, alternatives, pricing — these convert)
   - ~35-40% MOFU (use-case pages, solution pages, how-to guides, industry pages — these nurture)
   - ~35-40% TOFU (educational guides, statistics, templates, compliance guides — these attract)

3. **Topical authority**: Pages should cluster around semantic themes. Don't scatter randomly — build depth in topic areas. Each page should strengthen the overall semantic web.

4. **Diversity**: Include a MIX of content types and formats:
   - Blog posts (comprehensive guides EG 2500-4000w, cluster posts CB 800-1800w)
   - Feature deep-dives (1500-2500w)
   - Use-case/solution pages (2000-3000w)
   - Comparison & alternatives pages (2000-3500w)
   - Compliance/legal guides (2500-4000w)
   - Resource/statistics pages (2500-4000w)
   - Calculator/tool pages (1500-2500w)
   - Template/checklist pages (1500-2500w)
   - Industry-specific pages (2000-3000w)
   - Glossary/definition pages (800-1500w)
   
5. **Uniqueness**: Every topic must be meaningfully different from:
   - All existing eMonitor pages
   - All previously generated pages (manifest)
   - Each other (no two pages in this batch should cannibalize)

6. **Real angles**: Each topic needs a SPECIFIC angle/hook that differentiates it from generic content. Use the research to find what's MISSING from existing search results — that's your angle.

7. **Link to research evidence**: For each topic, note WHERE in the research you found the opportunity (which competitor gap, which PAA question, which forum thread, which SERP gap).

## OUTPUT FORMAT:

For EACH of the 100 pages:
{
  "id": 1,
  "topic": "Human readable topic",
  "slug": "url-slug",
  "directory": "blog|features|use-cases|compare|resources|tools|compliance|industries",
  "url": "/directory/slug",
  "page_type": "blog-eg|blog-cb|feature|solution|comparison|alternatives|listicle|calculator|template|glossary|statistics|compliance-guide|resource-guide|industry-page",
  "writer_agent": "01-blog-writer|02-feature-page-writer|03-solution-page-writer|04-comparison-page-writer|05-alternatives-writer|06-product-comparison-list-writer|07-calculator-page-writer",
  "primary_keyword": "",
  "secondary_keywords": ["kw1","kw2","kw3"],
  "search_intent": "informational|commercial|transactional",
  "funnel_stage": "TOFU|MOFU|BOFU",
  "word_count_target": 2500,
  "entity_definition": "[Entity] is [category] that [function] for [audience].",
  "h1": "Proposed H1",
  "meta_title": "Title under 60 chars | eMonitor",
  "meta_description": "155 char meta description with primary keyword",
  "pillar_parent": "/url-of-parent-hub-page",
  "links_to": ["/existing/page1", "/new/page2", "/new/page3"],
  "links_from": ["/existing/page3", "/new/page4"],
  "faq_seed_questions": ["Q1?","Q2?","Q3?","Q4?","Q5?"],
  "schema_types": ["FAQPage","BreadcrumbList","Article"],
  "research_evidence": "WHERE in the research this opportunity was found",
  "content_angle": "what makes our take DIFFERENT from existing search results",
  "competitor_gap": "what the best current result is missing",
  "priority": "P0|P1|P2|P3"
}

Write the complete map to: agents/topical-authority/output/topical-map/topical-map.json
Write a human-readable summary to: agents/topical-authority/output/topical-map/topical-map-summary.md

The summary should include:
- Coverage by content type
- Coverage by funnel stage
- Coverage by directory
- Semantic clusters formed
- Top 10 highest-priority opportunities with reasoning
```

**Wait for topical map to complete before Phase 3.**

---

## PHASE 3: CONTENT PRODUCTION (Batched Parallel Agents)

Read the topical map from `agents/topical-authority/output/topical-map/topical-map.json`.

### Batch Strategy
- Process in batches of **5 parallel agents**
- Each agent writes **1 complete HTML page**
- 20 batches to produce 100 pages
- Track progress after each batch

### For EACH page, spawn a writer Agent:

```
Spawn Agent (subagent_type: "SEO Content Engine"):

You are writing a production-ready HTML page for eMonitor (employee-monitoring.net).

## REFERENCE DOCUMENTS — Read these FIRST:
1. agents/reference/brand-guide.md — Brand voice (use "eMonitor" as brand, NOT "Time Champ")
2. agents/reference/seo-writing-rules.md — Semantic SEO writing framework (Koray Gubur method)
3. agents/reference/product-knowledge.md — Product features (use eMonitor branding, $2.50/user pricing)
4. agents/reference/internal-links.md — Internal link URLs (adapt timechamp.io → employee-monitoring.net)

## BRAND MAPPING (CRITICAL):
Reference docs say "Time Champ" — you MUST replace everywhere:
- "Time Champ" → "eMonitor"
- "timechamp.io" → "employee-monitoring.net"
- Keep all features, pricing ($2.50/user), and capabilities the same

## HTML TEMPLATE:
Read features/time-tracking.html for the exact template. Match:
- DOCTYPE, head structure, meta tags, OG tags
- Header/nav (correct relative paths based on directory depth)
- Breadcrumb pattern
- Footer
- JSON-LD structured data (WebPage + BreadcrumbList + FAQPage + page-type-specific schema)

## YOUR ASSIGNMENT:
[Insert the specific page object from topical map here]

## WRITING RULES:
1. Entity definition in first 100 words: "[Entity] is [category] that [function] for [audience]."
2. Inquisitive semantics on every major H2: Declaration → Question → Answer (40-60 words)
3. US English throughout
4. NO AI cliche words: unlock, harness, elevate, seamlessly, cutting-edge, game-changer, revolutionize, empower, leverage, streamline, delve, robust, holistic, tapestry, beacon, orchestrate, reimagine, spearhead, foster, pivotal
5. NO surveillance language: spy, surveil, snoop, watch over, Big Brother
6. Active voice in hero section (mandatory), preferred everywhere
7. Specific stats with source attribution (at least 3 per page, use real sources)
8. Primary keyword in: H1, first 100 words, 2+ H2s, meta description, conclusion
9. FAQ section: 10+ questions, 40-60 word answers, entity in first sentence of each
10. Internal links: 5-10 contextual links to existing eMonitor pages
11. Word count MUST meet target: {word_count_target} words minimum (body content only)
12. CTA sections: hero CTA + mid-page CTA + bottom CTA banner
13. Social proof: "trusted by 1,000+ companies" in hero/CTA
14. Human E-E-A-T: first-hand observations, specific scenarios, trade-offs, "we"/"you" voice
15. Image placeholders: 3-4 total: <!-- IMAGE: [description] ALT: [alt text] TYPE: [hero|infographic|screenshot|chart] -->
16. Sources section at bottom: real, verifiable URLs to authoritative sources

## CSS/IMAGE PATHS:
- Subdirectory pages (blog/, features/, etc.): "../css/", "../images/"
- Root level pages: "css/", "images/"

## OUTPUT:
Write COMPLETE HTML to: agents/topical-authority/output/pages/{directory}/{slug}.html
Must be valid HTML5, production-ready, zero edits needed.
```

### Progress Tracking
After each batch of 5:
1. Update todo list: "X/100 pages complete"
2. Log failures
3. Continue with next batch

### Failure Handling
- Failed agents: log page ID, continue, retry at end
- Incomplete HTML: flag for manual review

---

## PHASE 4: INTERLINKING POST-PROCESSING

After all pages are written:

```
Spawn Agent (subagent_type: "On-Page SEO Optimizer"):

You are the interlinking architect for eMonitor's 100 new pages.

READ:
1. agents/topical-authority/output/topical-map/topical-map.json
2. All HTML files in agents/topical-authority/output/pages/ (all subdirectories)
3. Existing site pages (features/, use-cases/, blog/, resources/, compare/)

TASKS:
1. Verify each page has 5-10 internal links
2. Add missing links specified in the topical map
3. Entity-rich anchor text (not "click here")
4. Cross-link between new pages where semantically relevant
5. No orphan pages (every page has 3+ incoming links)
6. List recommended links FROM existing pages TO new pages (don't modify existing files)

OUTPUT:
1. Update HTML files in-place with corrected links
2. Write agents/topical-authority/output/interlinking-report.json
```

---

## PHASE 5: SITEMAP, MANIFEST & REPORT

### Step 5.1: Sitemap additions
Generate `agents/topical-authority/output/sitemap-additions.xml` with `<url>` entries for all new pages (base: `https://www.employee-monitoring.net/`).

### Step 5.2: Update manifest
Read existing manifest (if any) and MERGE new data. Write to `agents/topical-authority/output/manifest.json`:
```json
{
  "runs": [
    {
      "run_id": "YYYYMMDD-HHMMSS",
      "date": "ISO date",
      "pages_generated": 100,
      "topics": ["all 100 slugs from this run"]
    }
  ],
  "all_generated_slugs": ["COMPLETE list across ALL runs"],
  "explored_searches": ["COMPLETE list of all search queries used across ALL runs"],
  "explored_competitors": ["COMPLETE list of competitor domains deeply audited across ALL runs"],
  "explored_niches": ["COMPLETE list of adjacent niches explored across ALL runs"],
  "run_count": 1
}
```

### Step 5.3: Final report
Write `agents/topical-authority/output/generation-report.md`:
- Pages generated (total, by type, by funnel stage, by directory)
- Word count stats (avg, min, max)
- Pages needing manual attention
- Interlinking health score
- Research insights: what new opportunities were found
- Recommended focus areas for the NEXT run
- Deploy instructions: copy from output/pages/ to site root directories

---

## EXECUTION NOTES

### Parallelism
- Phase 1: **5 agents in parallel** (research)
- Phase 2: 1 agent (needs all research)
- Phase 3: **5 agents per batch**, 20 batches (production)
- Phase 4: 1 agent (needs all content)
- Phase 5: Direct tool use

### Brand Consistency
- Brand: **eMonitor** (not Time Champ)
- Domain: **employee-monitoring.net**
- CTA primary: "Start Free Trial" → /signup
- CTA secondary: "Book a Demo" → /book-demo
- Pricing: "$2.50/user/month"
- Trust: "7-day free trial. No credit card required."
- Social proof: "trusted by 1,000+ companies worldwide"

### Quality Checklist (every page)
- [ ] Valid HTML5 with proper head/body
- [ ] JSON-LD structured data (WebPage + BreadcrumbList + FAQPage minimum)
- [ ] Meta title < 60 chars with keyword
- [ ] Meta description < 160 chars with keyword
- [ ] H1 with primary keyword
- [ ] Entity definition in first 100 words
- [ ] 5-10 internal links
- [ ] 10+ FAQ questions
- [ ] 2+ CTA sections
- [ ] Word count meets target
- [ ] No AI cliches, no surveillance language
- [ ] US English, active voice
- [ ] Correct CSS/image relative paths
- [ ] Canonical URL set
- [ ] Sources section with real URLs
