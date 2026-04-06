class Solution:
  def pairSumExists(self, nums: list[int], target: int) -> bool:
    # TODO
    return False

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  print(sol.pairSumExists(nums, target))
