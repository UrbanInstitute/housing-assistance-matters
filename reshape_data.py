import csv

outFile = csv.writer(open("data/HAI_all_years.csv", "wb"))

years = ["2013", "2006", "2000"]
data = {}
for year in years:
	if year == "2000":
		cr = csv.reader(open("data/source/HAI_COMMS_2000_Final.csv", "rU"))
		head = cr.next()
		i = 0
		indices = {}
		for h in head:
			indices[h] = i
			i+= 1
		for row in cr:
			fips = row[indices["county"]]
			if fips not in data:
				data[fips] = {"name":"", "2000":{"scalar":"","hud":"","maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2006":{"scalar":"","usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2013": {"scalar":"","usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}}
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
			if flag == "0":
				S = float(row[indices["units"]]) / float(row[indices["Total"]])
				data[fips][year]["scalar"] = float(row[indices["per100"]]) / (S*100)
				data[fips][year]["usdaOn_hudOn"] = S*100
				data[fips][year]["usdaOn_hudOff"] = float(row[indices["Per100_No_HUD"]])
				data[fips][year]["usdaOff_hudOn"] = float(row[indices["Per100_No_USDA"]])
				data[fips][year]["usdaOff_hudOff"] = float(row[indices["per100_no_assisted"]])
				data[fips][year]["totalPop"] = row[indices["Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["Units_no_usda"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["Unitsnoasst"]]
				data[fips][year]["hud"] = 0
				data[fips][year]["usda"] = 0
			elif row[indices["ST_Units"]] != "":
				S = float(row[indices["ST_Units"]]) / float(row[indices["ST_Total"]])
				data[fips][year]["scalar"] = float(row[indices["ST_per100"]]) / (S*100)
				data[fips][year]["usdaOn_hudOn"] = S*100
				data[fips][year]["usdaOn_hudOn"] = S*100
				data[fips][year]["usdaOn_hudOff"] = row[indices["ST_per100_No_HUD"]]
				data[fips][year]["usdaOff_hudOn"] = row[indices["ST_Per100_No_USDA"]]
				data[fips][year]["usdaOff_hudOff"] = row[indices["ST_per100_No_Assisted"]]
				data[fips][year]["totalPop"] = row[indices["ST_Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["ST_Units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["ST_Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["ST_Units_no_USDA"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["ST_Unitsnoasst"]]
				data[fips][year]["hud"] = 0
				data[fips][year]["usda"] = 0


	elif year == "2006":
		cr = csv.reader(open("data/source/HAI_COMMS_2007_Final.csv", "rU"))
		head = cr.next()
		i = 0
		indices = {}
		for h in head:
			indices[h] = i
			i+= 1
		for row in cr:
			fips = row[indices["county"]]
			if fips not in data:
				data[fips] = {"name":"", "2000":{"scalar":"","hud":"","maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2006":{"scalar":"","usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2013": {"scalar":"","usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}}
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
			if flag == "0":
				S = float(row[indices["units"]]) / float(row[indices["Total"]])
				data[fips][year]["scalar"] = float(row[indices["per100"]]) / (S*100)
				data[fips][year]["usdaOn_hudOn"] = S*100
				data[fips][year]["usdaOn_hudOff"] = float(row[indices["Per100_No_HUD"]])
				data[fips][year]["usdaOff_hudOn"] = float(row[indices["Per100_No_USDA"]])
				data[fips][year]["usdaOff_hudOff"] = float(row[indices["per100_no_assisted"]])
				data[fips][year]["totalPop"] = row[indices["Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["Units_no_usda"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["Unitsnoasst"]]
				data[fips][year]["hud"] = 0
				data[fips][year]["usda"] = 0
			elif row[indices["ST_Units"]] != "":
				# print (row[indices["ST_Units"]], row[indices["ST_Total"]], row)
				S = float(row[indices["ST_Units"]]) / float(row[indices["ST_Total"]])
				data[fips][year]["scalar"] = float(row[indices["ST_per100"]]) / (S*100)
				data[fips][year]["usdaOn_hudOn"] = S*100
				data[fips][year]["usdaOn_hudOn"] = S*100
				data[fips][year]["usdaOn_hudOff"] = row[indices["ST_per100_No_HUD"]]
				data[fips][year]["usdaOff_hudOn"] = row[indices["ST_Per100_No_USDA"]]
				data[fips][year]["usdaOff_hudOff"] = row[indices["ST_per100_No_Assisted"]]
				data[fips][year]["totalPop"] = row[indices["ST_Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["ST_Units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["ST_Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["ST_Units_no_USDA"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["ST_Unitsnoasst"]]
				data[fips][year]["hud"] = 0
				data[fips][year]["usda"] = 0

			
	elif year == "2013":
		cr = csv.reader(open("data/source/HAI_COMMS_2012_Final.csv", "rU"))
		head = cr.next()
		i = 0
		indices = {}
		for h in head:
			indices[h] = i
			i+= 1
		print indices
		for row in cr:
			fips = row[indices["county"]]
			if fips not in data:
				data[fips] = {"name":"", "2000":{"scalar":"","hud":"","maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2006":{"scalar":"","usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2013": {"scalar":"","usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}}
			# ignore = 0
			# state = row[indices["State Name"]]
			name = row[indices["countyname"]]
			data[fips]["name"] = name
			flag = row[indices["state_flag"]]
			# print (flag == "")
			if(flag == ""):
				flag = 1
			data[fips][year]["flag"] = flag
			data[fips]["FIPS"] = fips
			data[fips][year]["maxELI"] = row[indices["MaxEli"]]
			data[fips][year]["minELI"] = row[indices["MinEli"]]
			if flag == "0":
				S = float(row[indices["units"]]) / float(row[indices["Total"]])
				data[fips][year]["scalar"] = float(row[indices["per100"]]) / (S*100)
				data[fips][year]["usdaOn_hudOn"] = S*100
				data[fips][year]["usdaOn_hudOff"] = float(row[indices["Per100_No_HUD"]])
				data[fips][year]["usdaOff_hudOn"] = float(row[indices["Per100_No_USDA"]])
				data[fips][year]["usdaOff_hudOff"] = float(row[indices["per100_no_assisted"]])
				data[fips][year]["totalPop"] = row[indices["Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["Units_no_usda"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["Unitsnoasst"]]
				data[fips][year]["hud"] = 0
				data[fips][year]["usda"] = 0
			elif row[indices["ST_Units"]] != "":
				S = float(row[indices["ST_Units"]]) / float(row[indices["ST_Total"]])
				data[fips][year]["scalar"] = float(row[indices["ST_per100"]]) / (S*100)
				data[fips][year]["usdaOn_hudOn"] = S*100
				data[fips][year]["usdaOn_hudOn"] = S*100
				data[fips][year]["usdaOn_hudOff"] = row[indices["ST_per100_No_HUD"]]
				data[fips][year]["usdaOff_hudOn"] = row[indices["ST_Per100_No_USDA"]]
				data[fips][year]["usdaOff_hudOff"] = row[indices["ST_per100_No_Assisted"]]
				data[fips][year]["totalPop"] = row[indices["ST_Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["ST_Units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["ST_Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["ST_Units_no_USDA"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["ST_Unitsnoasst"]]
				data[fips][year]["hud"] = 0
				data[fips][year]["usda"] = 0
		

outFile.writerow(["FIPS", "flagged", "name", "ami2000","ami2006","ami2013", "usdaOnhudOn2000","usdaOnhudOff2000","usdaOffhudOn2000","usdaOffhudOff2000","totalPop2000", "usdaOnhudOnNum2000","usdaOnhudOffNum2000","usdaOffhudOnNum2000","usdaOffhudOffNum2000", "usdaOnhudOn2006","usdaOnhudOff2006","usdaOffhudOn2006","usdaOffhudOff2006","totalPop2006", "usdaOnhudOnNum2006","usdaOnhudOffNum2006","usdaOffhudOnNum2006","usdaOffhudOffNum2006", "usdaOnhudOn2013","usdaOnhudOff2013","usdaOffhudOn2013","usdaOffhudOff2013","totalPop2013", "usdaOnhudOnNum2013","usdaOnhudOffNum2013","usdaOffhudOnNum2013","usdaOffhudOffNum2013","maxELI2000","minELI2000","maxELI2006","minELI2006","maxELI2013","minELI2013","hud2000","hud2006","hud2013","usda2006","usda2013","scalar2000","scalar2006","scalar2013"])
for fips in data:
	d = data[fips]
	outFile.writerow([d["FIPS"], d["2013"]["flag"], d["name"], d["2000"]["ami"], d["2006"]["ami"], d["2013"]["ami"], d["2000"]["usdaOn_hudOn"],d["2000"]["usdaOn_hudOff"],d["2000"]["usdaOff_hudOn"],d["2000"]["usdaOff_hudOff"], d["2000"]["totalPop"], d["2000"]["usdaOn_hudOnNum"],d["2000"]["usdaOn_hudOffNum"],d["2000"]["usdaOff_hudOnNum"],d["2000"]["usdaOff_hudOffNum"], d["2006"]["usdaOn_hudOn"],d["2006"]["usdaOn_hudOff"],d["2006"]["usdaOff_hudOn"],d["2006"]["usdaOff_hudOff"], d["2006"]["totalPop"], d["2006"]["usdaOn_hudOnNum"],d["2006"]["usdaOn_hudOffNum"],d["2006"]["usdaOff_hudOnNum"],d["2006"]["usdaOff_hudOffNum"], d["2013"]["usdaOn_hudOn"],d["2013"]["usdaOn_hudOff"],d["2013"]["usdaOff_hudOn"],d["2013"]["usdaOff_hudOff"], d["2013"]["totalPop"], d["2013"]["usdaOn_hudOnNum"],d["2013"]["usdaOn_hudOffNum"],d["2013"]["usdaOff_hudOnNum"],d["2013"]["usdaOff_hudOffNum"], d["2000"]["maxELI"],d["2000"]["minELI"], d["2006"]["maxELI"],d["2006"]["minELI"], d["2013"]["maxELI"],d["2013"]["minELI"], d["2000"]["hud"], d["2006"]["hud"], d["2013"]["hud"],d["2006"]["usda"], d["2013"]["usda"], d["2000"]["scalar"],d["2006"]["scalar"],d["2013"]["scalar"]])