class Solution:
  def searchRange(self, nums: list[int], target: int) -> list[int]:
    # TODO
    return [-1, -1]

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  res = sol.searchRange(nums, target)
  print(res[0], res[1])
