# Aegis Command Palette Design Challenge

## Purpose

Create a polished, interactive command palette prototype for Aegis, a security operations platform used by SOC teams to detect, investigate, and respond to threats.

The goal is not to build a production-ready app. The goal is to show taste, visual execution, interaction thinking, and the ability to synthesize a varied reference board into one cohesive interface.

This project does not need real backend architecture. Any data, system state, search results, or command responses can be fake as long as they help the command palette feel believable and support Harshit's design direction.

## Interview Context

The company asked for this paid take-home after the portfolio review because they want more signal around designing UI from scratch. The role appears to value interaction design, UI craft, visual quality, and polished product thinking for a B2B AI SaaS / voice AI SaaS environment.

They recommend spending no more than 3-4 hours. Compensation is $500.

## Required Deliverable

A runnable local project that lets the reviewers interact with the command palette directly.

The prototype should include:

- Open/resting command palette state with search input and default content.
- At least one populated search results state.
- Empty, loading, or other useful states.
- Hover, focus, and selection behavior.
- A short video walkthrough with voiceover explaining design decisions and how the inspiration references shaped the direction.

## Proposed Approach

Build this as an interactive prototype rather than a single fixed mockup.

The reviewer should be able to:

- Experience the final recommended command palette configuration.
- Toggle states such as default, search results, empty, and loading.
- Adjust selected interaction or visual properties if useful.
- See how the component behaves under keyboard-heavy, time-sensitive workflows.

The final submission should still make a clear point of view: the prototype can be adjustable, but it should include one recommended configuration that represents the best design choice.

## Collaboration Model

Harshit owns the design direction, product decisions, and final point of view.

The agent's role is to:

- Capture Harshit's notes clearly.
- Help structure the project context.
- Build the prototype once Harshit decides what direction to pursue.
- Avoid inventing major design or product decisions independently.
- Translate Harshit's component vision into a polished, interactive prototype.
- Use technical references as implementation learnings, not as constraints on the visual direction.

Any future implementation should be framed as executing Harshit's ideas and hypotheses, not replacing them.

## Product Frame

Aegis is a central workspace for security analysts. It surfaces:

- Active incidents.
- Vulnerability alerts.
- Affected assets such as servers, endpoints, and cloud resources.
- Team members and on-call rotations.
- Runbooks.
- Audit logs.

The users are keyboard-heavy power users working under time pressure. Speed and information density matter more than simplicity.

## Technical Direction

The command palette should be custom-built for this prototype rather than treated as a production system. References such as `cmdk` are useful for interaction patterns, but the final component should stay under Harshit's design control.

Useful technical learnings to carry forward:

- Separate behavior from visual design: search, filtering, keyboard movement, selected state, loading, and empty states should be built as reusable behavior while the visible surface remains fully designable.
- Use fake but believable data: incident names, asset IDs, logs, runbooks, people, timestamps, and severities can all be invented to support the prototype story.
- Give every command a stable internal value: this keeps keyboard selection and search behavior predictable even when the row design becomes richer.
- Support keywords and aliases: results should match how analysts might think, not only exact labels.
- Keep result rows flexible: rows may need severity, owner, affected asset, shortcut hints, timestamps, status, or risk labels.
- Treat groups as part of the experience: Incidents, Assets, Runbooks, Logs, People, and Actions should feel intentionally organized.
- Make keyboard use feel first-class: arrow keys, Enter, Escape, focus, and selection feedback should be deliberate.

## Success Criteria

The prototype should communicate:

- Fast command access.
- Dense but readable information.
- Confident visual hierarchy.
- Responsive hover, focus, keyboard, and selection behavior.
- A security operations tone without feeling generic or over-themed.
- Clear influence from the provided moodboard.

## Current Assets

- Brief: `/Users/harshitbeni/Downloads/Design challenge.pdf`
- Moodboard: `/Users/harshitbeni/Downloads/Design challenge moodboard.pdf`
- Moodboard render used for setup: `/private/tmp/design-challenge-moodboard-1.png`
