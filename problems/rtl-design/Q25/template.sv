// ============================================================
// AXI-Lite slave with four 32-bit registers.
// Register map:
//   0x00 -> reg0
//   0x04 -> reg1
//   0x08 -> reg2
//   0x0C -> reg3

module axi_reg_file #(
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

  logic [DATA_W-1:0] reg0, reg1, reg2, reg3;

  // TODO: Internal state for write address/data capture
  // Suggested:
  // logic aw_seen, w_seen;
  // logic [ADDR_W-1:0] awaddr_q;
  // logic [DATA_W-1:0] wdata_q;
  // logic [DATA_W/8-1:0] wstrb_q;

  // TODO: READY generation
  // Accept AW and W independently
  // Allow one outstanding write and one outstanding read at a time

  // TODO: Write decode
  // case (awaddr_q[3:2])
  //   2'b00: write reg0
  //   2'b01: write reg1
  //   2'b10: write reg2
  //   2'b11: write reg3
  // endcase
  // Apply WSTRB for partial writes

  // TODO: Invalid write address
  // If address outside 0x00/0x04/0x08/0x0C, return SLVERR

  // TODO: Read decode
  // case (ARADDR[3:2])
  //   2'b00: RDATA = reg0
  //   2'b01: RDATA = reg1
  //   2'b10: RDATA = reg2
  //   2'b11: RDATA = reg3
  // endcase
  // Invalid address -> RDATA = 0, RRESP = SLVERR

  // TODO: Hold response valid signals
  // BVALID until BREADY
  // RVALID until RREADY

  // TODO: Reset
  // Clear reg0-reg3 and all response/handshake tracking flags

endmodule
