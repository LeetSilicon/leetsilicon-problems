module gpio_mm #(
  parameter GPIO_WIDTH = 8
)(
  input  logic                      clk,
  input  logic                      rst_n,
  // Memory-mapped bus
  input  logic [3:0]                address,
  input  logic [GPIO_WIDTH-1:0]     write_data,
  input  logic                      write_en,
  input  logic                      read_en,
  output logic [GPIO_WIDTH-1:0]     read_data,
  // GPIO pins
  inout  wire  [GPIO_WIDTH-1:0]     gpio_pins
);
  localparam ADDR_OUT = 4'h0;
  localparam ADDR_IN  = 4'h4;
  localparam ADDR_DIR = 4'h8;

  logic [GPIO_WIDTH-1:0] gpio_out_reg;
  logic [GPIO_WIDTH-1:0] gpio_dir_reg;

  // Tri-state drive: dir=1 → output, dir=0 → high-Z
  genvar i;
  generate
    for (i = 0; i < GPIO_WIDTH; i++) begin : tristate
      assign gpio_pins[i] = gpio_dir_reg[i] ? gpio_out_reg[i] : 1'bz;
    end
  endgenerate

  // Write decode
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      gpio_out_reg <= '0;
      gpio_dir_reg <= '0;
    end else if (write_en) begin
      case (address)
        ADDR_OUT: gpio_out_reg <= write_data;
        ADDR_DIR: gpio_dir_reg <= write_data;
        default: ;  // Ignore invalid addresses
      endcase
    end
  end

  // Read decode (combinational)
  always_comb begin
    case (address)
      ADDR_OUT: read_data = gpio_out_reg;
      ADDR_IN:  read_data = gpio_pins;
      ADDR_DIR: read_data = gpio_dir_reg;
      default:  read_data = '0;
    endcase
  end
endmodule