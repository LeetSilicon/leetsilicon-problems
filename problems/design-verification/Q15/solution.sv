// Binary Matrix with Sum Constraint
class binary_matrix_sum extends uvm_object;
  rand bit matrix[4][4];
  
  constraint c_row_sums {
    foreach (matrix[i,]) {
      matrix[i][0] + matrix[i][1] + matrix[i][2] + matrix[i][3] == 2;
    }
  }
  
  constraint c_col_sums {
    matrix[0][0] + matrix[1][0] + matrix[2][0] + matrix[3][0] == 2;
    matrix[0][1] + matrix[1][1] + matrix[2][1] + matrix[3][1] == 2;
    matrix[0][2] + matrix[1][2] + matrix[2][2] + matrix[3][2] == 2;
    matrix[0][3] + matrix[1][3] + matrix[2][3] + matrix[3][3] == 2;
  }
endclass
