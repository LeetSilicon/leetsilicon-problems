class Solution:
  def subarraySumIndices(self, arr: list[int], target: int) -> list[int]:
    # TODO
    return [-1]

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  arr = list(map(int, input().split()))
  target = int(input())

  res = sol.subarraySumIndices(arr, target)
  print(*res)
