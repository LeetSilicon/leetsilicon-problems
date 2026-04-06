// ============================================================
// Write-only AXI-Lite peripheral.
// Register map:
//   0x00 -> enable register
//   0x04 -> mode register
// Reads are not allowed and should return an error response.

module axi_write_only_ctrl (
  parameter int unsigned ADDR_W = 4,
  parameter int unsigned DATA_W = 32
) (
  input  logic                 ACLK,
  input  logic                 ARESETn,

  // Write address channel
  input  logic                 AWVALID,
  output logic                 AWREADY,
  input  logic [ADDR_W-1:0]    AWADDR,

  // Write data channel
  input  logic                 WVALID,
  output logic                 WREADY,
  input  logic [DATA_W-1:0]    WDATA,
  input  logic [DATA_W/8-1:0]  WSTRB,

  // Write response channel
  output logic                 BVALID,
  input  logic                 BREADY,
  output logic [1:0]           BRESP,

  // Read address channel
  input  logic                 ARVALID,
  output logic                 ARREADY,
  input  logic [ADDR_W-1:0]    ARADDR,

  // Read data channel
  output logic                 RVALID,
  input  logic                 RREADY,
  output logic [DATA_W-1:0]    RDATA,
  output logic [1:0]           RRESP,

  // Control outputs
  output logic                 enable_reg,
  output logic [DATA_W-1:0]    mode_reg
);

  // TODO: Internal write tracking
  // Suggested:
  // logic aw_seen, w_seen;
  // logic [ADDR_W-1:0] awaddr_q;
  // logic [DATA_W-1:0] wdata_q;
  // logic [DATA_W/8-1:0] wstrb_q;

  // TODO: Write decode
  // 0x00 -> enable_reg
  // 0x04 -> mode_reg
  // invalid address -> BRESP = SLVERR
  // Apply WSTRB to support byte writes

  // TODO: Read behavior
  // Any read attempt should return:
  //   RDATA = 0
  //   RRESP = 2'b10 (SLVERR)
  // Assert RVALID and hold until RREADY

  // TODO: READY generation
  // AWREADY/WREADY for normal write acceptance
  // ARREADY can still accept reads even if response will be an error

  // TODO: Reset
  // Clear enable_reg and mode_reg
  // Deassert BVALID/RVALID

endmodule
