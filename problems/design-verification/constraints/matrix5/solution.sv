// Matrix 90° Rotation
class matrix_rotation extends uvm_object;
  rand bit [7:0] original[4][4];
  rand bit [7:0] rotated[4][4];
  
  constraint c_bounds {
    foreach (original[i,j]) original[i][j] inside {[1:100]};
  }
  
  // rotated[j][N-1-i] = original[i][j] for 90° clockwise
  constraint c_rotate {
    foreach (original[i,j]) {
      rotated[j][3-i] == original[i][j];
    }
  }
endclass
