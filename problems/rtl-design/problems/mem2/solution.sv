// Simple dual-port RAM: Port A write-only, Port B read-only
module dp_ram #(
  parameter DEPTH = 256,
  parameter WIDTH = 8
)(
  input  logic                      clk,
  // Port A — write
  input  logic                      write_en_a,
  input  logic [$clog2(DEPTH)-1:0] addr_a,
  input  logic [WIDTH-1:0]          write_data_a,
  // Port B — read
  input  logic                      read_en_b,
  input  logic [$clog2(DEPTH)-1:0] addr_b,
  output logic [WIDTH-1:0]          read_data_b
);
  logic [WIDTH-1:0] mem [DEPTH];

  // Port A: synchronous write
  always_ff @(posedge clk) begin
    if (write_en_a) begin
      mem[addr_a] <= write_data_a;
    end
  end

  // Port B: synchronous read (read-first on same-address collision)
  always_ff @(posedge clk) begin
    if (read_en_b) begin
      read_data_b <= mem[addr_b];
    end
  end
endmodule