import csv

outFile = csv.writer(open("data/HAI_all_years.csv", "wb"))

years = ["2000", "2006", "2013"]
data = {}
for year in years:
	cr = csv.reader(open("data/source/HAI_commsoutput_%s.csv"%year, "rU"))
	head = cr.next()
	i = 0
	indices = {}
	for h in head:
		indices[h] = i
		i+= 1
	for row in cr:
		fips = row[indices["county"]]
		if fips not in data:
			data[fips] = {"2000":{"asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":""}, "2006":{"asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":""}, "2013": {"asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":""}}
		if year == "2013":
			ignore = row[indices["Unweighted ELI obs < 10"]]
			state = row[indices["State Name"]]
			name = row[indices["County Name"]]
			data[fips]["ignore"] = ignore
			data[fips]["state"] = state
			data[fips]["name"] = name
		data[fips]["FIPS"] = fips
		data[fips][year]["asst"] = row[indices["Units per 100 renters"]]
		data[fips][year]["noAsst"] = row[indices["Units per 100 renters (asst off)"]]
		data[fips][year]["totalPop"] = row[indices["Total ELI renters"]]
		data[fips][year]["asstNum"] = row[indices["AAA units"]]
		data[fips][year]["noAsstNum"] = row[indices["AAA units (asst off)"]]

outFile.writerow(["FIPS", "ignore", "state", "name", "asst2000", "noAsst2000", "totalPop2000", "asstNum2000","noAsstNum2000", "asst2006", "noAsst2006", "totalPop2006", "asstNum2006","noAsstNum2006", "asst2013", "noAsst2013", "totalPop2013", "asstNum2013","noAsstNum2013"])
for fips in data:
	d = data[fips]
	outFile.writerow([d["FIPS"], d["ignore"], d["state"], d["name"], d["2000"]["asst"], d["2000"]["noAsst"], d["2000"]["totalPop"], d["2000"]["asstNum"], d["2000"]["noAsstNum"], d["2006"]["asst"], d["2006"]["noAsst"], d["2006"]["totalPop"], d["2006"]["asstNum"], d["2006"]["noAsstNum"], d["2013"]["asst"], d["2013"]["noAsst"], d["2013"]["totalPop"], d["2013"]["asstNum"], d["2013"]["noAsstNum"]])