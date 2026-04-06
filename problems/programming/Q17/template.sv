class Solution:
  def containsNearbyDuplicate(self, nums: list[int], k: int) -> bool:
    # TODO
    return False

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  k = int(input())

  print(sol.containsNearbyDuplicate(nums, k))
