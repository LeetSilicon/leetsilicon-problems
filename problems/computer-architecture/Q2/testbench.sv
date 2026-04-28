module tb;

  logic clk;
  logic rst_n;
  logic access_valid;
  logic [1:0] access_way;
  logic [5:0] access_set;   // must match NUM_SETS=64
  logic [1:0] victim_way;

  int pass = 0, fail = 0;

  // DUT
  cache_plru #(.NUM_SETS(64), .N_WAYS(4)) dut (
    .clk(clk),
    .rst_n(rst_n),
    .access_valid(access_valid),
    .access_set(access_set),
    .access_way(access_way),
    .victim_way(victim_way)
  );

  // -----------------------------
  // GOLDEN MODEL (4-way PLRU tree)
  // -----------------------------
  logic [2:0] ref_tree [64];

  function automatic logic [1:0] ref_victim(input logic [2:0] t);
    logic [1:0] v;
    int node;

    node = 0;
    v = '0;

    for (int i = 0; i < 2; i++) begin
      if (t[node] == 1'b0) begin
        v[1-i] = 1'b0;
        node = 2*node + 1;
      end
      else begin
        v[1-i] = 1'b1;
        node = 2*node + 2;
      end
    end

    return v;
  endfunction

  function automatic logic [2:0] ref_update(input logic [2:0] t, input logic [1:0] way);
    logic [2:0] nt;
    int node;

    nt = t;
    node = 0;

    for (int i = 0; i < 2; i++) begin
      logic dir;
      dir = way[1-i];

      nt[node] = ~dir;

      if (dir == 1'b0)
        node = 2*node + 1;
      else
        node = 2*node + 2;
    end

    return nt;
  endfunction

  // -----------------------------
  // CLOCK
  // -----------------------------
  initial clk = 0;
  always #5 clk = ~clk;

  // -----------------------------
  // CHECK TASK
  // -----------------------------
  task check(string name, logic [5:0] set_id);
    logic [1:0] exp;
    exp = ref_victim(ref_tree[set_id]);
    #1;

    if (victim_way === exp) begin
      pass++;
      $display("PASS: %s | victim=%0d", name, victim_way);
    end
    else begin
      fail++;
      $display("FAIL: %s | exp=%0d got=%0d", name, exp, victim_way);
    end
  endtask

  // -----------------------------
  // TEST SEQUENCE
  // -----------------------------
  initial begin
    // init TB signals
    rst_n = 0;
    access_valid = 0;
    access_set = 0;
    access_way = 0;

    // init golden model
    for (int s = 0; s < 64; s++)
      ref_tree[s] = '0;

    // reset
    repeat (2) @(posedge clk);
    rst_n = 1;
    @(posedge clk);

    // -------------------------
    // TEST 1 - Cold Miss
    // -------------------------
    access_set = 0;
    access_valid = 0;
    #1;
    check("TEST1 Cold Miss", 0);

    // -------------------------
    // TEST 2 - Access way 0
    // -------------------------
    @(negedge clk);
    access_valid = 1;
    access_way   = 0;
    access_set   = 0;

    @(posedge clk);
    ref_tree[0] = ref_update(ref_tree[0], 0);
    access_valid = 0;
    check("TEST2 Access way0", 0);

    // -------------------------
    // TEST 3 - Access way 3
    // -------------------------
    @(negedge clk);
    access_valid = 1;
    access_way   = 3;
    access_set   = 0;

    @(posedge clk);
    ref_tree[0] = ref_update(ref_tree[0], 3);
    access_valid = 0;
    check("TEST3 Access way3", 0);

    // -------------------------
    // TEST 4 - Access way 1
    // -------------------------
    @(negedge clk);
    access_valid = 1;
    access_way   = 1;
    access_set   = 0;

    @(posedge clk);
    ref_tree[0] = ref_update(ref_tree[0], 1);
    access_valid = 0;
    check("TEST4 Access way1", 0);

    // -------------------------
    // TEST 5 - Repeated access stability
    // -------------------------
    @(negedge clk);
    access_valid = 1;
    access_way   = 1;
    access_set   = 0;

    @(posedge clk);
    ref_tree[0] = ref_update(ref_tree[0], 1);
    access_valid = 0;
    check("TEST5 Repeated access stability", 0);

    // -------------------------
    // TEST 6 - Full rotation stress
    // -------------------------
    for (int i = 0; i < 4; i++) begin
      @(negedge clk);
      access_valid = 1;
      access_way   = i[1:0];
      access_set   = 0;

      @(posedge clk);
      ref_tree[0] = ref_update(ref_tree[0], i[1:0]);
      access_valid = 0;
    end
    check("TEST6 Full PLRU stress", 0);

    // -------------------------
    // REPORT
    // -------------------------
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
