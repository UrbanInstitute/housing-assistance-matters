import csv

outFile = csv.writer(open("data/HAI_all_years.csv", "wb"))

years = ["2013", "2006", "2000"]
data = {}
for year in years:
	if year == "2000":
		cr = csv.reader(open("data/source/hai_comms_2000_final.csv", "rU"))
		head = cr.next()
		i = 0
		indices = {}
		for h in head:
			indices[h] = i
			i+= 1
		for row in cr:
			fips = row[indices["county"]]
			if fips not in data:
				data[fips] = {"name":"", "2000":{"hud":"", "maxELI":"", "minELI":"", "ami":"","asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":"", "flag":""}, "2006":{"hud":"", "maxELI":"", "minELI":"", "ami":"","asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":"", "flag":""}, "2013": {"hud":"", "maxELI":"", "minELI":"", "ami":"","asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":"","flag":""}}
			# if year == "2013":
			# 	ignore = row[indices["Unweighted ELI obs < 10"]]
			# 	state = row[indices["State Name"]]
			# 	name = row[indices["County Name"]]
			# 	data[fips]["state"] = state
			# 	data[fips]["name"] = name
			flag = row[indices["state_flag"]]
			data[fips][year]["flag"] = flag
			data[fips]["FIPS"] = fips
			data[fips][year]["maxELI"] = row[indices["MaxEli"]]
			data[fips][year]["minELI"] = row[indices["MinEli"]]
			data[fips][year]["hud"] = row[indices]["hud_units00"]

			if flag == "0":
				data[fips][year]["asst"] = row[indices["per100"]]
				data[fips][year]["noAsst"] = row[indices["per100_No_Assist"]]
				data[fips][year]["totalPop"] = row[indices["Total00"]]
				data[fips][year]["asstNum"] = row[indices["units00"]]
				data[fips][year]["noAsstNum"] = row[indices["Units_No_Assist_00"]]
				data[fips][year]["ami"] = row[indices["l30_4"]]
			else:
				data[fips][year]["asst"] = row[indices["State_per100"]]
				data[fips][year]["noAsst"] = row[indices["State_per100_No_Assist"]]
				data[fips][year]["totalPop"] = row[indices["state_total00"]]
				data[fips][year]["asstNum"] = row[indices["state_units00"]]
				data[fips][year]["noAsstNum"] = row[indices["State_Units_No_Assist_00"]]
				data[fips][year]["ami"] = row[indices["l30_4"]]

	elif year == "2006":
		cr = csv.reader(open("data/source/hai_comms_2005_to_2007.csv", "rU"))
		head = cr.next()
		i = 0
		indices = {}
		for h in head:
			indices[h] = i
			i+= 1
		for row in cr:
			fips = row[indices["county"]]
			if fips not in data:
				data[fips] = {"name":"", "2000":{"hud":"", "maxELI":"", "minELI":"", "ami":"","asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":"", "flag":""}, "2006":{"hud":"", "maxELI":"", "minELI":"", "ami":"","asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":"", "flag":""}, "2013": {"hud":"", "maxELI":"", "minELI":"", "ami":"","asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":"","flag":""}}
			# if year == "2013":
			# 	ignore = row[indices["Unweighted ELI obs < 10"]]
			# 	state = row[indices["State Name"]]
			# 	name = row[indices["County Name"]]
			# 	data[fips]["state"] = state
			# 	data[fips]["name"] = name
			flag = row[indices["state_flag"]]
			data[fips][year]["flag"] = flag
			data[fips]["FIPS"] = fips
			data[fips][year]["maxELI"] = row[indices["MaxEli"]]
			data[fips][year]["minELI"] = row[indices["MinEli"]]
			data[fips][year]["hud"] = row[indices]["hud_units06"]
			if flag == "0":
				data[fips][year]["asst"] = row[indices["per100"]]
				data[fips][year]["noAsst"] = row[indices["per100_No_Assist"]]
				data[fips][year]["totalPop"] = row[indices["Avg_ELITotal_05_07"]]
				data[fips][year]["asstNum"] = row[indices["Avg_Units_05_07"]]
				data[fips][year]["noAsstNum"] = row[indices["Avg_Units_No_Assist_05_07"]]
				data[fips][year]["ami"] = row[indices["l30_4"]]
			else:
				data[fips][year]["asst"] = row[indices["State_per100"]]
				data[fips][year]["noAsst"] = row[indices["State_per100_No_Assist"]]
				data[fips][year]["totalPop"] = row[indices["State_Avg_ELITotal_05_07"]]
				data[fips][year]["asstNum"] = row[indices["State_Avg_Units_05_07"]]
				data[fips][year]["noAsstNum"] = row[indices["State_Avg_Units_No_Assist_05_07"]]
				data[fips][year]["ami"] = row[indices["l30_4"]]

			
	elif year == "2013":
		cr = csv.reader(open("data/source/hai_comms_2011_to_2013.csv", "rU"))
		head = cr.next()
		i = 0
		indices = {}
		for h in head:
			indices[h] = i
			i+= 1
		for row in cr:
			fips = row[indices["county"]]
			if fips not in data:
				data[fips] = {"name":"", "2000":{"hud":"", "maxELI":"", "minELI":"", "ami":"","asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":"", "flag":""}, "2006":{"hud":"", "maxELI":"", "minELI":"", "ami":"","asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":"", "flag":""}, "2013": {"hud":"", "maxELI":"", "minELI":"", "ami":"","asst":"","noAsst":"","totalPop":"","asstNum":"","noAsstNum":"","flag":""}}
			# ignore = 0
			# state = row[indices["State Name"]]
			name = row[indices["countyname"]]
			data[fips]["name"] = name
			data[fips]["FIPS"] = fips
			data[fips][year]["maxELI"] = row[indices["MaxEli"]]
			data[fips][year]["minELI"] = row[indices["MinEli"]]
			data[fips][year]["ami"] = row[indices["l30_4"]]
			flag = row[indices["state_flag"]]
			data[fips][year]["flag"] = flag
			data[fips][year]["hud"] = row[indices]["Avg_units_hud_12_13"]
			if flag == "0":
				data[fips][year]["asst"] = row[indices["per100"]]
				data[fips][year]["noAsst"] = row[indices["per100_No_Assist"]]
				data[fips][year]["totalPop"] = row[indices["Avg_ELITotal_11_13"]]
				data[fips][year]["asstNum"] = row[indices["Avg_Units_11_13"]]
				data[fips][year]["noAsstNum"] = row[indices["Avg_Units_No_Assist_11_13"]]
			else:
				data[fips][year]["asst"] = row[indices["State_per100"]]
				data[fips][year]["noAsst"] = row[indices["State_per100_No_Assist"]]
				data[fips][year]["totalPop"] = row[indices["State_Avg_ELITotal_11_13"]]
				data[fips][year]["asstNum"] = row[indices["State_Avg_Units_11_13"]]
				data[fips][year]["noAsstNum"] = row[indices["State_Avg_Units_No_Assist_11_13"]]
		

outFile.writerow(["FIPS", "flagged", "name", "ami2000","ami2006","ami2013", "asst2000", "noAsst2000", "totalPop2000", "asstNum2000","noAsstNum2000", "asst2006", "noAsst2006", "totalPop2006", "asstNum2006","noAsstNum2006", "asst2013", "noAsst2013", "totalPop2013", "asstNum2013","noAsstNum2013","maxELI2000","minELI2000","maxELI2006","minELI2006","maxELI2013","minELI2013","hud2000","hud2006","hud2013"])
for fips in data:
	d = data[fips]
	outFile.writerow([d["FIPS"], d["2013"]["flag"], d["name"], d["2000"]["ami"], d["2006"]["ami"], d["2013"]["ami"], d["2000"]["asst"], d["2000"]["noAsst"], d["2000"]["totalPop"], d["2000"]["asstNum"], d["2000"]["noAsstNum"], d["2006"]["asst"], d["2006"]["noAsst"], d["2006"]["totalPop"], d["2006"]["asstNum"], d["2006"]["noAsstNum"], d["2013"]["asst"], d["2013"]["noAsst"], d["2013"]["totalPop"], d["2013"]["asstNum"], d["2013"]["noAsstNum"], d["2000"]["maxELI"],d["2000"]["minELI"], d["2006"]["maxELI"],d["2006"]["minELI"], d["2013"]["maxELI"],d["2013"]["minELI"], d["2000"]["hud"], d["2006"]["hud"], d["2013"]["hud"]])