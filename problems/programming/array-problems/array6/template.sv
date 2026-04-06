class Solution:
  def missingNumber(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.missingNumber(nums))
