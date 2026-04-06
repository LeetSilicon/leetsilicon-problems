class Solution:
  def longestCommonPrefix(self, strs: list[str]) -> str:
    # TODO: handle empty input
    return ""

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  strs = [input().strip() for _ in range(n)]
  print(sol.longestCommonPrefix(strs))
