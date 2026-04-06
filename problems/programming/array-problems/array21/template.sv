class Solution:
  def threeSum(self, nums: list[int]) -> list[list[int]]:
    # TODO: Implement 3Sum problem
    return []

if __name__ == "__main__":
  sol = Solution()
  nums = list(map(int, input().split()))
  result = sol.threeSum(nums)
  for triplet in result:
    print(" ".join(map(str, triplet)))

  