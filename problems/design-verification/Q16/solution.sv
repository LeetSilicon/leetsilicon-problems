// Adjacent Elements Distinct
class adj_distinct extends uvm_object;
  rand bit [3:0] matrix[4][4];
  
  constraint c_adj_horiz {
    foreach (matrix[i,j]) {
      if (j > 0) matrix[i][j] != matrix[i][j-1];
    }
  }
  
  constraint c_adj_vert {
    foreach (matrix[i,j]) {
      if (i > 0) matrix[i][j] != matrix[i-1][j];
    }
  }
  
  constraint c_bounds {
    foreach (matrix[i,j]) matrix[i][j] inside {[1:8]};
  }
endclass
