// ============================================================
// Simple AXI-Lite slave with one 32-bit register at address 0x00.
// Supports one read or write transaction at a time.
// AW and W channels are independent and may arrive in any order.

module axi_lite_single_reg #(
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
  output logic [1:0]           RRESP
);

  logic [DATA_W-1:0] reg0;

  // TODO: Internal write tracking
  // Suggested:
  // logic aw_seen, w_seen;
  // logic [ADDR_W-1:0] awaddr_q;
  // logic [DATA_W-1:0] wdata_q;
  // logic [DATA_W/8-1:0] wstrb_q;

  // TODO: READY generation
  // AWREADY high when write address can be accepted
  // WREADY high when write data can be accepted
  // ARREADY high when read address can be accepted

  // TODO: Write flow
  // Capture AWADDR on AW handshake
  // Capture WDATA/WSTRB on W handshake
  // When both are received:
  //   if address == 0x0, update reg0 using WSTRB byte enables
  //   else return error response
  // Assert BVALID after write completes

  // TODO: WSTRB byte-write example
  // for (int i = 0; i < DATA_W/8; i++) begin
  //   if (wstrb_q[i]) reg0[8*i +: 8] <= wdata_q[8*i +: 8];
  // end

  // TODO: BRESP handling
  // 2'b00 = OKAY
  // 2'b10 = SLVERR
  // Hold BVALID until BREADY

  // TODO: Read flow
  // On AR handshake:
  //   if ARADDR == 0x0, RDATA = reg0, RRESP = OKAY
  //   else RDATA = 0, RRESP = SLVERR
  // Assert RVALID and hold until RREADY

  // TODO: Reset
  // Clear reg0 and internal flags
  // Deassert BVALID/RVALID

endmodule
