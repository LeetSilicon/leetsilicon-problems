class Solution:
  def reverseString(self, s: list[str]) -> None:
    # TODO
    pass

if __name__ == "__main__":
  sol = Solution()

  s = list(input().strip())
  sol.reverseString(s)
  print("".join(s))
