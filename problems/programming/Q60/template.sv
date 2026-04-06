class Solution:
  def productExceptSelf(self, nums: list[int]) -> list[int]:
    # TODO
    return []

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  res = sol.productExceptSelf(nums)
  print(*res)
