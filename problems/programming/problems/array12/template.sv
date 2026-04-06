class Solution:
  def allPairsWithSum(self, nums: list[int], target: int) -> list[tuple[int, int]]:
    # TODO
    return []

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  res = sol.allPairsWithSum(nums, target)
  for a, b in res:
    print(a, b)
