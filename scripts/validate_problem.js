#!/usr/bin/env node
/**
 * validate_problem.js
 * Validates a problem.json file against the required schema.
 *
 * Usage:
 *   node scripts/validate_problem.js problems/rtl-design/fifo/fifo1-sync-fifo/problem.json
 *   node scripts/validate_problem.js --all   # validate every problem.json in the repo
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

const REQUIRED_FIELDS = ['id', 'shortName', 'domain', 'category', 'difficulty', 'topics', 'question', 'description', 'requirements'];
const VALID_DOMAINS = ['rtl-design', 'computer-architecture', 'design-verification', 'rtl-debug', 'programming'];
const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

function validateFile(filePath) {
  const errors = [];
  let data;

  try {
    data = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [`PARSE ERROR: ${e.message}`];
  }

  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  if (data.domain && !VALID_DOMAINS.includes(data.domain)) {
    errors.push(`Invalid domain "${data.domain}". Must be one of: ${VALID_DOMAINS.join(', ')}`);
  }

  if (data.difficulty && !VALID_DIFFICULTIES.includes(data.difficulty)) {
    errors.push(`Invalid difficulty "${data.difficulty}". Must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
  }

  if (data.topics && !Array.isArray(data.topics)) {
    errors.push(`"topics" must be an array`);
  }

  if (data.requirements && !Array.isArray(data.requirements)) {
    errors.push(`"requirements" must be an array`);
  }

  if (data.requirements && Array.isArray(data.requirements)) {
    const testCases = data.requirements.filter(r => /^Test Case \d+/i.test(r));
    if (testCases.length < 2) {
      errors.push(`Should have at least 2 test cases in "requirements" (found ${testCases.length})`);
    }
  }

  return errors;
}

function findAllProblems(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...findAllProblems(fullPath));
    } else if (entry === 'problem.json') {
      results.push(fullPath);
    }
  }
  return results;
}

const args = process.argv.slice(2);
let filesToCheck = [];

if (args[0] === '--all') {
  filesToCheck = findAllProblems(resolve('problems'));
  if (filesToCheck.length === 0) {
    console.log('No problem.json files found under problems/');
    process.exit(0);
  }
} else if (args[0]) {
  filesToCheck = [resolve(args[0])];
} else {
  console.error('Usage: node scripts/validate_problem.js <path/to/problem.json>');
  console.error('       node scripts/validate_problem.js --all');
  process.exit(1);
}

let totalErrors = 0;
let totalChecked = 0;

for (const filePath of filesToCheck) {
  totalChecked++;
  const errors = validateFile(filePath);
  if (errors.length === 0) {
    console.log(`✅ PASS  ${filePath}`);
  } else {
    console.log(`❌ FAIL  ${filePath}`);
    for (const err of errors) {
      console.log(`         → ${err}`);
    }
    totalErrors += errors.length;
  }
}

console.log(`\n${totalChecked} file(s) checked. ${totalErrors === 0 ? 'All valid.' : `${totalErrors} error(s) found.`}`);
process.exit(totalErrors > 0 ? 1 : 0);
