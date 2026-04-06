module rr_arbiter_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic [1:0] req,
  output logic [1:0] grant
);
  logic rr_ptr;

  // FIX: compute grant combinationally so rr_ptr can observe it
  logic [1:0] grant_next;

  always_comb begin
    grant_next = 2'b00;
    if (!rr_ptr) begin
      if      (req[0]) grant_next = 2'b01;
      else if (req[1]) grant_next = 2'b10;
    end else begin
      if      (req[1]) grant_next = 2'b10;
      else if (req[0]) grant_next = 2'b01;
    end
  end

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      rr_ptr <= 1'b0;
      grant  <= 2'b00;
    end else begin
      grant <= grant_next;
      // FIX: advance pointer using combinational grant_next, not registered grant
      if (grant_next[1]) rr_ptr <= ~rr_ptr;
    end
  end
endmodule