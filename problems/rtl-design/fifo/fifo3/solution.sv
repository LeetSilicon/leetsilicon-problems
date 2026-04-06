module fifo_width_conv #(
  parameter WRITE_WIDTH = 32,
  parameter READ_WIDTH  = 8,
  parameter DEPTH_UNITS = 16   // storage depth in min(WRITE_WIDTH, READ_WIDTH) units
)(
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    write_en,
  input  logic [WRITE_WIDTH-1:0]  write_data,
  output logic                    full,
  input  logic                    read_en,
  output logic [READ_WIDTH-1:0]   read_data,
  output logic                    empty
);
  localparam UNIT_WIDTH  = (WRITE_WIDTH < READ_WIDTH) ? WRITE_WIDTH : READ_WIDTH;
  localparam WRITE_UNITS = WRITE_WIDTH / UNIT_WIDTH;
  localparam READ_UNITS  = READ_WIDTH  / UNIT_WIDTH;
  localparam ADDR_W      = (DEPTH_UNITS <= 1) ? 1 : $clog2(DEPTH_UNITS);
  localparam COUNT_W     = $clog2(DEPTH_UNITS + 1);
  localparam int unsigned DEPTH_UNITS_INT = DEPTH_UNITS;
  localparam logic [COUNT_W-1:0] WRITE_UNITS_COUNT = COUNT_W'(WRITE_UNITS);
  localparam logic [COUNT_W-1:0] READ_UNITS_COUNT  = COUNT_W'(READ_UNITS);
  localparam logic [COUNT_W-1:0] DEPTH_UNITS_COUNT = COUNT_W'(DEPTH_UNITS);

  logic [UNIT_WIDTH-1:0] mem [0:DEPTH_UNITS-1];
  logic [ADDR_W-1:0]     wr_ptr, rd_ptr;
  logic [COUNT_W-1:0]    count_units;

  function automatic [ADDR_W-1:0] ptr_add(
    input [ADDR_W-1:0] base,
    input int unsigned delta
  );
    int unsigned tmp;
    begin
      tmp = int'(base) + delta;
      ptr_add = ADDR_W'(tmp % DEPTH_UNITS_INT);
    end
  endfunction

  wire write_fire = write_en && !full;
  wire read_fire  = read_en  && !empty;

  assign full  = (count_units + WRITE_UNITS_COUNT > DEPTH_UNITS_COUNT);
  assign empty = (count_units < READ_UNITS_COUNT);

  // Write path: break incoming word into UNIT_WIDTH chunks, LSB-first
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      wr_ptr <= '0;
    end else if (write_fire) begin
      for (int i = 0; i < WRITE_UNITS; i++) begin
        mem[ptr_add(wr_ptr, i)] <= write_data[i*UNIT_WIDTH +: UNIT_WIDTH];
      end
      wr_ptr <= ptr_add(wr_ptr, WRITE_UNITS);
    end
  end

  // Read path: assemble outgoing word from UNIT_WIDTH chunks, LSB-first
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      rd_ptr    <= '0;
      read_data <= '0;
    end else if (read_fire) begin
      for (int i = 0; i < READ_UNITS; i++) begin
        read_data[i*UNIT_WIDTH +: UNIT_WIDTH] <= mem[ptr_add(rd_ptr, i)];
      end
      rd_ptr <= ptr_add(rd_ptr, READ_UNITS);
    end
  end

  // Occupancy in UNIT_WIDTH chunks
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count_units <= '0;
    end else begin
      unique case ({write_fire, read_fire})
        2'b10:   count_units <= count_units + WRITE_UNITS_COUNT;
        2'b01:   count_units <= count_units - READ_UNITS_COUNT;
        2'b11:   count_units <= count_units + WRITE_UNITS_COUNT - READ_UNITS_COUNT;
        default: count_units <= count_units;
      endcase
    end
  end
endmodule