/**
 * programmingTemplates — Code templates for the "programming" domain.
 * Auto-split from codeTemplates.js
 */

export const programmingTemplates = (qId, language) => {
  if (language === 'cpp') {
    if (qId === "array1") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <algorithm>
#include <utility>
using namespace std;

class Solution {
public:
  // Return {max, min}
  pair<int,int> maxMin(const vector<int>& nums) {
    // TODO: Define behavior for empty nums (throw/undefined/return {0,0}).
    // TODO: Track current max and min.
    return {0, 0};
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  auto result = sol.maxMin(nums);
  cout << result.first << " " << result.second << endl;

  return 0;
}
`;
}

if (qId === "array2") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
  // Reverse nums in-place, O(1) extra space.
  void reverseArray(vector<int>& nums) {
    // TODO
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  sol.reverseArray(nums);

  for (int i = 0; i < n; i++) {
    if (i) cout << " ";
    cout << nums[i];
  }
  cout << endl;

  return 0;
}
`;
}

if (qId === "array3") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  int findKthLargest(vector<int>& nums, int k) {
    // TODO: Validate k (1..nums.size()).
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int k;
  cin >> k;

  cout << sol.findKthLargest(nums, k) << endl;
  return 0;
}
`;
}

if (qId === "array4") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  int firstDuplicate(const vector<int>& nums) {
    // TODO
    return -1;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.firstDuplicate(nums) << endl;
  return 0;
}
`;
}

if (qId === "array5") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  void moveZeroes(vector<int>& nums) {
    // TODO
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  sol.moveZeroes(nums);

  for (int i = 0; i < n; i++) {
    if (i) cout << " ";
    cout << nums[i];
  }
  cout << endl;

  return 0;
}
`;
}

if (qId === "array6") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  int missingNumber(const vector<int>& nums) {
    // TODO
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.missingNumber(nums) << endl;
  return 0;
}
`;
}

if (qId === "array7") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  int majorityElement(const vector<int>& nums) {
    // TODO
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.majorityElement(nums) << endl;
  return 0;
}
`;
}

if (qId === "array8") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  int equilibriumIndex(const vector<int>& nums) {
    // TODO
    return -1;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.equilibriumIndex(nums) << endl;
  return 0;
}
`;
}

if (qId === "array9") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  void rotate(vector<int>& nums, int k) {
    // TODO: handle k %= n and n==0.
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int k;
  cin >> k;

  sol.rotate(nums, k);

  for (int i = 0; i < n; i++) {
    if (i) cout << " ";
    cout << nums[i];
  }
  cout << endl;

  return 0;
}
`;
}

if (qId === "array10") {
  return `
#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  bool pairSumExists(const vector<int>& nums, int target) {
    // TODO
    return false;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int target;
  cin >> target;

  cout << (sol.pairSumExists(nums, target) ? "true" : "false") << endl;
  return 0;
}
`;
}

if (qId === "array11") {
  return `
#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  vector<int> commonElements3(const vector<int>& a,
                           const vector<int>& b,
                           const vector<int>& c) {
    // TODO
    return {};
  }
};

static vector<int> readVec() {
  int n; cin >> n;
  vector<int> v(n);
  for (int i = 0; i < n; i++) cin >> v[i];
  return v;
}

int main() {
  Solution sol;

  vector<int> a = readVec();
  vector<int> b = readVec();
  vector<int> c = readVec();

  auto res = sol.commonElements3(a, b, c);
  for (int i = 0; i < (int)res.size(); i++) {
    if (i) cout << " ";
    cout << res[i];
  }
  cout << endl;

  return 0;
}
`;
}

if (qId === "array12") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
#include <utility>
using namespace std;

class Solution {
public:
  vector<pair<int,int>> allPairsWithSum(const vector<int>& nums, int target) {
    // TODO
    return {};
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int target;
  cin >> target;

  auto res = sol.allPairsWithSum(nums, target);
  for (auto &p : res) {
    cout << p.first << " " << p.second << endl;
  }

  return 0;
}
`;
}

if (qId === "array13") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  vector<int> mergeSorted(const vector<int>& a, const vector<int>& b) {
    // TODO
    return {};
  }
};

static vector<int> readVec() {
  int n; cin >> n;
  vector<int> v(n);
  for (int i = 0; i < n; i++) cin >> v[i];
  return v;
}

int main() {
  Solution sol;

  vector<int> a = readVec();
  vector<int> b = readVec();

  auto res = sol.mergeSorted(a, b);
  for (int i = 0; i < (int)res.size(); i++) {
    if (i) cout << " ";
    cout << res[i];
  }
  cout << endl;

  return 0;
}
`;
}

if (qId === "array14") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  vector<vector<int>> subsets(vector<int>& nums) {
    // TODO
    return {};
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  auto res = sol.subsets(nums);

  // print each subset on its own line
  for (auto &sub : res) {
    for (int i = 0; i < (int)sub.size(); i++) {
        if (i) cout << " ";
        cout << sub[i];
    }
    cout << endl;
  }

  return 0;
}
`;
}

if (qId === "array15") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  bool isSubset(const vector<int>& a, const vector<int>& b) {
    // TODO
    return false;
  }
};

static vector<int> readVec() {
  int n; cin >> n;
  vector<int> v(n);
  for (int i = 0; i < n; i++) cin >> v[i];
  return v;
}

int main() {
  Solution sol;

  vector<int> a = readVec();
  vector<int> b = readVec();

  cout << (sol.isSubset(a, b) ? "true" : "false") << endl;
  return 0;
}
`;
}

if (qId === "array16") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  int longestConsecutive(vector<int>& nums) {
    // TODO
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.longestConsecutive(nums) << endl;
  return 0;
}
`;
}

if (qId === "array17") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  bool containsNearbyDuplicate(vector<int>& nums, int k) {
    // TODO
    return false;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int k;
  cin >> k;

  cout << (sol.containsNearbyDuplicate(nums, k) ? "true" : "false") << endl;
  return 0;
}
`;
}

if (qId === "array18") {
  return `#include <iostream>
#include <unordered_set> 
#include <vector>
using namespace std;

class Solution {
public:
  int maxProduct(vector<int>& nums) {
    // TODO
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.maxProduct(nums) << endl;
  return 0;
}
`;
}

if (qId === "array19") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  vector<int> subarraySumIndices(const vector<int>& arr, long long target) {
    // TODO
    return {-1};
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> arr(n);
  for (int i = 0; i < n; i++) cin >> arr[i];

  long long target;
  cin >> target;

  auto res = sol.subarraySumIndices(arr, target);
  for (int i = 0; i < (int)res.size(); i++) {
    if (i) cout << " ";
    cout << res[i];
  }
  cout << endl;

  return 0;
}
`;
}

if (qId === "array20") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int countTriplets(vector<int>& arr) {
    // TODO: Define how duplicates/indices are counted (important for cases like [0,0,0]).
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> arr(n);
  for (int i = 0; i < n; i++) cin >> arr[i];

  cout << sol.countTriplets(arr) << endl;
  return 0;
}
`;
}

if (qId === "array21") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
  vector<vector<int>> threeSum(const vector<int>& nums) {
    // TODO: Implement 3Sum problem
    return {};
  }
};

int main() {
  Solution sol;
  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) {
    cin >> nums[i];
  }
  vector<vector<int>> result = sol.threeSum(nums);
  for (auto& triplet : result) {
    for (int num : triplet) {
        cout << num << " ";
    }
    cout << endl;
  }
  return 0;
}
`;
}

if (qId === "array22") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int containerWithMostWater(const vector<int>& height) {
    // TODO: Implement container with most water
    return 0;
  }
};

int main() {
  Solution sol;
  int n;
  cin >> n;
  vector<int> height(n);
  for (int i = 0; i < n; i++) {
    cin >> height[i];
  }
  int result = sol.containerWithMostWater(height);
  cout << result << endl;
  return 0;
}

`;
}

if (qId === "array23") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int trappingRainWater(const vector<int>& height) {
    // TODO: Implement trapping rain water
    return 0;
  }
};

int main() {
  Solution sol;
  int n;
  cin >> n;
  vector<int> height(n);
  for (int i = 0; i < n; i++) {
    cin >> height[i];
  }
  int result = sol.trappingRainWater(height);
  cout << result << endl;
  return 0;
}

`;
}

if (qId === "array24") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int findMinInRotatedSortedArray(const vector<int>& nums) {
    // TODO: Implement find minimum in rotated sorted array with binary search
    return 0;
  }
};

int main() {
  Solution sol;
  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) {
    cin >> nums[i];
  }
  int result = sol.findMinInRotatedSortedArray(nums);
  cout << result << endl;
  return 0;
}

`;
}


// =================== STRING PROBLEMS ===================

if (qId === "string1") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
  void reverseString(string& s) {
    // TODO: i=0, j=s.size()-1; swap while i<j
    // TODO: Or: std::reverse(s.begin(), s.end());
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  sol.reverseString(s);
  cout << s << endl;

  return 0;
}
`;
}

if (qId === "string2") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  bool isPalindrome(string s) {
    // TODO
    return false;
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << (sol.isPalindrome(s) ? "true" : "false") << endl;
  return 0;
}
`;
}

if (qId === "string3") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  bool isAnagram(string s, string t) {
    // TODO
    return false;
  }
};

int main() {
  Solution sol;

  string s, t;
  cin >> s >> t;

  cout << (sol.isAnagram(s, t) ? "true" : "false") << endl;
  return 0;
}
`;
}

if (qId === "string4") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  int firstRepeatingChar(const string& s) {
    // TODO: return int(char) or -1
    return -1;
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << sol.firstRepeatingChar(s) << endl;
  return 0;
}
`;
}

if (qId === "string5") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  bool isSubsequence(string s, string t) {
    // TODO
    return false;
  }
};

int main() {
  Solution sol;

  string s, t;
  cin >> s >> t;

  cout << (sol.isSubsequence(s, t) ? "true" : "false") << endl;
  return 0;
}
`;
}

if (qId === "string6") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  string removeDuplicatesPreserveOrder(const string& s) {
    // TODO
    return "";
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << sol.removeDuplicatesPreserveOrder(s) << endl;
  return 0;
}
`;
}

if (qId === "string7") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  int lengthOfLongestSubstring(string s) {
    // TODO
    return 0;
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << sol.lengthOfLongestSubstring(s) << endl;
  return 0;
}
`;
}

if (qId === "string8") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
  string longestCommonPrefix(vector<string>& strs) {
    // TODO: handle empty input
    return "";
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<string> strs(n);
  for (int i = 0; i < n; i++) cin >> strs[i];

  cout << sol.longestCommonPrefix(strs) << endl;
  return 0;
}
`;
}

if (qId === "string9") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  string compressString(const string& s) {
    // TODO
    return "";
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << sol.compressString(s) << endl;
  return 0;
}
`;
}

if (qId === "string10") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  // Longest palindromic substring.
  // TODO: Expand-around-center (odd/even centers), O(n^2).
  string longestPalindrome(string s) {
    // TODO
    return "";
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << sol.longestPalindrome(s) << endl;
  return 0;
}
`;
}

if (qId === "string11") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
#include <utility>
using namespace std;

class Solution {
public:
  pair<int,int> countVowelsConsonants(const string& s) {
    // TODO: return {vowels, consonants}
    return {0, 0};
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  auto ans = sol.countVowelsConsonants(s);
  cout << ans.first << " " << ans.second << endl;
  return 0;
}
`;
}

if (qId === "string12") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  bool isDigitsOnly(const string& s) {
    // TODO
    return true;
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << (sol.isDigitsOnly(s) ? "true" : "false") << endl;
  return 0;
}
`;
}

if (qId === "string13") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  // Count occurrences of ch in s (case-sensitive unless specified).
  int countChar(const string& s, char ch) {
    // TODO
    return 0;
  }
};

int main() {
  Solution sol;

  string s;
  char ch;
  cin >> s >> ch;

  cout << sol.countChar(s, ch) << endl;
  return 0;
}
`;
}

if (qId === "string14") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  int strStr(string text, string pattern) {
    // TODO
    return -1;
  }
};

int main() {
  Solution sol;

  string text, pattern;
  cin >> text >> pattern;

  cout << sol.strStr(text, pattern) << endl;
  return 0;
}
`;
}

if (qId === "string15") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
  vector<int> findAllOccurrences(string text, string pattern) {
    // TODO
    return {};
  }
};

int main() {
  Solution sol;

  string text, pattern;
  cin >> text >> pattern;

  auto res = sol.findAllOccurrences(text, pattern);
  for (int i = 0; i < (int)res.size(); i++) {
    if (i) cout << " ";
    cout << res[i];
  }
  cout << endl;

  return 0;
}
`;
}

if (qId === "string16") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  string toLowerCase(string s) {
    // TODO
    return s;
  }

  string toUpperCase(string s) {
    // TODO
    return s;
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << sol.toLowerCase(s) << endl;
  cout << sol.toUpperCase(s) << endl;

  return 0;
}
`;
}

if (qId === "string17") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  int countWords(const string& s) {
    // TODO
    return 0;
  }
};

int main() {
  Solution sol;

  string s;
  cin >> ws;
  getline(cin, s);

  cout << sol.countWords(s) << endl;
  return 0;
}
`;
}

if (qId === "string18") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  bool checkInclusion(string s1, string s2) {
    // TODO: if s1 empty -> true (per your spec)
    return false;
  }
};

int main() {
  Solution sol;

  string s1, s2;
  cin >> s1 >> s2;

  cout << (sol.checkInclusion(s1, s2) ? "true" : "false") << endl;
  return 0;
}
`;
}

if (qId === "string19") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  string string19_TODO() {
    // TODO
    return "";
  }
};

int main() {
  Solution sol;
  cout << sol.string19_TODO() << endl;
  return 0;
}
`;
}

if (qId === "string20") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  string shortestPalindromeByAppending(string s) {
    // TODO
    return "";
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << sol.shortestPalindromeByAppending(s) << endl;
  return 0;
}
`;
}

if (qId === "string21") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  int countVowels(const string& s) {
    // TODO
    return 0;
  }
};

int main() {
  Solution sol;

  string s;
  cin >> s;

  cout << sol.countVowels(s) << endl;
  return 0;
}
`;
}

if (qId === "string22") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  int lcsLength(string a, string b) {
    // TODO
    return 0;
  }
};

int main() {
  Solution sol;

  string a, b;
  cin >> a >> b;

  cout << sol.lcsLength(a, b) << endl;
  return 0;
}
`;
}

// =================== SEARCH PROBLEMS ===================

if (qId === "search1") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int search(vector<int>& nums, int target) {
    return -1;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int target;
  cin >> target;

  cout << sol.search(nums, target) << endl;
  return 0;
}
`;
}

if (qId === "search2") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int search(vector<int>& nums, int target) {
    return -1;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int target;
  cin >> target;

  cout << sol.search(nums, target) << endl;
  return 0;
}
`;
}

if (qId === "search3") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  vector<int> searchRange(vector<int>& nums, int target) {
    return {-1, -1};
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int target;
  cin >> target;

  auto res = sol.searchRange(nums, target);
  cout << res[0] << " " << res[1] << endl;
  return 0;
}
`;
}

if (qId === "search4") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int findMin(vector<int>& nums) {
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.findMin(nums) << endl;
  return 0;
}
`;
}

if (qId === "search5") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int linearSearch(vector<int>& nums, int target) {
    return -1;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int target;
  cin >> target;

  cout << sol.linearSearch(nums, target) << endl;
  return 0;
}
`;
}

if (qId === "search6") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int searchInsert(vector<int>& nums, int target) {
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int target;
  cin >> target;

  cout << sol.searchInsert(nums, target) << endl;
  return 0;
}
`;
}

if (qId === "search7") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int findPeakElement(vector<int>& nums) {
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.findPeakElement(nums) << endl;
  return 0;
}
`;
}

if (qId === "search8") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  double findMedianSortedArrays(vector<int>& a, vector<int>& b) {
    return 0.0;
  }
};

static vector<int> readVec() {
  int n; cin >> n;
  vector<int> v(n);
  for (int i = 0; i < n; i++) cin >> v[i];
  return v;
}

int main() {
  Solution sol;

  vector<int> a = readVec();
  vector<int> b = readVec();

  cout << sol.findMedianSortedArrays(a, b) << endl;
  return 0;
}
`;
}

if (qId === "search9") {
  return `#include <iostream>
#include <unordered_set>
using namespace std;

class InfiniteArray {
public:
  int get(int i); // Provided by platform
};

class Solution {
public:
  int searchInfinite(InfiniteArray& arr, int target) {
    return -1;
  }
};

int main() {
  // Typically not runnable locally because InfiniteArray::get is platform-provided.
  return 0;
}
`;
}

if (qId === "search10") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int countOccurrences(vector<int>& nums, int target) {
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  int target;
  cin >> target;

  cout << sol.countOccurrences(nums, target) << endl;
  return 0;
}
`;
}

// ===================sliding window ================
if (qId === "sw1") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
  string minimumWindowSubstring(const string &s, const string &t) {
    // TODO: Implement sliding window to find minimum substring
    return "";
  }
};

int main() {
  Solution sol;
  string s, t;
  cin >> s >> t;
  string result = sol.minimumWindowSubstring(s, t);
  cout << result << endl;
  return 0;
}
`;
}

if (qId === "sw2") {
  return `#include <iostream>
#include <unordered_set>
#include <unordered_map>
#include <string>
using namespace std;

class Solution {
public:
  int longestRepeatingCharacterReplacement(const string &s, int k) {
    // TODO: Implement sliding window for longest substring with replacement
    return 0;
  }
};

int main() {
  Solution sol;
  string s;
  int k;
  cin >> s >> k;
  int result = sol.longestRepeatingCharacterReplacement(s, k);
  cout << result << endl;
  return 0;
}
`;
}



// =================== DP PROBLEMS ===================

if (qId === "dp1") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int maxSubArray(vector<int>& nums) {
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.maxSubArray(nums) << endl;
  return 0;
}
`;
}

if (qId === "dp2") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  vector<int> productExceptSelf(vector<int>& nums) {
    return {};
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  auto res = sol.productExceptSelf(nums);
  for (int i = 0; i < (int)res.size(); i++) {
    if (i) cout << " ";
    cout << res[i];
  }
  cout << endl;

  return 0;
}
`;
}

if (qId === "dp3") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  int lengthOfLIS(vector<int>& nums) {
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.lengthOfLIS(nums) << endl;
  return 0;
}
`;
}

if (qId === "dp4") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

class Solution {
public:
  int longestCommonSubsequence(string text1, string text2) {
    return 0;
  }
};

int main() {
  Solution sol;

  string a, b;
  cin >> a >> b;

  cout << sol.longestCommonSubsequence(a, b) << endl;
  return 0;
}
`;
}

if (qId === "dp5") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  long long countInversions(vector<int>& nums) {
    return 0;
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  cout << sol.countInversions(nums) << endl;
  return 0;
}
`;
}

if (qId === "dp6") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
  void sortColors(vector<int>& nums) {
  }
};

int main() {
  Solution sol;

  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) cin >> nums[i];

  sol.sortColors(nums);

  for (int i = 0; i < n; i++) {
    if (i) cout << " ";
    cout << nums[i];
  }
  cout << endl;

  return 0;
}
`;
}

if (qId === "dp7") {
  return `#include <iostream>
#include <unordered_set>
using namespace std;

class Solution {
public:
  int climbingStairs(int n) {
    // TODO: Implement the climbing stairs problem with DP
    return 0;
  }
};

int main() {
  Solution sol;
  int n;
  cin >> n;
  int result = sol.climbingStairs(n);
  cout << result << endl;
  return 0;
}
`;
}

if (qId === "dp8") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
  int coinChange(const vector<int>& coins, int amount) {
    // TODO: Implement coin change problem using DP
    return -1;
  }
};

int main() {
  Solution sol;
  int n, amount;
  cin >> n;
  cin >> amount;
  vector<int> coins(n);
  for (int i = 0; i < n; i++) {
    cin >> coins[i];
  }
  int result = sol.coinChange(coins, amount);
  cout << result << endl;
  return 0;
}
`;
}

if (qId === "dp9") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
  int houseRobber(const vector<int>& nums) {
    // TODO: Implement house robber problem using DP
    return 0;
  }
};

int main() {
  Solution sol;
  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) {
    cin >> nums[i];
  }
  int result = sol.houseRobber(nums);
  cout << result << endl;
  return 0;
}
`;
}

if (qId === "dp10") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
  int houseRobberII(const vector<int>& nums) {
    // TODO: Implement house robber II with DP
    return 0;
  }
};

int main() {
  Solution sol;
  int n;
  cin >> n;
  vector<int> nums(n);
  for (int i = 0; i < n; i++) {
    cin >> nums[i];
  }
  int result = sol.houseRobberII(nums);
  cout << result << endl;
  return 0;
}
`;
}

if (qId === "dp11") {
  return `#include <iostream>
#include <unordered_set>
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
  int decodeWays(const string &s) {
    // TODO: Implement decode ways problem using DP
    return 0;
  }
};

int main() {
  Solution sol;
  string s;
  cin >> s;
  int result = sol.decodeWays(s);
  cout << result << endl;
  return 0;
}
`;
}

if (qId === "dp12") {
  return `#include <iostream>
#include <unordered_set>
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
  bool wordBreak(const string &s, const vector<string> &wordDict) {
    // TODO: Implement word break problem using DP
    return false;
  }
};

int main() {
  Solution sol;
  string s;
  int n;
  cin >> s >> n;
  vector<string> wordDict(n);
  for (int i = 0; i < n; i++) {
    cin >> wordDict[i];
  }
  bool result = sol.wordBreak(s, wordDict);
  cout << (result ? "true" : "false") << endl;
  return 0;
}
`;
}





    // Generic C++ template
    return `
    // TODO: Implement your solution here and get AI feedback
`;
} 


else if (language === 'python') {

  if (qId === "array1") {
  return `class Solution:
  def maxMin(self, nums: list[int]) -> tuple[int, int]:
    # TODO
    return (0, 0)

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  max_val, min_val = sol.maxMin(nums)
  print(max_val, min_val)
`;
  }

  if (qId === "array2") {
  return `class Solution:
  def reverseArray(self, nums: list[int]) -> None:
    # TODO
    pass

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  sol.reverseArray(nums)
  print(*nums)
`;
  }

  if (qId === "array3") {
  return `
class Solution:
  def findKthLargest(self, nums: list[int], k: int) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  k = int(input())

  print(sol.findKthLargest(nums, k))
`;
  }

  if (qId === "array4") {
  return `
class Solution:
  def firstDuplicate(self, nums: list[int]) -> int:
    # TODO
    return -1

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.firstDuplicate(nums))
`;
  }

  if (qId === "array5") {
  return `class Solution:
  def moveZeroes(self, nums: list[int]) -> None:
    # TODO
    pass

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  sol.moveZeroes(nums)
  print(*nums)
`;
  }

  if (qId === "array6") {
  return `class Solution:
  def missingNumber(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.missingNumber(nums))
`;
  }

  if (qId === "array7") {
  return `class Solution:
  def majorityElement(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.majorityElement(nums))
`;
  }

  if (qId === "array8") {
  return `class Solution:
  def equilibriumIndex(self, nums: list[int]) -> int:
    # TODO
    return -1

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.equilibriumIndex(nums))
`;
  }

  if (qId === "array9") {
  return `class Solution:
  def rotate(self, nums: list[int], k: int) -> None:
    # TODO
    pass

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  k = int(input())

  sol.rotate(nums, k)
  print(*nums)
`;
  }

  if (qId === "array10") {
  return `class Solution:
  def pairSumExists(self, nums: list[int], target: int) -> bool:
    # TODO
    return False

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  print(sol.pairSumExists(nums, target))
`;
  }

  if (qId === "array11") {
  return `class Solution:
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
`;
  }

  if (qId === "array12") {
  return `class Solution:
  def allPairsWithSum(self, nums: list[int], target: int) -> list[tuple[int, int]]:
    # TODO
    return []

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  res = sol.allPairsWithSum(nums, target)
  for a, b in res:
    print(a, b)
`;
  }

  if (qId === "array13") {
  return `class Solution:
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
`;
  }

  if (qId === "array14") {
  return `class Solution:
  def subsets(self, nums: list[int]) -> list[list[int]]:
    # TODO
    return []

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  res = sol.subsets(nums)
  for sub in res:
    print(*sub)
`;
  }

  if (qId === "array15") {
  return `class Solution:
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
`;
  }

  if (qId === "array16") {
  return `class Solution:
  def longestConsecutive(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.longestConsecutive(nums))
`;
  }

  if (qId === "array17") {
  return `class Solution:
  def containsNearbyDuplicate(self, nums: list[int], k: int) -> bool:
    # TODO
    return False

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  k = int(input())

  print(sol.containsNearbyDuplicate(nums, k))
`;
  }

  if (qId === "array18") {
  return `class Solution:
  def maxProduct(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.maxProduct(nums))
`;
  }

  if (qId === "array19") {
  return `class Solution:
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
`;
  }

  if (qId === "array20") {
  return `class Solution:
  def countTriplets(self, arr: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  arr = list(map(int, input().split()))

  print(sol.countTriplets(arr))
`;
  }

  if (qId === "array21") {
  return `class Solution:
  def threeSum(self, nums: list[int]) -> list[list[int]]:
    # TODO: Implement 3Sum problem
    return []

if __name__ == "__main__":
  sol = Solution()
  nums = list(map(int, input().split()))
  result = sol.threeSum(nums)
  for triplet in result:
    print(" ".join(map(str, triplet)))

  `;
  }

  if (qId === "array22") {
  return `class Solution:
  def maxArea(self, height: list[int]) -> int:
    # TODO: Implement container with most water
    return 0

if __name__ == "__main__":
  sol = Solution()
  height = list(map(int, input().split()))
  print(sol.maxArea(height))
  `;
  }

  if (qId === "array23") {
  return `class Solution:
  def trap(self, height: list[int]) -> int:
    # TODO: Implement trapping rain water
    return 0

if __name__ == "__main__":
  sol = Solution()
  height = list(map(int, input().split()))
  print(sol.trap(height))
  `;
  }

  if (qId === "array24") {
  return `class Solution:
  def findMin(self, nums: list[int]) -> int:
    # TODO: Implement find minimum in rotated sorted array with binary search
    return 0

if __name__ == "__main__":
  sol = Solution()
  nums = list(map(int, input().split()))
  print(sol.findMin(nums))
  `;
  }

  // -------- Strings --------

  if (qId === "string1") {
  return `class Solution:
  def reverseString(self, s: list[str]) -> None:
    # TODO
    pass

if __name__ == "__main__":
  sol = Solution()

  s = list(input().strip())
  sol.reverseString(s)
  print("".join(s))
`;
  }

  if (qId === "string2") {
  return `class Solution:
  def isPalindrome(self, s: str) -> bool:
    # TODO
    return False

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  print(sol.isPalindrome(s))
`;
  }

  if (qId === "string3") {
  return `class Solution:
  def isAnagram(self, s: str, t: str) -> bool:
    # TODO
    return False

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  t = input().strip()
  print(sol.isAnagram(s, t))
`;
  }

  if (qId === "string4") {
  return `class Solution:
  def firstRepeatingChar(self, s: str):
    # TODO: return int(ord(char)) or -1, based on your spec
    return -1

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  print(sol.firstRepeatingChar(s))
`;
  }

  if (qId === "string5") {
  return `class Solution:
  def isSubsequence(self, s: str, t: str) -> bool:
    # TODO
    return False

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  t = input().strip()
  print(sol.isSubsequence(s, t))
`;
  }

  if (qId === "string6") {
  return `class Solution:
  def removeDuplicatesPreserveOrder(self, s: str) -> str:
    # TODO
    return ""

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  print(sol.removeDuplicatesPreserveOrder(s))
`;
  }

  if (qId === "string7") {
  return `
class Solution:
  def lengthOfLongestSubstring(self, s: str) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  print(sol.lengthOfLongestSubstring(s))
`;
  }

  if (qId === "string8") {
  return `
class Solution:
  def longestCommonPrefix(self, strs: list[str]) -> str:
    # TODO: handle empty input
    return ""

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  strs = [input().strip() for _ in range(n)]
  print(sol.longestCommonPrefix(strs))
`;
  }

  if (qId === "string9") {
  return `
class Solution:
  def compressString(self, s: str) -> str:
    # TODO
    return ""

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  print(sol.compressString(s))
`;
  }

  if (qId === "string10") {
  return `
class Solution:
  def longestPalindrome(self, s: str) -> str:
    # TODO
    return ""

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  print(sol.longestPalindrome(s))
`;
  }

  if (qId === "string11") {
  return `
class Solution:
  def countVowelsConsonants(self, s: str) -> tuple[int, int]:
    # TODO
    return (0, 0)

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  v, c = sol.countVowelsConsonants(s)
  print(v, c)
`;
  }

  if (qId === "string12") {
  return `
class Solution:
  def isDigitsOnly(self, s: str) -> bool:
    # TODO
    return True

if __name__ == "__main__":
  sol = Solution()

  s = input().strip()
  print(sol.isDigitsOnly(s))
`;
  }

  if (qId === "string13") {
  return `
class Solution:
  def countChar(self, s: str, ch: str) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  s = input().rstrip("\\n")
  ch = input().rstrip("\\n")
  print(sol.countChar(s, ch))
`;
  }

  if (qId === "string14") {
  return `
class Solution:
  def strStr(self, text: str, pattern: str) -> int:
    # TODO
    return -1

if __name__ == "__main__":
  sol = Solution()

  text = input().strip()
  pattern = input().strip()
  print(sol.strStr(text, pattern))
`;
  }

  if (qId === "string15") {
  return `
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
`;
  }

  if (qId === "string16") {
  return `
class Solution:
  def toLowerCase(self, s: str) -> str:
    # TODO
    return s

  def toUpperCase(self, s: str) -> str:
    # TODO
    return s

if __name__ == "__main__":
  sol = Solution()

  s = input().rstrip("\\n")
  print(sol.toLowerCase(s))
  print(sol.toUpperCase(s))
`;
  }

  if (qId === "string17") {
  return `
class Solution:
  def countWords(self, s: str) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  s = input().rstrip("\\n")
  print(sol.countWords(s))
`;
  }

  if (qId === "string18") {
  return `
class Solution:
  def checkInclusion(self, s1: str, s2: str) -> bool:
    # TODO
    return False

if __name__ == "__main__":
  sol = Solution()

  s1 = input().strip()
  s2 = input().strip()
  print(sol.checkInclusion(s1, s2))
`;
  }

  if (qId === "string19") {
  return `
class Solution:
  def runLengthEncode(self, s: str) -> str:
    # TODO
    return ""

if __name__ == "__main__":
  sol = Solution()

  s = input().rstrip("\\n")
  print(sol.runLengthEncode(s))
`;
  }

  if (qId === "string20") {
  return `
class Solution:
  def shortestPalindromeByAppending(self, s: str) -> str:
    # TODO
    return ""

if __name__ == "__main__":
  sol = Solution()

  s = input().rstrip("\\n")
  print(sol.shortestPalindromeByAppending(s))
`;
  }

  if (qId === "string21") {
  return `
class Solution:
  def countVowels(self, s: str) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  s = input().rstrip("\\n")
  print(sol.countVowels(s))
`;
  }

  if (qId === "string22") {
  return `
class Solution:
  def lcsLength(self, a: str, b: str) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  a = input().rstrip("\\n")
  b = input().rstrip("\\n")
  print(sol.lcsLength(a, b))
`;
  }

  // -------- Search --------

  if (qId === "search1") {
  return `
class Solution:
  def search(self, nums: list[int], target: int) -> int:
    # TODO
    return -1

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  print(sol.search(nums, target))
`;
  }

  if (qId === "search2") {
  return `
class Solution:
  def search(self, nums: list[int], target: int) -> int:
    # TODO
    return -1

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  print(sol.search(nums, target))
`;
  }

  if (qId === "search3") {
  return `
class Solution:
  def searchRange(self, nums: list[int], target: int) -> list[int]:
    # TODO
    return [-1, -1]

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  res = sol.searchRange(nums, target)
  print(res[0], res[1])
`;
  }

  if (qId === "search4") {
  return `
class Solution:
  def findMin(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.findMin(nums))
`;
  }

  if (qId === "search5") {
  return `
class Solution:
  def linearSearch(self, nums: list[int], target: int) -> int:
    # TODO
    return -1

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  print(sol.linearSearch(nums, target))
`;
  }

  if (qId === "search6") {
  return `
class Solution:
  def searchInsert(self, nums: list[int], target: int) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  print(sol.searchInsert(nums, target))
`;
  }

  if (qId === "search7") {
  return `
class Solution:
  def findPeakElement(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.findPeakElement(nums))
`;
  }

  if (qId === "search8") {
  return `
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
`;
  }

  if (qId === "search9") {
  return `
class InfiniteArray:
  def get(self, i: int) -> int:
    raise NotImplementedError

class Solution:
  def searchInfinite(self, arr: InfiniteArray, target: int) -> int:
    # TODO
    return -1

if __name__ == "__main__":
  # Platform-provided InfiniteArray; local stdin runner usually not applicable.
  pass
`;
  }

  if (qId === "search10") {
  return `
class Solution:
  def countOccurrences(self, nums: list[int], target: int) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))
  target = int(input())

  print(sol.countOccurrences(nums, target))
`;
  }

  // ===================sliding window ================
if (qId === "sw1") {
  return `
class Solution:
  def minWindow(self, s: str, t: str) -> str:
    # TODO: Implement sliding window to find minimum substring
    return ""

if __name__ == "__main__":
  sol = Solution()
  s, t = input(), input()
  print(sol.minWindow(s, t))
  `;
  }

if (qId === "sw2") {
  return `
class Solution:
  def characterReplacement(self, s: str, k: int) -> int:
    # TODO: Implement sliding window for longest substring with replacement
    return 0

if __name__ == "__main__":
  sol = Solution()
  s, k = input(), int(input())
  print(sol.characterReplacement(s, k))
  `;
  }



  // -------- DP --------

  if (qId === "dp1") {
  return `
class Solution:
  def maxSubArray(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.maxSubArray(nums))
`;
  }

  if (qId === "dp2") {
  return `
class Solution:
  def productExceptSelf(self, nums: list[int]) -> list[int]:
    # TODO
    return []

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  res = sol.productExceptSelf(nums)
  print(*res)
`;
  }

  if (qId === "dp3") {
  return `
class Solution:
  def lengthOfLIS(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.lengthOfLIS(nums))
`;
  }

  if (qId === "dp4") {
  return `
class Solution:
  def longestCommonSubsequence(self, text1: str, text2: str) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  text1 = input().strip()
  text2 = input().strip()

  print(sol.longestCommonSubsequence(text1, text2))
`;
  }

  if (qId === "dp5") {
  return `
class Solution:
  def countInversions(self, nums: list[int]) -> int:
    # TODO
    return 0

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  print(sol.countInversions(nums))
`;
  }

  if (qId === "dp6") {
  return `
class Solution:
  def sortColors(self, nums: list[int]) -> None:
    # TODO
    pass

if __name__ == "__main__":
  sol = Solution()

  n = int(input())
  nums = list(map(int, input().split()))

  sol.sortColors(nums)
  print(*nums)
`;
  }

  if (qId === "dp7") {
  return `
 class Solution:
  def climbStairs(self, n: int) -> int:
    # TODO: Implement the climbing stairs problem with DP
    return 0

if __name__ == "__main__":
  sol = Solution()
  n = int(input())
  print(sol.climbStairs(n)) 
  `;
  }

  if (qId === "dp8") {
  return `
class Solution:
  def coinChange(self, coins: list[int], amount: int) -> int:
    # TODO: Implement coin change problem using DP
    return -1

if __name__ == "__main__":
  sol = Solution()
  n, amount = int(input()), int(input())
  coins = list(map(int, input().split()))
  print(sol.coinChange(coins, amount))
  `;
  }

  if (qId === "dp9") {
  return `
class Solution:
  def rob(self, nums: list[int]) -> int:
    # TODO: Implement house robber problem using DP
    return 0

if __name__ == "__main__":
  sol = Solution()
  n = int(input())
  nums = list(map(int, input().split()))
  print(sol.rob(nums))
  `;
  }

  if (qId === "dp10") {
  return `
class Solution:
  def robII(self, nums: list[int]) -> int:
    # TODO: Implement house robber II with DP
    return 0

if __name__ == "__main__":
  sol = Solution()
  n = int(input())
  nums = list(map(int, input().split()))
  print(sol.robII(nums))
  `;
  }

  if (qId === "dp11") {
  return `
class Solution:
  def numDecodings(self, s: str) -> int:
    # TODO: Implement decode ways problem using DP
    return 0

if __name__ == "__main__":
  sol = Solution()
  s = input()
  print(sol.numDecodings(s))
  `;
  }

  if (qId === "dp12") {
  return `
class Solution:
  def wordBreak(self, s: str, wordDict: list[str]) -> bool:
    # TODO: Implement word break problem using DP
    return False

if __name__ == "__main__":
  sol = Solution()
  s = input()
  wordDict = input().split()
  print("true" if sol.wordBreak(s, wordDict) else "false")
  `;
  }




    // Generic Python template
    return `"""
    TODO: Implement your solution here and get AI feedback
    """
    `;
  }

  return null;
};
