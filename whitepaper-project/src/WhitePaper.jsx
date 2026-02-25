import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ═══════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════ */
const ThemeCtx = createContext();
const LIGHT = {
  bg: "#faf9f6", bgAlt: "#f3f1ec", text: "#1a1a1a", textSoft: "#2c2c2c",
  muted: "#888", mutedLight: "#b0aaa0", border: "#e0ddd7", borderLight: "#eae7e0",
  accent: "#1a1a1a", accentInv: "#faf9f6", cardBg: "#f5f3ee", figureBg: "#f7f5f0",
  figureBorder: "#ddd8cf", noteBar: "#d0cdc6", selection: "#1a1a1a", selectionText: "#faf9f6",
};
const DARK = {
  bg: "#171615", bgAlt: "#1e1d1b", text: "#e8e5df", textSoft: "#c8c4bc",
  muted: "#7a756c", mutedLight: "#5a564f", border: "#2e2c28", borderLight: "#262422",
  accent: "#e8e5df", accentInv: "#171615", cardBg: "#1e1d1b", figureBg: "#1c1b19",
  figureBorder: "#33302b", noteBar: "#3a3732", selection: "#e8e5df", selectionText: "#171615",
};

/* ═══════════════════════════════════════════
   DATA — MARGIN NOTES
   ═══════════════════════════════════════════ */
const MARGIN_NOTES = {
  "theory-of-change": [
    { paraIndex: 1, text: "Franzen et al. (2022) piloted this at the World Bank IEG across 392 project reports from 64 countries — eight months before ChatGPT's release." },
    { paraIndex: 5, text: "APE project, Univ. of Zurich: as of Feb 2026, 4.5% of AI-generated papers beat human benchmarks — small, but steadily rising." },
  ],
  "evidence-synthesis": [
    { paraIndex: 2, text: "Clark et al. (2025): incorrect inclusions ranged 0–29%. RAISE guidance (Flemyng et al., 2025) now mandates human oversight." },
  ],
  methods: [
    { paraIndex: 3, text: "Key reference: Chernozhukov et al. (2026), Applied Causal Inference Powered by ML and AI — freely available." },
  ],
  "data-collection": [
    { paraIndex: 1, text: "Geiecke & Jaravel (2026): AI interviews revealed 142% more information than open text fields. Accepted at the Review of Economic Studies." },
    { paraIndex: 6, text: "Bisbee et al. (2024): synthetic responses show less variation, coefficients differ, and results shift over a three-month window." },
  ],
  analysis: [
    { paraIndex: 1, text: "DAAF: open-source Claude Code workflow. Research question → full report with code pipelines at 5–10x acceleration." },
    { paraIndex: 3, text: "Hall's replication: 12 coefficients matched to three decimal places. Cost: ~$10. Time: under one hour." },
    { paraIndex: 7, text: "Asher et al. (2026): 640 analysis sessions across four papers testing automated p-hacking — a fundamental integrity risk." },
  ],
  "de-automation": [
    { paraIndex: 2, text: "Shen & Tamkin (2026, Anthropic): AI users scored 17% lower on mastery — equivalent to nearly two letter grades." },
    { paraIndex: 3, text: "Guingrich et al. (2026): belief offloading creates 'algorithmic monoculture' as AI-formed beliefs propagate through networks." },
  ],
};

/* ═══════════════════════════════════════════
   DATA — SECTIONS
   ═══════════════════════════════════════════ */
const SECTIONS = [
  {
    id: "abstract", number: "00", title: "Abstract",
    content: [
      `Over the past two years, PUBLIC has published two editions of its guidebook on evaluating digital projects in the public sector. Since then, artificial intelligence has become not only the subject of evaluation but a tool transforming how evaluations are conducted. Yet the gap remains vast: the OECD's Governing with Artificial Intelligence report (2025) found that policy evaluation has the fewest AI use cases of any government function—just 5 out of 200 examined across member states. Meanwhile, inference costs for large language models have fallen by factors of 9 to 900 per year, depending on the task.`,
      `This paper walks through the evaluation lifecycle—from Theory of Change design to reporting—and examines, at each stage, how generative AI and AI agents are already changing the work and where the limits remain. Drawing on recent academic research, frontier projects in the causal inference community, and real government deployments, it offers policymakers and evaluation teams a practical account of what is possible today, what is emerging, and what warrants caution. It also argues that the most important skill in this new landscape is knowing when not to automate, and proposes a decision framework for making that determination. It closes with a practical roadmap—from prompting to agentic workflows—for teams at different levels of technical readiness.`,
    ],
  },
  {
    id: "foundations", number: "01", title: "Prompting: The Foundation",
    content: [
      `Before walking through the evaluation lifecycle, it is worth pausing on the most underrated AI skill in evaluation: prompting itself. Before synthesising literature or running causal forests, evaluators need to learn how to communicate with these systems effectively. This means being specific about the evaluation context, the method, the data constraints, and the desired output format. Crucially, AI is exceptionally good at generating prompts—iterating through a prompt-generation strategy where you ask the model to refine its own instructions often produces dramatically better results than a first attempt. This meta-skill alone can transform how practitioners interact with every tool discussed below.`,
      `Prompting is also where AI offers an immediate, low-risk use case for capacity building. Need to understand the intuition behind a doubly robust estimator? Want to explore the trade-offs between Difference-in-Differences and Synthetic Control for a specific programme design? LLMs can explain concepts at whatever level of technical depth is needed, generate worked examples, and build teaching materials. For evaluation teams building internal capacity, this requires no technical infrastructure—just a subscription and good prompting practice. However, as discussed later in this paper, there is an important tension between using AI to learn and using it in ways that prevent deeper understanding and expertise (Leone, 2026).`,
    ],
  },
  {
    id: "llm-vs-agent", number: "02", title: "LLMs and Agents: A Critical Distinction",
    content: [
      `An important distinction underlies the entire discussion that follows: the difference between using a large language model (an LLM, such as ChatGPT or Claude) and using an AI agent (such as Codex or Claude Code). An LLM responds to a single prompt. It excels at one-shot tasks: summarising a document, drafting an interview guide, explaining a statistical concept. A basic query to ChatGPT or Claude is built on this paradigm: the user submits a prompt, the model returns a response, and the interaction is complete. For many evaluation tasks, they are the right choice.`,
      `An AI agent is something more: an LLM equipped with tools, memory, and the ability to execute multi-step workflows—reading files, running code, iterating on outputs, and checking its own work. Agents are particularly suited to evaluation because rigour demands consistency across steps. An agent can be instructed, through carefully written configuration files (often now referred to as 'skills'), to follow a specific analytical protocol every time, reducing the variance that comes from prompting an LLM ad hoc.`,
      `The trade-off is real: an agentic task can easily consume 10 to 100 times the computational resources of a single prompt, and setting up the orchestration takes genuine effort. Throughout this paper, applications are flagged as LLM tasks or agentic capabilities, because the distinction matters for cost, reliability, and what evaluation teams need to set up.`,
    ],
  },
  {
    id: "theory-of-change", number: "03", title: "Designing the Theory of Change",
    content: [
      `A good Theory of Change is the foundation of any evaluation. It maps the causal chain from programme inputs through activities, outputs, and outcomes to long-term impacts, and it makes the assumptions behind that chain explicit and testable.`,
      `Generative AI can accelerate this work. LLMs are effective at drafting initial Theory of Change frameworks when given a programme description—structuring inputs, activities, outputs, outcomes, and impacts, and surfacing assumptions that a programme team may not have articulated. The World Bank's Independent Evaluation Group piloted NLP and knowledge graphs to automate theory-based content analysis across 392 project reports from 64 countries, mapping AI outputs to a predefined Theory of Change (Franzen et al., 2022). Knowledge graphs successfully structured ML outputs according to the ToC framework, though the researchers concluded that further work is needed before AI can support a full theory-based evaluation autonomously. This was in early 2022, eight months before ChatGPT was released.`,
      `The core principle is clear: AI can structure and organise programme logic, surface relevant evidence, and identify gaps in causal chains—but only human evaluators can validate whether those causal links hold in a specific policy context, for a specific population, under specific conditions. The value is in accelerating the drafting and stress-testing of a ToC, not in replacing the collaborative process between evaluation teams, programme managers, and stakeholders that makes a ToC credible.`,
      `For teams already using AI agents, an agentic workflow could go further: ingesting programme documentation, searching the academic literature for evidence on similar interventions, drafting a ToC, and then critically reviewing it against that evidence base—all as a multi-step, orchestrated process.`,
      `In March 2025, the AI Scientist (v2), a project by Sakana.ai, managed to publish a paper at the ICLR 2025 workshop, essentially passing the same peer-review process that human scientists go through. Other teams, such as that from Schmidgall et al. (2025)—an active collaboration between AMD researchers and Johns Hopkins University—have created an Agent Laboratory which employs LLMs as Research Assistants, leaving the idea generation aspect to researchers.`,
      `The Autonomous Policy Evaluation (APE) project at the University of Zurich's Social Catalyst Lab, led by David Yanagizawa-Drott, is building a fundamentally distinct and more advanced pipeline: autonomous systems that decide on research questions, produce research papers, run replications, and revise their own work, benchmarked against papers from top economics journals. This is the frontier—not yet ready for routine deployment, but a credible signal of where the field is heading. As of late February 2026, 4.5% of AI-generated papers have beaten human-generated benchmark papers. A small number, but one that has gradually increased since the project's inception.`,
    ],
  },
  {
    id: "evidence-synthesis", number: "04", title: "Synthesising the Evidence Base",
    content: [
      `Before selecting evaluation methods, teams need to understand what the existing evidence says. This is where AI is arguably most mature.`,
      `Tools like Elicit and Scite use LLMs to search, filter, and summarise academic literature. Google's NotebookLM can ingest multiple papers and produce structured syntheses. The World Bank's ImpactAI tool goes further still—it is a purpose-built LLM with a curated, validated database of impact evaluations, enabling policymakers to query causal evidence in natural language and perform dynamic meta-analyses using standardised effect sizes. It was recognised on Apolitical's Government AI 100 list in 2025 and 2026.`,
      `AI screening tools can reduce manual screening of research papers by over 60% while maintaining a recall above 90%. However, a systematic review by Clark et al. (2025) found that incorrect inclusion decisions ranged from 0% to 29%, and concluded that current evidence does not support GenAI use in evidence synthesis without human involvement. The RAISE guidance (Flemyng et al., 2025), jointly published by Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence, now mandates human oversight and transparent reporting when AI is used.`,
      `The relevant question for practitioners is a cost-benefit one: as these tools improve and costs fall, teams should continually reassess where the marginal value of human review exceeds its cost—and where the speed and scale advantages of AI-led synthesis outweigh the residual error rate. For some tasks and contexts, that threshold has arguably already been crossed. For evaluation teams without the budget for a full systematic review, AI-assisted rapid evidence synthesis is among the single highest-value applications available today.`,
      `This is a task where the distinction between LLMs and agents matters. An LLM can summarise a paper provided to it. An agent can search for relevant papers, screen them against inclusion criteria, extract key findings, assess quality, and produce a structured evidence map—a multi-step workflow that would take a human researcher days or weeks. For most evaluation teams today, however, AI-based tools with targeted human review at critical decision points remain the practical sweet spot.`,
    ],
  },
  {
    id: "methods", number: "05", title: "Designing the Evaluation Methods",
    content: [
      `AI is changing the evaluation methods landscape in two ways: it can help teams select the right method, and it is making the methods themselves more powerful.`,
      `On method selection, LLMs can serve as a knowledgeable interlocutor—helping teams think through whether their data constraints, treatment assignment mechanism, and outcome structure fit a particular design. This is essentially an advanced form of prompting: describing the evaluation context and asking the model to walk through the assumptions of different methods, flag potential violations, and suggest alternatives. It is not a replacement for methodological expertise, but it can be a useful sounding board, particularly for teams that do not have a trained econometrician on staff.`,
      `Even for those with a team of causal inference-trained analysts, discussing and challenging assumptions will always remain a valuable process. LLMs can help operationalise methods and packages at the frontier of the field, or even create methods and packages which facilitate previously unfeasible analyses, especially in the face of competing time constraints.`,
      `On the methods themselves, machine learning is being integrated into established evaluation methods. This section is deliberately concise—practitioners looking for technical detail should consult Baker, Callaway, Cunningham, Goodman-Bacon & Sant'Anna (2025) and the freely available Applied Causal Inference Powered by ML and AI textbook (Chernozhukov et al., 2026).`,
      `Traditional two-way fixed effects DiD estimators can produce misleading results under treatment effect heterogeneity—common with digital programmes rolled out in stages. Modern DiD methods (Callaway & Sant'Anna, 2021; Sun & Abraham, 2021) handle this properly and are now being combined with Double Machine Learning (Chernozhukov et al., 2018) to allow flexible modelling of confounders while maintaining valid statistical inference. Extensions for DiD designs (Chang, 2020) and panel data with fixed effects (Clarke & Polselli, 2025) mean these tools now meet evaluators where their data actually lives.`,
      `Synthetic Difference-in-Differences (Arkhangelsky et al., 2021) combines the strengths of both DiD and Synthetic Control, while the Augmented SCM (Ben-Michael, Feller & Rothstein, 2021) uses ML outcome models to de-bias estimates when pre-treatment fit is imperfect.`,
      `Causal forests (Wager & Athey, 2018) allow evaluators to estimate who benefits most rather than producing a single average treatment effect. A methodological review of 133 applied papers using causal forests (Rehill, 2025) confirms widespread adoption. In applied work, causal ML-based targeting rules have improved programme effectiveness by up to 20% over existing practices (Cockx, Lechner & Bollens, 2023). Crucially, identifying who is worst off (a prediction task) is not the same as identifying who would benefit most from intervention (a causal task)—naive risk-based targeting from predictive ML performs substantially worse than causal approaches.`,
      `Perhaps most relevant is the emerging work on adaptive experimentation. Susan Athey's 2024 NBER Methods Lecture covered the design and analysis of multi-armed bandit experiments for policy learning—where treatment assignment is optimised in real time based on incoming data, rather than fixed at the start. This has direct applications for digital programme evaluation: rather than a static A/B test, an adaptive experiment can learn which programme variant works best for which population while the programme is running, balancing learning against participant welfare. Beyond experimental design, AI-powered monitoring systems can process incoming data in near-real time, flagging emerging patterns or implementation problems as they happen. This shift from static to adaptive evaluation is still early, but it has the potential to make evaluation far more useful for programme managers who need to make decisions before a final report arrives.`,
    ],
  },
  {
    id: "data-collection", number: "06", title: "Collecting the Data",
    content: [
      `AI is transforming every part of data collection—a critical step that often determines evaluation quality.`,
      `AI-led interviews. Geiecke and Jaravel's "Conversations at Scale" (accepted at the Review of Economic Studies, 2026) developed an open-source platform for AI-led qualitative interviews—including voice—at scale. The LLM interviewer incorporates best practices from sociological methodology (non-directive interviewing, cognitive empathy, gathering "palpable evidence") and in their experiments, AI-led interviews revealed 142% more information than conventional open text fields. The platform can interview thousands of respondents in hours through recruitment platforms like Prolific. For evaluation teams, this opens up the possibility of rich qualitative data collection at a scale and cost that was previously impossible—running hundreds of beneficiary interviews rather than the dozen that most evaluation budgets allow.`,
      `Survey design and pretesting. LLM-based pipelines can generate and pretest survey questionnaires, with expert evaluations finding the output to be clear and relevant—particularly effective for cross-cultural adaptation of instruments (Adhikari et al., 2025). NLP techniques can identify conceptual gaps in questionnaires before fielding. LLM-powered chatbot interviewers can administer surveys at a quality comparable to traditional methods while offering scalability.`,
      `These capabilities also extend to agents, with Yamil Velez (2026) creating a Model Context Protocol (MCP) server that gives Claude full control over the Qualtrics platform. Through it one can build surveys, manage questions, configure logic flows, distribute via email, handle contacts, export responses, and much more, all through prompting Claude Code. What once took days to configure may now take less than 15 minutes to complete. For example, Stephany et al. (2026) have designed a large number of CVs acting as survey stimuli as part of an experiment, significantly accelerating the survey design process.`,
      `GPT as a measurement tool. A February 2026 NBER working paper by Asirvatham, Mokski, and Shleifer validates GPT as a measurement instrument for coding qualitative data, finding it generally indistinguishable from human evaluators across domains, with results that do not depend on exact prompting strategy. They release an official OpenAI toolkit: GABRIEL, an open-source library with built-in audit trails, making this practically deployable for evaluation teams coding interview transcripts, policy documents, or open-ended survey responses.`,
      `Administrative data and web scraping. AI agents can automate the extraction and cleaning of administrative datasets—work that evaluation teams typically spend weeks on. LLM-enhanced data cleaning methods achieve cost reductions of up to 100x over manual approaches with F1 scores often exceeding 90%. The World Bank's DIME AI programme uses NLP on non-traditional data sources (news articles) to track food crisis risk drivers, improving forecasts by up to 50% a year in advance.`,
      `A note of caution on synthetic respondents: there is growing interest in using LLMs to generate "silicon samples"—synthetic survey data as a substitute for real respondents. The evidence suggests this does not work for statistical inference. Bisbee et al. (2024) found that while LLM-generated averages correspond to real data, synthetic responses show less variation, regression coefficients often differ significantly, and the same prompt yields different results over a three-month period. Synthetic data may be useful for pretesting instruments, but it should not replace real data collection in high-stakes contexts unless these factors are mitigated.`,
    ],
  },
  {
    id: "analysis", number: "07", title: "Conducting the Analysis",
    content: [
      `This is where the most powerful applications—and the most serious risks—converge.`,
      `Qualitative coding. LLMs are increasingly used for thematic coding of interview and focus group data. Research using the Braun & Clarke framework found evaluators preferred LLM-generated codes 61% of the time over human-generated ones (Montes et al., 2025). For policy stakeholder interviews specifically, Liu & Sun (2025) showed that a human-developed codebook used with an LLM coder significantly mitigates the bias that arises when LLMs generate codes autonomously—a finding with direct practical implications for how evaluation teams should structure their qualitative workflows. Open-source, locally-hosted models can achieve moderate-to-substantial agreement with human coders while keeping data on government infrastructure, which matters enormously for evaluations involving sensitive participant data. The key risk here may be anchoring bias: evaluators accepting AI-suggested codes rather than critically generating their own. This is precisely where agents, configured with explicit codebook protocols and validation steps, can outperform ad hoc LLM prompting.`,
      `Agentic analysis workflows. The Data Analyst Augmentation Framework (DAAF), an open-source workflow for Claude Code released in early 2026, allows skilled researchers to scale their expertise and accelerate data analysis by 5 to 10x while maintaining transparency, reproducibility, and rigour. Users can move from a research question to a full research report—with findings, methodology, limitations, and bespoke visualisations—with minimal active engagement time, plus review. Every output comes with fully reproducible, documented code pipelines. For evaluation teams, this represents a realistic near-term model: the evaluator provides expertise and direction, the agent handles the mechanical execution.`,
      `These workflows open up possibilities that time constraints previously foreclosed: revisiting abandoned research questions, testing the robustness and sensitivity of methodological choices, and exploring heterogeneity that would remain hidden without further iterative analysis—all of which can significantly increase the quality and depth of the insights an evaluation produces.`,
      `Andy Hall at Stanford demonstrated this concretely when he had Claude Code fully replicate and extend his published vote-by-mail paper in under an hour for about $10—translating Stata to Python, finding updated data, running new analyses through 2024, creating tables and figures, writing up a new paper, and pushing everything to GitHub. An independent audit found all 12 original coefficients replicated exactly to three decimal places. Hall argues every new empirical paper should ship with proof of automated AI replication. His replication visualiser is an elegant example of what this makes possible: an interactive tool that makes the results of a replication study accessible and explorable in ways that a static PDF never could. While one cannot simply fully defer replication exercises to AI agents, their potential to reduce the time spent on essential yet arduous peer-review tasks could free researchers to focus on harder, more original questions.`,
      `Recent evidence from Thakkar et al. (2026) published in Nature Machine Intelligence shows how, with agents, one can improve review clarity, specificity, and actionability by providing automated feedback on vague comments, content misunderstandings, and unprofessional remarks to reviewers, thus improving the quality and usability of peer review. Some are even starting to use tools like Refine.ink, which provides high-quality feedback for complex papers in under an hour. Even if this does not substitute peer review, it will greatly improve what emerges from it.`,
      `Pedro Sant'Anna at Emory, Scott Cunningham at Baylor, and Paul Goldsmith-Pinkham at Yale have each built agentic workflows that use multi-agent orchestration—where the user describes what they want, and the system plans, implements, reviews (via adversarial quality assurance), fixes, and verifies. Sant'Anna's workflow produced six PhD lecture decks with 800+ slides, interactive versions, and full replication packages. These workflows are directly transferable to evaluation practice: an evaluator specifies the analysis plan, and the agent executes, reviews, and produces documented outputs.`,
      `The consultation analysis frontier. The UK Government's Consult tool, built by i.AI, provides the most thoroughly evaluated real-world example. Across consultations including DWP's Health and Disability Benefits review (85,000+ responses, 125 human reviewers), it achieved F1 scores of 0.76 to 0.82, in some cases exceeding inter-rater agreement among human reviewers. The government estimates it could save 75,000 days of manual analysis per year.`,
      `The p-hacking risk. Asher, Malzahn, Persano, Paschal, Myers, and Hall (2026) tested whether AI coding assistants engage in specification search when prompted—effectively automating p-hacking. They ran 640 independent analysis sessions across four published papers with null or near-null results, spanning RDD, DiD, selection on observables, and RCT designs, varying prompts along dimensions of research framing and nudge condition. This is a fundamental integrity risk for evaluation. If the AI tool an evaluator uses is susceptible to confirming their priors—or the preferences of a commissioner—the resulting analysis could be biased in ways that are hard to detect. Evaluation teams must understand this risk and implement safeguards: pre-registration of analysis plans, adversarial review of AI-generated code, and separation of the analyst from the analyst's AI tools' incentive structure.`,
    ],
  },
  {
    id: "reporting", number: "08", title: "Reporting, Visualisation, and Feedback",
    content: [
      `Evaluation findings must be fed back to programme teams in usable formats. AI is making this dramatically easier.`,
      `LLMs and agents can draft evaluation reports, translate technical findings into accessible language for different audiences, create visualisations in R, Python, or interactive HTML that would previously have required weeks of upskilling, and personalise outputs—producing a technical annex for the evaluation board and an executive summary for ministers from the same underlying analysis. This is an underexplored opportunity: evaluations often fail to influence policy not because the analysis is poor, but because the communication is poorly targeted. OpenAI's Prism, launched in January 2026, provides a free, AI-native LaTeX workspace that integrates literature search, citation management, and AI-assisted editing directly into the scientific writing workflow—relevant for evaluations published in academic venues.`,
      `The risk here is not capability but quality control. AI-generated reports can sound authoritative while containing errors. Any AI-assisted reporting workflow needs a verification step—and ideally, that verification should not be done by the same model that produced the report. Research on self-enhancement bias shows that LLMs preferentially rate their own outputs higher (Panickssery et al., 2024), so using the same model to generate and then review evaluation content will produce systematically inflated quality assessments.`,
    ],
  },
  {
    id: "de-automation", number: "09", title: "The Case for De-Automation",
    content: [
      `Every credible source reviewed for this paper mandates human oversight of AI in evaluation. But the framing—"human in the loop"—obscures a harder question: what happens to the human's skills over time?`,
      `Perhaps the most important argument in this paper is a counterintuitive one. In a landscape of accelerating automation, evaluators should deliberately choose not to automate certain steps.`,
      `An early 2026 randomised experiment by Shen and Tamkin at Anthropic found that software engineers who used AI assistance scored 17% lower on subsequent mastery assessments—equivalent to nearly two letter grades. Those who delegated code generation to AI scored below 40% on understanding tests, while those who used AI for conceptual inquiry scored above 65%. The mechanism matters: it is not that AI makes people worse, but that certain patterns of AI use prevent people from developing the understanding they need to evaluate AI outputs critically.`,
      `The research on belief offloading (Guingrich, Rose, Mehta & Bhatt, 2026) formalises a related concern: when people's processes of forming beliefs are offloaded onto AI, those beliefs may persist even when the AI is wrong, and they may propagate through social networks—creating what the authors call "algorithmic monoculture." Meanwhile, the evidence on LLM sycophancy reinforces this—AI systems tend to confirm rather than challenge, and humans tend to defer rather than interrogate.`,
      `For evaluation, these findings have specific consequences. But to act on them, teams need more than a general injunction to "keep humans in the loop." They need a way of distinguishing which tasks to protect from automation and which to delegate.`,
    ],
  },
  {
    id: "typology", number: "10", title: "A Typology of Evaluation Tasks",
    figure: "typology",
    content: [
      `The underlying principle is this: for some evaluation tasks, the process of doing them is what generates the judgement needed to assess whether they have been done correctly. Automating these tasks does not just save time—it removes the mechanism by which evaluators develop the expertise to catch errors. For other tasks, the output is what matters, and the process is genuinely mechanical. Conflating the two is where teams get into trouble.`,
      `Three categories are proposed here—tentatively, as an initial framework for discussion rather than a settled taxonomy.`,
      `Judgement-building tasks are those where manual execution allows the evaluator to build capacity to assess quality, interpret ambiguity, or detect meaningful error. These are tasks where the knowledge gained from doing them is prerequisite to evaluating whether they have been done well. Examples include: coding a subset of qualitative transcripts to develop familiarity with the data before deploying an LLM coder; manually implementing an estimation strategy on a subset of the data to understand what the coefficients mean and where the specification choices bite; working through the logic of a Theory of Change with programme stakeholders rather than accepting an AI-generated draft.`,
      `Execution tasks are those where the task is well-specified, the quality criteria are clear, and the output can be verified without having performed the task oneself. Data cleaning to a documented specification, formatting tables and figures to a style guide, producing standardised visualisations from a completed analysis, converting between file formats, administering a validated survey instrument at scale—these are tasks where automation straightforwardly saves time without eroding the evaluator's ability to judge the result.`,
      `Hybrid tasks sit between these two, and in practice, most evaluation work lives here. Literature screening is an example: the mechanical act of reading hundreds of abstracts builds substantive familiarity with a field, which informs the evaluator's later interpretive work—but the volume often exceeds what is feasible, and the screening criteria can be made explicit enough for AI to apply them reliably.`,
      `This typology is a starting framework. The boundaries between categories are not always crisp, and may shift depending on the evaluator's existing experience level—what is judgement-building for a junior evaluator may be genuinely mechanical for a senior one.`,
    ],
  },
  {
    id: "decision-framework", number: "11", title: "A Decision Framework",
    figure: "framework",
    content: [
      `The typology above describes what kind of task one is dealing with. But evaluation teams need a practical way to decide, for a specific task in a specific context, whether to automate, partially automate, or protect it from automation.`,
      `The framework rests on two questions, each grounded in the evidence above. Neither alone is sufficient—it is their intersection that determines the right approach.`,
      `Question 1: If an evaluator has never done this task manually, would they be able to detect a consequential error in the automated output? This is the Shen and Tamkin question, translated into evaluation terms. "Consequential" means an error that would change the evaluation's findings, conclusions, or recommendations, not a cosmetic or formatting issue.`,
      `Question 2: If this task is automated, does the team lose a feedback loop that informs other parts of the evaluation? This is the belief offloading question. Some tasks generate understanding that feeds forward into later stages.`,
      `Using the two questions together: If the answer to both is no—the output is verifiable without having done it, and the task does not feed understanding into other stages—automate fully. These are execution tasks. If the answer to either is yes: protect the task from full automation. If the answer to both is yes—this is a task that sits at the core of evaluation expertise, and it should be the last thing a team automates, even under time pressure.`,
      `To be concrete: formatting a set of completed regression tables for an annex is a clear 'automate fully'—verifiable, no feedback loop. Coding qualitative data when the evaluator has never worked with the dataset is a clear 'protect'—both conditions apply. Running a pre-specified DiD estimation on a clean dataset when the analyst has previously implemented the method manually is a reasonable candidate for agentic execution—but only because the judgement-building work was done previously.`,
      `This framework is deliberately simple, and may not cover all relevant cases. In particular, it does not yet account for the time-sensitivity dimension—what happens when evaluation timelines make manual execution genuinely infeasible, not just slower?`,
    ],
  },
  {
    id: "skills", number: "12", title: "Accelerating While Building Skills",
    content: [
      `Any serious AI-enhanced evaluation workflow should therefore include deliberate points of de-automation: steps where practitioners engage directly with the data, the method, or the reasoning, not for efficiency but for understanding. This might mean manually coding a subset of interviews before deploying an LLM coder, working through one estimation by hand before scaling with an agent, or conducting a 'red team' review where team members challenge AI-generated conclusions without seeing the AI's reasoning.`,
      `The right division of labour is not human versus machine. It is: which tasks build expertise when done manually, and which are purely mechanical and better delegated? And—critically—does the answer change depending on who on the team is doing the work? A senior evaluator with fifteen years of qualitative coding experience may reasonably automate what a first-year analyst should do by hand. Teams should make these decisions explicitly rather than defaulting to maximum automation for everyone.`,
      `The goal is not to slow things down—it is to build the judgement that makes speed safe.`,
    ],
  },
  {
    id: "risks", number: "13", title: "Risks Worth Naming",
    content: [
      `Beyond the p-hacking and skill erosion risks discussed above, several further concerns deserve attention.`,
      `Hallucinations remain a real problem: incorrect data extractions in evidence synthesis range from 4% to 31% (Clark et al., 2025). Self-enhancement bias means the same model should not both generate and evaluate evaluation content.`,
      `Data privacy is particularly acute in public sector evaluation. The UK's Redbox tool—which processed 1.3 million messages at up to OFFICIAL-SENSITIVE classification—demonstrated that citation and grounding features are essential for maintaining trust. Open-source, locally-deployable models offer a privacy-preserving alternative, though they require more technical expertise. For evaluations involving sensitive participant data, the question of where data is processed is not optional.`,
      `There is also a democratic legitimacy question. When AI analyses citizen consultation responses, it mediates between citizen voice and policy decision. Nesta's deliberative polling on the UK Government's Consult tool represents the first known instance of structured public deliberation about an AI tool used for policy consultation analysis—a practice that should become standard for AI tools that sit between citizens and policy decisions.`,
    ],
  },
  {
    id: "implementation", number: "14", title: "Implementation Realities",
    content: [
      `The risks above are analytical—they concern what can go wrong inside the evaluation itself. But there is a prior set of obstacles that determines whether AI-enhanced evaluation happens at all.`,
      `The most common is the gap between discovery and deployment. An evaluator who experiments with Claude or ChatGPT on a personal subscription and sees immediate productivity gains still faces a procurement process, a data governance review, and—in many government departments—an AI-specific risk assessment before they can use the same tool on programme data. These processes exist for good reasons, but they are rarely designed with evaluation timescales in mind. Evaluation teams should engage information governance and procurement colleagues early—ideally before the evaluation begins.`,
      `Data classification adds a further layer. Many evaluations involve participant-level data—interview transcripts, survey responses, linked administrative records—that cannot be sent to cloud-hosted models without explicit authorisation. The UK Government's experience with Redbox, which processed documents up to OFFICIAL-SENSITIVE classification, shows that solutions exist, but they require deliberate architectural choices: locally-deployed models, data processing agreements, or purpose-built secure environments.`,
      `There is also a team dynamics question that is rarely discussed in technical guides. Enthusiasm for AI tools is unevenly distributed. Some team members adopt quickly and see immediate gains. Others—often those with the deepest methodological expertise—are sceptical, sometimes reasonably so, about outputs they cannot fully audit. Both instincts are valuable. The most effective teams treat AI adoption as a shared learning process—running internal pilots, reviewing AI-generated outputs collectively, and building shared norms about where AI adds value and where it does not.`,
      `Finally, the distance between a compelling demonstration and a reliable production workflow is larger than it appears. Agentic workflows in particular—the most powerful tools discussed in this paper—require configuration, testing, and ongoing maintenance. Teams should budget for this setup time explicitly, rather than assuming that AI acceleration begins on day one.`,
      `None of this is an argument against adoption. It is an argument for planning adoption deliberately—and for recognising that the binding constraint on AI-enhanced evaluation in most government contexts is not the capability of the tools, but the organisational infrastructure around them.`,
    ],
  },
  {
    id: "roadmap", number: "15", title: "A Practical Roadmap",
    figure: "roadmap",
    content: [
      `Not every evaluation team is ready to deploy AI agents. The ideas in this paper span a wide range of technical sophistication, from prompting an LLM to running multi-agent orchestration workflows. For teams considering how to start, a practical progression emerges.`,
      `The entry point is prompting and learning. Using LLMs to draft a Theory of Change, critique a research design, explore the intuition behind an estimation strategy, or summarise a set of papers requires no technical infrastructure—just a subscription and good prompt engineering. AI is exceptionally good at generating and iterating on prompts, so even the prompt-writing process itself can be AI-assisted. Start here: these activities build the foundational understanding that makes every subsequent step more effective.`,
      `The next level is LLM-based tools. Products like Elicit for literature search, NotebookLM for evidence synthesis, or GABRIEL for qualitative coding provide structured interfaces that reduce the need for prompt engineering and add guardrails specific to research tasks. These are deployable today by any evaluation team.`,
      `The most powerful level is agentic workflows. Tools like Claude Code with frameworks like DAAF, or custom orchestration setups like those built by Sant'Anna, Cunningham, and Goldsmith-Pinkham, allow evaluators to direct multi-step analysis pipelines. These require more setup—writing configuration files, defining quality assurance protocols, and understanding cost implications—but they unlock the 5 to 10x acceleration that the frontier research describes.`,
      `Agents are not always the better choice. For one-off tasks, or for tasks where excellent standalone tools already exist, an LLM or a purpose-built tool will often be more efficient. Agents excel where the task involves multiple interdependent steps, requires consistency across outputs, or needs to maintain context over a long workflow—which describes most evaluation work.`,
      `Throughout, maintain points of de-automation. The goal is not to replace evaluators with AI, but to make evaluators dramatically more capable—while ensuring they remain capable of catching the mistakes that AI will inevitably make.`,
    ],
  },
  {
    id: "conclusion", number: "16", title: "What Comes Next",
    content: [
      `The OECD's finding that policy evaluation has the fewest AI use cases of any government function represents both a problem and an opportunity. The tools described in this paper are not theoretical—they are being used by academic researchers, international organisations, and some government teams today. The cost of LLM inference is falling rapidly, and the question is not whether AI will change evaluation, but whether evaluation teams will be prepared when it does.`,
      `PUBLIC is preparing its third edition guidebook to address these developments in detail—with practical guidance, worked examples, and frameworks for responsible integration at each stage of the evaluation process. For those working on the evaluation of digital, data, or AI projects and interested in discussing how these approaches might apply to specific contexts, PUBLIC welcomes the conversation.`,
    ],
  },
];

const REFERENCES = [
  "Adhikari, R. et al. (2025). LLM-based survey questionnaire generation and pretesting.",
  "Arkhangelsky, D. et al. (2021). Synthetic Difference-in-Differences. American Economic Review.",
  "Asher, S., Malzahn, F., Persano, G., Paschal, C., Myers, K. & Hall, A. (2026). AI coding assistants and specification search.",
  "Asirvatham, S., Mokski, M. & Shleifer, A. (2026). GPT as a measurement instrument. NBER Working Paper.",
  "Baker, A., Callaway, B., Cunningham, S., Goodman-Bacon, A. & Sant'Anna, P. (2025). Difference-in-Differences methods.",
  "Ben-Michael, E., Feller, A. & Rothstein, J. (2021). The Augmented Synthetic Control Method. JASA.",
  "Bisbee, J. et al. (2024). Synthetic survey data and LLM-generated silicon samples.",
  "Callaway, B. & Sant'Anna, P. (2021). Difference-in-Differences with multiple time periods. Journal of Econometrics.",
  "Chang, N.-C. (2020). Double/debiased machine learning for DiD designs.",
  "Chernozhukov, V. et al. (2018). Double/Debiased Machine Learning. The Econometrics Journal.",
  "Chernozhukov, V. et al. (2026). Applied Causal Inference Powered by ML and AI. Textbook.",
  "Clark, J. et al. (2025). AI screening tools in evidence synthesis: A systematic review.",
  "Clarke, D. & Polselli, A. (2025). Double machine learning for panel data with fixed effects.",
  "Cockx, B., Lechner, M. & Bollens, J. (2023). Causal ML-based targeting rules.",
  "Flemyng, E. et al. (2025). RAISE guidance. Cochrane, Campbell Collaboration, JBI, CEE.",
  "Franzen, A. et al. (2022). NLP and knowledge graphs for theory-based evaluation. World Bank IEG.",
  "Guingrich, R., Rose, R., Mehta, S. & Bhatt, R. (2026). Belief offloading and algorithmic monoculture.",
  "Leone, A. (2026). AI and learning in evaluation practice.",
  "Liu, Y. & Sun, H. (2025). Human codebooks with LLM coders in policy research.",
  "Montes, G. et al. (2025). LLM-generated thematic codes using Braun & Clarke framework.",
  "OECD (2025). Governing with Artificial Intelligence.",
  "Panickssery, A. et al. (2024). Self-enhancement bias in large language models.",
  "Rehill, P. (2025). Causal forests in applied research: A methodological review.",
  "Schmidgall, S. et al. (2025). Agent Laboratory: LLMs as Research Assistants.",
  "Shen, J. & Tamkin, A. (2026). AI assistance and mastery in software engineering. Anthropic.",
  "Stephany, F. et al. (2026). CV stimuli design using LLMs for experimental surveys.",
  "Sun, L. & Abraham, S. (2021). Estimating dynamic treatment effects. Journal of Econometrics.",
  "Thakkar, A. et al. (2026). Improving peer review with AI agents. Nature Machine Intelligence.",
  "Velez, Y. (2026). MCP server for Qualtrics integration with Claude.",
  "Wager, S. & Athey, S. (2018). Estimation and inference of heterogeneous treatment effects. JASA.",
];

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
const wordCount = (arr) => arr.join(" ").split(/\s+/).length;
const readTime = (words) => Math.max(1, Math.round(words / 220));
const totalWords = SECTIONS.reduce((a, s) => a + wordCount(s.content), 0);

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */
function useOnScreen(ref, opts = {}) {
  const [ratio, setRatio] = useState(0);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setEntered(true);
        setRatio(e.intersectionRatio);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7, 1], ...opts }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return { ratio, entered };
}

/* ═══════════════════════════════════════════
   FIGURE WRAPPER (shared design language)
   ═══════════════════════════════════════════ */
function FigureWrapper({ number, title, children }) {
  const t = useContext(ThemeCtx);
  const ref = useRef(null);
  const { entered } = useOnScreen(ref);
  return (
    <figure
      ref={ref}
      style={{
        margin: "48px 0 56px",
        padding: 0,
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 500ms ease-out, transform 500ms ease-out",
      }}
    >
      <div
        style={{
          border: `1px dashed ${t.figureBorder}`,
          borderRadius: "2px",
          background: t.figureBg,
          padding: "32px 28px 28px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-11px",
            left: "20px",
            background: t.figureBg,
            padding: "0 10px",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: t.mutedLight,
          }}
        >
          Figure {number}
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: t.text,
            marginBottom: "24px",
            letterSpacing: "-0.1px",
          }}
        >
          {title}
        </div>
        {children}
      </div>
    </figure>
  );
}

/* ═══════════════════════════════════════════
   FIGURE 1 — TYPOLOGY
   ═══════════════════════════════════════════ */
function TypologyFigure() {
  const t = useContext(ThemeCtx);
  const ref = useRef(null);
  const { entered } = useOnScreen(ref);
  const cards = [
    {
      label: "Judgement-Building",
      desc: "Process generates the expertise needed to assess the output",
      examples: "Qualitative coding (first pass) · Manual estimation · Collaborative ToC design",
      action: "Protect from automation",
      color: "#c0785a",
    },
    {
      label: "Hybrid",
      desc: "Partial automation with deliberate human engagement at judgement points",
      examples: "Literature screening · Evidence synthesis · Robustness testing",
      action: "Partially automate",
      color: "#8a8a6a",
    },
    {
      label: "Execution",
      desc: "Output verifiable without having performed the task",
      examples: "Data cleaning · Table formatting · File conversion · Survey administration",
      action: "Automate fully",
      color: "#5a7a8a",
    },
  ];
  return (
    <FigureWrapper number="1" title="A Typology of Evaluation Tasks">
      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {cards.map((c, i) => {
          const delay = i * 180;
          const show = entered;
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                border: `1px solid ${t.border}`,
                borderRadius: "3px",
                background: t.bg,
                overflow: "hidden",
                opacity: show ? 1 : 0,
                transform: show ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 450ms ease-out ${delay}ms, transform 450ms ease-out ${delay}ms`,
              }}
            >
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 600, color: t.text }}>{c.label}</span>
                  <span style={{
                    marginLeft: "auto", fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 500,
                    padding: "3px 10px", borderRadius: "2px",
                    background: c.color + "18", color: c.color, letterSpacing: "0.3px",
                  }}>{c.action}</span>
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", color: t.textSoft, lineHeight: 1.55, marginBottom: "6px" }}>
                  {c.desc}
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: t.muted, lineHeight: 1.5 }}>
                  {c.examples}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10.5px", color: t.muted, marginTop: "16px", lineHeight: 1.5 }}>
        Boundaries shift with experience: what is judgement-building for a junior evaluator may be execution for a senior one.
      </div>
    </FigureWrapper>
  );
}

/* ═══════════════════════════════════════════
   FIGURE 2 — DECISION FRAMEWORK
   ═══════════════════════════════════════════ */
function FrameworkFigure() {
  const t = useContext(ThemeCtx);
  const ref = useRef(null);
  const { entered } = useOnScreen(ref);
  const cells = [
    { q1: "No", q2: "No", label: "Automate fully", desc: "Execution tasks", color: "#5a7a8a", example: "Formatting regression tables" },
    { q1: "Yes", q2: "No", label: "Protect", desc: "Judgement needed to verify", color: "#c0785a", example: "First-time qualitative coding" },
    { q1: "No", q2: "Yes", label: "Protect", desc: "Feedback loop at risk", color: "#c0785a", example: "Manual estimation before scaling" },
    { q1: "Yes", q2: "Yes", label: "Last to automate", desc: "Core evaluation expertise", color: "#a05040", example: "Novel method on sensitive data" },
  ];

  return (
    <FigureWrapper number="2" title="Decision Framework: Two Questions">
      <div ref={ref}>
        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {[
            "Q1: Could an evaluator who has never done this manually detect a consequential error?",
            "Q2: Does automating this sever a feedback loop that informs other evaluation stages?"
          ].map((q, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: t.textSoft,
                padding: "12px 16px", background: t.cardBg, borderRadius: "3px",
                borderLeft: `3px solid ${t.mutedLight}`,
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 400ms ease-out ${i * 150}ms, transform 400ms ease-out ${i * 150}ms`,
                lineHeight: 1.5,
              }}
            >
              {q}
            </div>
          ))}
        </div>

        {/* 2x2 grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px",
        }}>
          {/* Header row */}
          <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: "8px", marginBottom: "2px" }}>
            <div />
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 600, color: t.muted, textAlign: "center", letterSpacing: "1px" }}>Q2: NO</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 600, color: t.muted, textAlign: "center", letterSpacing: "1px" }}>Q2: YES</div>
          </div>
          {/* Rows */}
          {[0, 1].map((row) => (
            <div key={row} style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: "8px" }}>
              <div style={{
                fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 600, color: t.muted,
                display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "1px",
              }}>
                Q1: {row === 0 ? "NO" : "YES"}
              </div>
              {[0, 1].map((col) => {
                const idx = row * 2 + col;
                const c = cells[idx];
                const delay = 350 + idx * 140;
                return (
                  <div
                    key={col}
                    style={{
                      padding: "16px",
                      background: t.bg,
                      border: `1px solid ${t.border}`,
                      borderRadius: "3px",
                      opacity: entered ? 1 : 0,
                      transform: entered ? "scale(1)" : "scale(0.95)",
                      transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: c.color }} />
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 600, color: t.text }}>{c.label}</span>
                    </div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: t.textSoft, lineHeight: 1.45, marginBottom: "6px" }}>{c.desc}</div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", color: t.muted, fontStyle: "italic" }}>e.g. {c.example}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </FigureWrapper>
  );
}

/* ═══════════════════════════════════════════
   FIGURE 3 — ROADMAP
   ═══════════════════════════════════════════ */
function RoadmapFigure() {
  const t = useContext(ThemeCtx);
  const ref = useRef(null);
  const { entered } = useOnScreen(ref);
  const tiers = [
    {
      level: "01", label: "Prompting & Learning", color: "#5a7a8a",
      desc: "Draft ToCs, critique designs, explore methods, summarise papers",
      infra: "Subscription only",
      examples: "ChatGPT · Claude · Gemini",
    },
    {
      level: "02", label: "LLM-Based Tools", color: "#8a8a6a",
      desc: "Structured interfaces with research-specific guardrails",
      infra: "Tool subscription + human review protocols",
      examples: "Elicit · NotebookLM · GABRIEL · ImpactAI",
    },
    {
      level: "03", label: "Agentic Workflows", color: "#c0785a",
      desc: "Multi-step analysis pipelines with QA, replication, and documentation",
      infra: "Configuration files · QA protocols · Cost management",
      examples: "Claude Code + DAAF · Custom orchestration · skills.sh",
    },
  ];

  return (
    <FigureWrapper number="3" title="Implementation Roadmap">
      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {tiers.map((tier, i) => {
          const delay = i * 200;
          return (
            <div key={i}>
              {i > 0 && (
                <div style={{
                  display: "flex", justifyContent: "center", padding: "6px 0",
                  opacity: entered ? 1 : 0,
                  transition: `opacity 300ms ease-out ${delay - 50}ms`,
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10 4 L10 14 M6 11 L10 15 L14 11" stroke={t.mutedLight} strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  border: `1px solid ${t.border}`,
                  borderRadius: "3px",
                  background: t.bg,
                  borderLeft: `3px solid ${tier.color}`,
                  overflow: "hidden",
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 450ms ease-out ${delay}ms, transform 450ms ease-out ${delay}ms`,
                }}
              >
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{
                      fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 600,
                      color: tier.color, letterSpacing: "1px",
                    }}>LEVEL {tier.level}</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 600, color: t.text }}>
                      {tier.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: t.textSoft, lineHeight: 1.5, marginBottom: "8px" }}>
                    {tier.desc}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontFamily: "'Poppins', sans-serif", fontSize: "10.5px", color: t.muted }}>
                    <span><span style={{ fontWeight: 600 }}>Infrastructure:</span> {tier.infra}</span>
                    <span><span style={{ fontWeight: 600 }}>Tools:</span> {tier.examples}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10.5px", color: t.muted, marginTop: "16px", lineHeight: 1.5 }}>
        Throughout all levels, maintain deliberate points of de-automation.
      </div>
    </FigureWrapper>
  );
}

/* ═══════════════════════════════════════════
   MARGIN NOTE
   ═══════════════════════════════════════════ */
function MarginNote({ text, index }) {
  const t = useContext(ThemeCtx);
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop: inline marker */}
      <span
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: t.noteBar,
          color: t.bg,
          fontSize: "10px",
          fontWeight: 700,
          cursor: "pointer",
          marginLeft: "4px",
          verticalAlign: "super",
          lineHeight: 1,
          fontFamily: "'Poppins', sans-serif",
          transition: "background 200ms",
          userSelect: "none",
        }}
      >
        {index}
      </span>
      {open && (
        <span
          style={{
            display: "block",
            margin: "12px 0 16px",
            padding: "14px 16px",
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: "3px",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "12.5px",
            lineHeight: 1.6,
            color: t.muted,
            fontWeight: 400,
            position: "relative",
          }}
        >
          <span
            onClick={() => setOpen(false)}
            style={{
              position: "absolute", top: "8px", right: "12px", cursor: "pointer",
              fontSize: "14px", color: t.mutedLight, lineHeight: 1,
            }}
          >
            ×
          </span>
          {text}
        </span>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   SECTION BLOCK
   ═══════════════════════════════════════════ */
function SectionBlock({ section }) {
  const t = useContext(ThemeCtx);
  const ref = useRef(null);
  const { entered } = useOnScreen(ref);
  const wc = wordCount(section.content);
  const rt = readTime(wc);
  const notes = MARGIN_NOTES[section.id] || [];

  /* global note counter */
  let noteCounter = 0;
  const allSectionIds = SECTIONS.map((s) => s.id);
  for (const sid of allSectionIds) {
    if (sid === section.id) break;
    noteCounter += (MARGIN_NOTES[sid] || []).length;
  }

  return (
    <section
      ref={ref}
      id={section.id}
      style={{
        marginBottom: "88px",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 550ms ease-out, transform 550ms ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "8px" }}>
        <span style={{
          fontSize: "12px", fontWeight: 600, color: t.mutedLight, letterSpacing: "1px",
          fontVariantNumeric: "tabular-nums", fontFamily: "'Poppins', sans-serif",
        }}>
          {section.number}
        </span>
        <h2 style={{
          fontSize: "clamp(21px, 3vw, 30px)", fontWeight: 600, color: t.text,
          lineHeight: 1.2, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.3px",
        }}>
          {section.title}
        </h2>
      </div>
      <div style={{
        fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: t.mutedLight,
        marginBottom: "28px", letterSpacing: "0.3px",
      }}>
        {rt} min read · {wc} words
      </div>

      {section.content.map((para, i) => {
        const noteForPara = notes.filter((n) => n.paraIndex === i);
        let localCounter = noteCounter;
        for (const n of notes) {
          if (n.paraIndex < i) localCounter++;
        }
        return (
          <div key={i}>
            <p style={{
              fontSize: "16px", lineHeight: 1.78, color: t.textSoft,
              margin: "0 0 20px", fontFamily: "'Poppins', sans-serif", fontWeight: 350,
              maxWidth: "660px",
            }}>
              {para}
              {noteForPara.map((n, ni) => {
                const globalIdx = noteCounter + notes.filter((nn) => nn.paraIndex < i).length + ni + 1;
                return <MarginNote key={ni} text={n.text} index={globalIdx} />;
              })}
            </p>
          </div>
        );
      })}

      {/* Inline figures */}
      {section.figure === "typology" && <TypologyFigure />}
      {section.figure === "framework" && <FrameworkFigure />}
      {section.figure === "roadmap" && <RoadmapFigure />}
    </section>
  );
}

/* ═══════════════════════════════════════════
   TABLE OF CONTENTS
   ═══════════════════════════════════════════ */
function TableOfContents({ activeId, onNavigate, isOpen, onClose }) {
  const t = useContext(ThemeCtx);
  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 800, backdropFilter: "blur(3px)",
        }} />
      )}
      <nav style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: "min(380px, 85vw)",
        background: t.bgAlt, borderRight: `1px solid ${t.border}`, zIndex: 900,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto", padding: "68px 28px 48px",
        fontFamily: "'Poppins', sans-serif",
      }}>
        <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: t.muted, marginBottom: "8px", fontWeight: 600 }}>Contents</div>
        <div style={{ fontSize: "11px", color: t.mutedLight, marginBottom: "24px" }}>
          {readTime(totalWords)} min total · {totalWords.toLocaleString()} words
        </div>
        {SECTIONS.map((s) => {
          const isActive = activeId === s.id;
          const wc = wordCount(s.content);
          return (
            <button key={s.id} onClick={() => { onNavigate(s.id); onClose(); }}
              style={{
                display: "flex", alignItems: "baseline", gap: "10px", width: "100%",
                padding: "9px 0", background: "none", border: "none", cursor: "pointer",
                textAlign: "left", fontFamily: "'Poppins', sans-serif",
                opacity: isActive ? 1 : 0.5, transition: "opacity 180ms",
              }}>
              <span style={{ fontSize: "10px", fontWeight: 600, color: t.text, minWidth: "20px", fontVariantNumeric: "tabular-nums" }}>{s.number}</span>
              <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400, color: t.text, lineHeight: 1.4, flex: 1 }}>{s.title}</span>
              <span style={{ fontSize: "10px", color: t.mutedLight }}>{readTime(wc)}m</span>
            </button>
          );
        })}
        <button onClick={() => { onNavigate("references"); onClose(); }}
          style={{
            display: "flex", alignItems: "baseline", gap: "10px", width: "100%",
            padding: "9px 0", background: "none", border: "none", cursor: "pointer",
            textAlign: "left", fontFamily: "'Poppins', sans-serif",
            opacity: activeId === "references" ? 1 : 0.5, marginTop: "8px",
            borderTop: `1px solid ${t.border}`, paddingTop: "16px",
          }}>
          <span style={{ fontSize: "10px", fontWeight: 600, color: t.text, minWidth: "20px" }}>◆</span>
          <span style={{ fontSize: "13px", fontWeight: activeId === "references" ? 600 : 400, color: t.text }}>References</span>
        </button>
      </nav>
    </>
  );
}

/* ═══════════════════════════════════════════
   PDF GENERATOR (AER/JPE two-column)
   ═══════════════════════════════════════════ */
function usePDFGenerator() {
  return useCallback(() => {
    const css = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Poppins:wght@400;500;600;700&display=swap');
@page { margin: 1.8cm 1.6cm 2.2cm; size: A4; @bottom-center { content: counter(page); font-family: 'Poppins', sans-serif; font-size: 8pt; color: #888; } }
* { box-sizing: border-box; }
body { font-family: 'Source Serif 4', Georgia, serif; font-size: 9.5pt; line-height: 1.52; color: #1a1a1a; margin: 0; padding: 0; counter-reset: page; }

/* ---- COVER ---- */
.cover { page-break-after: always; display: flex; flex-direction: column; justify-content: center; min-height: 88vh; }
.cover-rule { width: 50px; height: 2px; background: #1a1a1a; margin-bottom: 24px; }
.cover h1 { font-family: 'Poppins', sans-serif; font-size: 24pt; font-weight: 700; line-height: 1.12; letter-spacing: -0.6px; margin: 0 0 16px; }
.cover .subtitle { font-family: 'Poppins', sans-serif; font-size: 11pt; color: #666; font-weight: 400; margin: 0 0 32px; }
.cover .authors { font-family: 'Poppins', sans-serif; font-size: 10pt; font-weight: 600; color: #1a1a1a; margin: 0 0 3px; }
.cover .affiliation { font-family: 'Poppins', sans-serif; font-size: 9pt; color: #888; margin: 0 0 2px; }
.cover .date { font-family: 'Poppins', sans-serif; font-size: 9pt; color: #888; }

/* ---- ABSTRACT ---- */
.abstract-page { page-break-after: always; }
.abstract-page .label { font-family: 'Poppins', sans-serif; font-size: 9pt; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; color: #888; margin: 0 0 14px; }
.abstract-page p { font-size: 9.5pt; line-height: 1.6; color: #333; margin: 0 0 10px; text-align: justify; hyphens: auto; }
.abstract-page .keywords { margin-top: 18px; font-size: 8.5pt; color: #666; }
.abstract-page .keywords strong { font-weight: 600; color: #1a1a1a; }

/* ---- TOC ---- */
.toc-page { page-break-after: always; }
.toc-page .label { font-family: 'Poppins', sans-serif; font-size: 9pt; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; color: #888; margin: 0 0 20px; }
.toc-item { display: flex; align-items: baseline; gap: 8px; padding: 5px 0; border-bottom: 0.5px solid #eee; font-family: 'Poppins', sans-serif; font-size: 8.5pt; }
.toc-item .num { font-weight: 600; color: #aaa; min-width: 18px; font-size: 8pt; }
.toc-item .t { font-weight: 500; color: #1a1a1a; }

/* ---- BODY (two-column) ---- */
.body-content { column-count: 2; column-gap: 22pt; column-rule: 0.5px solid #eee; }
.section-num { font-family: 'Poppins', sans-serif; font-size: 7.5pt; font-weight: 600; color: #b0aaa0; letter-spacing: 1px; margin-bottom: 2px; column-span: none; break-after: avoid; }
h2.section-title { font-family: 'Poppins', sans-serif; font-size: 12pt; font-weight: 600; color: #1a1a1a; margin: 20pt 0 8pt; letter-spacing: -0.2px; break-after: avoid; line-height: 1.25; }
.body-content p { text-align: justify; hyphens: auto; margin: 0 0 7pt; orphans: 3; widows: 3; font-size: 9.5pt; line-height: 1.52; }

/* ---- HEADER ---- */
.running-header { font-family: 'Poppins', sans-serif; font-size: 7.5pt; color: #aaa; letter-spacing: 0.5px; display: flex; justify-content: space-between; border-bottom: 0.5px solid #ddd; padding-bottom: 6px; margin-bottom: 16px; }

/* ---- REFS ---- */
.ref-section { margin-top: 18pt; break-before: column; }
.ref-section .label { font-family: 'Poppins', sans-serif; font-size: 9pt; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; color: #888; margin: 0 0 12px; break-after: avoid; }
.ref-item { font-size: 8pt; line-height: 1.45; margin: 0 0 4pt; color: #444; padding-left: 14px; text-indent: -14px; }

.footer-note { margin-top: 24pt; padding-top: 10px; border-top: 0.5px solid #ddd; font-size: 7.5pt; color: #999; font-family: 'Poppins', sans-serif; column-span: all; }
`;

    let sectionsHTML = "";
    SECTIONS.slice(1).forEach((s) => {
      sectionsHTML += `<div class="section-num">${s.number}</div><h2 class="section-title">${s.title}</h2>`;
      s.content.forEach((p) => { sectionsHTML += `<p>${p}</p>`; });
    });

    let refsHTML = REFERENCES.map((r) => `<div class="ref-item">${r}</div>`).join("");
    let tocHTML = SECTIONS.map((s) => `<div class="toc-item"><span class="num">${s.number}</span><span class="t">${s.title}</span></div>`).join("");
    tocHTML += `<div class="toc-item"><span class="num">◆</span><span class="t">References</span></div>`;

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>How AI is Transforming the Evaluation of Public Sector Programmes</title><style>${css}</style></head><body>
<div class="cover">
  <div class="cover-rule"></div>
  <h1>How AI is Transforming the Evaluation of Public Sector Programmes</h1>
  <div class="subtitle">A Practitioner's Guide</div>
  <div class="authors">Angelo Leone &amp; Lucas Pollock</div>
  <div class="affiliation">PUBLIC</div>
  <div class="date">February 2026</div>
</div>
<div class="abstract-page">
  <div class="label">Abstract</div>
  ${SECTIONS[0].content.map((p) => `<p>${p}</p>`).join("")}
  <div class="keywords"><strong>Keywords:</strong> programme evaluation, artificial intelligence, causal inference, public sector, agentic workflows, de-automation, large language models</div>
</div>
<div class="toc-page">
  <div class="label">Contents</div>
  ${tocHTML}
</div>
<div class="running-header"><span>Leone &amp; Pollock</span><span>AI and Programme Evaluation (2026)</span></div>
<div class="body-content">
  ${sectionsHTML}
  <div class="ref-section"><div class="label">References</div>${refsHTML}</div>
</div>
<div class="footer-note">PUBLIC | public.io | This paper was written by PUBLIC's specialist evaluation team.</div>
</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w) w.onload = () => setTimeout(() => w.print(), 900);
  }, []);
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function WhitePaper() {
  const [dark, setDark] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("abstract");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const t = dark ? DARK : LIGHT;
  const generatePDF = usePDFGenerator();

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
      setShowTopBtn(scrolled > 500);
      const allIds = [...SECTIONS.map((s) => s.id), "references"];
      for (let i = allIds.length - 1; i >= 0; i--) {
        const node = document.getElementById(allIds[i]);
        if (node && node.getBoundingClientRect().top <= 160) { setActiveId(allIds[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <ThemeCtx.Provider value={t}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,350;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      <style>{`
        html { scroll-behavior: smooth; }
        body { margin: 0; background: ${t.bg}; transition: background 350ms ease; }
        ::selection { background: ${t.selection}; color: ${t.selectionText}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        nav::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Progress */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "2px", zIndex: 1000, background: t.border }}>
        <div style={{ height: "100%", width: `${progress}%`, background: t.accent, transition: "width 100ms ease-out" }} />
      </div>

      <TableOfContents activeId={activeId} onNavigate={scrollTo} isOpen={tocOpen} onClose={() => setTocOpen(false)} />

      {/* ─── Header ─── */}
      <header style={{
        position: "fixed", top: 2, left: 0, right: 0, zIndex: 700,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 24px", background: dark ? "rgba(23,22,21,0.9)" : "rgba(250,249,246,0.9)",
        backdropFilter: "blur(14px)", borderBottom: `1px solid ${t.borderLight}`,
        fontFamily: "'Poppins', sans-serif", transition: "background 350ms ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => setTocOpen((o) => !o)}
            style={{
              background: "none", border: `1px solid ${t.border}`, borderRadius: "5px",
              padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px",
              fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 500, color: t.muted,
              letterSpacing: "0.4px", transition: "border-color 200ms",
            }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect y="2" width="16" height="1.4" rx="0.7" fill="currentColor" />
              <rect y="7" width="10" height="1.4" rx="0.7" fill="currentColor" />
              <rect y="12" width="16" height="1.4" rx="0.7" fill="currentColor" />
            </svg>
            Contents
          </button>
          <span style={{ fontSize: "11px", fontWeight: 500, color: t.mutedLight, letterSpacing: "0.4px" }}>PUBLIC</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Dark mode */}
          <button onClick={() => setDark((d) => !d)}
            style={{
              background: "none", border: `1px solid ${t.border}`, borderRadius: "5px",
              padding: "6px 10px", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              fontSize: "13px", color: t.muted, lineHeight: 1, transition: "border-color 200ms",
            }}>
            {dark ? "☀" : "☾"}
          </button>
          <button onClick={generatePDF}
            style={{
              background: t.accent, color: t.accentInv, border: "none", borderRadius: "5px",
              padding: "7px 16px", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              fontSize: "11px", fontWeight: 500, letterSpacing: "0.4px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "transform 150ms",
            }}>
            ↓ PDF
          </button>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <div style={{ padding: "148px 28px 32px", maxWidth: "740px", margin: "0 auto" }}>
        <div style={{ animation: "fadeUp 700ms ease-out both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <div style={{ width: "36px", height: "2px", background: t.accent }} />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: t.muted }}>White Paper</span>
          </div>
          <h1 style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "clamp(28px, 5.2vw, 48px)", fontWeight: 700,
            lineHeight: 1.08, color: t.text, margin: "0 0 20px", letterSpacing: "-0.8px", maxWidth: "660px",
          }}>
            How AI is Transforming the Evaluation of Public Sector Programmes
          </h1>
          <p style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "clamp(15px, 2vw, 19px)", fontWeight: 350,
            lineHeight: 1.5, color: t.muted, margin: "0 0 36px",
          }}>
            A Practitioner's Guide
          </p>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center",
            fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: t.muted,
            borderTop: `1px solid ${t.border}`, paddingTop: "18px",
          }}>
            <span style={{ fontWeight: 500, color: t.textSoft }}>Angelo Leone & Lucas Pollock</span>
            <span style={{ color: t.borderLight }}>|</span>
            <span>PUBLIC</span>
            <span style={{ color: t.borderLight }}>|</span>
            <span>February 2026</span>
            <span style={{ color: t.borderLight }}>|</span>
            <span>{readTime(totalWords)} min read</span>
          </div>
        </div>

        {/* ─── Sections ─── */}
        <div style={{ marginTop: "84px" }}>
          {SECTIONS.map((s) => (
            <SectionBlock key={s.id} section={s} />
          ))}

          {/* References */}
          <section id="references" style={{
            marginTop: "56px", paddingTop: "44px", borderTop: `1px solid ${t.border}`,
          }}>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "10px", fontWeight: 600,
              letterSpacing: "2.5px", textTransform: "uppercase", color: t.muted, marginBottom: "28px",
            }}>References</div>
            {REFERENCES.map((ref, i) => (
              <p key={i} style={{
                fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: 1.6,
                color: t.muted, margin: "0 0 8px", paddingLeft: "18px", textIndent: "-18px", fontWeight: 350,
              }}>{ref}</p>
            ))}
          </section>

          <footer style={{
            marginTop: "80px", paddingTop: "28px", paddingBottom: "56px",
            borderTop: `1px solid ${t.border}`, fontFamily: "'Poppins', sans-serif",
            fontSize: "11px", color: t.mutedLight, lineHeight: 1.6,
          }}>
            <p style={{ margin: "0 0 6px" }}>This paper was written by PUBLIC's specialist evaluation team.</p>
            <p style={{ margin: "0 0 6px" }}>For more on evaluation work, see PUBLIC's guidebooks on evaluating digital projects.</p>
            <p style={{ margin: 0 }}>Contact: <span style={{ color: t.textSoft }}>public.io</span></p>
          </footer>
        </div>
      </div>

      {/* Back to top */}
      {showTopBtn && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed", bottom: "24px", right: "24px", width: "38px", height: "38px",
            borderRadius: "50%", background: t.accent, color: t.accentInv, border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.12)", zIndex: 600,
          }}>↑</button>
      )}
    </ThemeCtx.Provider>
  );
}
