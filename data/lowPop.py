import csv
import json
cr = csv.reader(open("lowPop.csv","rU"))
data = {}
for row in cr:
	if row[1] not in data:
		data[row[1]] = []
	data[row[1]].append(row[0])
print json.dumps(data)
