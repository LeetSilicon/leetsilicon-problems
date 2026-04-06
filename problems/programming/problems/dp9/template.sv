class Solution:
  def rob(self, nums: list[int]) -> int:
    # TODO: Implement house robber problem using DP
    return 0

if __name__ == "__main__":
  sol = Solution()
  n = int(input())
  nums = list(map(int, input().split()))
  print(sol.rob(nums))
  