---
name: ref-seo-writing-rules
description: Time Champ semantic SEO writing rules based on Koray Gubur's Holistic SEO system — 15 core writing rules, inquisitive semantics, EAV triples, page architecture, schema requirements by page type, and a pre-publish quality checklist. Reference for all content creation and review tasks.
---

# Semantic SEO Content Writing Rules — Koray Tugberk GUBUR Framework

This document contains the essential writing rules extracted from Koray Gubur's Holistic SEO Writing System and the Semantic SEO framework. Every piece of content MUST follow these rules.

---

## FOUNDATIONAL CONCEPTS

### Source Context
The purpose, business model, and brand identity of the website. For Time Champ:
- **Monetization**: SaaS subscription ($2.50/user/month)
- **Brand Identity**: AI-powered employee monitoring and productivity platform, powered by workforce intelligence
- **Audience**: Agencies, BPOs, construction, architecture/engineering, freelancers, remote/hybrid/field teams

### Central Entity
The main topic that appears consistently throughout every subsection. Always name the central entity explicitly — never use pronouns where the entity name should appear.

### Central Search Intent (CSI)
The unification of Source Context with Central Entity. The CSI must appear throughout all topical map sections. Example: "How [audience] uses [entity] to [outcome]."

---

## KORAY GUBUR'S HOLISTIC SEO WRITING RULES

### Rule 1: Use the Proper Word Sequence
- Prioritize key attributes and context of entities early in the sentence
- Entity as subject, active voice, core attribute immediately after
- **Wrong**: "A flightless seabird with flippers instead of wings that lives below the equator is a penguin."
- **Right**: "Penguin is a flightless seabird that lives almost exclusively below the equator, and they have flippers instead of wings."
- Place the most important information (prominent attributes) before secondary details

### Rule 2: Be Certain — Use Factual Statements
- Avoid opinion-based words: "will," "should," "have to," "need to," "might," "could"
- Use definitive, fact-based language
- **Wrong**: "You should drink more water." / "The sun will rise tomorrow."
- **Right**: "Drinking water is essential for hydration." / "The sun rises every day."
- Certainty builds trust, authority, and E-E-A-T signals

### Rule 3: Use Numeric Values and Specific Data
- Replace vague claims with specific numbers, percentages, and measurements
- Every stat must have a source attribution
- **Wrong**: "Time Champ significantly improves productivity."
- **Right**: "Time Champ users report 23% higher productivity within the first 90 days (Source: Time Champ customer data, 2025)."
- Numbers increase information extraction confidence for passage indexing

### Rule 4: Use Proper Sentence Structure
- Subject-Verb-Object construction for maximum NLP parsing accuracy
- Entity as subject maximizes semantic signal density
- **Wrong**: "Activity is tracked by the software across all devices."
- **Right**: "Time Champ tracks employee activity across all devices in real time."
- Clear SVO structure helps search engines extract entity-attribute-value triples

### Rule 5: Maintain Semantic Relevance — No Semantic Noise
- Every sentence must contain at least one element from: entity / attribute / value
- Remove off-topic tangents, generic boilerplate, and vague marketing copy
- Replace "unlock potential" and "transform your business" with entity-specific language
- Keep entity + its most prominent attributes in close physical proximity

### Rule 6: Use Contextual Terms and Semantic Neighborhood
- Include the full lexical neighborhood of the central entity
- Use all six lexical relations:
  - **Hypernyms** (broader category): "workforce management software" for "employee monitoring software"
  - **Hyponyms** (specific types): "screenshot monitoring," "keystroke logging," "GPS tracking"
  - **Synonyms**: "staff monitoring," "workforce tracking," "employee oversight"
  - **Meronyms** (parts): "activity dashboard," "time tracker," "productivity score"
  - **Holonyms** (larger system): "workforce management suite," "HR technology stack"
  - **Antonyms**: "manual time tracking," "unmonitored work," "blind management"
- Include skip-gram dominant words for the topic space

### Rule 7: Apply Inquisitive Semantics to Every Major Section
This is the EXACT structure Google AI Overviews use to extract citations:
1. **Declaration**: A factual statement about the entity/feature
2. **Question**: A natural follow-up that deepens context
3. **Answer**: Direct, standalone, 40-60 words, entity named in first sentence

**Example**:
> **Declaration**: Time Champ captures employee activity data across apps, websites, and tasks in real time.
> **Question**: But how does real-time activity data translate into actionable productivity insights?
> **Answer**: Time Champ's AI engine classifies each application and website as productive, non-productive, or neutral based on role-specific rules. Managers see color-coded productivity scores and heatmaps — not raw data — enabling them to identify bottlenecks and support underperforming teams within minutes, not days.

### Rule 8: Entity Definition in First 100 Words — Always
- First paragraph after H1 must contain an explicit, direct definition
- Formula: "[Entity] is [hypernym] that [core function] for [audience]. [Supporting sentence about primary outcome or differentiator]."
- **Example**: "Employee monitoring software is a workforce management tool that captures, analyzes, and reports on employee work activity — including app usage, time allocation, and productivity patterns — for managers overseeing remote, hybrid, and in-office teams."

### Rule 9: Build a Semantic Heading Vector
- H1 → H2 → H3 sequence must tell a semantic story
- Every heading is an entity + attribute statement OR a representative query
- **Wrong**: "Unlock Your Team's Potential" / "See What Your Team Achieves"
- **Right**: "What Is Employee Monitoring Software?" / "How Does Employee Monitoring Software Work?" / "Key Features of Employee Monitoring Software"
- Heading vector = the page's semantic skeleton — crawlers read it first

### Rule 10: Apply the Inverted Pyramid
- Most important answer FIRST → Supporting detail SECOND → Context/nuance THIRD
- Never bury the answer. Never use "Great question!" or build-up paragraphs
- First sentence of every section must be extractable as a standalone answer
- This is critical for AEO (Answer Engine Optimization) and passage indexing

### Rule 11: Use EAV (Entity-Attribute-Value) Triples
- Every content section should be expressible as clear EAV triples
- **Entity**: Employee Monitoring Software
- **Attribute**: Compliance standard
- **Value**: GDPR-compliant with configurable privacy levels
- If you cannot express a content section as clear EAV triples, it lacks semantic precision

### Rule 12: Contextual Borders Between Sections
- Never jump between major content sections without a bridging sentence
- Formula: "But [X feature set] alone doesn't explain which teams benefit most. What are the primary use cases where [entity] delivers the clearest ROI?"
- Contextual borders signal transition from macro to micro context

### Rule 13: Information Responsiveness — Cover All Query Types
- **Current Search Activity**: What users are actively searching ("What is X?", "How does X work?")
- **Possible Search Activity**: Post-discovery questions ("Is X legal?", "How much does X cost?", "X vs Y?")
- **Related Search Activity**: Adjacent topics ("Best practices for X", "What industries use X?")
- FAQ sections must cover all three types with minimum 10-15 questions

### Rule 14: Passage-Optimized Paragraphs
Every paragraph must be:
- Independently meaningful (can be read without surrounding paragraphs)
- Contains an explicit entity reference (no orphaned pronouns)
- Provides a direct answer or fact
- 50-80 words per paragraph
- Entity named in sentence 1

### Rule 15: FAQ Answer Formula (AEO-Optimized)
```
Q: [Exact query phrasing from PAA / Google autocomplete]
A: [Entity name] [verb] [direct answer — 1 sentence].
   [Mechanism or how/why — 1 sentence].
   [Specific detail, stat, or example — 1 sentence].
```
- 40-60 words per answer
- Entity in sentence 1
- Direct answer first — never bury it

---

## PAGE ARCHITECTURE FOR AEO PERFORMANCE

### Optimal Page Flow
1. **HERO** (150 words max): H1 with central entity + qualifier + audience. Sentence 1 = explicit entity definition. Sentence 2 = primary benefit / CSI statement. CTA.
2. **TRUST ANCHORS**: Stats bar, awards, logos (no prose)
3. **CORE MACRO CONTENT**: "What Is X? How Does It Work?" — Root attributes first
4. **CONTEXTUAL BORDER 1**: Grouper question bridging to features
5. **PROMINENT ATTRIBUTES**: Feature sections with full inquisitive semantics
6. **CONTEXTUAL BORDER 2**: Grouper question bridging to use cases
7. **CONTEXTUAL ATTRIBUTES**: Use cases (60-80 words each, NOT icon labels)
8. **SUPPLEMENTARY CONTENT**: Legal/compliance, myths, comparison
9. **MECHANISM**: "How It Works" section (HowTo schema candidate)
10. **SOCIAL PROOF**: Case studies with inline stats
11. **MINOR CONTEXTUAL BRIDGES**: Related resources section
12. **RESPONSIVE CONTENT**: FAQ section (12-15 Q&As + FAQPage schema)
13. **CTA**: Final conversion section

---

## SCHEMA REQUIREMENTS BY PAGE TYPE

| Page Type | Required Schema |
|---|---|
| Feature Page | SoftwareApplication + FAQPage + HowTo + BreadcrumbList + Person (author) |
| Solution Page | FAQPage + HowTo + Article + BreadcrumbList |
| Blog Post | BlogPosting + FAQPage + HowTo (if step-by-step) + Person (author) |
| Comparison Page | FAQPage + Product + BreadcrumbList |
| Landing Page | Product/Service + FAQPage + AggregateRating |
| Homepage | Organization + SoftwareApplication + FAQPage |
| Calculator Page | FAQPage + HowTo + BreadcrumbList |

---

## CONTENT QUALITY CHECKLIST (Pre-Publish)

### Entity & Semantic Foundation
- [ ] Central entity explicitly defined in first 100 words with entity name in sentence 1
- [ ] Source context reflected in opening framing
- [ ] All ROOT attributes covered (definition + mechanism)
- [ ] All PROMINENT attributes covered with EAV structure
- [ ] Top POPULAR attributes covered (check PAA)
- [ ] All 6 lexical relations present (hypernym, hyponym, synonym, meronym, holonym, antonym)
- [ ] Entity named explicitly in every section (no orphaned pronouns)
- [ ] Active voice with entity as subject throughout

### Information Responsiveness
- [ ] Every H2/H3 section: direct answer in sentence 1
- [ ] Inquisitive semantics applied to all major sections
- [ ] Current + Possible + Related Search Activity all covered
- [ ] Inverted pyramid applied (answer first, detail second, context third)

### AEO Readiness
- [ ] FAQ section with minimum 10 Q&As
- [ ] FAQ answers: 40-60 words, entity in sentence 1, direct answer first
- [ ] Every H2 section independently extractable as a passage

### Technical
- [ ] Semantic HTML: h1 for entity, h2 for attributes, h3 for sub-attributes, strong for key terms
- [ ] Meta title: 50-60 chars, entity front-loaded
- [ ] Meta description: under 155 chars, entity + benefit + CTA
- [ ] All images: descriptive alt text with entity reference
- [ ] Internal links: 3-5 minimum with entity-rich anchor text

---

## WRITING EXECUTION RULES (NON-NEGOTIABLE)

1. **Entity definition in first 100 words. Always.**
2. **Inquisitive semantics on EVERY H2 section.**
3. **No orphaned facts. Every stat has a source.**
4. **Semantic HTML signals. Always.**
5. **Lexical density. No keyword repetition** -- entity name in H1, definition paragraph, schema. Then synonyms rotate.
6. **FAQ section = information responsiveness coverage** -- minimum 10 questions, all three query activity types.
7. **Contextual borders between major sections.**
8. **No semantic noise** -- every sentence serves the central entity.
9. **Passage-optimized paragraphs** -- 50-80 words, standalone, entity named.
10. **Specific numbers over vague claims** -- always with attribution.
11. **Natural punctuation only.** Do NOT use em dashes (—) or double hyphens (--) as stylistic separators. Use commas, colons, semicolons, periods, or parentheses. Hyphens are only acceptable in compound modifiers (e.g., "real-time tracking"). Write as a natural human editor would.
12. **NEVER use AI cliche words.** Banned words: unlock, harness, elevate, seamlessly, cutting-edge, game-changer, revolutionize, empower, leverage, state-of-the-art, next-generation, robust, holistic, synergy, paradigm shift, dive into, navigate, landscape, ever-evolving, in today's fast-paced world, at the end of the day, streamline, delve, tapestry, multifaceted, comprehensive (as filler), spearhead, foster (overused), pivotal, cornerstone, underscores, realm, nestled, embark, beacon, orchestrate, reimagine, unpack.
13. **Internal links as a table inside the content file.** Do NOT embed hyperlinks in body text. Add a "Recommended Internal Links" section at the end of the content (before the self-review checklist) with a table: Anchor Text | URL | Suggested Placement. Only recommend URLs from the ref-internal-links agent.
14. **Images: 1 hero + 2-3 additional = 3-4 total maximum.** Place 1 hero image after H1, then 2-3 more at key content breaks. Never exceed 4 images total.
14b. **Word count = body content only.** Schema, internal link tables, source tables, self-review checklists, metadata, and image comments do NOT count toward the word count target.
15. **Natural keyword density.** Use the primary keyword in H1, 2-3 H2s, first paragraph, meta description, and conclusion. Elsewhere, rotate with synonyms, partial matches, and related terms.
16. **No competitor names** unless the content type is alternatives, comparison, or product comparison list.
17. **Autonomous web access.** Access safe public websites directly for SERP analysis and research without asking user permission.
18. **Human essence for E-E-A-T (Non-Negotiable).** Every piece of content must pass Google's Experience, Expertise, Authoritativeness, and Trustworthiness evaluation.
    - **Experience:** Include first-hand observations, practical scenarios, and lessons learned.
    - **Expertise:** Go beyond facts. Explain *why* something matters and *when* it does not apply.
    - **Authoritativeness:** Reference specific research, regulations, and industry standards by name.
    - **Trustworthiness:** Acknowledge limitations honestly. Mention when something is not the right fit.
    - **Human writing signals:** Use "we" and "you." Vary sentence length. Share opinions with confidence.
