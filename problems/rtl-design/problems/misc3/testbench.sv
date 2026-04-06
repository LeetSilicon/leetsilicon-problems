module tb;
  logic       clk;
  logic       rst_n;
  logic       in_valid;
  logic [7:0] in_data;
  logic [7:0] min_out, max_out;
  logic       out_valid;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  sliding_window_minmax #(.WINDOW_SIZE(3), .DATA_WIDTH(8)) dut (.*);

  task automatic push(input logic [7:0] d);
    @(negedge clk); in_valid = 1; in_data = d;
    @(posedge clk); @(negedge clk);
    in_valid = 0; @(posedge clk); @(negedge clk);
  endtask

  initial begin
    rst_n    = 0;
    in_valid = 0;
    in_data  = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // TC1 — Warm-up: W=3, 2 samples not valid yet
    push(4); push(2); @(negedge clk);
    if (!out_valid) begin p++; $display("PASS: TC1 not valid before window full"); end
    else begin f++; $display("FAIL: TC1 premature valid"); end

    // After 3rd sample, valid
    push(12);
    if (out_valid && min_out == 2 && max_out == 12) begin
      p++;
      $display("PASS: TC2 window=[4,2,12] min=2 max=12");
    end else begin
      f++;
      $display("FAIL: TC2 min=%0d max=%0d valid=%b", min_out, max_out, out_valid);
    end

    // TC2 — Slide: push 3 → window=[2,12,3]
    push(3);
    if (min_out == 2 && max_out == 12) begin p++; $display("PASS: TC2 after 3"); end
    else begin f++; $display("FAIL: TC2 after 3 min=%0d max=%0d", min_out, max_out); end

    // Push 1 → window=[12,3,1]
    push(1);
    if (min_out == 1 && max_out == 12) begin p++; $display("PASS: TC2 after 1 min=1 max=12"); end
    else begin f++; $display("FAIL: TC2 after 1 min=%0d max=%0d", min_out, max_out); end

    // TC3 — Constant input
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    push(7); push(7); push(7);
    if (min_out == 7 && max_out == 7) begin p++; $display("PASS: TC3 constant min=max=7"); end
    else begin f++; $display("FAIL: TC3"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule