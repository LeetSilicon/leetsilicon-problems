module axi_read_only_status #(
  parameter VERSION = 32'h0000_0001
)(
  input  logic        ACLK,
  input  logic        ARESETn,
  input  logic [31:0] status_in,
  // Write (always error)
  input  logic        AWVALID, output logic AWREADY, input  logic [31:0] AWADDR,
  input  logic        WVALID,  output logic WREADY,  input  logic [31:0] WDATA, input logic [3:0] WSTRB,
  output logic        BVALID,  input  logic BREADY,  output logic [1:0]  BRESP,
  // Read
  input  logic        ARVALID, output logic ARREADY, input  logic [31:0] ARADDR,
  output logic        RVALID,  input  logic RREADY,  output logic [31:0] RDATA, output logic [1:0] RRESP
);
  logic aw_done, w_done;

  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;
  assign ARREADY = !RVALID;

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin aw_done <= 0; end
    else begin
      if (AWVALID && AWREADY) aw_done <= 1;
      if (BVALID && BREADY)   aw_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin w_done <= 0; end
    else begin
      if (WVALID && WREADY) w_done <= 1;
      if (BVALID && BREADY) w_done <= 0;
    end
  end

  // All writes return SLVERR
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin BVALID <= 0; BRESP <= 2'b10; end
    else begin
      if (aw_done && w_done && !BVALID) begin BVALID <= 1; BRESP <= 2'b10; end
      else if (BVALID && BREADY) BVALID <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin RVALID <= 0; RDATA <= '0; RRESP <= 2'b00; end
    else begin
      if (ARVALID && ARREADY) begin
        RVALID <= 1;
        case (ARADDR)
          32'h00: begin RDATA <= VERSION;   RRESP <= 2'b00; end
          32'h04: begin RDATA <= status_in; RRESP <= 2'b00; end
          default: begin RDATA <= '0;       RRESP <= 2'b10; end
        endcase
      end else if (RVALID && RREADY) begin
        RVALID <= 0;
      end
    end
  end
endmodule