class Solution:
  def isSubset(self, a: list[int], b: list[int]) -> bool:
    # TODO
    return False

if __name__ == "__main__":
  sol = Solution()

  n1 = int(input())
  a = list(map(int, input().split()))

  n2 = int(input())
  b = list(map(int, input().split()))

  print(sol.isSubset(a, b))
