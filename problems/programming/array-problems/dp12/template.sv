class Solution:
  def wordBreak(self, s: str, wordDict: list[str]) -> bool:
    # TODO: Implement word break problem using DP
    return False

if __name__ == "__main__":
  sol = Solution()
  s = input()
  wordDict = input().split()
  print("true" if sol.wordBreak(s, wordDict) else "false")
  