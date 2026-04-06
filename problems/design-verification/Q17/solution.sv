// Unique Row Maximums
class unique_row_max extends uvm_object;
  rand bit [7:0] matrix[4][4];
  rand bit [7:0] row_max[4];
  
  constraint c_bounds {
    foreach (matrix[i,j]) matrix[i][j] inside {[1:50]};
  }
  
  constraint c_row_max_val {
    foreach (row_max[i]) {
      row_max[i] >= matrix[i][0];
      row_max[i] >= matrix[i][1];
      row_max[i] >= matrix[i][2];
      row_max[i] >= matrix[i][3];
      row_max[i] == matrix[i][0] || row_max[i] == matrix[i][1] ||
      row_max[i] == matrix[i][2] || row_max[i] == matrix[i][3];
    }
  }
  
  constraint c_unique_max {
    unique {row_max};
  }
endclass
