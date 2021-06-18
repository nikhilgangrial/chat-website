"""First"""
i = 10
while i >= 0:
    print(i)
    i -= 2

"""Second"""
i = 0
while i < 3:
    n1 = int(input("Enter First Number:\n"))
    n2 = int(input("Enter Second Number:\n"))
    print("Greater Number is", max(n1, n2))
    i += 1

"""Third"""
s = k = 1
while k <= 10:
    print(s)
    s += k
    k += 1


"""Forth"""
def gcd(a, b):
    k = min(a, b)
    while k > 0:
        if a % k == b % k == 0:
            return k
        k -= 1

n1 = int(input("Enter First Number:\n"))
n2 = int(input("Enter Second Number:\n"))
print("GCD is:", gcd(n1, n2))
