// Sudoku Puzzle Constraints
class sudoku extends uvm_object;
  rand bit [3:0] grid[9][9]; // values 1-9
  
  constraint c_range {
    foreach (grid[i,j]) grid[i][j] inside {[1:9]};
  }
  
  // Row uniqueness
  constraint c_rows {
    foreach (grid[i,]) {
      unique {grid[i][0], grid[i][1], grid[i][2], grid[i][3],
              grid[i][4], grid[i][5], grid[i][6], grid[i][7], grid[i][8]};
    }
  }
  
  // Column uniqueness
  constraint c_cols {
    foreach (grid[,j]) {
      unique {grid[0][j], grid[1][j], grid[2][j], grid[3][j],
              grid[4][j], grid[5][j], grid[6][j], grid[7][j], grid[8][j]};
    }
  }
  
  // 3x3 box uniqueness (iterate over 9 boxes)
  constraint c_boxes {
    foreach (grid[i,j]) {
      if (i % 3 == 0 && j % 3 == 0) {
        unique {grid[i][j],     grid[i][j+1],   grid[i][j+2],
                grid[i+1][j],   grid[i+1][j+1], grid[i+1][j+2],
                grid[i+2][j],   grid[i+2][j+1], grid[i+2][j+2]};
      }
    }
  }
endclass
