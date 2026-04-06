module thread_mask #(
  parameter THREADS = 32,
  parameter STACK_D = 4
)(
  input  logic [THREADS-1:0] predicate,
  input  logic               clk,
  input  logic               rst_n,
  input  logic               enter_if,
  input  logic               enter_else,
  input  logic               exit_if,
  output logic [THREADS-1:0] active_mask
);
  logic [THREADS-1:0] stack [STACK_D];
  logic [$clog2(STACK_D+1)-1:0] sp;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      active_mask <= {THREADS{1'b1}};
      sp          <= '0;
      for (int i = 0; i < STACK_D; i++) stack[i] <= '0;
    end else begin
      if (enter_if && sp < STACK_D) begin
        stack[sp]   <= active_mask;
        sp          <= sp + 1'b1;
        active_mask <= active_mask & predicate;
      end else if (enter_else && (sp != 0)) begin
        active_mask <= stack[sp-1] & ~predicate;
      end else if (exit_if && (sp != 0)) begin
        active_mask <= stack[sp-1];
        sp          <= sp - 1'b1;
      end
    end
  end
endmodule