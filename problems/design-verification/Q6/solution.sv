// 3D Array All Unique
class unique_3d extends uvm_object;
  \`uvm_object_utils(unique_3d)

  rand bit [7:0] cube[3][3][3]; // 27 elements

  function new(string name = "unique_3d");
    super.new(name);
  endfunction
  
  constraint c_all_unique {
    unique {cube[0][0][0], cube[0][0][1], cube[0][0][2],
            cube[0][1][0], cube[0][1][1], cube[0][1][2],
            cube[0][2][0], cube[0][2][1], cube[0][2][2],
            cube[1][0][0], cube[1][0][1], cube[1][0][2],
            cube[1][1][0], cube[1][1][1], cube[1][1][2],
            cube[1][2][0], cube[1][2][1], cube[1][2][2],
            cube[2][0][0], cube[2][0][1], cube[2][0][2],
            cube[2][1][0], cube[2][1][1], cube[2][1][2],
            cube[2][2][0], cube[2][2][1], cube[2][2][2]};
  }
  
  constraint c_bounds {
    foreach (cube[i,j,k]) cube[i][j][k] inside {[0:255]};
  }
endclass
