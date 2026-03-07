def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            return [seen[comp], i]
        seen[n] = i
    return []

# Read input
nums = list(map(int, input().strip('[]').split(',')))
target = int(input())
print(twoSum(nums, target))