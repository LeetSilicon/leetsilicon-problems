module apb_slave #(
  parameter DATA_WIDTH = 32,
  parameter ADDR_WIDTH = 8
)(
  input  logic                      PCLK,
  input  logic                      PRESETn,
  // APB signals
  input  logic                      PSEL,
  input  logic                      PENABLE,
  input  logic                      PWRITE,
  input  logic [ADDR_WIDTH-1:0]     PADDR,
  input  logic [DATA_WIDTH-1:0]     PWDATA,
  output logic [DATA_WIDTH-1:0]     PRDATA,
  output logic                      PREADY,
  output logic                      PSLVERR
);
  localparam ADDR_REG0 = 8'h00;
  localparam ADDR_REG1 = 8'h04;
  localparam ADDR_REG2 = 8'h08;

  logic [DATA_WIDTH-1:0] reg0;
  logic [DATA_WIDTH-1:0] reg1;   // Read-only (hardcoded for demo)
  logic                   addr_valid;

  assign addr_valid = (PADDR == ADDR_REG0) || (PADDR == ADDR_REG1) || (PADDR == ADDR_REG2);

  // Zero-wait-state: always ready
  assign PREADY  = 1'b1;
  assign PSLVERR = PSEL && PENABLE && !addr_valid;

  // Transfer complete condition: PSEL && PENABLE && PREADY
  // Write
  always_ff @(posedge PCLK or negedge PRESETn) begin
    if (!PRESETn) begin
      reg0 <= '0;
    end else if (PSEL && PENABLE && PREADY && PWRITE) begin
      case (PADDR)
        ADDR_REG0: reg0 <= PWDATA;
        default: ;
      endcase
    end
  end

  // Read (combinational)
  always_comb begin
    PRDATA = '0;
    if (!PWRITE) begin
      case (PADDR)
        ADDR_REG0: PRDATA = reg0;
        ADDR_REG1: PRDATA = 32'hDEAD_C0DE;   // Hardcoded read-only
        ADDR_REG2: PRDATA = 32'hCAFE_BABE;
        default:   PRDATA = '0;
      endcase
    end
  end
endmodule