class Solution:
  def coinChange(self, coins: list[int], amount: int) -> int:
    # TODO: Implement coin change problem using DP
    return -1

if __name__ == "__main__":
  sol = Solution()
  n, amount = int(input()), int(input())
  coins = list(map(int, input().split()))
  print(sol.coinChange(coins, amount))
  