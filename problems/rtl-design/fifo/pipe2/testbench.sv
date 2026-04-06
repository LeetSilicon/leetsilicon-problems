module tb;
  logic clk, rst_n, stall, flush, valid_in, valid_out;
  logic [31:0] data_in, data_out;
  logic [7:0] ctrl_in, ctrl_out;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  pipe_stage_reg #(.DATA_WIDTH(32), .CTRL_WIDTH(8)) dut(.*);
  initial begin
    rst_n=0; stall=0; flush=0; data_in=0; ctrl_in=0; valid_in=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // TC3: pass-through
    @(negedge clk); data_in=32'hCAFE_BABE; ctrl_in=8'hAA; valid_in=1;
    @(posedge clk); @(negedge clk);
    if (data_out==32'hCAFE_BABE && valid_out) begin p++; $display("PASS: TC3"); end
    else begin f++; $display("FAIL: TC3 data=%h valid=%b", data_out, valid_out); end

    // TC1: immediately assert stall (keep valid_in=1 irrelevant since stall blocks)
    stall=1; valid_in=0; data_in=0;
    repeat(3) @(posedge clk);
    @(negedge clk);
    if (data_out==32'hCAFE_BABE && valid_out) begin p++; $display("PASS: TC1 stall"); end
    else begin f++; $display("FAIL: TC1 data=%h valid=%b", data_out, valid_out); end

    // TC2: flush clears
    stall=0; flush=1;
    @(posedge clk); @(negedge clk); flush=0;
    if (!valid_out) begin p++; $display("PASS: TC2 flush"); end
    else begin f++; $display("FAIL: TC2 valid=%b", valid_out); end

    // TC4: flush wins over stall
    @(negedge clk); data_in=32'hBBBB; valid_in=1;
    @(posedge clk); @(negedge clk); valid_in=0;
    stall=1; flush=1;
    @(posedge clk); @(negedge clk); stall=0; flush=0;
    if (!valid_out) begin p++; $display("PASS: TC4"); end
    else begin f++; $display("FAIL: TC4"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
