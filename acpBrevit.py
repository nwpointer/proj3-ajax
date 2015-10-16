import math;

def r1(d):
	return (d/15*60, (d/34*60))
def r2(d):
	return (d/15*60, (d/32*60))
def r3(d):
	return (d/15*60, (d/30*60))
def r4(d):
	return ((d/11.428*60), (d/28*60))
def r5(d):
	return ((d/13.333*60), (d/26*60))

def addTouple(a,b):
	return (a[0]+b[0],a[1]+b[1])

def acpBrevit(d):
	d = int(d)
	if(d==0):
		return (d,d+60)
	else:
		total = (0,0)
		for x in range(0,d):
			if x <200:
				max = 220
				total = addTouple(total,r1(1))
			elif x<400:
				max = 440
				total = addTouple(total,r2(1))
			elif x<600:
				max=660
				total = addTouple(total,r3(1))
			elif x<1000:
				max=1100
				total = addTouple(total,r4(1))
			else:
				total =  addTouple(total,r5(d-x))

		return (math.ceil(total[1]), math.ceil(total[0]));