// Magic Square
class magic_square extends uvm_object;
  rand bit [7:0] grid[3][3];
  rand bit [7:0] magic_sum;
  
  constraint c_unique_vals {
    unique {grid[0][0], grid[0][1], grid[0][2],
            grid[1][0], grid[1][1], grid[1][2],
            grid[2][0], grid[2][1], grid[2][2]};
  }
  
  constraint c_range {
    foreach (grid[i,j]) grid[i][j] inside {[1:9]};
  }
  
  // All rows sum to magic_sum
  constraint c_row_sum {
    foreach (grid[i,]) {
      grid[i][0] + grid[i][1] + grid[i][2] == magic_sum;
    }
  }
  
  // All cols sum to magic_sum
  constraint c_col_sum {
    grid[0][0] + grid[1][0] + grid[2][0] == magic_sum;
    grid[0][1] + grid[1][1] + grid[2][1] == magic_sum;
    grid[0][2] + grid[1][2] + grid[2][2] == magic_sum;
  }
  
  // Diagonals
  constraint c_diag {
    grid[0][0] + grid[1][1] + grid[2][2] == magic_sum;
    grid[0][2] + grid[1][1] + grid[2][0] == magic_sum;
  }
endclass
