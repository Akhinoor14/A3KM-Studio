"""
Problem: Two Sum (LeetCode #1)
Author: Md Akhinoor Islam
Category: Arrays & Strings / Problem Solving
Difficulty: Easy
---
Given an array of integers nums and an integer target,
return indices of the two numbers such that they add up to target.

Approach: HashMap single pass
Time: O(n), Space: O(n)
"""

def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            return [seen[comp], i]
        seen[n] = i
    return []


# Test
if __name__ == "__main__":
    print(twoSum([2, 7, 11, 15], 9))   # [0, 1]
    print(twoSum([3, 2, 4], 6))        # [1, 2]
    print(twoSum([3, 3], 6))           # [0, 1]
