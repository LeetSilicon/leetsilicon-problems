# How to Simulate

## Option 1: iverilog (Free, Local)

### Install

```bash
# Ubuntu / Debian
sudo apt-get install iverilog

# macOS
brew install icarus-verilog

# Windows
# Download from https://bleyer.org/icarus/
```

### Run a Testbench

```bash
cd problems/rtl-design/fifo/fifo1-sync-fifo/

# Compile
iverilog -g2012 -o sim testbench.sv solution.sv

# Run
vvp sim
```

Expected output:
```
PASS: Test Case 1 - Basic FIFO Operation
PASS: Test Case 2 - Full Flag Boundary
...
All tests passed.
```

---

## Option 2: Verilator (Free, Fast)

Verilator compiles SystemVerilog to C++ for faster simulation.

### Install

```bash
sudo apt-get install verilator
```

### Run

```bash
verilator --sv --cc solution.sv --exe testbench.cpp --build
./obj_dir/Vsolution
```

Note: Verilator testbenches need a C++ wrapper. For pure SV testbenches, iverilog is simpler.

---

## Option 3: EDA Playground (No Install)

Go to [https://www.edaplayground.com](https://www.edaplayground.com).

1. Paste `testbench.sv` into the left pane.
2. Paste `solution.sv` into the right pane.
3. Select **Icarus Verilog 0.9.7** as the simulator.
4. Click **Run**.

---

## Option 4: ModelSim / Questa (Commercial)

```tcl
vlib work
vlog -sv solution.sv testbench.sv
vsim -c work.tb_top -do "run -all; quit"
```

---

## Running All Tests (CI Script)

```bash
# Run all testbenches in the repo
bash scripts/run_tests.sh

# Output:
# [PASS] rtl-design/fifo/fifo1-sync-fifo
# [PASS] rtl-design/fifo/fifo2-async-fifo
# [FAIL] rtl-design/fsm/fsm3-mealy     ← needs fix
```

---

## Tips

- If iverilog reports `error: Unknown module type`, make sure both files are passed on the command line.
- Use `-Wall` flag to catch common warnings: `iverilog -g2012 -Wall -o sim ...`
- For CDC problems, Verilator's `--timing` flag is useful.
