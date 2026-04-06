module traffic_light #(
  parameter NS_GREEN_TIME  = 10,
  parameter NS_YELLOW_TIME = 2,
  parameter EW_GREEN_TIME  = 10,
  parameter EW_YELLOW_TIME = 2
)(
  input  logic clk,
  input  logic rst_n,
  output logic ns_red,
  output logic ns_yellow,
  output logic ns_green,
  output logic ew_red,
  output logic ew_yellow,
  output logic ew_green
);
  typedef enum logic [1:0] {
    NS_GREEN,
    NS_YELLOW,
    EW_GREEN,
    EW_YELLOW
  } state_t;

  state_t       state;
  logic [3:0]   timer;

  // State register + timer
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      state <= NS_GREEN;
      timer <= NS_GREEN_TIME - 1;
    end else begin
      if (timer == 0) begin
        case (state)
          NS_GREEN:  begin state <= NS_YELLOW; timer <= NS_YELLOW_TIME - 1; end
          NS_YELLOW: begin state <= EW_GREEN;  timer <= EW_GREEN_TIME  - 1; end
          EW_GREEN:  begin state <= EW_YELLOW; timer <= EW_YELLOW_TIME - 1; end
          EW_YELLOW: begin state <= NS_GREEN;  timer <= NS_GREEN_TIME  - 1; end
        endcase
      end else begin
        timer <= timer - 1;
      end
    end
  end

  // Moore outputs — depend only on state
  always_comb begin
    {ns_red, ns_yellow, ns_green} = 3'b100;   // Default: NS red
    {ew_red, ew_yellow, ew_green} = 3'b100;   // Default: EW red
    case (state)
      NS_GREEN:  begin {ns_red, ns_yellow, ns_green} = 3'b001; {ew_red, ew_yellow, ew_green} = 3'b100; end
      NS_YELLOW: begin {ns_red, ns_yellow, ns_green} = 3'b010; {ew_red, ew_yellow, ew_green} = 3'b100; end
      EW_GREEN:  begin {ns_red, ns_yellow, ns_green} = 3'b100; {ew_red, ew_yellow, ew_green} = 3'b001; end
      EW_YELLOW: begin {ns_red, ns_yellow, ns_green} = 3'b100; {ew_red, ew_yellow, ew_green} = 3'b010; end
    endcase
  end
endmodule