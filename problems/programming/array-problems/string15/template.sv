class Solution:
  def findAllOccurrences(self, text: str, pattern: str) -> list[int]:
    # TODO
    return []

if __name__ == "__main__":
  sol = Solution()

  text = input().strip()
  pattern = input().strip()
  res = sol.findAllOccurrences(text, pattern)
  print(*res)
