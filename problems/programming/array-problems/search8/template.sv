class Solution:
  def findMedianSortedArrays(self, a: list[int], b: list[int]) -> float:
    # TODO
    return 0.0

if __name__ == "__main__":
  sol = Solution()

  n1 = int(input())
  a = list(map(int, input().split()))

  n2 = int(input())
  b = list(map(int, input().split()))

  print(sol.findMedianSortedArrays(a, b))
