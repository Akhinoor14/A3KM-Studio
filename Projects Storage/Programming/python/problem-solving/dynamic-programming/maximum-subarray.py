"""
Problem: Maximum Subarray (LeetCode #53)
Author: Md Akhinoor Islam
Category: Dynamic Programming / Problem Solving
Difficulty: Medium
---
Given an integer array nums, find the subarray with the largest sum,
and return its sum.

Approach: Kadane's Algorithm
Time: O(n), Space: O(1)
"""

def maxSubArray(nums):
    max_sum = nums[0]
    curr_sum = nums[0]
    for n in nums[1:]:
        curr_sum = max(n, curr_sum + n)
        max_sum = max(max_sum, curr_sum)
    return max_sum


# Test
if __name__ == "__main__":
    print(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6
    print(maxSubArray([1]))                                 # 1
    print(maxSubArray([5, 4, -1, 7, 8]))                   # 23
