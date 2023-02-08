def polluants():
    p=5000
    n=2016
    while p>2000:
        p*=0.92
        n+=1
    return n

def dansphrase(ph):
    s=len(ph)
    n=0
    for i in range(s):
        if ph[i]=="e":
            n+=1
    return n

print(dansphrase("ahmed")) # 1
print(dansphrase("gabin")) # 0
print(dansphrase("éloise")) # 1

def dansphrase2(ph):
    s=len(ph)
    n=0
    for i in range(s):
        if ph[i]=="a":
            n+=1
    return n