module axi_lite_single_reg (
  input  logic        ACLK,
  input  logic        ARESETn,
  // Write address channel
  input  logic        AWVALID,
  output logic        AWREADY,
  input  logic [31:0] AWADDR,
  // Write data channel
  input  logic        WVALID,
  output logic        WREADY,
  input  logic [31:0] WDATA,
  input  logic [3:0]  WSTRB,
  // Write response channel
  output logic        BVALID,
  input  logic        BREADY,
  output logic [1:0]  BRESP,
  // Read address channel
  input  logic        ARVALID,
  output logic        ARREADY,
  input  logic [31:0] ARADDR,
  // Read data channel
  output logic        RVALID,
  input  logic        RREADY,
  output logic [31:0] RDATA,
  output logic [1:0]  RRESP
);
  logic [31:0] reg_data;

  // Latch flags for AW and W
  logic aw_done, w_done;
  logic [31:0] aw_addr_lat, w_data_lat;

  // Accept AW immediately when no pending write
  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;

  // AW latch
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      aw_done     <= 0;
      aw_addr_lat <= '0;
    end else begin
      if (AWVALID && AWREADY) begin
        aw_done     <= 1;
        aw_addr_lat <= AWADDR;
      end
      if (BVALID && BREADY) aw_done <= 0;
    end
  end

  // W latch
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      w_done    <= 0;
      w_data_lat <= '0;
    end else begin
      if (WVALID && WREADY) begin
        w_done     <= 1;
        w_data_lat <= WDATA;
      end
      if (BVALID && BREADY) w_done <= 0;
    end
  end

  // Register write when both AW and W received
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      reg_data <= '0;
    end else if (aw_done && w_done && !(BVALID && !BREADY)) begin
      if (aw_addr_lat == 32'h00) reg_data <= w_data_lat;
    end
  end

  // Write response
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      BVALID <= 0;
      BRESP  <= 2'b00;
    end else begin
      if (aw_done && w_done && !BVALID) begin
        BVALID <= 1;
        BRESP  <= 2'b00;  // OKAY
      end else if (BVALID && BREADY) begin
        BVALID <= 0;
      end
    end
  end

  // AR acceptance
  assign ARREADY = !RVALID;

  // Read response
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      RVALID <= 0;
      RDATA  <= '0;
      RRESP  <= 2'b00;
    end else begin
      if (ARVALID && ARREADY) begin
        RVALID <= 1;
        RDATA  <= (ARADDR == 32'h00) ? reg_data : '0;
        RRESP  <= 2'b00;
      end else if (RVALID && RREADY) begin
        RVALID <= 0;
      end
    end
  end
endmodule