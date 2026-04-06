// Tic-Tac-Toe Constraints
class tictactoe extends uvm_object;
  rand bit [1:0] board[3][3]; // 0=empty, 1=X, 2=O
  
  constraint c_valid_values {
    foreach (board[i,j]) board[i][j] inside {[0:2]};
  }
  
  // X and O differ by at most 1 (X goes first)
  constraint c_turn_order {
    board[0][0] + board[0][1] + board[0][2] +
    board[1][0] + board[1][1] + board[1][2] +
    board[2][0] + board[2][1] + board[2][2] > 0; // not empty
  }
  
  // Count constraint approach
  function void post_randomize();
    int x_count = 0, o_count = 0;
    foreach (board[i,j]) begin
      if (board[i][j] == 1) x_count++;
      if (board[i][j] == 2) o_count++;
    end
    assert(x_count == o_count || x_count == o_count + 1);
  endfunction
endclass
