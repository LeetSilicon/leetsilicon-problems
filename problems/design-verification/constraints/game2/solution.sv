// Two Matrices Unique Minimums
class unique_minimums extends uvm_object;
  rand bit [7:0] m1[3][3];
  rand bit [7:0] m2[3][3];
  rand bit [7:0] min1, min2;
  
  constraint c_bounds {
    foreach (m1[i,j]) m1[i][j] inside {[1:50]};
    foreach (m2[i,j]) m2[i][j] inside {[1:50]};
  }
  
  constraint c_min1 {
    foreach (m1[i,j]) min1 <= m1[i][j];
    min1 == m1[0][0] || min1 == m1[0][1] || min1 == m1[0][2] ||
    min1 == m1[1][0] || min1 == m1[1][1] || min1 == m1[1][2] ||
    min1 == m1[2][0] || min1 == m1[2][1] || min1 == m1[2][2];
  }
  
  constraint c_min2 {
    foreach (m2[i,j]) min2 <= m2[i][j];
    min2 == m2[0][0] || min2 == m2[0][1] || min2 == m2[0][2] ||
    min2 == m2[1][0] || min2 == m2[1][1] || min2 == m2[1][2] ||
    min2 == m2[2][0] || min2 == m2[2][1] || min2 == m2[2][2];
  }
  
  constraint c_unique_mins {
    min1 != min2;
  }
endclass
