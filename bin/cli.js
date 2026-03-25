#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

// 平台配置
const PLATFORMS = {
  claude: {
    name: 'Claude Code',
    skillsDir: '.claude/skills',
    commandsDir: null,
  },
  opencode: {
    name: 'OpenCode',
    skillsDir: '.opencode/skills',
    commandsDir: null,
  }
};

// 自动检测平台
function detectPlatform(cwd) {
  // 检查是否存在 .claude 目录
  if (fs.existsSync(path.join(cwd, '.claude'))) {
    return 'claude';
  }
  // 检查是否存在 .opencode 目录
  if (fs.existsSync(path.join(cwd, '.opencode'))) {
    return 'opencode';
  }
  // 默认返回 claude
  return 'claude';
}

program
  .name('sdd-cli')
  .description('SDD (Skill-Driven Development) CLI Tool - Trinity Workflow v2 (Claude Code + OpenCode)')
  .version('2.0.0');

program
  .command('init')
  .description('Initialize SDD workflow configuration in current project')
  .option('-f, --force', 'Overwrite existing files', false)
  .option('--skip-schema', 'Skip copying schema files', false)
  .option('--skip-skills', 'Skip copying skill files', false)
  .option('--platform <name>', 'Target platform: claude | opencode (auto-detect by default)')
  .action(async (options) => {
    const cwd = process.cwd();

    // 自动检测或使用指定平台
    const platform = options.platform || detectPlatform(cwd);
    const platformConfig = PLATFORMS[platform];

    if (!platformConfig) {
      console.error(chalk.red(`\n❌ Unknown platform: ${platform}`));
      console.log(chalk.gray('Available platforms: claude, opencode'));
      process.exit(1);
    }

    console.log(chalk.blue('\n🚀 Initializing SDD workflow v2...\n'));
    console.log(chalk.gray(`Platform: ${platformConfig.name}`));
    console.log(chalk.gray(`Schema: trinity-workflow-v2\n`));

    try {
      // 1. Copy openspec config and schema
      if (!options.skipSchema) {
        const openspecDir = path.join(cwd, 'openspec');
        const schema = 'trinity-workflow-v2';

        // Create openspec directory structure
        await fs.ensureDir(path.join(openspecDir, 'schemas', schema));
        await fs.ensureDir(path.join(openspecDir, 'specs'));
        await fs.ensureDir(path.join(openspecDir, 'changes'));

        // Copy config.yaml
        const configSrc = path.join(TEMPLATES_DIR, 'openspec', 'config.yaml');
        const configDest = path.join(openspecDir, 'config.yaml');

        if (await fs.exists(configDest) && !options.force) {
          console.log(chalk.yellow('⚠ config.yaml already exists, use --force to overwrite'));
        } else {
          await fs.copy(configSrc, configDest);
          console.log(chalk.green('✓ Created openspec/config.yaml'));
        }

        // Copy selected schema
        const schemaSrc = path.join(TEMPLATES_DIR, 'openspec', 'schemas', schema, 'schema.yaml');
        const schemaDest = path.join(openspecDir, 'schemas', schema, 'schema.yaml');

        if (await fs.exists(schemaDest) && !options.force) {
          console.log(chalk.yellow(`⚠ ${schema}/schema.yaml already exists, use --force to overwrite`));
        } else if (await fs.exists(schemaSrc)) {
          await fs.copy(schemaSrc, schemaDest);
          console.log(chalk.green(`✓ Created openspec/schemas/${schema}/schema.yaml`));
        }

        // Copy schema templates if exist
        const templatesSrcDir = path.join(TEMPLATES_DIR, 'openspec', 'schemas', schema, 'templates');
        const templatesDestDir = path.join(openspecDir, 'schemas', schema, 'templates');

        if (await fs.pathExists(templatesSrcDir)) {
          await fs.copy(templatesSrcDir, templatesDestDir, { overwrite: options.force });
          console.log(chalk.green(`✓ Created openspec/schemas/${schema}/templates/`));
        }

        // Create .active file
        const activeFile = path.join(openspecDir, '.active');
        if (!await fs.exists(activeFile)) {
          await fs.writeFile(activeFile, '');
        }
      }

      // 2. Copy skills (platform-specific)
      if (!options.skipSkills) {
        const skillsDir = path.join(cwd, platformConfig.skillsDir);
        await fs.ensureDir(skillsDir);

        const templateSkillsDir = path.join(TEMPLATES_DIR, 'opencode', 'skills');

        if (await fs.pathExists(templateSkillsDir)) {
          const skills = await fs.readdir(templateSkillsDir);
          let copiedSkills = 0;

          for (const skill of skills) {
            const skillSrcDir = path.join(templateSkillsDir, skill);
            const skillDestDir = path.join(skillsDir, skill);

            // Skip if not a directory
            const stat = await fs.stat(skillSrcDir);
            if (!stat.isDirectory()) continue;

            // Check if skill already exists
            if (await fs.exists(skillDestDir) && !options.force) {
              console.log(chalk.gray(`  ${skill}/ already exists, skipping`));
            } else {
              await fs.copy(skillSrcDir, skillDestDir, { overwrite: options.force });
              copiedSkills++;
            }
          }

          if (copiedSkills > 0) {
            console.log(chalk.green(`✓ Copied ${copiedSkills} skill packages to ${platformConfig.skillsDir}/`));
          }
        }
      }

      console.log('\n' + chalk.green.bold('✅ SDD workflow v2 initialized successfully!'));

      // Show next steps
      console.log('\n📚 Trinity Workflow v2 Commands:');
      console.log(chalk.cyan('   /trinity:new "描述"') + '      - 创建新变更（带追踪）');
      console.log(chalk.cyan('   /trinity:continue') + '        - 继续下一个 artifact');
      console.log(chalk.cyan('   /trinity:apply') + '           - 执行任务（3-Strike）');
      console.log(chalk.cyan('   /trinity:verify') + '          - 验证实现（三维度）');
      console.log(chalk.cyan('   /trinity:archive') + '         - 归档变更');
      console.log(chalk.cyan('   /trinity:ff "描述"') + '       - 快速流程\n');

      // Platform-specific tips
      if (platform === 'claude') {
        console.log(chalk.gray('💡 Tips for Claude Code:'));
        console.log(chalk.gray('   - Skills are in .claude/skills/'));
        console.log(chalk.gray('   - Restart Claude Code to load new skills\n'));
      } else {
        console.log(chalk.gray('💡 Tips for OpenCode:'));
        console.log(chalk.gray('   - Skills are in .opencode/skills/'));
        console.log(chalk.gray('   - Commands are in .opencode/commands/'));
        console.log(chalk.gray('   - Requires oh-my-opencode plugin\n'));
      }

    } catch (error) {
      console.error(chalk.red('\n❌ Initialization failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available commands and schemas')
  .action(() => {
    console.log(chalk.bold('\n📚 Trinity Workflow v2 Commands:'));
    console.log('   /trinity:new "描述"   - 创建新变更（带追踪）');
    console.log('   /trinity:continue    - 继续下一个 artifact');
    console.log('   /trinity:apply       - 执行任务（3-Strike）');
    console.log('   /trinity:verify      - 验证实现（三维度）');
    console.log('   /trinity:archive     - 归档变更');
    console.log('   /trinity:ff "描述"   - 快速流程');

    console.log(chalk.bold('\n📦 Schema:'));
    console.log('   trinity-workflow-v2  - 三位一体架构工作流 v2');

    console.log(chalk.bold('\n🖥️ Supported Platforms:'));
    console.log('   claude   - Claude Code (.claude/skills/)');
    console.log('   opencode - OpenCode (.opencode/skills/)\n');
  });

program.parse();
