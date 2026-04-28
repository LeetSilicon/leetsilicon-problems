#!/bin/bash

set +e   # don't exit on failure

ROOT_DIR=$(pwd)
LOG_FILE="$ROOT_DIR/run_results.log"
> "$LOG_FILE"

TARGET=$1

# ---- decide directories ----
if [[ -n "$TARGET" ]]; then
    DIRS="${TARGET%/}/"
    echo "Running ONLY $DIRS" | tee -a "$LOG_FILE"
else
    DIRS=Q*/
    echo "Running all Q* folders..." | tee -a "$LOG_FILE"
fi

for dir in $DIRS; do
    echo "============================" | tee -a "$LOG_FILE"
    echo "Running $dir" | tee -a "$LOG_FILE"

    if [[ ! -d "$dir" ]]; then
        echo "$dir not found, skipping..." | tee -a "$LOG_FILE"
        continue
    fi

    if [[ ! -f "$dir/solution.sv" || ! -f "$dir/testbench.sv" ]]; then
        echo "Missing files in $dir, skipping..." | tee -a "$LOG_FILE"
        continue
    fi

    cd "$dir" || continue

    TOP=tb
    echo "Detected TOP module: $TOP" | tee -a "$LOG_FILE"

    # ---- clean ----
    rm -rf obj_dir build.log run.log

    # ---- build ----
    verilator -Wall --binary \
        -sv solution.sv testbench.sv \
        --top-module "$TOP" \
        --timing \
        -Wno-fatal \
        -j 0 > build.log 2>&1

    if [[ $? -ne 0 ]]; then
        echo "$dir : BUILD FAILED" | tee -a "$LOG_FILE"
        echo "---- $dir/build.log ----" >> "$LOG_FILE"
        cat build.log >> "$LOG_FILE"
        cd "$ROOT_DIR"
        continue
    fi

    # ---- run ----
    if [[ ! -f obj_dir/V$TOP ]]; then
        echo "$dir : EXECUTABLE MISSING" | tee -a "$LOG_FILE"
        cd "$ROOT_DIR"
        continue
    fi

    ./obj_dir/V$TOP > run.log 2>&1
    STATUS=$?

    if [[ $STATUS -eq 0 ]]; then
        echo "$dir : PASS" | tee -a "$LOG_FILE"
    else
        echo "$dir : FAIL (exit code $STATUS)" | tee -a "$LOG_FILE"
        echo "---- $dir/run.log ----" >> "$LOG_FILE"
        cat run.log >> "$LOG_FILE"
    fi

    cd "$ROOT_DIR"
done

echo "============================" | tee -a "$LOG_FILE"
echo "Done. Results saved in $LOG_FILE"