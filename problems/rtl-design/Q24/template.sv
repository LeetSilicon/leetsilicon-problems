// ============================================================
// AXI-Lite GPIO peripheral.
// Register map:
//   0x00 -> gpio_out register
//   0x04 -> gpio_in status
// Writes update gpio_out. Reads return gpio_out or gpio_in.

module axi_gpio #(
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

  // GPIO ports
  input  logic [DATA_W-1:0]    gpio_in,
  output logic [DATA_W-1:0]    gpio_out
);

  // TODO: Internal write tracking for AW/W channel pairing
  // Suggested:
  // logic aw_seen, w_seen;
  // logic [ADDR_W-1:0] awaddr_q;
  // logic [DATA_W-1:0] wdata_q;
  // logic [DATA_W/8-1:0] wstrb_q;

  // TODO: Register map
  // 0x00 -> writable gpio_out register
  // 0x04 -> read-only gpio_in value

  // TODO: Write logic
  // If AWADDR == 0x00, update gpio_out using WSTRB
  // If AWADDR == 0x04, either ignore write or return SLVERR
  // If invalid address, return SLVERR

  // TODO: Read logic
  // ARADDR == 0x00 -> return gpio_out
  // ARADDR == 0x04 -> return gpio_in
  // else return 0 with SLVERR

  // TODO: Response behavior
  // BVALID held until BREADY
  // RVALID held until RREADY

  // TODO: Reset
  // Clear gpio_out to 0
  // Deassert BVALID/RVALID

endmodule
