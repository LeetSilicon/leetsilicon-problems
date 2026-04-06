module tb;
  logic       clk;
  logic       rst_n;
  logic       in_valid;
  logic [7:0] in_data;
  logic [7:0] top_values [3];
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  top_k_tracker #(.K(3), .DATA_WIDTH(8)) dut (.*);

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

    // TC1 — Max only (K=1 — using K=3 but checking top[0])
    push(3); push(1); push(5); push(2); push(4);
    if (top_values[0] == 5) begin p++; $display("PASS: TC1 max=5"); end
    else begin f++; $display("FAIL: TC1 max=%0d", top_values[0]); end

    // TC2 — Top-2: stream [4,9,1,7,3]
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    push(4); push(9); push(1); push(7); push(3);
    if (top_values[0] == 9 && top_values[1] == 7) begin
      p++;
      $display("PASS: TC2 top[0]=9 top[1]=7");
    end else begin
      f++;
      $display("FAIL: TC2 top[0]=%0d top[1]=%0d", top_values[0], top_values[1]);
    end

    // TC3 — Sorted insertion K=3: [5,8,3,9,2]
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    push(5); push(8); push(3); push(9); push(2);
    if (top_values[0] == 9 && top_values[1] == 8 && top_values[2] == 5) begin
      p++;
      $display("PASS: TC3 top=[9,8,5]");
    end else begin
      f++;
      $display("FAIL: TC3 top=[%0d,%0d,%0d]", top_values[0], top_values[1], top_values[2]);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule