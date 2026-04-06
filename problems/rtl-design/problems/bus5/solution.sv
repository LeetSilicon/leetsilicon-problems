module axi_reg_file (
  input  logic        ACLK,
  input  logic        ARESETn,
  // Write
  input  logic        AWVALID, output logic AWREADY, input  logic [31:0] AWADDR,
  input  logic        WVALID,  output logic WREADY,  input  logic [31:0] WDATA, input logic [3:0] WSTRB,
  output logic        BVALID,  input  logic BREADY,  output logic [1:0]  BRESP,
  // Read
  input  logic        ARVALID, output logic ARREADY, input  logic [31:0] ARADDR,
  output logic        RVALID,  input  logic RREADY,  output logic [31:0] RDATA, output logic [1:0] RRESP
);
  logic [31:0] regs [4];  // reg0=0x00, reg1=0x04, reg2=0x08, reg3=0x0C

  logic aw_done, w_done;
  logic [31:0] aw_lat, wd_lat;
  logic        addr_ok_w, addr_ok_r;

  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;
  assign ARREADY = !RVALID;
  assign addr_ok_w = aw_done && (aw_lat inside {32'h00, 32'h04, 32'h08, 32'h0C});

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      aw_done <= 0; aw_lat <= '0;
    end else begin
      if (AWVALID && AWREADY) begin aw_done <= 1; aw_lat <= AWADDR; end
      if (BVALID && BREADY)   aw_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      w_done <= 0; wd_lat <= '0;
    end else begin
      if (WVALID && WREADY) begin w_done <= 1; wd_lat <= WDATA; end
      if (BVALID && BREADY) w_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      foreach (regs[i]) regs[i] <= '0;
    end else if (aw_done && w_done && !BVALID && addr_ok_w) begin
      case (aw_lat)
        32'h00: regs[0] <= wd_lat;
        32'h04: regs[1] <= wd_lat;
        32'h08: regs[2] <= wd_lat;
        32'h0C: regs[3] <= wd_lat;
      endcase
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      BVALID <= 0; BRESP <= 2'b00;
    end else begin
      if (aw_done && w_done && !BVALID) begin
        BVALID <= 1;
        BRESP  <= addr_ok_w ? 2'b00 : 2'b10;
      end else if (BVALID && BREADY) begin
        BVALID <= 0;
      end
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      RVALID <= 0; RDATA <= '0; RRESP <= 2'b00;
    end else begin
      if (ARVALID && ARREADY) begin
        RVALID <= 1;
        case (ARADDR)
          32'h00: begin RDATA <= regs[0]; RRESP <= 2'b00; end
          32'h04: begin RDATA <= regs[1]; RRESP <= 2'b00; end
          32'h08: begin RDATA <= regs[2]; RRESP <= 2'b00; end
          32'h0C: begin RDATA <= regs[3]; RRESP <= 2'b00; end
          default: begin RDATA <= '0;    RRESP <= 2'b10; end
        endcase
      end else if (RVALID && RREADY) begin
        RVALID <= 0;
      end
    end
  end
endmodule