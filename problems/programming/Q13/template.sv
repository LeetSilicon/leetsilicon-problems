class Solution:
  def mergeSorted(self, a: list[int], b: list[int]) -> list[int]:
    # TODO
    return []

if __name__ == "__main__":
  sol = Solution()

  n1 = int(input())
  a = list(map(int, input().split()))

  n2 = int(input())
  b = list(map(int, input().split()))

  res = sol.mergeSorted(a, b)
  print(*res)
