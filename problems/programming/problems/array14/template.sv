class Solution:
  def subsets(self, nums: list[int]) -> list[list[int]]:
    # TODO
    return []

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  res = sol.subsets(nums)
  for sub in res:
    print(*sub)
