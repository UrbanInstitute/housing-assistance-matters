import csv

outFile = csv.writer(open("data/HAI_all_years.csv", "wb"))

years = ["2000", "2006", "2012", "2013"]
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
			data[fips] = {"2000":{"asst":"","noAsst":""}, "2006":{"asst":"","noAsst":""}, "2012": {"asst":"","noAsst":""}, "2013": {"asst":"","noAsst":""}}
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

outFile.writerow(["FIPS", "ignore", "state", "name", "asst2000", "noAsst2000", "asst2006", "noAsst2006", "asst2012", "noAsst2012", "asst2013", "noAsst2013"])
for fips in data:
	d = data[fips]
	outFile.writerow([d["FIPS"], d["ignore"], d["state"], d["name"], d["2000"]["asst"], d["2000"]["noAsst"], d["2006"]["asst"], d["2006"]["noAsst"], d["2012"]["asst"], d["2012"]["noAsst"], d["2013"]["asst"], d["2013"]["noAsst"]])


