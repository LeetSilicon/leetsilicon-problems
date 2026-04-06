class Solution:
  def firstDuplicate(self, nums: list[int]) -> int:
    # TODO
    return -1

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.firstDuplicate(nums))
