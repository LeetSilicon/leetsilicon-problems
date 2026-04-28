module tb;

  logic [19:0] req_tag;
  logic [19:0] way_tag [4];
  logic [3:0]  way_valid;
  logic [3:0]  way_match;
  logic        hit, miss, multi_hit_error;
  logic [1:0]  hit_way;

  int pass = 0, fail = 0;

  cache_tag_cmp #(.TAG_W(20), .N_WAYS(4)) dut (.*);

  task automatic check(string name, logic ok);
    #1;
    if (ok) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s", name);
    end
  endtask

  initial begin
    // -------------------------
    // TEST 1 - Single hit on way 2
    // -------------------------
    way_valid  = 4'b1111;
    way_tag[0] = 20'hA;
    way_tag[1] = 20'hB;
    way_tag[2] = 20'hC;
    way_tag[3] = 20'hD;
    req_tag    = 20'hC;
    check("TEST1 Single hit way2", hit && !miss && (hit_way == 2) && (way_match == 4'b0100) && !multi_hit_error);

    // -------------------------
    // TEST 2 - All invalid => miss
    // -------------------------
    way_valid = 4'b0000;
    req_tag   = 20'hB;
    check("TEST2 All invalid miss", !hit && miss);

    // -------------------------
    // TEST 3 - All valid no tag match => miss
    // -------------------------
    way_valid  = 4'b1111;
    way_tag[0] = 20'h1;
    way_tag[1] = 20'h2;
    way_tag[2] = 20'h3;
    way_tag[3] = 20'h4;
    req_tag    = 20'hF;
    check("TEST3 All valid no match miss", !hit && miss && (way_match == 4'b0000));

    // -------------------------
    // TEST 4 - Multi-hit lowest way + error
    // -------------------------
    way_valid  = 4'b1010;
    way_tag[1] = 20'h55;
    way_tag[3] = 20'h55;
    req_tag    = 20'h55;
    check("TEST4 Multi-hit way1 and error", hit && (hit_way == 1) && multi_hit_error);

    // -------------------------
    // TEST 5 - Hit implies miss deasserted consistency
    // -------------------------
    way_valid  = 4'b0010;
    way_tag[1] = 20'hACE;
    req_tag    = 20'hACE;
    check("TEST5 Hit miss mutual exclusive", hit && !miss);

    // -------------------------
    // TEST 6 - Single hit way 0
    // -------------------------
    way_valid  = 4'b0001;
    way_tag[0] = 20'h100;
    req_tag    = 20'h100;
    check("TEST6 Single hit way0", hit && (hit_way == 0) && (way_match == 4'b0001));

    $display("=================================");
    $display("TOTAL PASS = %0d", pass);
    $display("TOTAL FAIL = %0d", fail);
    $display("=================================");
    if (fail == 0)
      $display("ALL 6 TESTS PASSED");
    else
      $display("SOME TESTS FAILED");
    $finish;
  end

endmodule
