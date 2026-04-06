class Solution:
  def commonElements3(self, a: list[int], b: list[int], c: list[int]) -> list[int]:
    # TODO
    return []

if __name__ == "__main__":
  sol = Solution()

  n1 = int(input())
  a = list(map(int, input().split()))

  n2 = int(input())
  b = list(map(int, input().split()))

  n3 = int(input())
  c = list(map(int, input().split()))

  res = sol.commonElements3(a, b, c)
  print(*res)
