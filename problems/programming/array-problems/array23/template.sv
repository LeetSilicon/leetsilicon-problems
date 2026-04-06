class Solution:
  def trap(self, height: list[int]) -> int:
    # TODO: Implement trapping rain water
    return 0

if __name__ == "__main__":
  sol = Solution()
  height = list(map(int, input().split()))
  print(sol.trap(height))
  