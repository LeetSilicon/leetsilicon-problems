// ============================================================
// Read-only AXI-Lite peripheral.
module axi_read_only_status #(
  parameter VERSION = 32'h0000_0001
) (
  input  logic        ACLK,
  input  logic        ARESETn,
  input  logic [31:0] status_in,
  input  logic        AWVALID,
  output logic        AWREADY,
  input  logic [31:0] AWADDR,
  input  logic        WVALID,
  output logic        WREADY,
  input  logic [31:0] WDATA,
  input  logic [3:0]  WSTRB,
  output logic        BVALID,
  input  logic        BREADY,
  output logic [1:0]  BRESP,
  input  logic        ARVALID,
  output logic        ARREADY,
  input  logic [31:0] ARADDR,
  output logic        RVALID,
  input  logic        RREADY,
  output logic [31:0] RDATA,
  output logic [1:0]  RRESP
);

  // TODO: Reads return VERSION/status_in; writes respond with SLVERR.

endmodule
