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
			# print fips
			# break
			# print len(fips)

			if len(str(fips)) == 4:
				fips = "0" + str(fips)
				print fips
			if fips not in data:
				data[fips] = {"name":"", "2000":{"hud":"","maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2006":{"usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2013": {"usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}}
			# if year == "2013":
			# 	ignore = row[indices["Unweighted ELI obs < 10"]]
			# 	state = row[indices["State Name"]]
			# 	name = row[indices["County Name"]]
			# 	data[fips]["state"] = state
			# 	data[fips]["name"] = name
			flag = row[indices["state_flag"]]
			if(flag != "0"):
				flag = "1"
			data[fips][year]["flag"] = flag
			data[fips]["FIPS"] = fips
			data[fips][year]["maxELI"] = row[indices["MaxEli"]]
			data[fips][year]["minELI"] = row[indices["MinEli"]]
			data[fips][year]["minELI"] = row[indices["MinEli"]]

			if flag == "0":
				data[fips][year]["usdaOn_hudOn"] = row[indices["per100"]]
				data[fips][year]["usdaOn_hudOff"] = row[indices["per100_No_Assist"]]
				data[fips][year]["usdaOff_hudOn"] = row[indices["per100"]]
				data[fips][year]["usdaOff_hudOff"] = row[indices["per100_No_Assist"]]
				data[fips][year]["totalPop"] = row[indices["Total00"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["units00"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["Units_No_Assist_00"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["units00"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["Units_No_Assist_00"]]
				data[fips][year]["hud"] = row[indices["hud_units00"]]
			else:
				data[fips][year]["usdaOn_hudOn"] = row[indices["State_per100"]]
				data[fips][year]["usdaOn_hudOff"] = row[indices["State_per100_No_Assist"]]
				data[fips][year]["usdaOff_hudOn"] = row[indices["State_per100"]]
				data[fips][year]["usdaOff_hudOff"] = row[indices["State_per100_No_Assist"]]
				data[fips][year]["totalPop"] = row[indices["state_total00"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["state_units00"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["State_Units_No_Assist_00"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["state_units00"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["State_Units_No_Assist_00"]]
				data[fips][year]["hud"] = row[indices["state_hud_units00"]]


	elif year == "2006":
		cr = csv.reader(open("data/source/HAI_COMMS_2006_to_2008_Final.csv", "rU"))
		head = cr.next()
		i = 0
		indices = {}
		for h in head:
			indices[h] = i
			i+= 1
		for row in cr:
			fips = row[indices["county"]]
			if fips not in data:
				data[fips] = {"name":"", "2000":{"hud":"","maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2006":{"usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2013": {"usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}}
			# if year == "2013":
			# 	ignore = row[indices["Unweighted ELI obs < 10"]]
			# 	state = row[indices["State Name"]]
			# 	name = row[indices["County Name"]]
			# 	data[fips]["state"] = state
			# 	data[fips]["name"] = name
			flag = row[indices["state_flag"]]
			if(flag != "0"):
				flag = "1"
			data[fips][year]["flag"] = flag
			data[fips]["FIPS"] = fips
			data[fips]["name"] = row[indices["countyname"]]

			data[fips][year]["maxELI"] = row[indices["MaxEli"]]
			data[fips][year]["minELI"] = row[indices["MinEli"]]
			if flag == "0":
				data[fips][year]["usdaOn_hudOn"] = row[indices["per100"]]
				data[fips][year]["usdaOn_hudOff"] = row[indices["Per100_No_HUD"]]
				data[fips][year]["usdaOff_hudOn"] = row[indices["per100_no_USDA"]]
				data[fips][year]["usdaOff_hudOff"] = row[indices["Per100_No_Assisted"]]
				data[fips][year]["totalPop"] = row[indices["Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["Units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["units_no_USDA"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["unitsnoasst"]]
				data[fips][year]["hud"] = row[indices["eli"]]
				data[fips][year]["usda"] = row[indices["usda"]]
			else:
				data[fips][year]["usdaOn_hudOn"] = row[indices["ST_per100"]]
				data[fips][year]["usdaOn_hudOff"] = row[indices["ST_per100_No_HUD"]]
				data[fips][year]["usdaOff_hudOn"] = row[indices["ST_Per100_No_USDA"]]
				data[fips][year]["usdaOff_hudOff"] = row[indices["ST_Per100_No_Assisted"]]
				data[fips][year]["totalPop"] = row[indices["ST_Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["ST_Units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["ST_Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["ST_Units_no_USDA"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["ST_Unitsnoasst"]]
				data[fips][year]["hud"] = row[indices["ST_eli"]]
				data[fips][year]["usda"] = row[indices["ST_usda"]]

			
	elif year == "2013":
		cr = csv.reader(open("data/source/HAI_COMMS_2012_to_2014_Final.csv", "rU"))
		head = cr.next()
		i = 0
		indices = {}
		for h in head:
			indices[h] = i
			i+= 1
		for row in cr:
			fips = row[indices["county"]]
			if fips not in data:
				data[fips] = {"name":"", "2000":{"hud":"","maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2006":{"usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}, "2013": {"usda":"", "hud":"", "maxELI":"", "minELI":"", "ami":"","usdaOn_hudOn":"","usdaOn_hudOff":"","usdaOff_hudOn":"","usdaOff_hudOff":"","totalPop":"","usdaOn_hudOnNum":"","usdaOn_hudOffNum":"","usdaOff_hudOnNum":"", "usdaOff_hudOffNum":"","flag":""}}
			# ignore = 0
			# state = row[indices["State Name"]]
			flag = row[indices["state_flag"]]
			if(flag != "0"):
				flag = "1"
			data[fips][year]["flag"] = flag
			data[fips]["FIPS"] = fips
			data[fips][year]["maxELI"] = row[indices["MaxEli"]]
			data[fips][year]["minELI"] = row[indices["MinEli"]]
			if flag == "0":
				data[fips][year]["usdaOn_hudOn"] = row[indices["per100"]]
				data[fips][year]["usdaOn_hudOff"] = row[indices["Per100_No_HUD"]]
				data[fips][year]["usdaOff_hudOn"] = row[indices["per100_no_USDA"]]
				data[fips][year]["usdaOff_hudOff"] = row[indices["Per100_No_Assisted"]]
				data[fips][year]["totalPop"] = row[indices["Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["Units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["units_no_USDA"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["unitsnoasst"]]
				data[fips][year]["hud"] = row[indices["eli"]]
				data[fips][year]["usda"] = row[indices["usda"]]
			else:
				data[fips][year]["usdaOn_hudOn"] = row[indices["ST_per100"]]
				data[fips][year]["usdaOn_hudOff"] = row[indices["ST_per100_No_HUD"]]
				data[fips][year]["usdaOff_hudOn"] = row[indices["ST_Per100_No_USDA"]]
				data[fips][year]["usdaOff_hudOff"] = row[indices["ST_Per100_No_Assisted"]]
				data[fips][year]["totalPop"] = row[indices["ST_Total"]]
				data[fips][year]["usdaOn_hudOnNum"] = row[indices["ST_Units"]]
				data[fips][year]["usdaOn_hudOffNum"] = row[indices["ST_Units_No_HUD"]]
				data[fips][year]["usdaOff_hudOnNum"] = row[indices["ST_Units_no_USDA"]]
				data[fips][year]["usdaOff_hudOffNum"] = row[indices["ST_Unitsnoasst"]]
				data[fips][year]["hud"] = row[indices["ST_eli"]]
				data[fips][year]["usda"] = row[indices["ST_usda"]]

		

outFile.writerow(["FIPS", "flagged", "name", "ami2000","ami2006","ami2013", "usdaOnhudOn2000","usdaOnhudOff2000","usdaOffhudOn2000","usdaOffhudOff2000","totalPop2000", "usdaOnhudOnNum2000","usdaOnhudOffNum2000","usdaOffhudOnNum2000","usdaOffhudOffNum2000", "usdaOnhudOn2006","usdaOnhudOff2006","usdaOffhudOn2006","usdaOffhudOff2006","totalPop2006", "usdaOnhudOnNum2006","usdaOnhudOffNum2006","usdaOffhudOnNum2006","usdaOffhudOffNum2006", "usdaOnhudOn2013","usdaOnhudOff2013","usdaOffhudOn2013","usdaOffhudOff2013","totalPop2013", "usdaOnhudOnNum2013","usdaOnhudOffNum2013","usdaOffhudOnNum2013","usdaOffhudOffNum2013","maxELI2000","minELI2000","maxELI2006","minELI2006","maxELI2013","minELI2013","hud2000","hud2006","hud2013","usda2006","usda2013"])
for fips in data:
	d = data[fips]
	outFile.writerow([d["FIPS"], d["2013"]["flag"], d["name"], d["2000"]["ami"], d["2006"]["ami"], d["2013"]["ami"], d["2000"]["usdaOn_hudOn"],d["2000"]["usdaOn_hudOff"],d["2000"]["usdaOff_hudOn"],d["2000"]["usdaOff_hudOff"], d["2000"]["totalPop"], d["2000"]["usdaOn_hudOnNum"],d["2000"]["usdaOn_hudOffNum"],d["2000"]["usdaOff_hudOnNum"],d["2000"]["usdaOff_hudOffNum"], d["2006"]["usdaOn_hudOn"],d["2006"]["usdaOn_hudOff"],d["2006"]["usdaOff_hudOn"],d["2006"]["usdaOff_hudOff"], d["2006"]["totalPop"], d["2006"]["usdaOn_hudOnNum"],d["2006"]["usdaOn_hudOffNum"],d["2006"]["usdaOff_hudOnNum"],d["2006"]["usdaOff_hudOffNum"], d["2013"]["usdaOn_hudOn"],d["2013"]["usdaOn_hudOff"],d["2013"]["usdaOff_hudOn"],d["2013"]["usdaOff_hudOff"], d["2013"]["totalPop"], d["2013"]["usdaOn_hudOnNum"],d["2013"]["usdaOn_hudOffNum"],d["2013"]["usdaOff_hudOnNum"],d["2013"]["usdaOff_hudOffNum"], d["2000"]["maxELI"],d["2000"]["minELI"], d["2006"]["maxELI"],d["2006"]["minELI"], d["2013"]["maxELI"],d["2013"]["minELI"], d["2000"]["hud"], d["2006"]["hud"], d["2013"]["hud"],d["2006"]["usda"], d["2013"]["usda"]])
