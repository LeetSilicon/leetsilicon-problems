class Solution:
  def rotate(self, nums: list[int], k: int) -> None:
    # TODO
    pass

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  k = int(input())

  sol.rotate(nums, k)
  print(*nums)
