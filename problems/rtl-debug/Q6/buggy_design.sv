module rr_arbiter_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic [1:0] req,
  output logic [1:0] grant
);
  logic rr_ptr;

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      rr_ptr <= 1'b0;
      grant  <= 2'b00;
    end else begin
      grant <= 2'b00;
      if (!rr_ptr) begin
        if (req[0])      grant <= 2'b01;
        else if (req[1]) grant <= 2'b10;
      end else begin
        if (req[1])      grant <= 2'b10;
        else if (req[0]) grant <= 2'b01;
      end
      // BUG
      if (grant[1]) rr_ptr <= ~rr_ptr;
    end
  end
endmodule