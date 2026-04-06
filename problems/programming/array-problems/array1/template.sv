class Solution:
  def maxMin(self, nums: list[int]) -> tuple[int, int]:
    # TODO
    return (0, 0)

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  max_val, min_val = sol.maxMin(nums)
  print(max_val, min_val)
