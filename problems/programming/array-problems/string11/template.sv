class Solution:
  def countVowelsConsonants(self, s: str) -> tuple[int, int]:
    # TODO
    return (0, 0)

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  v, c = sol.countVowelsConsonants(s)
  print(v, c)
