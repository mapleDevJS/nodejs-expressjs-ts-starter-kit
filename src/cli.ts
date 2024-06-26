#!/usr/bin/env node
import 'reflect-metadata';
import VersionCommand from './cli-command/version-command.js';
import HelpCommand from './cli-command/help-command.js';
import CLIApplication from './app/cli-application.js';
import GenerateCommand from './cli-command/generate-command.js';
import ImportCommand from './cli-command/import-command.js';

const commands = [
    new HelpCommand(),
    new VersionCommand(),
    new GenerateCommand(),
    new ImportCommand(),
];

const cliApplication = new CLIApplication();

cliApplication.registerCommands(commands);

cliApplication.processCommand(process.argv);
