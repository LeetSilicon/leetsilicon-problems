class Solution:
  def moveZeroes(self, nums: list[int]) -> None:
    # TODO
    pass

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  sol.moveZeroes(nums)
  print(*nums)
