// 5 Bits Set with Consecutive Probability
class five_bits_consec extends uvm_object;
  rand bit [15:0] data;
  rand bit consecutive;
  
  constraint c_five_bits {
    $countones(data) == 5;
  }
  
  constraint c_consec_dist {
    consecutive dist {1 := 30, 0 := 70};
  }
  
  constraint c_apply_consec {
    if (consecutive) {
      // 5 consecutive bits set somewhere
      (data & 16'h001F) == 16'h001F ||
      (data & 16'h003E) == 16'h003E ||
      (data & 16'h007C) == 16'h007C ||
      (data & 16'h00F8) == 16'h00F8 ||
      (data & 16'h01F0) == 16'h01F0 ||
      (data & 16'h03E0) == 16'h03E0 ||
      (data & 16'h07C0) == 16'h07C0 ||
      (data & 16'h0F80) == 16'h0F80 ||
      (data & 16'h1F00) == 16'h1F00 ||
      (data & 16'h3E00) == 16'h3E00 ||
      (data & 16'h7C00) == 16'h7C00 ||
      (data & 16'hF800) == 16'hF800;
    }
  }
endclass
