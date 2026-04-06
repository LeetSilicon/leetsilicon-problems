module reg_rename #(
  parameter ARCH = 32,
  parameter PHYS = 64
)(
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         rename_req,
  input  logic                         checkpoint_save,
  input  logic                         flush,
  input  logic                         commit_free,
  input  logic [$clog2(ARCH)-1:0]      src1_arch,
  input  logic [$clog2(ARCH)-1:0]      src2_arch,
  input  logic [$clog2(ARCH)-1:0]      dst_arch,
  input  logic [$clog2(PHYS)-1:0]      free_preg,
  output logic [$clog2(PHYS)-1:0]      src1_preg,
  output logic [$clog2(PHYS)-1:0]      src2_preg,
  output logic [$clog2(PHYS)-1:0]      new_preg,
  output logic [$clog2(PHYS)-1:0]      old_preg,
  output logic                         rename_grant,
  output logic                         stall
);
  logic [$clog2(PHYS)-1:0] map_table        [ARCH];
  logic [$clog2(PHYS)-1:0] checkpoint_table [ARCH];
  logic [PHYS-1:0]         free_list;

  assign src1_preg = map_table[src1_arch];
  assign src2_preg = map_table[src2_arch];
  assign old_preg  = map_table[dst_arch];
  assign stall     = (free_list == '0);
  assign rename_grant = rename_req && !stall;

  always_comb begin
    new_preg = '0;
    for (int i = 0; i < PHYS; i++) begin
      if (free_list[i]) begin
        new_preg = i[$clog2(PHYS)-1:0];
        break;
      end
    end
  end

  // Combinational: compute rebuilt free list from checkpoint (synthesizable)
  logic [PHYS-1:0] rebuilt_free_list;
  always_comb begin
    logic [PHYS-1:0] used;
    used = '0;
    for (int a = 0; a < ARCH; a++) begin
      used[checkpoint_table[a]] = 1'b1;
    end
    rebuilt_free_list = ~used;
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int a = 0; a < ARCH; a++) begin
        map_table[a]        <= a[$clog2(PHYS)-1:0];
        checkpoint_table[a] <= a[$clog2(PHYS)-1:0];
      end
      free_list <= {{(PHYS-ARCH){1'b1}}, {ARCH{1'b0}}};
    end else begin
      if (checkpoint_save) begin
        for (int a = 0; a < ARCH; a++) begin
          checkpoint_table[a] <= map_table[a];
        end
      end

      if (flush) begin
        for (int a = 0; a < ARCH; a++) begin
          map_table[a] <= checkpoint_table[a];
        end
        free_list <= rebuilt_free_list;
      end else begin
        if (rename_req && !stall) begin
          map_table[dst_arch] <= new_preg;
          free_list[new_preg] <= 1'b0;
        end
        if (commit_free) begin
          free_list[free_preg] <= 1'b1;
        end
      end
    end
  end
endmodule