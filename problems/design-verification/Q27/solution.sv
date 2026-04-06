// 8 Queens Problem
class eight_queens extends uvm_object;
  rand int unsigned col[8]; // col[row] = column position of queen in that row
  
  constraint c_range {
    foreach (col[i]) col[i] inside {[0:7]};
  }
  
  constraint c_unique_cols {
    unique {col};
  }
  
  constraint c_diagonals {
    foreach (col[i]) {
      foreach (col[j]) {
        if (i < j) {
          (col[i] - col[j]) != (i - j);
          (col[i] - col[j]) != (j - i);
        }
      }
    }
  }
endclass
