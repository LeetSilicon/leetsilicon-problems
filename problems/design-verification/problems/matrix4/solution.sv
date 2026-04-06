// Sub-Square Maximum Constraint
class sub_square_max extends uvm_object;
  rand bit [7:0] matrix[4][4];
  
  constraint c_bounds {
    foreach (matrix[i,j]) matrix[i][j] inside {[1:50]};
  }
  
  // Every 2x2 sub-square has max <= 30
  constraint c_sub_square {
    foreach (matrix[i,j]) {
      if (i < 3 && j < 3) {
        matrix[i][j] <= 30;
        matrix[i][j+1] <= 30;
        matrix[i+1][j] <= 30;
        matrix[i+1][j+1] <= 30;
      }
    }
  }
endclass
