module sp_ram #(
  parameter DEPTH = 256,
  parameter WIDTH = 8
)(
  input  logic                      clk,
  input  logic                      write_en,
  input  logic                      read_en,
  input  logic [$clog2(DEPTH)-1:0] address,
  input  logic [WIDTH-1:0]          write_data,
  output logic [WIDTH-1:0]          read_data
);
  logic [WIDTH-1:0] mem [DEPTH];

  // Synchronous write
  always_ff @(posedge clk) begin
    if (write_en) begin
      mem[address] <= write_data;
    end
  end

  // Write-first read (1-cycle latency, returns new data on same-address write+read)
  always_ff @(posedge clk) begin
    if (read_en) begin
      if (write_en && (address == address))
        read_data <= write_data;   // Write-first forwarding
      else
        read_data <= mem[address];
    end
  end
endmodule