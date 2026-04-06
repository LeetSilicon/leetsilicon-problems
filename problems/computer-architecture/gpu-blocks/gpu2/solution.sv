module simd_alu #(
  parameter LANES = 4,
  parameter W     = 32
)(
  input  logic [W-1:0]     a      [LANES],
  input  logic [W-1:0]     b      [LANES],
  input  logic [LANES-1:0] mask,
  input  logic [2:0]        op,
  output logic [W-1:0]     result [LANES]
);
  genvar i;
  generate
    for (i = 0; i < LANES; i++) begin : lane
      always_comb begin
        if (!mask[i]) begin
          result[i] = '0;
        end else begin
          case (op)
            3'd0: result[i] = a[i] + b[i];
            3'd1: result[i] = a[i] - b[i];
            3'd2: result[i] = a[i] & b[i];
            3'd3: result[i] = a[i] | b[i];
            3'd4: result[i] = a[i] ^ b[i];
            default: result[i] = '0;
          endcase
        end
      end
    end
  endgenerate
endmodule