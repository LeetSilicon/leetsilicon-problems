module axi_write_only_ctrl (
  input  logic        ACLK,
  input  logic        ARESETn,
  // Write
  input  logic        AWVALID, output logic AWREADY, input  logic [31:0] AWADDR,
  input  logic        WVALID,  output logic WREADY,  input  logic [31:0] WDATA, input logic [3:0] WSTRB,
  output logic        BVALID,  input  logic BREADY,  output logic [1:0]  BRESP,
  // Read (always error)
  input  logic        ARVALID, output logic ARREADY, input  logic [31:0] ARADDR,
  output logic        RVALID,  input  logic RREADY,  output logic [31:0] RDATA, output logic [1:0] RRESP,
  // Control outputs
  output logic        enable_reg,
  output logic [31:0] mode_reg
);
  logic aw_done, w_done;
  logic [31:0] aw_lat, wd_lat;

  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;
  assign ARREADY = !RVALID;

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin aw_done <= 0; aw_lat <= '0; end
    else begin
      if (AWVALID && AWREADY) begin aw_done <= 1; aw_lat <= AWADDR; end
      if (BVALID && BREADY)   aw_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin w_done <= 0; wd_lat <= '0; end
    else begin
      if (WVALID && WREADY) begin w_done <= 1; wd_lat <= WDATA; end
      if (BVALID && BREADY) w_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin enable_reg <= 0; mode_reg <= '0; end
    else if (aw_done && w_done && !BVALID) begin
      case (aw_lat)
        32'h00: enable_reg <= wd_lat[0];
        32'h04: mode_reg   <= wd_lat;
        default: ;
      endcase
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin BVALID <= 0; BRESP <= 2'b00; end
    else begin
      if (aw_done && w_done && !BVALID) begin
        BVALID <= 1;
        BRESP  <= (aw_lat inside {32'h00, 32'h04}) ? 2'b00 : 2'b10;
      end else if (BVALID && BREADY) BVALID <= 0;
    end
  end

  // All reads return SLVERR
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin RVALID <= 0; RDATA <= '0; RRESP <= 2'b10; end
    else begin
      if (ARVALID && ARREADY) begin RVALID <= 1; RDATA <= '0; RRESP <= 2'b10; end
      else if (RVALID && RREADY) RVALID <= 0;
    end
  end
endmodule