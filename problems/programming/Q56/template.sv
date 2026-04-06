class Solution:
  def countOccurrences(self, nums: list[int], target: int) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  print(sol.countOccurrences(nums, target))
