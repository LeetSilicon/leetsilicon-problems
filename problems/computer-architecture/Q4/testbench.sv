module tb;
  logic [19:0] req_tag;
  logic [19:0] way_tag [4];
  logic [3:0]  way_valid;
  logic [3:0]  way_match;
  logic        hit, miss, multi_hit_error;
  logic [1:0]  hit_way;
  int          p = 0, f = 0;

  cache_tag_cmp #(.TAG_W(20), .N_WAYS(4)) dut (.*);

  initial begin
    // Single hit.
    way_valid  = 4'b1111;
    way_tag[0] = 20'hA;
    way_tag[1] = 20'hB;
    way_tag[2] = 20'hC;
    way_tag[3] = 20'hD;
    req_tag    = 20'hC;
    #1;
    if (hit && !miss && hit_way == 2 && way_match == 4'b0100 && !multi_hit_error) begin
      p++;
      $display("PASS: single hit");
    end else begin
      f++;
      $display("FAIL: single hit");
    end

    // All invalid => miss.
    way_valid = 4'b0000;
    req_tag   = 20'hB;
    #1;
    if (!hit && miss) begin
      p++;
      $display("PASS: invalid ways miss");
    end else begin
      f++;
      $display("FAIL: invalid miss");
    end

    // Multi-hit => lowest index wins.
    way_valid  = 4'b1010;
    way_tag[1] = 20'h55;
    way_tag[3] = 20'h55;
    req_tag    = 20'h55;
    #1;
    if (hit && hit_way == 1 && multi_hit_error) begin
      p++;
      $display("PASS: multi-hit resolution");
    end else begin
      f++;
      $display("FAIL: multi-hit hit_way=%0d err=%0b", hit_way, multi_hit_error);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule