# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.1] - 2026-03-25

### Fixed
- Fix init command error when commands directory doesn't exist
- Remove commands copying logic (no longer needed)

### Changed
- Remove `--skip-commands` option from CLI

## [2.3.0] - 2026-03-25

### Added
- **contextFiles support**: Trinity Skills now read project context from `contextFiles` config
- Phase 0 in all Trinity Skills: Load project context before any operations
- `openspec/project.md` support for project-level context injection

### Changed
- Only support `trinity-workflow-v2` schema (removed `trinity-workflow` and `hybrid-workflow`)
- `config.yaml` now includes `contextFiles` configuration section

## [2.2.6] - 2026-03-24

### Added
- Worktrunk config (wt.toml) support
- Copy wt.toml to .config/ during init
- Pre-switch: sync OpenSpec specs from origin/main
- Pre-merge: run tests before merging
- Post-switch: hint for start Agent
- Post-merge: notify when merge complete

## [2.2.5] - 2026-03-23

### Fixed
- Correct archive path from `openspec/changes/archive/` to `openspec/archive/`

## [2.2.4] - 2026-03-22

### Fixed
- Add missing artifact templates for trinity-workflow-v2 schema

## [2.2.3] - 2026-03-21

### Added
- Publish to GitHub and npm

## [2.2.2] - 2026-03-20

### Added
- Three Principles for AI-Driven Development
- Update README with core philosophy
- Add English documentation

## [2.2.1] - 2026-03-19

### Fixed
- Fix brainstorming skill reference (superpowers/brainstorming)
- Update README with core philosophy description

## [2.2.0] - 2026-03-18

### Changed
- Clarify tracking file location (openspec/changes/{change-id}/)
- Remove .trinity directory creation logic

## [2.1.0] - 2026-03-17

### Added
- Three-phase architecture: planning-with-files → OpenSpec CLI → planning-with-files
- Each operation updates tracking files via planning-with-files

## [2.0.0] - 2026-03-16

### Added
- Trinity Workflow v2 schema
- Planning-with-Files integration as context anchor
- Delta Specs mechanism
- Profile mode auto-selection
- 3-Strike protocol integration
- Multi-platform support: Claude Code + OpenCode

## [0.4.1] - 2026-03-15

### Added
- Initial version
- Trinity Workflow v1
- Hybrid Workflow support