#!/bin/bash
# run_tests.sh
# Runs all testbenches in the problems/ directory using iverilog.
# Prints PASS/FAIL per problem and a final summary.
#
# Usage:
#   bash scripts/run_tests.sh
#   bash scripts/run_tests.sh problems/rtl-design/fifo/fifo1-sync-fifo

set -euo pipefail

PROBLEMS_DIR="${1:-problems}"
PASS=0
FAIL=0
SKIP=0
TMP_DIR=$(mktemp -d)

run_problem() {
  local dir="$1"
  local name="${dir#problems/}"

  local testbench="$dir/testbench.sv"
  local solution="$dir/solution.sv"
  local buggy="$dir/buggy_design.sv"
  local fixed="$dir/fixed_design.sv"

  # RTL debug: use fixed_design + testbench
  if [[ -f "$fixed" && -f "$testbench" ]]; then
    solution="$fixed"
  fi

  if [[ ! -f "$testbench" ]]; then
    echo "⚪ SKIP  $name  (no testbench.sv)"
    ((SKIP++)) || true
    return
  fi

  if [[ ! -f "$solution" ]]; then
    echo "⚪ SKIP  $name  (no solution.sv or fixed_design.sv)"
    ((SKIP++)) || true
    return
  fi

  local out_bin="$TMP_DIR/sim_$(echo "$name" | tr '/' '_')"
  local compile_log="$TMP_DIR/compile.log"
  local run_log="$TMP_DIR/run.log"

  # Compile
  if ! iverilog -g2012 -o "$out_bin" "$testbench" "$solution" > "$compile_log" 2>&1; then
    echo "❌ FAIL  $name  (compile error)"
    cat "$compile_log" | sed 's/^/         /'
    ((FAIL++)) || true
    return
  fi

  # Run
  vvp "$out_bin" > "$run_log" 2>&1 || true

  if grep -qi "FAIL" "$run_log"; then
    echo "❌ FAIL  $name"
    grep -i "FAIL" "$run_log" | head -5 | sed 's/^/         /'
    ((FAIL++)) || true
  else
    echo "✅ PASS  $name"
    ((PASS++)) || true
  fi
}

# Find all problem directories (those containing problem.json)
while IFS= read -r -d '' problem_json; do
  dir=$(dirname "$problem_json")
  run_problem "$dir"
done < <(find "$PROBLEMS_DIR" -name "problem.json" -print0 | sort -z)

echo ""
echo "────────────────────────────────────"
echo "Results: ✅ $PASS passed  ❌ $FAIL failed  ⚪ $SKIP skipped"
echo "────────────────────────────────────"

rm -rf "$TMP_DIR"

[[ $FAIL -eq 0 ]]
