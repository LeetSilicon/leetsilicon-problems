class Solution:
  def findKthLargest(self, nums: list[int], k: int) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  k = int(input())

  print(sol.findKthLargest(nums, k))
