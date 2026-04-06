// Knight's Tour / Latin Square (context-dependent)
class latin_square extends uvm_object;
  rand bit [3:0] grid[5][5]; // 5x5 latin square
  
  constraint c_range {
    foreach (grid[i,j]) grid[i][j] inside {[1:5]};
  }
  
  constraint c_rows {
    foreach (grid[i,]) {
      unique {grid[i][0], grid[i][1], grid[i][2], grid[i][3], grid[i][4]};
    }
  }
  
  constraint c_cols {
    foreach (grid[,j]) {
      unique {grid[0][j], grid[1][j], grid[2][j], grid[3][j], grid[4][j]};
    }
  }
endclass
