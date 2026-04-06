module bus_arbiter #(
  parameter NUM_MASTERS = 4
)(
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic [NUM_MASTERS-1:0]  request,
  output logic [NUM_MASTERS-1:0]  grant,
  output logic                    grant_valid
);
  localparam LOG2 = (NUM_MASTERS <= 1) ? 1 : $clog2(NUM_MASTERS);

  logic [LOG2-1:0] last_grant;
  logic [LOG2-1:0] next_grant_idx;
  logic            found_grant;

  always_comb begin
    integer idx;

    grant          = '0;
    next_grant_idx = last_grant;
    found_grant    = 0;
    idx            = 0;

    for (int i = 1; i <= NUM_MASTERS; i++) begin
      idx = (last_grant + i) % NUM_MASTERS;
      if (!found_grant && request[idx]) begin
        grant[idx]      = 1'b1;
        next_grant_idx  = idx[LOG2-1:0];
        found_grant     = 1'b1;
      end
    end
  end

  assign grant_valid = found_grant;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      last_grant <= NUM_MASTERS-1;
    end else if (grant_valid) begin
      last_grant <= next_grant_idx;
    end
  end
endmodule