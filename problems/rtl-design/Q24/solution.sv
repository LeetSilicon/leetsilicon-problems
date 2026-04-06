module axi_gpio #(
  parameter GPIO_WIDTH = 32
)(
  input  logic                    ACLK,
  input  logic                    ARESETn,
  // AXI-Lite write
  input  logic                    AWVALID, output logic AWREADY,
  input  logic [31:0]             AWADDR,
  input  logic                    WVALID,  output logic WREADY,
  input  logic [GPIO_WIDTH-1:0]   WDATA,
  input  logic [3:0]              WSTRB,
  output logic                    BVALID,  input  logic BREADY,
  output logic [1:0]              BRESP,
  // AXI-Lite read
  input  logic                    ARVALID, output logic ARREADY,
  input  logic [31:0]             ARADDR,
  output logic                    RVALID,  input  logic RREADY,
  output logic [GPIO_WIDTH-1:0]   RDATA,
  output logic [1:0]              RRESP,
  // GPIO
  input  logic [GPIO_WIDTH-1:0]   gpio_in,
  output logic [GPIO_WIDTH-1:0]   gpio_out
);
  localparam ADDR_OUT = 32'h00;
  localparam ADDR_IN  = 32'h04;

  logic aw_done, w_done;
  logic [31:0] aw_addr_lat;
  logic [GPIO_WIDTH-1:0] w_data_lat;
  logic write_err;

  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;
  assign ARREADY = !RVALID;

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      aw_done <= 0; aw_addr_lat <= '0;
    end else begin
      if (AWVALID && AWREADY) begin aw_done <= 1; aw_addr_lat <= AWADDR; end
      if (BVALID && BREADY)   aw_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      w_done <= 0; w_data_lat <= '0;
    end else begin
      if (WVALID && WREADY) begin w_done <= 1; w_data_lat <= WDATA; end
      if (BVALID && BREADY)  w_done <= 0;
    end
  end

  assign write_err = aw_done && (aw_addr_lat == ADDR_IN);

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      gpio_out <= '0;
    end else if (aw_done && w_done && !BVALID) begin
      if (aw_addr_lat == ADDR_OUT) gpio_out <= w_data_lat;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      BVALID <= 0; BRESP <= 2'b00;
    end else begin
      if (aw_done && w_done && !BVALID) begin
        BVALID <= 1;
        BRESP  <= write_err ? 2'b10 : 2'b00;   // SLVERR or OKAY
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
          ADDR_OUT: begin RDATA <= gpio_out; RRESP <= 2'b00; end
          ADDR_IN:  begin RDATA <= gpio_in;  RRESP <= 2'b00; end
          default:  begin RDATA <= '0;       RRESP <= 2'b10; end
        endcase
      end else if (RVALID && RREADY) begin
        RVALID <= 0;
      end
    end
  end
endmodule